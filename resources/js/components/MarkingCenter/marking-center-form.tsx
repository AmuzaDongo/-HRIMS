"use client";

import { router } from "@inertiajs/react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { toast } from "sonner";
import * as Yup from "yup";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import marking_centers from "@/routes/marking-centers";

interface MarkingCenter {
  id?: string;
  name: string;
  code: string | null;
  type: string;
  region: string | null;
  district: string | null;
  address: string | null;
  is_active: boolean;
  status: string;
}

interface MarkingCenterFormProps {
  initialData?: MarkingCenter;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MarkingCenterForm({
  initialData,
  open,
  onOpenChange,
}: MarkingCenterFormProps) {
  const isEditMode = !!initialData?.id;

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    code: Yup.string(),
    type: Yup.string().required("Type is required"),
    region: Yup.string(),
    district: Yup.string(),
    address: Yup.string(),
    is_active: Yup.boolean(),
    status: Yup.string().oneOf(['open', 'closed', 'postponed', 'cancelled']).required("Status is required"),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-131.25">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit Marking Center" : "Add Marking Center"}</DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Update the marking center details below."
              : "Create a new marking center. Fill in the details below."}
          </DialogDescription>
        </DialogHeader>

        <Formik
          enableReinitialize
          initialValues={{
            name: initialData?.name || "",
            code: initialData?.code || "",
            type: initialData?.type || "",
            region: initialData?.region || "",
            district: initialData?.district || "",
            address: initialData?.address || "",
            is_active: initialData?.is_active ?? true,
            status: initialData?.status || "open",
          }}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            const url = isEditMode
              ? marking_centers.update(initialData!.id!)
              : marking_centers.store();

            if (isEditMode) {
              router.put(url, values, {
                onSuccess: () => {
                  toast.success("Marking center updated successfully!");
                  onOpenChange(false);
                },
                onError: (errors) => {
                  console.error(errors);
                  toast.error("Failed to update marking center.");
                },
                onFinish: () => setSubmitting(false),
              });
            } else {
              router.post(url, values, {
                onSuccess: () => {
                  resetForm();
                  toast.success("Marking center created successfully!");
                  onOpenChange(false);
                },
                onError: (errors) => {
                  console.error(errors);
                  toast.error("Failed to create marking center.");
                },
                onFinish: () => setSubmitting(false),
              });
            }
          }}
        >
          {({ values, setFieldValue, isSubmitting }) => (
            <Form className="space-y-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Field
                  as={Input}
                  id="name"
                  name="name"
                  placeholder="Central Marking Center"
                  className="col-span-3"
                />
                <ErrorMessage
                  name="name"
                  component="p"
                  className="col-span-4 text-sm text-red-600"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="code" className="text-right">
                  Code
                </Label>
                <Field
                  as={Input}
                  id="code"
                  name="code"
                  placeholder="CMC-01"
                  className="col-span-3"
                />
                <ErrorMessage
                  name="code"
                  component="p"
                  className="col-span-4 text-sm text-red-600"
                />
              </div>

              {/* Type */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right">
                  Type
                </Label>
                <Field
                  as={Input}
                  id="type"
                  name="type"
                  placeholder="Marking center type..."
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="region" className="text-right">
                  Region
                </Label>
                <Field
                  as={Input}
                  id="region"
                  name="region"
                  placeholder="Region name..."
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="district" className="text-right">
                  District
                </Label>
                <Field
                  as={Input}
                  id="district"
                  name="district"
                  placeholder="District name..."
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="address" className="text-right">
                  Address
                </Label>
                <Field
                  as={Input}
                  id="address"
                  name="address"
                  placeholder="123 Main St, City, Country"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Status
                </Label>
                <Field
                  as="select"
                  id="status"
                  name="status"
                  className="col-span-3 rounded-md border border-gray-300 bg-white px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="open">Open</option>
                  <option value="closed">Closed</option>
                  <option value="postponed">Postponed</option>
                  <option value="cancelled">Cancelled</option>
                </Field>
              </div>

              {/* Active Status */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="is_active" className="text-right">
                  Active
                </Label>
                <Field
                  type="checkbox"
                  name="is_active"
                  checked={values.is_active}
                  onChange={() => setFieldValue("is_active", !values.is_active)}
                  className="col-span-3 h-4 w-4"
                />
              </div>

              {/* Actions */}
              <DialogFooter className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isEditMode ? "Update Marking Center" : "Create Marking Center"}
                </Button>
              </DialogFooter>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
}