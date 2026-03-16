// Relocation Intake feature
// Actual intake form is at src/features/move-to-dubai/pages/Intake.tsx
export {
  useRelocationProfile,
  useCreateRelocationProfile,
  useUpdateRelocationProfile,
  useUserWorkflows,
  useWorkflowSteps,
  useUpdateWorkflowStep,
} from '../move-to-dubai/hooks/useRelocation';
export { useCostEstimates, useAddCostEstimate } from '../move-to-dubai/hooks/useRelocationCost';
export { useUserDocuments, useUploadDocument } from '../move-to-dubai/hooks/useRelocationDocs';
