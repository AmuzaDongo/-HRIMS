<?php

namespace App\Http\Controllers;

use App\Http\Requests\Assessment\ScriptMovement\StoreScriptMovementRequest;
use App\Http\Requests\Assessment\ScriptMovement\UpdateScriptMovementRequest;
use App\Models\Assessment\ScriptMovement;
use App\Models\Assessment\ScriptBatch;
use App\Models\Assessment\Paper;
use App\Models\Assessment\AssessmentSeries;
use App\Models\HR\MarkingCenter;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\DB;

class ScriptMovementController extends Controller
{
    public function index(Request $request): Response
    {
        $query = ScriptMovement::query()
            ->with([
                'paper:id,name,code',
                'assessmentSeries:id,name',
                'fromCenter:id,name',
                'toCenter:id,name',
            ])
            ->when($request->search, function ($q, $search) {
                $q->where(function ($q) use ($search) {

                    $q->where('movement_type', 'like', "%{$search}%")
                      ->orWhere('to_location', 'like', "%{$search}%");

                    $q->orWhereHas('paper', function ($qq) use ($search) {
                        $qq->where('name', 'like', "%{$search}%")
                           ->orWhere('code', 'like', "%{$search}%");
                    });

                    $q->orWhereHas('assessmentSeries', function ($qq) use ($search) {
                        $qq->where('name', 'like', "%{$search}%");
                    });

                    $q->orWhereHas('toCenter', function ($qq) use ($search) {
                        $qq->where('name', 'like', "%{$search}%");
                    });
                });
            });

        $movements = $query->latest()
            ->paginate($request->get('per_page', 10))
            ->withQueryString();

        return Inertia::render('Assessment/ScriptMovement/Index', [
            'movements' => $movements,
            'assessmentSeries' => AssessmentSeries::get(['id', 'name']),
            'papers' => Paper::get(['id', 'name', 'code']),
            'markingCenters' => MarkingCenter::get(['id', 'name']),
            'filters' => $request->only(['search']),
        ]);
    }

    public function store(StoreScriptMovementRequest $request): RedirectResponse
    {
        DB::transaction(function () use ($request) {

            $validated = $request->validated();

            $movement = ScriptMovement::create([
                ...$validated,
                'moved_by' => auth()->id(),
                'moved_at' => now(),
            ]);

            // 🔥 UPDATE CURRENT LOCATION
            ScriptBatch::where('id', $validated['script_batch_id'])
                ->update([
                    'current_location' => $validated['to_location']
                ]);
        });

        return redirect()->route('script-movements.index')
            ->with('success', 'Script movement recorded successfully.');
    }

    public function show(ScriptMovement $scriptMovement): Response
    {
        return Inertia::render('Assessment/ScriptMovement/Show', [
            'movement' => $scriptMovement->load([
                'paper',
                'assessmentSeries',
                'fromCenter',
                'toCenter',
            ]),
        ]);
    }

    public function update(UpdateScriptMovementRequest $request, ScriptMovement $scriptMovement): RedirectResponse
    {
        DB::transaction(function () use ($request, $scriptMovement) {

            $validated = $request->validated();

            $scriptMovement->update($validated);

            // 🔥 KEEP LOCATION CONSISTENT
            ScriptBatch::where('id', $validated['script_batch_id'])
                ->update([
                    'current_location' => $validated['to_location']
                ]);
        });

        return redirect()->route('script-movements.index')
            ->with('success', 'Script movement updated successfully.');
    }

    public function destroy(ScriptMovement $scriptMovement): RedirectResponse
    {
        $scriptMovement->delete();

        return redirect()->route('script-movements.index')
            ->with('success', 'Script movement deleted successfully.');
    }
}