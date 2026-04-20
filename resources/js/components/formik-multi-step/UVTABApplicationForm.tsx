"use client";

import { router } from "@inertiajs/react";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { Formik, Form } from "formik";
import React, { useState } from "react";
import { toast } from "sonner";
import * as Yup from "yup";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import StepperIndicator from "@/components/shared/stepper-indicator";
import FormActions from "@/components/shared/form-actions";

import ApplicantInfo from "./steps/ApplicantInfo";
import AddressInfo from "./steps/AddressInfo";
import AcademicQualifications from "./steps/AcademicQualifications";
import ActivitiesApplied from "./steps/ActivitiesApplied";
import ExperienceInfo from "./steps/ExperienceInfo";
import AccountDetails from "./steps/AccountDetails";
import Declaration from "./steps/Declaration";

const STEPS = [
  "Personal Information",
  "Residential Address",
  "Academic Qualifications",
  "Activities Applied For",
  "Experience (Scouts & Supervisors)",
  "Account Details",
  "Declaration",
];

export default function UVTABApplicationForm() {
  const [activeStep, setActiveStep] = useState(0);
  const [formError, setFormError] = useState("");

  const initialValues = {
    surname: "",
    other_names: "",
    date_of_birth: "",
    place_of_birth: "",
    nationality: "",
    phone1: "",
    phone2: "",
    national_id: "",
    email: "",

    designation: "",
    duty_station: "",
    district: "",
    county: "",
    subcounty: "",
    parish: "",
    village: "",
    residential_from: "",

    academic_qualifications: [
      { award: "", institution: "", year: "" },
    ],

    activities: {
      item_writing: false,
      item_moderation: false,
      assessor_marking: false,
      scouts: false,
      script_checker: false,
      supervisor: false,
      others: "",
    },

    subjects_specialization: "", // for item writing, moderation, assessor

    experience: [
      { institution: "", police_station: "", year: "" },
    ],

    bank_name: "",
    account_no: "",
    branch: "",

    declaration: false,
  };

  const validationSchema = Yup.object().shape({
    surname: Yup.string().required("Surname is required"),
    other_names: Yup.string().required("Other names are required"),
    date_of_birth: Yup.date().required("Date of birth is required"),
    phone1: Yup.string().required("Phone number is required"),
    national_id: Yup.string().required("National ID / Passport is required"),
    email: Yup.string().email().required("Email is required"),
    declaration: Yup.boolean().oneOf([true], "You must accept the declaration"),
  });

  const getStepContent = (step: number) => {
    switch (step) {
      case 0: return <ApplicantInfo />;
      case 1: return <AddressInfo />;
      case 2: return <AcademicQualifications />;
      case 3: return <ActivitiesApplied />;
      case 4: return <ExperienceInfo />;
      case 5: return <AccountDetails />;
      case 6: return <Declaration />;
      default: return null;
    }
  };

  const onSubmit = async (values: any, { setSubmitting }: any) => {
    setFormError("");

    try {
      await router.post("/applications/uvtab", values, {
        onSuccess: () => {
          toast.success("Application submitted successfully!");
          // Optional: reset form or redirect
        },
        onError: (errors) => {
          setFormError("Failed to submit application. Please check your data.");
          console.error(errors);
        },
        onFinish: () => setSubmitting(false),
      });
    } catch (error) {
      toast.error("An unexpected error occurred");
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <StepperIndicator activeStep={activeStep} steps={STEPS} />

      {formError && (
        <Alert variant="destructive" className="mt-6">
          <ExclamationTriangleIcon className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{formError}</AlertDescription>
        </Alert>
      )}

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ handleSubmit, isSubmitting }) => (
          <Form>
            <div className="mt-8">
              {getStepContent(activeStep)}
            </div>

            <FormActions
              activeStep={activeStep}
              totalSteps={STEPS.length}
              onBack={() => setActiveStep((prev) => prev - 1)}
              onNext={() => setActiveStep((prev) => prev + 1)}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
            />
          </Form>
        )}
      </Formik>
    </div>
  );
}