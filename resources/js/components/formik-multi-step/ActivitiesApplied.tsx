"use client";

import { Field } from "formik";
import { Label } from "@/components/ui/label";

export default function ActivitiesApplied() {
  return (
    <div className="space-y-6">
      <Label className="text-base font-medium">Activities Applied For</Label>

      <div className="grid grid-cols-1 gap-4">
        <div className="flex items-center space-x-3">
          <Field type="checkbox" name="activities.item_writing" id="item_writing" />
          <Label htmlFor="item_writing">Item Writing</Label>
        </div>

        <div className="flex items-center space-x-3">
          <Field type="checkbox" name="activities.item_moderation" id="item_moderation" />
          <Label htmlFor="item_moderation">Item Moderation</Label>
        </div>

        <div className="flex items-center space-x-3">
          <Field type="checkbox" name="activities.assessor_marking" id="assessor_marking" />
          <Label htmlFor="assessor_marking">Assessor / Assessments Marking</Label>
        </div>

        <div className="flex items-center space-x-3">
          <Field type="checkbox" name="activities.scouts" id="scouts" />
          <Label htmlFor="scouts">Scouts</Label>
        </div>

        <div className="flex items-center space-x-3">
          <Field type="checkbox" name="activities.script_checker" id="script_checker" />
          <Label htmlFor="script_checker">Script Checker</Label>
        </div>

        <div className="flex items-center space-x-3">
          <Field type="checkbox" name="activities.supervisor" id="supervisor" />
          <Label htmlFor="supervisor">Supervisor</Label>
        </div>
      </div>

      <div>
        <Label htmlFor="others">Others (Please Specify)</Label>
        <Field as="textarea" name="activities.others" id="others" className="w-full" />
      </div>
    </div>
  );
}