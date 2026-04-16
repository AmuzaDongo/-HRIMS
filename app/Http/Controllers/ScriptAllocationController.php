<?php

namespace App\Http\Controllers;

use App\Models\Assessment\ScriptAllocation;
use App\Models\Assessment\ScriptBatch;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ScriptAllocationController extends Controller
{
    public function index(Request $request)
    {
        $allocations = ScriptAllocation::with([
                'scriptBatch',
                'chiefAssessor:id,name',
                'paper:id,name,code'
            ])
            ->latest()
            ->paginate(10);

        return Inertia::render('Assessment/Allocations/Index', [
            'allocations' => $allocations
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'script_batch_id' => ['required', 'exists:script_batches,id'],
            'paper_id' => ['required', 'exists:papers,id'],
            'assessment_series_id' => ['required', 'exists:assessment_series,id'],
            'chief_assessor_id' => ['required', 'exists:users,id'],
            'total_scripts' => ['required', 'integer', 'min:1'],
        ]);

        DB::transaction(function () use ($request) {

            // 🚫 prevent double allocation
            if (ScriptAllocation::where('script_batch_id', $request->script_batch_id)->exists()) {
                abort(400, 'Batch already allocated');
            }

            ScriptAllocation::create([
                ...$request->all(),
                'allocated_at' => now(),
                'status' => 'allocated'
            ]);

            // update batch
            ScriptBatch::where('id', $request->script_batch_id)
                ->update(['status' => 'allocated']);
        });

        return back()->with('success', 'Allocation created successfully');
    }

    public function update(Request $request, ScriptAllocation $allocation)
    {
        $request->validate([
            'chief_assessor_id' => ['required', 'exists:users,id'],
            'total_scripts' => ['required', 'integer', 'min:1'],
        ]);

        $allocation->update($request->only('chief_assessor_id', 'total_scripts'));

        return back()->with('success', 'Allocation updated');
    }

    public function destroy(ScriptAllocation $allocation)
    {
        $allocation->delete();

        return back()->with('success', 'Allocation deleted');
    }
}