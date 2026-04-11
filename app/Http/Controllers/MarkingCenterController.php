<?php

namespace App\Http\Controllers;

use App\Http\Requests\HR\Department\StoreDepartmentRequest;
use App\Http\Requests\HR\Department\UpdateDepartmentRequest;
use App\Models\HR\MarkingCenter;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\Request;

class MarkingCenterController extends Controller
{
    public function index(Request $request): Response
    {
        $query = MarkingCenter::query()
            ->when($request->search, function ($q, $search) {
                $q->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                    ->orWhere('code', 'like', "%{$search}%")
                    ->orWhere('type', 'like', "%{$search}%");
                });
            });

        $marking_center = $query
            ->orderBy('name')
            ->paginate($request->get('per_page', 10)) // ✅ dynamic pagination
            ->withQueryString()
            ->through(function ($mc) {
                return [
                    'id' => $mc->id,
                    'name' => $mc->name,
                    'code' => $mc->code,
                    'type' => $mc->type,
                    'is_active' => $mc->is_active,
                    'status' => $mc->status,
                    'address' => $mc->address,
                    'region' => $mc->region,
                    'district' => $mc->district,
                ];
            });

        return Inertia::render('HR/MarkingCenter/Index', [
            'marking_centers' => $marking_center,
            'filters' => $request->only(['search', 'per_page']),
        ]);
    }

    public function store(StoreDepartmentRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        MarkingCenter::create($validated);

        return back()->with('success', 'Marking Center created successfully.');
    }

    public function show(MarkingCenter $marking_center): Response
    {
        $marking_center->load([]);

        return Inertia::render('HR/MarkingCenters/Show', [
            'marking_center' => $marking_center,
        ]);
    }

    public function edit(MarkingCenter $marking_center): Response
    {
        $parents = MarkingCenter::where('id', '!=', $marking_center->id)
            ->orderBy('name')
            ->get(['id', 'name']);

        return Inertia::render('HR/MarkingCenters/Index', [
            'marking_center' => $marking_center,
        ]);
    }

    public function update(UpdateDepartmentRequest $request, MarkingCenter $marking_center): RedirectResponse
    {
        $marking_center->update($request->validated());

        return redirect()->route('marking-centers.index')
            ->with('success', 'Marking Center updated successfully.');
    }

    public function destroy(MarkingCenter $marking_center): RedirectResponse
    {
        $marking_center->delete();

        return redirect()->route('marking-centers.index')
            ->with('success', 'Marking Center deleted successfully.');
    }
}