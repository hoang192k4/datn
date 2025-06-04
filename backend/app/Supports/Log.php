<?php
namespace App\Supports;


use Exception;
use Illuminate\Support\Facades\Log as LogHelp;
use Throwable;

trait Log {
    /*   * Log an informational message.
     *
     * @param string $message The log message.
     * @param array $context Optional context data.
     */
    public function logInfo(string $message, array $context = []): void
    {
        LogHelp::info($message, $context);
    }

    /**
     * Log an error message.
     *
     * @param string $message The log message.
     * @param Exception $e The exception to log.
     */
    public function logError(string $message, Throwable $e): void
    {
        LogHelp::error($message, [
            'exception' => $e->getMessage(),
        ]);
    }

}
