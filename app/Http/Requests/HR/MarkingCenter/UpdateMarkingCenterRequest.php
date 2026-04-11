<?php

namespace App\Http\Requests\HR\Department;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateMarkingCenterRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => [
                'required',
                'string',
                'max:100',
                'unique:marking_centers,name,' . $this->marking_center->id
            ],

            'code' => [
                'nullable',
                'string',
                'max:20',
                'unique:marking_centers,code,' . $this->marking_center->id
            ],
            'type'        => ['required', 'string', 'max:50'],
            'region'      => ['nullable', 'string', 'max:100'],
            'district'    => ['nullable', 'string', 'max:100'],
            'address'     => ['nullable', 'string'],
            'status'      => ['required', 'in:open,closed,postponed,cancelled'],
            'is_active' => ['nullable', 'boolean'],
        ];
    }
}
