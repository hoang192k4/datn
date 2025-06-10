<?php

namespace App\Services\Firebase;

interface FirebaseServiceInterface
{

    public function sendNotification(array $deviceTokens, $title, $body, $data = []);
    public function sendToTopic($topic, $title, $body, $data = []);
}
