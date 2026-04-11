<?php

namespace App\Http\Requests\HR\MarkingCenter;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;


class StoreMarkingCenterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Implement authorization logic as needed
    }

    public function rules(): array
    {
        return [
            'name'        => ['required', 'string', 'max:100', 'unique:marking_centers,name'],
            'code'        => ['nullable', 'string', 'max:20', 'unique:marking_centers,code'],
            'type'        => ['required', 'string', 'max:50'],
            'region'      => ['nullable', 'string', 'max:100'],
            'district'    => ['nullable', 'string', 'max:100'],
            'address'     => ['nullable', 'string'],
            'is_active'   => ['boolean'],
            'status'      => ['required', 'in:open,closed,postponed,cancelled'],
            'metadata'    => ['nullable', 'array'],
        ];
    }
}