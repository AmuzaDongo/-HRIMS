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
                'assessmentSeries:id,name',
                'fromCenter:id,name',
                'toCenter:id,name',
                'scriptBatch:id,batch_code,paper_id,assessment_series_id,total_scripts',
                'scriptBatch.paper:id,name,code',
                'scriptBatch.assessmentSeries:id,name',
            ])
            ->when($request->search, function ($q, $search) {
                $q->where(function ($q) use ($search) {
                    $q->where('movement_type', 'like', "%{$search}%")
                    ->orWhere('to_location', 'like', "%{$search}%")
                    ->orWhereHas('assessmentSeries', fn($qq) => 
                        $qq->where('name', 'like', "%{$search}%")
                    )
                    ->orWhereHas('scriptBatch.paper', fn($qq) => 
                        $qq->where('name', 'like', "%{$search}%")
                            ->orWhere('code', 'like', "%{$search}%")
                    )
                    ->orWhereHas('toCenter', fn($qq) => 
                        $qq->where('name', 'like', "%{$search}%")
                    );
                });
            });

        $movements = $query->latest()
            ->paginate($request->get('per_page', 10))
            ->withQueryString();

        $assessmentSeries = AssessmentSeries::select('id', 'name')
            ->orderBy('name')
            ->get();

        $markingCenters = MarkingCenter::select('id', 'name')
            ->orderBy('name')
            ->get();

        $scriptBatches = ScriptBatch::with([
            'paper:id,name,code',
            'assessmentSeries:id,name'
        ])
        ->select('id', 'batch_code', 'paper_id', 'assessment_series_id', 'total_scripts')
        ->get();

        $movements->getCollection()->transform(function ($movement) {
            return [
                'id'                => $movement->id,
                'assessment_series' => $movement->assessmentSeries,
                'script_batch'      => [
                    'id'         => $movement->scriptBatch?->id,
                    'batch_code' => $movement->scriptBatch?->batch_code,
                    'total_scripts' => $movement->scriptBatch?->total_scripts ?? 0,
                    'paper'      => $movement->scriptBatch?->paper,
                ],
                'from_center'       => $movement->fromCenter,
                'to_center'         => $movement->toCenter,
                'from_location'     => $movement->from_location,
                'to_location'       => $movement->to_location,
                'movement_type'     => $movement->movement_type,
                'remarks'           => $movement->remarks,
                'moved_at'          => $movement->moved_at,
            ];
        });

        return Inertia::render('Assessment/ScriptMovement/Index', [
            'movements'       => $movements,
            'scriptBatches'   => $scriptBatches, 
            'assessmentSeries'=> $assessmentSeries,
            'markingCenters'  => $markingCenters,
            'filters'         => $request->only(['search']),
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
                'scriptBatch.paper',
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