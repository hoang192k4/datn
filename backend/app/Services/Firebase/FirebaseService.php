<?php

namespace App\Services\Firebase;

use App\Supports\Log;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log as LogSupport;

class FirebaseService implements FirebaseServiceInterface
{
    use Log;
    private $serverKey;
    private $fcmUrl;
    public function __construct()
    {
        $this->serverKey = config('firebase.server_key');
        $this->fcmUrl = 'https://fcm.googleapis.com/fcm/send';
    }

    public function sendNotification(array $deviceTokens, $title, $body, $data = [])
    {
        $payload = [
            'registration_ids' => $deviceTokens,
            'notification' => [
                'title' => $title,
                'body' => $body,
                'icon' => '/firebase-messaging-sw.js', // Icon notification
                'click_action' => url('/'), // URL khi click notification
            ],
            'data' => $data
        ];

        $response = Http::withHeaders([
            'Authorization' => 'key=' . $this->serverKey,
            'Content-Type' => 'application/json'
        ])->post($this->fcmUrl, $payload);


        if ($response->successful()) {
            $this->logInfo('Firebase notification sent successfully', $response->json());
            return $response->json();
        } else {
            LogSupport::error('Firebase notification failed', [
                'status' => $response->status(),
                'response' => $response->body()
            ]);

            return false;
        }
    }



    public function sendToTopic($topic, $title, $body, $data = [])
    {
        $payload = [
            'to' => '/topics/' . $topic,
            'notification' => [
                'title' => $title,
                'body' => $body,
                'icon' => '/icon-192x192.png',
                'click_action' => url('/'),
            ],
            'data' => $data
        ];

        $response = Http::withHeaders([
            'Authorization' => 'key=' . $this->serverKey,
            'Content-Type' => 'application/json'
        ])->post($this->fcmUrl, $payload);

        return $response->successful() ? $response->json() : false;
    }
}
