"use client";

import { Head, router } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useState } from "react";
import { toast } from 'sonner';
import { PaperForm } from '@/components/papers/paper-form';
import PaperShowModal from '@/components/papers/PaperShowModal';
import { Button } from "@/components/ui/button";
import { useConfirm } from "@/components/ui/confirm-provider";
import { DataTable } from "@/components/ui/data-table";
import AppLayout from "@/layouts/app-layout";
import { dashboard } from '@/routes';
import papers, { destroy } from '@/routes/papers';
import type { BreadcrumbItem } from "@/types";
import { columns } from './columns';

interface Paper {
  id: string;
  name: string;
  code: string;
  file_path: string;
  assessment_series: {
    id: string;
    name: string;
  };
}

interface Paginatedpapers {
  data: Paper[];
  links: { url: string | null; label: string; active: boolean }[];
  total: number;
  per_page: number;
}

interface Props {
  papers: Paginatedpapers;
  assessmentSeries: { id: string; name: string }[];
  filters?: Record<string, string | number | undefined>;
}


const breadcrumbs = (): BreadcrumbItem[] => [
  { title: 'Dashboard', href: dashboard().url || "/" },
  { title: 'Papers', href: papers.index().url || "/papers" },
];

export default function ActivitiesIndex({ papers, assessmentSeries, filters }: Props) {
  const [modalOpen, setModalOpen] = useState(false);
  const [showModalOpen, setShowModalOpen] = useState(false);
  const [selectedPaper, setSelectedPaper] = useState<Paper | null>(null);
  const [editingPaper, setEditingPaper] = useState<Paper | null>(null);

  const { confirm } = useConfirm();

  const openAddModal = () => {
    setEditingPaper(null);
    setModalOpen(true);
  };

  const handleView = (paper: Paper) => {
    setSelectedPaper(paper);
    setShowModalOpen(true);
  };

  const openEditModal = (paper: Paper) => {
    setEditingPaper(paper);
    setModalOpen(true);
  };

  const handleDelete = (id: string) => {
    confirm({
      title: "Delete Paper",
      description: "Are you sure you want to delete this paper? This action cannot be undone.",
      onConfirm: async () => {
        const promise = new Promise((resolve, reject) => {
          router.delete(destroy(id), {
            preserveScroll: true,
            onSuccess: resolve,
            onError: reject,
          });
        });

        toast.promise(promise, {
          loading: "Deleting paper...",
          success: "Paper deleted successfully ✅",
          error: "Failed to delete paper ❌",
        });

        await promise;
      },
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs()}>
      <Head title="Papers" />

      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Papers</h1>
          <Button onClick={openAddModal}>
            <Plus className="mr-2 h-4 w-4" />
            Add Paper
          </Button>
        </div>

        <DataTable
          columns={columns({
            onView: handleView,
            onEdit: openEditModal,
            onDelete: handleDelete,
          })}
          data={papers.data}
          links={papers.links} 
          total={papers.total}
          pageSize={papers.per_page}
          currentRoute="/papers"
          filters={filters}
          searchPlaceholder="Search papers..."
        />
      </div>

      {/* Add/Edit Form Modal */}
      <PaperForm
        initialData={editingPaper || undefined}
        assessmentSeries={assessmentSeries}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />

      {/* View Details Modal */}
      <PaperShowModal
        open={showModalOpen}
        onClose={() => setShowModalOpen(false)}
        paper={selectedPaper}
      />
    </AppLayout>
  );
}