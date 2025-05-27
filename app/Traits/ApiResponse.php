<?php

namespace App\Traits;

trait ApiResponse
{
    /**
     * Return a success JSON response.
     */
    protected function success($data = null, string $message = null, int $code = 200)
    {
        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => $data,
        ], $code);
    }

    /**
     * Return an error JSON response.
     */
    protected function error(string $message = null, int $code = 400, $errors = null)
    {
        return response()->json([
            'success' => false,
            'message' => $message,
            'errors' => $errors,
        ], $code);
    }

    /**
     * Return a not found JSON response.
     */
    protected function notFound(string $message = 'Resource not found')
    {
        return $this->error($message, 404);
    }

    /**
     * Return an unauthorized JSON response.
     */
    protected function unauthorized(string $message = 'Unauthorized')
    {
        return $this->error($message, 403);
    }

    /**
     * Return a validation error JSON response.
     */
    protected function validationError($errors, string $message = 'Validation errors occurred')
    {
        return $this->error($message, 422, $errors);
    }
}