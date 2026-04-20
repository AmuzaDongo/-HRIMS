"use client";

import { Field } from "formik";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AccountDetails() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="bank_name">Bank Name</Label>
          <Field as={Input} name="bank_name" id="bank_name" />
        </div>
        <div>
          <Label htmlFor="account_no">Account Number</Label>
          <Field as={Input} name="account_no" id="account_no" />
        </div>
        <div>
          <Label htmlFor="branch">Branch</Label>
          <Field as={Input} name="branch" id="branch" />
        </div>
      </div>
    </div>
  );
}