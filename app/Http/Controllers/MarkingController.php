<?php

namespace App\Http\Controllers;

use App\Models\Assessment\Marking;
use App\Models\Assessment\ScriptAllocation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class MarkingController extends Controller
{
    public function index(Request $request)
    {
        $markings = Marking::with([
                'assessor:id,name',
                'allocation:id,total_scripts'
            ])
            ->latest()
            ->paginate(10);

        return Inertia::render('Assessment/Marking/Index', [
            'markings' => $markings
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'allocation_id' => ['required', 'exists:script_allocations,id'],
            'scripts_marked' => ['required', 'integer', 'min:1'],
        ]);

        DB::transaction(function () use ($request) {

            $allocation = ScriptAllocation::findOrFail($request->allocation_id);

            // 🚫 prevent over-marking
            $totalMarked = $allocation->markings()->sum('scripts_marked');

            if (($totalMarked + $request->scripts_marked) > $allocation->total_scripts) {
                abort(400, 'Exceeds allocated scripts');
            }

            Marking::create([
                'allocation_id' => $allocation->id,
                'script_batch_id' => $allocation->script_batch_id,
                'assessor_id' => auth()->id(),
                'scripts_marked' => $request->scripts_marked,
                'status' => 'submitted',
                'submitted_at' => now(),
            ]);

            // 🔥 update allocation status
            $newTotal = $allocation->markings()->sum('scripts_marked');

            if ($newTotal >= $allocation->total_scripts) {
                $allocation->update([
                    'status' => 'completed',
                    'completed_at' => now()
                ]);
            } else {
                $allocation->update(['status' => 'in_progress']);
            }
        });

        return back()->with('success', 'Marking submitted');
    }
}