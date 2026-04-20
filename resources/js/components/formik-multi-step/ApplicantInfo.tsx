"use client";

import { Field, ErrorMessage } from "formik";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ApplicantInfo() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div>
          <Label htmlFor="surname">Surname *</Label>
          <Field as={Input} name="surname" id="surname" placeholder="Enter surname" />
          <ErrorMessage name="surname" component="p" className="text-red-600 text-sm mt-1" />
        </div>

        <div>
          <Label htmlFor="other_names">Other Names *</Label>
          <Field as={Input} name="other_names" id="other_names" placeholder="Enter other names" />
          <ErrorMessage name="other_names" component="p" className="text-red-600 text-sm mt-1" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div>
          <Label htmlFor="date_of_birth">Date of Birth *</Label>
          <Field type="date" as={Input} name="date_of_birth" id="date_of_birth" />
          <ErrorMessage name="date_of_birth" component="p" className="text-red-600 text-sm mt-1" />
        </div>

        <div>
          <Label htmlFor="place_of_birth">Place of Birth</Label>
          <Field as={Input} name="place_of_birth" id="place_of_birth" placeholder="e.g. Kampala" />
        </div>

        <div>
          <Label htmlFor="nationality">Nationality *</Label>
          <Field as={Input} name="nationality" id="nationality" placeholder="Ugandan" />
          <ErrorMessage name="nationality" component="p" className="text-red-600 text-sm mt-1" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <Label htmlFor="phone1">Phone Number 1 *</Label>
          <Field as={Input} name="phone1" id="phone1" placeholder="+256 7XX XXX XXX" />
          <ErrorMessage name="phone1" component="p" className="text-red-600 text-sm mt-1" />
        </div>

        <div>
          <Label htmlFor="phone2">Phone Number 2</Label>
          <Field as={Input} name="phone2" id="phone2" placeholder="+256 7XX XXX XXX" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <Label htmlFor="national_id">National ID / Passport No. *</Label>
          <Field as={Input} name="national_id" id="national_id" placeholder="CM123456789" />
          <ErrorMessage name="national_id" component="p" className="text-red-600 text-sm mt-1" />
        </div>

        <div>
          <Label htmlFor="email">Email Address *</Label>
          <Field type="email" as={Input} name="email" id="email" placeholder="example@email.com" />
          <ErrorMessage name="email" component="p" className="text-red-600 text-sm mt-1" />
        </div>
      </div>
    </div>
  );
}