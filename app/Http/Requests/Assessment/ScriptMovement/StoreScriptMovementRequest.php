<?php

namespace App\Http\Requests\Assessment\ScriptMovement;

use Illuminate\Foundation\Http\FormRequest;

class StoreScriptMovementRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'script_batch_ids' => ['required', 'array'],
            'script_batch_ids.*' => ['exists:script_batches,id'],
            'marking_center_id' => ['required', 'exists:marking_centers,id'],
            'movement_type' => ['required', 'in:Transfer,Dispatch,Return'],
            'to_location' => ['required', 'string', 'max:255'],
            'from_location' => ['required', 'string', 'max:255'],
            'action' => ['required', 'string', 'max:255'],
            'status' => ['required', 'string', 'max:255'],
            'handled_by' => ['required', 'exists:users,id'],
            'metadata' => ['nullable', 'array'],
        ];
    }
}