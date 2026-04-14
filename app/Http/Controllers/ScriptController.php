<?php

namespace App\Http\Controllers;

use App\Http\Requests\Assessment\Script\StoreScriptRequest;
use App\Http\Requests\Assessment\Script\UpdateScriptRequest;
use App\Models\Assessment\ScriptBatch;
use App\Models\Assessment\Paper;
use App\Models\Assessment\AssessmentSeries;
use App\Models\HR\MarkingCenter;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\Request;

class ScriptController extends Controller
{
    public function index(Request $request): Response
    {
        $query = ScriptBatch::query()

            ->with(['paper:id,name,code'])
            ->with(['marking_center:id,name'])
            ->with(['assessment_series:id,name'])
            ->when($request->search, function ($q, $search) {
                $q->where(function ($q) use ($search) {
                    $q->where('paper.name', 'like', "%{$search}%")
                    ->orWhere('paper.code', 'like', "%{$search}%")
                    ->orWhere('assessment_series.name', 'like', "%{$search}%")
                    ->orWhere('assessment_series.year', 'like', "%{$search}%")
                    ->orWhere('marking_center.name', 'like', "%{$search}%")
                    ->orWhere('status', 'like', "%{$search}%")
                    ->orWhere('current_location', 'like', "%{$search}%");
                });
            })
            ->when($request->status, fn($q, $status) => $q->where('status', $status))
            ->when($request->type, fn($q, $type) => $q->where('type', $type));

        $scripts = $query
            ->orderBy('created_at', 'desc') 
            ->paginate($request->get('per_page', 10))
            ->withQueryString();

        return Inertia::render('Assessment/Scripts/Index', [
            'scripts' => $scripts,
            'assessmentSeries' => AssessmentSeries::orderBy('name')
                ->get(['id', 'name']),
            'papers' => Paper::orderBy('name')
                ->get(['id', 'name', 'code']),
            'markingCenters' => MarkingCenter::orderBy('name')
                ->get(['id', 'name']),
            'filters' => $request->only(['search', 'status', 'type', 'per_page']),
        ]);
    }

    public function create(): Response
    {

        return Inertia::render('Assessment/Scripts/Create', [
            'scripts' => $scripts,
        ]);
    }

    public function store(StoreScriptRequest $request): RedirectResponse
    {
        $validated = $request->validated();
    
        $validated['created_by'] = auth()->id();
        $validated['updated_by'] = auth()->id();

        ScriptBatch::create($validated);

        return redirect()->route('scripts.index')
            ->with('success', 'Script created successfully.');
    }

    public function show(ScriptBatch $script): Response
    {
        $script->load(['paper:id,name']);

        return Inertia::render('Assessment/Scripts/Show', [
            'script' => $script,
        ]);
    }

    public function edit(ScriptBatch $script): Response
    {
        $marking_centers = MarkingCenter::where('id', '!=', $script->id)
            ->orderBy('name')
            ->get(['id', 'name']);

        $papers = Paper::orderBy('name')->get(['id', 'name', 'code']);

        return Inertia::render('Assessment/Scripts/Edit', [
            'script'  => $script->load(['paper:id,name']),
            'papers'  => $papers,
        ]);
    }

    public function update(UpdateScriptRequest $request, ScriptBatch $script): RedirectResponse
    {
        $validated = $request->validated();
        $validated['updated_by'] = auth()->id();

        $script->update($validated);

        return redirect()->route('scripts.index')
            ->with('success', 'Script updated successfully.');
    }

    public function destroy(ScriptBatch $script): RedirectResponse
    {
        $script->delete();

        return redirect()->route('scripts.index')
            ->with('success', 'Script deleted successfully.');
    }
}