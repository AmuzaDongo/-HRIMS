"use client";

import { Head, router } from "@inertiajs/react";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { ScriptMovementForm } from "@/components/scriptMovement/ScriptMovement-form";
import ScriptMovementShowModal from "@/components/scriptMovement/ScriptMovementShowModal";

import { Button } from "@/components/ui/button";
import { useConfirm } from "@/components/ui/confirm-provider";
import { DataTable } from "@/components/ui/data-table";
import AppLayout from "@/layouts/app-layout";
import { dashboard } from "@/routes";
import scriptMovements, { destroy } from "@/routes/script-movements";

import type { BreadcrumbItem } from "@/types";
import type { ScriptMovement } from "@/types/script-movement";
import { columns } from "./columns";


interface PaginatedScripts {
  data: ScriptMovement[];
  links: { url: string | null; label: string; active: boolean }[];
  total: number;
  per_page: number;
}

/* ================= PROPS ================= */

interface Props {
  movements: PaginatedScripts;
  assessmentSeries: { id: string; name: string }[];
  markingCenters: { id: string; name: string }[];
  scriptBatches: { id: string; batch_code: string, paper: { id: string; name: string; code: string } }[];
  filters?: Record<string, string | number | undefined>;
}

/* ================= BREADCRUMBS ================= */

const breadcrumbs = (): BreadcrumbItem[] => [
  { title: "Dashboard", href: dashboard().url || "/" },
  { title: "Script Movements", href: scriptMovements.index().url || "/script-movements" },
];

/* ================= COMPONENT ================= */

export default function ScriptMovementIndex({
  movements,
  assessmentSeries,
  markingCenters,
  scriptBatches,
  filters,
}: Props) {
  const [modalOpen, setModalOpen] = useState(false);
  const [showModalOpen, setShowModalOpen] = useState(false);

  const [selectedScript, setSelectedScript] = useState<ScriptMovement | null>(null);
  const [editingScript, setEditingScript] = useState<ScriptMovement | null>(null);

  const { confirm } = useConfirm();

  /* ================= HANDLERS ================= */

  const openAddModal = () => {
    setEditingScript(null);
    setModalOpen(true);
  };

  const handleView = (script: ScriptMovement) => {
    setSelectedScript(script);
    setShowModalOpen(true);
  };

  const openEditModal = (script: ScriptMovement) => {
    setEditingScript(script);
    setModalOpen(true);
  };

  const handleDelete = (id: string) => {
    confirm({
      title: "Delete Movement",
      description: "This will permanently delete this movement record.",
      onConfirm: async () => {
        const promise = new Promise((resolve, reject) => {
          router.delete(destroy(id), {
            preserveScroll: true,
            onSuccess: resolve,
            onError: reject,
          });
        });

        toast.promise(promise, {
          loading: "Deleting movement...",
          success: "Movement deleted successfully ✅",
          error: "Failed to delete movement ❌",
        });

        await promise;
      },
    });
  };

  /* ================= UI ================= */

  return (
    <AppLayout breadcrumbs={breadcrumbs()}>
      <Head title="Script Movements" />

      <div className="p-6 space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">
            Script Movements
          </h1>

          <Button onClick={openAddModal}>
            <Plus className="mr-2 h-4 w-4" />
            New Movement
          </Button>
        </div>

        {/* Table */}
        <DataTable
          columns={columns({
            onView: handleView,
            onEdit: openEditModal,
            onDelete: handleDelete,
          })}
          data={movements.data}
          links={movements.links}
          total={movements.total}
          pageSize={movements.per_page}
          currentRoute="/script-movements"
          filters={filters}
          searchPlaceholder="Search movements..."
        />
      </div>

      {/* FORM MODAL */}
      <ScriptMovementForm
        initialData={editingScript || undefined}
        assessmentSeries={assessmentSeries}
        marking_centers={markingCenters}
        scriptBatches={scriptBatches}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />

      {/* VIEW MODAL */}
      <ScriptMovementShowModal
        open={showModalOpen}
        onClose={() => setShowModalOpen(false)}
        script={selectedScript}
      />
    </AppLayout>
  );
}