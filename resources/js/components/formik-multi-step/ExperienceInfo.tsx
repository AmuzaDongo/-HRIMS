"use client";

import { Field, FieldArray } from "formik";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ExperienceInfo() {
  return (
    <FieldArray name="experience">
      {({ push, remove, form }) => (
        <div>
          <Label className="block mb-4">Experience (For Scouts & Supervisors Only)</Label>

          {form.values.experience.map((_: any, index: number) => (
            <div key={index} className="grid grid-cols-3 gap-4 mb-4 border p-4 rounded-lg">
              <div>
                <Label>Institution Supervised</Label>
                <Field as={Input} name={`experience[${index}].institution`} />
              </div>
              <div>
                <Label>Police Station</Label>
                <Field as={Input} name={`experience[${index}].police_station`} />
              </div>
              <div>
                <Label>Year</Label>
                <Field as={Input} name={`experience[${index}].year`} />
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
            onClick={() => push({ institution: "", police_station: "", year: "" })}
          >
            + Add Experience
          </Button>
        </div>
      )}
    </FieldArray>
  );
}