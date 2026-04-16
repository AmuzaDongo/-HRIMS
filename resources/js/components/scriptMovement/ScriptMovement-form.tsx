"use client";

import { router } from "@inertiajs/react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { toast } from "sonner";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import scripts from "@/routes/scripts";

interface Script {
  id?: string;
  type: string;
  status: string;
  batch_code?: string;
  total_scripts: number;
  current_location: string;
  assessment_series?: { id: string; name: string };
  paper?: { id: string; name: string, code: string };
  marking_center?: { id: string; name: string };
}

interface ScriptFormProps {
  initialData?: Script;
  assessmentSeries: { id: string; name: string }[];
  papers: { id: string; name: string }[];
  marking_centers: { id: string; name: string }[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ScriptMovementForm({
  initialData,
  assessmentSeries,
  papers,
  marking_centers,
  open,
  onOpenChange,
}: ScriptFormProps) {
  const isEditMode = !!initialData?.id;

  const validationSchema = Yup.object().shape({
    assessment_series_id: Yup.string().required("Assessment series is required"),
    type: Yup.string().required("Type is required"),
    center_id: Yup.string().required("Center is required"),
    batch_code: Yup.string().nullable(),
    total_scripts: Yup.number()
      .typeError("Total scripts must be a number")
      .required("Total scripts is required")
      .min(1, "Total scripts must be greater than zero"),
    status: Yup.string().required("Status is required"),
    current_location: Yup.string().required("Current location is required"),
    paper_id: Yup.string().required("Paper is required"),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-131.25">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit Script" : "Add Script"}</DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Update the script details below."
              : "Create a new script. Fill in the details below."}
          </DialogDescription>
        </DialogHeader>

        <Formik
          enableReinitialize
          initialValues={{
            assessment_series_id: initialData?.assessment_series?.id || "",
            type: initialData?.type || "single",
            center_id: initialData?.marking_center?.id || "",
            batch_code: initialData?.batch_code || "",
            total_scripts: initialData?.total_scripts || 0,
            status: initialData?.status || "",
            current_location: initialData?.current_location || "",
            paper_id: initialData?.paper?.id || "",
          }}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            const url = isEditMode
              ? scripts.update(initialData!.id!)
              : scripts.store();

            if (isEditMode) {
              router.put(url, values, {
                onSuccess: () => {
                  toast.success("Script updated successfully!");
                  onOpenChange(false);
                },
                onError: (errors) => {
                  console.error(errors);
                  toast.error("Failed to update script.");
                },
                onFinish: () => setSubmitting(false),
              });
            } else {
              router.post(url, values, {
                onSuccess: () => {
                  resetForm();
                  toast.success("Department created successfully!");
                  onOpenChange(false);
                },
                onError: (errors) => {
                  console.error(errors);
                  toast.error("Failed to create department.");
                },
                onFinish: () => setSubmitting(false),
              });
            }
          }}
        >
          {({ values, setFieldValue, isSubmitting }) => (
            <Form className="space-y-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="assessment_series_id" className="text-right">
                  Assessment Series
                </Label>
                <Select
                  value={values.assessment_series_id || ""}
                  onValueChange={(value) => setFieldValue("assessment_series_id", value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select assessment series" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="assessment_series_id">None</SelectItem>
                    {assessmentSeries.map((series) => (
                      <SelectItem key={series.id} value={series.id}>
                        {series.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                  <ErrorMessage
                    name="paper_id"
                    component="p"
                    className="col-span-4 text-sm text-red-600"
                  />
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right">
                  Type
                </Label>
                <Select
                  value={values.type}
                  onValueChange={(value) => setFieldValue("type", value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single">Single</SelectItem>
                    <SelectItem value="batch">Batch</SelectItem>
                  </SelectContent>
                </Select>
                <ErrorMessage
                  name="type"
                  component="p"
                  className="col-span-4 text-sm text-red-600"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="paper_id" className="text-right">
                  Paper
                </Label>
                <Select
                  value={values.paper_id || ""}
                  onValueChange={(value) => setFieldValue("paper_id", value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select paper" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="paper_id">None</SelectItem>
                    {papers.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                  <ErrorMessage
                    name="paper_id"
                    component="p"
                    className="col-span-4 text-sm text-red-600"
                  />
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="total_scripts" className="text-right">
                  Total Scripts
                </Label>
                <Field
                  as={Input}
                  id="total_scripts"
                  name="total_scripts"
                  placeholder="e.g., 100"
                  className="col-span-3"
                />
                <ErrorMessage
                  name="total_scripts"
                  component="p"
                  className="col-span-4 text-sm text-red-600"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="center_origin" className="text-right">
                  Center
                </Label>
                <Select
                  value={values.center_id || ""}
                  onValueChange={(value) => setFieldValue("center_id", value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select Center" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="center_id">None</SelectItem>
                    {marking_centers.map((center) => (
                      <SelectItem key={center.id} value={center.id}>
                        {center.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <ErrorMessage
                  name="center_origin"
                  component="p"
                  className="col-span-4 text-sm text-red-600"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="current_location" className="text-right">
                  Current Location
                </Label>
                <Field
                  as={Input}
                  id="current_location"
                  name="current_location"
                  placeholder="e.g., Marking Center A"
                  className="col-span-3"
                />
                <ErrorMessage
                  name="current_location"
                  component="p"
                  className="col-span-4 text-sm text-red-600"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="batch_code" className="text-right">
                  Barcode
                </Label>
                <Field
                  as={Input}
                  id="batch_code"
                  name="batch_code"
                  placeholder="e.g., 123456789"
                  className="col-span-3"
                />
                <ErrorMessage
                  name="batch_code"
                  component="p"
                  className="col-span-4 text-sm text-red-600"
                />
              </div>

              {/* Status */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Status
                </Label>
                <Select
                  value={values.status || ""}
                  onValueChange={(value) => setFieldValue("status", value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select status (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="status">None</SelectItem>
                    <SelectItem value="received">Received</SelectItem>
                    <SelectItem value="allocated">In Transit</SelectItem>
                    <SelectItem value="marked">Marked</SelectItem>
                    <SelectItem value="checked">Checked</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Actions */}
              <DialogFooter className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isEditMode ? "Update Scripts" : "Create Scripts"}
                </Button>
              </DialogFooter>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
}