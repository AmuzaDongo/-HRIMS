<?php

namespace App\Http\Controllers;

use App\Http\Requests\Assessment\AssessmentCategory\StoreAssessmentCategoryRequest;
use App\Http\Requests\Assessment\AssessmentCategory\UpdateAssessmentCategoryRequest;
use App\Models\Assessment\AssessmentCategory;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\Request;

class AssessmentCategoryController extends Controller
{
    public function index(Request $request): Response
    {
        $query = AssessmentCategory::query()
            ->when($request->search, function ($q, $search) {
                $q->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                    ->orWhere('code', 'like', "%{$search}%");
                });
            });

        $assessmentCategories = $query
            ->orderBy('name')
            ->paginate($request->get('per_page', 10))
            ->withQueryString()
            ->through(function ($category) {
                return [
                    'id' => $category->id,
                    'name' => $category->name,
                    'code' => $category->code,
                ];
            });

        return Inertia::render('Assessment/AssessmentCategories/Index', [
            'assessment_categories' => $assessmentCategories,
            'filters' => $request->only(['search', 'per_page']),
        ]);
    }

    public function store(StoreAssessmentCategoryRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        AssessmentCategory::create($validated);

        return back()->with('success', 'Assessment category created successfully.');
    }

    public function show(AssessmentCategory $category): Response
    {
        $category->load(['parent', 'head', 'children', 'employees']);

        return Inertia::render('Assessment/AssessmentCategories/Show', [
            'category' => $category,
        ]);
    }

    public function edit(AssessmentCategory $category): Response
    {
        $parents = AssessmentCategory::where('id', '!=', $category->id)
            ->orderBy('name')
            ->get(['id', 'name']);

        return Inertia::render('Assessment/AssessmentCategories/Edit', [
            'category' => $category,
        ]);
    }

    public function update(UpdateAssessmentCategoryRequest $request, AssessmentCategory $assessment_category)
    {
        $data = $request->validated();

        if (!empty($data)) {
            $assessment_category->update($data);
        }

        return redirect()->route('assessment-categories.index')
            ->with('success', 'Updated successfully.');
    }

    public function destroy(AssessmentCategory $assessment_category): RedirectResponse
    {
        $assessment_category->delete();

        return redirect()->route('assessment-categories.index')
            ->with('success', 'Assessment category deleted successfully.');
    }
}