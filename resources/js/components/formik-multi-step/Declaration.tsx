"use client";

import { ErrorMessage } from "formik";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export default function Declaration() {
  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3">
        <Checkbox  name="declaration" id="declaration" />
        <div>
          <Label htmlFor="declaration" className="cursor-pointer">
            I hereby declare that the information provided on this form is true and correct to the best of my knowledge.
          </Label>
          <ErrorMessage name="declaration" component="p" className="text-red-600 text-sm mt-1" />
        </div>
      </div>
    </div>
  );
}