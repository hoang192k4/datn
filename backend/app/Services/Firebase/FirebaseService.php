<?php

namespace App\Services\Firebase;


use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;

class FirebaseService implements FirebaseServiceInterface
{

    private $projectId;
    private $clientEmail;
    private $privateKey;
    private $fcmUrl;
    public function __construct()
    {
        $this->projectId = config('firebase.project_id');
        $this->clientEmail = config('firebase.client_email');
        $this->privateKey = config('firebase.private_key');
        $this->fcmUrl = config('firebase.fcm_url');
    }

    private function createJWT()
    {
        $header = json_encode(['typ' => 'JWT', 'alg' => 'RS256']);

        $now = time();
        $payload = json_encode([
            'iss' => $this->clientEmail,
            'scope' => 'https://www.googleapis.com/auth/firebase.messaging',
            'aud' => 'https://oauth2.googleapis.com/token',
            'exp' => $now + 3600,
            'iat' => $now
        ]);

        $base64Header = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($header));
        $base64Payload = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($payload));

        $signature = '';
        $privateKey = openssl_pkey_get_private($this->privateKey);
        openssl_sign($base64Header . "." . $base64Payload, $signature, $privateKey, OPENSSL_ALGO_SHA256);

        $base64Signature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($signature));

        return $base64Header . "." . $base64Payload . "." . $base64Signature;
    }

    /**
     * Lấy Access Token từ Google OAuth2
     */
    private function getAccessToken()
    {
        // Cache token trong 55 phút (token có hiệu lực 1 giờ)
        return Cache::remember('firebase_access_token', 55 * 60, function () {
            $jwt = $this->createJWT();

            $response = Http::asForm()->post('https://oauth2.googleapis.com/token', [
                'grant_type' => 'urn:ietf:params:oauth:grant-type:jwt-bearer',
                'assertion' => $jwt
            ]);

            if ($response->successful()) {
                $data = $response->json();
                return $data['access_token'];
            }

            Log::error('Failed to get Firebase access token', [
                'status' => $response->status(),
                'response' => $response->body()
            ]);

            throw new \Exception('Failed to get Firebase access token');
        });
    }

    /**
     * Gửi notification đến device tokens
     */
    public function sendNotification($deviceTokens, $title, $body, $data)
    {
        try {
            $accessToken = $this->getAccessToken();

            // Chuyển đổi single token thành array
            if (is_string($deviceTokens)) {
                $deviceTokens = [$deviceTokens];
            }

            $results = [];

            // FCM v1 API chỉ gửi được 1 token mỗi lần
            foreach ($deviceTokens as $token) {
                $message = [
                    'message' => [
                        'token' => $token,
                        'data' => [
                            'title' => (string)$title,
                            'body' => (string)$body,
                            'icon' => (string)url('/logo192.png'),
                            'click_action' => (string)url('/notifications'),
                            'requireInteraction' => 'true'
                        ], // FCM v1 cần data dạng string
                        // 'webpush' => [
                        //     'notification' => [
                        //         'title' => $title,
                        //         'body' => $body,
                        //         'icon' => url('/logo192.png'),
                        //         'click_action' => url('/notifications'),
                        //         'requireInteraction' => true
                        //     ]
                        // ]
                    ]
                ];

                $response = Http::withHeaders([
                    'Authorization' => 'Bearer ' . $accessToken,
                    'Content-Type' => 'application/json'
                ])->post($this->fcmUrl, $message);

                if ($response->successful()) {
                    $results[] = ['token' => $token, 'success' => true, 'response' => $response->json()];
                    Log::info('Firebase notification sent successfully', [
                        'token' => $token,
                        'response' => $response->json()
                    ]);
                } else {
                    $results[] = ['token' => $token, 'success' => false, 'error' => $response->body()];
                    Log::error('Firebase notification failed', [
                        'token' => $token,
                        'status' => $response->status(),
                        'response' => $response->body()
                    ]);
                }
            }

            return $results;
        } catch (\Exception $e) {
            Log::error('Firebase service error', ['message' => $e->getMessage()]);
            return false;
        }
    }

    /**
     * Gửi notification đến topic
     */
    public function sendToTopic($topic, $title, $body, $data = [])
    {
        try {
            $accessToken = $this->getAccessToken();

            $message = [
                'message' => [
                    'topic' => $topic,
                    'notification' => [
                        'title' => $title,
                        'body' => $body
                    ],
                    'data' => array_map('strval', $data),
                    'webpush' => [
                        'notification' => [
                            'title' => $title,
                            'body' => $body,
                            'icon' => url('/logo192.png'),
                            'click_action' => url('/'),
                        ]
                    ]
                ]
            ];

            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $accessToken,
                'Content-Type' => 'application/json'
            ])->post($this->fcmUrl, $message);

            if ($response->successful()) {
                Log::info('Firebase topic notification sent successfully', $response->json());
                return $response->json();
            } else {
                Log::error('Firebase topic notification failed', [
                    'status' => $response->status(),
                    'response' => $response->body()
                ]);
                return false;
            }
        } catch (\Exception $e) {
            Log::error('Firebase topic service error', ['message' => $e->getMessage()]);
            return false;
        }
    }

    /**
     * Subscribe token to topic
     */
    public function subscribeToTopic($tokens, $topic)
    {
        try {
            $accessToken = $this->getAccessToken();

            if (is_string($tokens)) {
                $tokens = [$tokens];
            }

            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $accessToken,
                'Content-Type' => 'application/json'
            ])->post("https://iid.googleapis.com/iid/v1:batchAdd", [
                'to' => '/topics/' . $topic,
                'registration_tokens' => $tokens
            ]);

            return $response->successful() ? $response->json() : false;
        } catch (\Exception $e) {
            Log::error('Firebase subscribe error', ['message' => $e->getMessage()]);
            return false;
        }
    }

    /**
     * Unsubscribe token from topic
     */
    public function unsubscribeFromTopic($tokens, $topic)
    {
        try {
            $accessToken = $this->getAccessToken();

            if (is_string($tokens)) {
                $tokens = [$tokens];
            }

            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $accessToken,
                'Content-Type' => 'application/json'
            ])->post("https://iid.googleapis.com/iid/v1:batchRemove", [
                'to' => '/topics/' . $topic,
                'registration_tokens' => $tokens
            ]);

            return $response->successful() ? $response->json() : false;
        } catch (\Exception $e) {
            Log::error('Firebase unsubscribe error', ['message' => $e->getMessage()]);
            return false;
        }
    }

    /**
     * Validate token
     */
    public function validateToken($token)
    {
        try {
            // Gửi dry run message để check token
            $accessToken = $this->getAccessToken();

            $message = [
                'message' => [
                    'token' => $token,
                    'notification' => [
                        'title' => 'Test',
                        'body' => 'Test'
                    ]
                ],
                'validate_only' => true // Chỉ validate, không gửi thật
            ];

            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $accessToken,
                'Content-Type' => 'application/json'
            ])->post($this->fcmUrl, $message);

            return $response->successful();
        } catch (\Exception $e) {
            Log::error('Firebase token validation error', ['message' => $e->getMessage()]);
            return false;
        }
    }
}
