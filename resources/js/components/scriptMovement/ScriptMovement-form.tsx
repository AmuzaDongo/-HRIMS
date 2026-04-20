"use client";

import { router } from "@inertiajs/react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { toast } from "sonner";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MultiSelect } from "@/components/ui/MultiSelect";
import scriptMovements from "@/routes/script-movements";
import { SearchableSelect } from "../ui/SearchableSelect";

const validationSchema = Yup.object({
  script_batch_ids: Yup.array().of(Yup.string()).required("Batch is required"),
  assessment_series_id: Yup.string().required("Assessment series is required"),
  movement_type: Yup.string()
    .oneOf(["dispatch", "receive", "internal_transfer", "return"])
    .required("Movement type is required"),
  from_center_id: Yup.string().nullable(),
  to_center_id: Yup.string().nullable(),
  from_location: Yup.string().nullable(),
  to_location: Yup.string().required("Destination is required"),
  remarks: Yup.string().nullable(),
  moved_at: Yup.date().required("Movement date is required"),
});

export function ScriptMovementForm({
  initialData,
  assessmentSeries,
  marking_centers,
  scriptBatches,        // all script batches (unfiltered)
  open,
  onOpenChange,
}: any) {
  const isEditMode = !!initialData?.id;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit Script Movement" : "New Script Movement"}
          </DialogTitle>
          <DialogDescription>
            Track movement of scripts between centers.
          </DialogDescription>
        </DialogHeader>

        <Formik
          enableReinitialize
          initialValues={{
            script_batch_ids: initialData?.script_batch_ids || [],
            assessment_series_id: initialData?.assessment_series_id || "",
            movement_type: initialData?.movement_type || "dispatch",
            from_center_id: initialData?.from_center_id || "",
            to_center_id: initialData?.to_center_id || "",
            from_location: initialData?.from_location || "",
            to_location: initialData?.to_location || "",
            remarks: initialData?.remarks || "",
            moved_at: initialData?.moved_at || "",
          }}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            const url = isEditMode
              ? scriptMovements.update(initialData.id)
              : scriptMovements.store();

            const method = isEditMode ? router.put : router.post;

            method(url, values, {
              onSuccess: () => {
                toast.success(
                  isEditMode
                    ? "Movement updated successfully"
                    : "Movement recorded successfully"
                );
                resetForm();
                onOpenChange(false);
              },
              onError: () => toast.error("Something went wrong"),
              onFinish: () => setSubmitting(false),
            });
          }}
        >
          {({ values, setFieldValue, isSubmitting }) => {
            const filteredScriptBatches = (scriptBatches ?? []).filter(
              (scriptBatch: any) =>
                String(scriptBatch.assessment_series_id || scriptBatch.assessment_series?.id) ===
                String(values.assessment_series_id)
            );

            return (
              <Form className="space-y-4">
                <div className="grid grid-cols-4 gap-4 items-center">
                  <Label className="text-right">Assessment Series</Label>
                  <div className="col-span-3">
                    <SearchableSelect
                      options={(assessmentSeries ?? []).map((s: any) => ({
                        value: String(s.id),
                        label: s.name,
                      }))}
                      value={values.assessment_series_id || ""}
                      onChange={(val) => {
                        setFieldValue("assessment_series_id", val ?? "");
                        setFieldValue("script_batch_ids", []);
                      }}
                      placeholder="Assessment Series"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4 items-center">
                  <Label className="text-right">Scripts</Label>
                  <div className="col-span-3">
                    <MultiSelect
                      options={filteredScriptBatches.map((b: any) => ({
                        value: String(b.id),
                        label: `${b.paper?.code} - ${b.paper?.name ?? "No Script"}`,
                      }))}
                      value={values.script_batch_ids || []}
                      onChange={(val) => setFieldValue("script_batch_ids", val)}
                      placeholder={
                        values.assessment_series_id
                          ? "Select Scripts for this series"
                          : "Select Assessment Series first"
                      }
                      disabled={!values.assessment_series_id}
                    />

                    <ErrorMessage
                      name="script_batch_ids"
                      component="p"
                      className="text-red-600 text-sm mt-1"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-4 items-center">
                  <Label className="text-right">Movement Type</Label>
                  <div className="col-span-3">
                    <SearchableSelect
                      options={[
                        { value: "dispatch", label: "Dispatch" },
                        { value: "receive", label: "Receive" },
                        { value: "internal_transfer", label: "Internal Transfer" },
                        { value: "return", label: "Return" },
                      ]}
                      value={values.movement_type}
                      onChange={(val) => setFieldValue("movement_type", String(val))}
                      placeholder="Select Movement Type"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-4 items-center">
                  <Label className="text-right">From Center</Label>
                  <div className="col-span-3">
                    <SearchableSelect
                      options={(marking_centers ?? []).map((c: any) => ({
                        value: String(c.id),
                        label: c.name,
                      }))}
                      value={values.from_center_id || ""}
                      onChange={(val) => setFieldValue("from_center_id", val ?? "")}
                      placeholder="From which Center"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-4 items-center">
                  <Label className="text-right">To Center</Label>
                  <div className="col-span-3">
                    <SearchableSelect
                      options={(marking_centers ?? []).map((c: any) => ({
                        value: String(c.id),
                        label: c.name,
                      }))}
                      value={values.to_center_id || ""}
                      onChange={(val) => setFieldValue("to_center_id", val ?? "")}
                      placeholder="To which Center"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-4 items-center">
                  <Label className="text-right">From Location</Label>
                  <div className="col-span-3">
                    <Field as={Input} name="from_location" type="text" />
                    <ErrorMessage name="from_location" component="p" className="text-red-500 text-sm" />
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4 items-center">
                  <Label className="text-right">To Location</Label>
                  <div className="col-span-3">
                    <Field as={Input} name="to_location" type="text" />
                    <ErrorMessage name="to_location" component="p" className="text-red-500 text-sm" />
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4 items-center">
                  <Label className="text-right">Remarks</Label>
                  <div className="col-span-3">
                    <Field as={Input} name="remarks" type="text" placeholder="Remarks (Optional)" />
                    <ErrorMessage name="remarks" component="p" className="text-red-500 text-sm" />
                  </div>
                </div>

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isEditMode ? "Update Movement" : "Save Movement"}
                  </Button>
                </DialogFooter>
              </Form>
            );
          }}
        </Formik>
      </DialogContent>
    </Dialog>
  );
}