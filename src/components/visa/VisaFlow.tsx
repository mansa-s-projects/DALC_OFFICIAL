"use client";

import { useState } from "react";
import StepNationality from "./StepNationality";
import StepDestination from "./StepDestination";
import StepResult from "./StepResult";

export default function VisaFlow() {
  const [step, setStep] = useState<number>(1);
  const [nationality, setNationality] = useState<string | null>(null);
  const [destination, setDestination] = useState<string | null>(null);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white">
      <div className="mb-6 text-sm opacity-70">Step {step} of 3</div>

      {step === 1 && (
        <StepNationality
          onSelect={(country: string) => {
            setNationality(country);
            setStep(2);
          }}
        />
      )}

      {step === 2 && (
        <StepDestination
          onSelect={(dest: string) => {
            setDestination(dest);
            setStep(3);
          }}
        />
      )}

      {step === 3 && (
        <StepResult nationality={nationality} destination={destination} />
      )}
    </div>
  );
}