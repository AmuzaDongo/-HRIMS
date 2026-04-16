"use client";

import { router } from "@inertiajs/react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useState } from "react";
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
import papers from "@/routes/papers";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

interface Paper {
  id?: string;
  name: string;
  code: string | null;
  file_path: string | null;
  assessment_series?: { id: string; name: string };
}

interface PaperFormProps {
  initialData?: Paper;
  assessmentSeries: { id: string; name: string }[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export function PaperForm({
  initialData,
  assessmentSeries,
  open,
  onOpenChange,
}: PaperFormProps) {
  const isEditMode = !!initialData?.id;
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const validationSchema = Yup.object().shape({
    assessment_series_id: Yup.string().required("Assessment series is required"),
    name: Yup.string().required("Name is required"),
    code: Yup.string().nullable(),
    file_path: Yup.mixed().nullable(),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-131.25">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit Paper" : "Add Paper"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Update the paper details below."
              : "Create a new paper. Fill in the details below."}
          </DialogDescription>
        </DialogHeader>

        <Formik
          enableReinitialize
          initialValues={{
            assessment_series_id: initialData?.assessment_series?.id || "",
            name: initialData?.name || "",
            code: initialData?.code || "",
            file_path: null as File | null,
          }}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            const url = isEditMode
              ? papers.update(initialData!.id!)
              : papers.store();

            const formData = new FormData();
            formData.append("name", values.name);

            if (values.code) {
              formData.append("code", values.code);
            }

            if (values.file_path) {
              formData.append("file_path", values.file_path);
            }

            if (values.assessment_series_id) {
              formData.append("assessment_series_id", values.assessment_series_id);
            }

            if (isEditMode) {
              formData.append("_method", "PUT");

              router.post(url, formData, {
                forceFormData: true,
                onSuccess: () => {
                  toast.success("Paper updated successfully!");
                  onOpenChange(false);
                },
                onError: () => {
                  toast.error("Failed to update paper.");
                },
                onFinish: () => setSubmitting(false),
              });
            } else {
              router.post(url, formData, {
                forceFormData: true,
                onSuccess: () => {
                  resetForm();
                  toast.success("Paper created successfully!");
                  onOpenChange(false);
                },
                onError: () => {
                  toast.error("Failed to create paper.");
                },
                onFinish: () => setSubmitting(false),
              });
            }
          }}
        >
          {({ values, isSubmitting, setFieldValue }) => (
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
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Field
                  as={Input}
                  id="name"
                  name="name"
                  placeholder="Paper Name"
                  className="col-span-3"
                />
                <ErrorMessage
                  name="name"
                  component="p"
                  className="col-span-4 text-sm text-red-600"
                />
              </div>

              {/* Code */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="code" className="text-right">
                  Code
                </Label>
                <Field
                  as={Input}
                  id="code"
                  name="code"
                  placeholder="Paper Code"
                  className="col-span-3"
                />
                <ErrorMessage
                  name="code"
                  component="p"
                  className="col-span-4 text-sm text-red-600"
                />
              </div>

              {/* File Upload */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="file_path" className="text-right">
                  Paper PDF
                </Label>

                <div className="col-span-3">
                  <Input
                    type="file"
                    accept="application/pdf"
                    onChange={(e: any) => {
                      const file = e.target.files[0];

                      if (!file) return;

                      if (file.size > MAX_FILE_SIZE) {
                        toast.error("Max file size is 5MB");
                        return;
                      }

                      setFieldValue("file_path", file);
                      setPreviewUrl(URL.createObjectURL(file));
                    }}
                  />

                  {previewUrl && (
                    <a
                      href={previewUrl}
                      target="_blank"
                      className="text-blue-500 underline mt-2 block"
                    >
                      Preview PDF
                    </a>
                  )}
                </div>
              </div>

              {/* Actions */}
              <DialogFooter className="flex justify-end space-x-2 pt-4">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => onOpenChange(false)}
                >
                  Cancel
                </Button>

                <Button type="submit" disabled={isSubmitting}>
                  {isEditMode ? "Update Paper" : "Create Paper"}
                </Button>
              </DialogFooter>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
}