<?php

namespace App\Http\Controllers\Integrations;

use App\Http\Controllers\Controller;
use App\Models\Integration;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class IntegrationsController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $integrations = Integration::where('user_id', $request->user()->id)
            ->get(['id', 'provider', 'meta', 'created_at']);

        return response()->json($integrations);
    }
}
