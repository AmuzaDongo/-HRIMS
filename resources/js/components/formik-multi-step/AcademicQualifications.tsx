"use client";

import { Field, FieldArray } from "formik";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AcademicQualifications() {
  return (
    <FieldArray name="academic_qualifications">
      {({ push, remove, form }) => (
        <div>
          <Label className="block mb-4">Academic Qualifications (Attach Photocopies)</Label>

          {form.values.academic_qualifications.map((_: any, index: number) => (
            <div key={index} className="grid grid-cols-3 gap-4 mb-6 border p-4 rounded-lg">
              <div>
                <Label>Title of Award</Label>
                <Field as={Input} name={`academic_qualifications[${index}].award`} />
              </div>
              <div>
                <Label>Awarding Institution</Label>
                <Field as={Input} name={`academic_qualifications[${index}].institution`} />
              </div>
              <div>
                <Label>Year of Award</Label>
                <Field as={Input} name={`academic_qualifications[${index}].year`} />
              </div>

              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="col-span-3 w-fit"
                onClick={() => remove(index)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Remove
              </Button>
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={() => push({ award: "", institution: "", year: "" })}
          >
            + Add Qualification
          </Button>
        </div>
      )}
    </FieldArray>
  );
}