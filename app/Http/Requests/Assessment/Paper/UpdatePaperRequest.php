<?php

namespace App\Http\Requests\Assessment\Paper;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePaperRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name'       => ['required', 'string', 'max:255'],
            'code' => ['required', 'string', 'max:255'],
            'file_path' => 'nullable|file|mimes:pdf|max:5120',
            'assessment_series_id' => 'required|uuid|exists:assessment_series,id',
        ];
    }
}