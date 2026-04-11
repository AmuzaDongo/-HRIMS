"use client";

import { Head, router } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useState } from "react";
import { toast } from 'sonner';
import { MarkingCenterForm } from '@/components/MarkingCenter/marking-center-form';
import MarkingCenterShowModal from '@/components/MarkingCenter/MarkingCenterShowModal';
import { Button } from "@/components/ui/button";
import { useConfirm } from "@/components/ui/confirm-provider";
import { DataTable } from "@/components/ui/data-table";
import AppLayout from "@/layouts/app-layout";
import { dashboard } from '@/routes';
import markingCenters from '@/routes/marking-centers';
import { destroy } from '@/routes/marking-centers';
import type { BreadcrumbItem } from "@/types";
import { columns } from './columns';

interface MarkingCenter {
  id: string;
  name: string;
  code: string;
  type: string;
  region: string;
  district: string;
  address: string;
  is_active: boolean;
  status: string;
}

interface PaginatedMarkingCenters {
  data: MarkingCenter[];
  links: { url: string | null; label: string; active: boolean }[];
  total: number;
  per_page: number;
}

interface Props {
  marking_centers: PaginatedMarkingCenters;
  filters?: { 
    search?: string;
    per_page?: number; 
    [key: string]: string | number | undefined;
  };
}

const breadcrumbs = (): BreadcrumbItem[] => [
  { title: 'Dashboard', href: dashboard().url || "/" },
  { title: 'Location', href: markingCenters.index().url || "/marking-center" },
];

export default function DepartmentsIndex({ marking_centers, filters }: Props) {
  const [modalOpen, setModalOpen] = useState(false);
  const [showModalOpen, setShowModalOpen] = useState(false);
  const [selectedMarkingCenter, setSelectedMarkingCenter] = useState<MarkingCenter | null>(null);
  const [editingMarkingCenter, setEditingMarkingCenter] = useState<MarkingCenter | null>(null);
  const { confirm } = useConfirm();

  const openAddModal = () => {
    setEditingMarkingCenter(null);
    setModalOpen(true);
  };

  const handleView = (marking_center: MarkingCenter) => {
    setSelectedMarkingCenter(marking_center);
    setShowModalOpen(true);
  };

  const openEditModal = (marking_center: MarkingCenter) => {
    setEditingMarkingCenter(marking_center);
    setModalOpen(true);
  };

  const handleDelete = (deleteId: string) => {
    confirm({
      title: "Delete Location",
      description: "This action cannot be undone.",
      onConfirm: async () => {
        const promise = new Promise((resolve, reject) => {
          router.delete(destroy(deleteId), {
            onSuccess: resolve,
            onError: reject,
          });
        });

        toast.promise(promise, {
          loading: "Deleting Location...",
          success: "Location deleted successfully ✅",
          error: "Failed to delete Location ❌",
        });

        await promise;
      },
    });
  };


  return (
    <AppLayout breadcrumbs={breadcrumbs()}>
      <Head title="Locations" />

      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Locations</h1>
          <Button onClick={openAddModal}>
            <Plus className="mr-1 h-4 w-4" /> Add Location
          </Button>
        </div>

        <DataTable
          columns={columns({
            onView: handleView,
            onEdit: openEditModal,
            onDelete: handleDelete,
          })}
          data={marking_centers.data}
          links={marking_centers.links}
          total={marking_centers.total}
          pageSize={marking_centers.per_page || 10}
          currentRoute="/marking-centers"
          filters={filters}
        />
      </div>

      {/* Dynamic Form Modal */}
      <MarkingCenterForm
        initialData={editingMarkingCenter || undefined}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />

      <MarkingCenterShowModal
        open={showModalOpen}
        onClose={() => setShowModalOpen(false)}
        marking_center={selectedMarkingCenter}
      />
    </AppLayout>
  );
}