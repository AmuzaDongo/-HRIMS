"use client";

import { Field } from "formik";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AddressInfo() {
  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="designation">Designation / Job Title</Label>
        <Field as={Input} name="designation" placeholder="e.g. Principal, Lecturer" />
      </div>

      <div>
        <Label htmlFor="duty_station">Duty Station</Label>
        <Field as={Input} name="duty_station" placeholder="e.g. Makerere University" />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <Label htmlFor="district">District</Label>
          <Field as={Input} name="district" />
        </div>
        <div>
          <Label htmlFor="county">County</Label>
          <Field as={Input} name="county" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <Label htmlFor="subcounty">Subcounty</Label>
          <Field as={Input} name="subcounty" />
        </div>
        <div>
          <Label htmlFor="parish">Parish</Label>
          <Field as={Input} name="parish" />
        </div>
      </div>

      <div>
        <Label htmlFor="village">Village</Label>
        <Field as={Input} name="village" />
      </div>

      <div>
        <Label htmlFor="residential_from">Residential From (DD/MM/YYYY)</Label>
        <Field type="date" as={Input} name="residential_from" />
      </div>
    </div>
  );
}