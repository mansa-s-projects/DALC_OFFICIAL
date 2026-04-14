import VisaPhotoUpload from "./VisaPhotoUpload";

type StepResultProps = {
  nationality: string | null;
  destination: string | null;
};

export default function StepResult({
  nationality,
  destination,
}: StepResultProps) {
  return (
    <div className="text-center">
      <h1 className="text-3xl mb-4">Visa Result</h1>

      <p className="mb-2">
        From <strong>{nationality ?? "Unknown"}</strong> to{" "}
        <strong>{destination ?? "Unknown"}</strong>
      </p>

      <p className="mb-6 text-lg">Visa details will appear here.</p>

      <VisaPhotoUpload />
    </div>
  );
}