"use client";

import { Head, router } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useState } from "react";
import { toast } from 'sonner';
import { AssessmentCategoryForm } from '@/components/Categories/assessment-category-form';
import AssessmentCategoryShowModal from '@/components/Categories/AssessmentCategoryShowModal';
import { Button } from "@/components/ui/button";
import { useConfirm } from "@/components/ui/confirm-provider";
import { DataTable } from "@/components/ui/data-table";
import AppLayout from "@/layouts/app-layout";
import { dashboard } from '@/routes';
import assessmentCategories, { destroy } from '@/routes/assessment-categories';
import type { BreadcrumbItem } from "@/types";
import { columns } from './columns';

interface AssessmentCategory {
  id: string;
  name: string;
  code: string;
}

interface PaginatedAssessmentCategories {
  data: AssessmentCategory[];
  links: { url: string | null; label: string; active: boolean }[];
  total: number;
  per_page: number;
}

interface Props {
  assessment_categories: PaginatedAssessmentCategories;
  filters?: { 
    search?: string;
    per_page?: number; 
    [key: string]: string | number | undefined;
  };
}

const breadcrumbs = (): BreadcrumbItem[] => [
  { title: 'Dashboard', href: dashboard().url || "/" },
  { title: 'Assessment Categories', href: assessmentCategories.index().url || "/assessment-categories" },
];

export default function AssessmentCategoriesIndex({ assessment_categories, filters }: Props) {
  const [modalOpen, setModalOpen] = useState(false);
  const [showModalOpen, setShowModalOpen] = useState(false);
  const [selectedAssessmentCategory, setSelectedAssessmentCategory] = useState<AssessmentCategory | null>(null);
  const [editingCategory, setEditingCategory] = useState<AssessmentCategory | null>(null);
  const { confirm } = useConfirm();

  const openAddModal = () => {
    setEditingCategory(null);
    setModalOpen(true);
  };

  const handleView = (assessment_category: AssessmentCategory) => {
    setSelectedAssessmentCategory(assessment_category);
    setShowModalOpen(true);
  };

  const openEditModal = (Category: AssessmentCategory) => {
    setEditingCategory(Category);
    setModalOpen(true);
  };

  const handleDelete = (deleteId: string) => {
    confirm({
      title: "Delete Assessment Category",
      description: "This action cannot be undone.",
      onConfirm: async () => {
        const promise = new Promise((resolve, reject) => {
          router.delete(destroy(deleteId), {
            onSuccess: resolve,
            onError: reject,
          });
        });

        toast.promise(promise, {
          loading: "Deleting assessment category...",
          success: "Assessment category deleted successfully ✅",
          error: "Failed to delete assessment category ❌",
        });

        await promise;
      },
    });
  };


  return (
    <AppLayout breadcrumbs={breadcrumbs()}>
      <Head title="Assessment Categories" />

      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Assessment Categories</h1>
          <Button onClick={openAddModal}>
            <Plus className="mr-1 h-4 w-4" /> Add Assessment Category
          </Button>
        </div>

        <DataTable
          columns={columns({
            onView: handleView,
            onEdit: openEditModal,
            onDelete: handleDelete,
          })}
          data={assessment_categories.data}
          links={assessment_categories.links}
          total={assessment_categories.total}
          pageSize={assessment_categories.per_page || 10}
          currentRoute="/assessment-categories"
          filters={filters}
        />
      </div>

      {/* Dynamic Form Modal */}
      <AssessmentCategoryForm
        initialData={editingCategory || undefined}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />

      <AssessmentCategoryShowModal
        open={showModalOpen}
        onClose={() => setShowModalOpen(false)}
        assessment_category={selectedAssessmentCategory}
      />
    </AppLayout>
  );
}