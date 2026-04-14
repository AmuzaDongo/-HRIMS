<?php

namespace App\Http\Requests\Assessment\Script;

use Illuminate\Foundation\Http\FormRequest;

class StoreScriptRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'type' => 'required|string|in:single,batch',
            'paper_id' => 'required|uuid|exists:papers,id',
            'center_id' => 'required|uuid|exists:marking_centers,id',
            'total_scripts' => 'required|integer|min:1',
            'batch_code' => 'nullable|string|max:255',
            'status' => 'required|string|in:received,allocated,marked,checked',
            'current_location' => 'required|string|max:255',
            'assessment_series_id' => 'required|uuid|exists:assessment_series,id',
        ];
    }
}