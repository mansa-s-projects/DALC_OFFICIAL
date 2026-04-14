type StepDestinationProps = {
  onSelect: (destination: string) => void;
};

export default function StepDestination({ onSelect }: StepDestinationProps) {
  const destinations = ["UAE", "Schengen", "USA"];

  return (
    <div className="text-center">
      <h1 className="text-3xl mb-6">Where are you going?</h1>

      <div className="flex gap-4 justify-center flex-wrap">
        {destinations.map((destination) => (
          <button
            key={destination}
            onClick={() => onSelect(destination)}
            className="border border-yellow-500 px-6 py-4 rounded hover:bg-yellow-500 hover:text-black transition"
          >
            {destination}
          </button>
        ))}
      </div>
    </div>
  );
}