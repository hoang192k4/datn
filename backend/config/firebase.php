<?php

return [
    'project_id' => env('FIREBASE_PROJECT_ID'),
    'client_email' => env('FIREBASE_CLIENT_EMAIL'),
    'private_key' => env('FIREBASE_PRIVATE_KEY'),
    'fcm_url' => 'https://fcm.googleapis.com/v1/projects/' . env('FIREBASE_PROJECT_ID') . '/messages:send',
];
