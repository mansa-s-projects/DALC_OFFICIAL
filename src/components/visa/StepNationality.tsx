type StepNationalityProps = {
  onSelect: (country: string) => void;
};

export default function StepNationality({ onSelect }: StepNationalityProps) {
  const countries = ["UAE", "USA", "UK", "India", "France"];

  return (
    <div className="text-center">
      <h1 className="text-3xl mb-6">Select Your Nationality</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {countries.map((country) => (
          <button
            key={country}
            onClick={() => onSelect(country)}
            className="border border-yellow-500 p-4 rounded hover:bg-yellow-500 hover:text-black transition"
          >
            {country}
          </button>
        ))}
      </div>
    </div>
  );
}