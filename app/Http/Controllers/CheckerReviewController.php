<?php

namespace App\Http\Controllers;

use App\Models\Assessment\CheckerReview;
use App\Models\Assessment\ScriptAllocation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class CheckerReviewController extends Controller
{
    public function index()
    {
        $reviews = CheckerReview::with([
                'checker:id,name',
                'allocation:id,status'
            ])
            ->latest()
            ->paginate(10);

        return Inertia::render('Assessment/Checker/Index', [
            'reviews' => $reviews
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'allocation_id' => ['required', 'exists:script_allocations,id'],
            'scripts_checked' => ['required', 'integer', 'min:1'],
            'status' => ['required', 'in:approved,rejected'],
        ]);

        DB::transaction(function () use ($request) {

            $allocation = ScriptAllocation::findOrFail($request->allocation_id);

            // 🚫 cannot check unfinished marking
            if ($allocation->status !== 'completed') {
                abort(400, 'Marking not completed yet');
            }

            CheckerReview::create([
                'allocation_id' => $allocation->id,
                'script_batch_id' => $allocation->script_batch_id,
                'checker_id' => auth()->id(),
                'scripts_checked' => $request->scripts_checked,
                'status' => $request->status,
                'checked_at' => now(),
            ]);

            // 🔥 update allocation status
            if ($request->status === 'approved') {
                $allocation->update(['status' => 'checked']);
            } else {
                $allocation->update(['status' => 'rejected']);
            }
        });

        return back()->with('success', 'Review completed');
    }
}