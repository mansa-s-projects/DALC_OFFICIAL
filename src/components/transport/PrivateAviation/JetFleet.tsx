import { jetFleet } from "../../../data/transport/jetFleet";

type JetFleetItem = {
  id: string;
  model: string;
  range: string;
  passengers: number;
  cabinType: string;
  description: string;
  image: string;
};

function handleTransportRequest(aircraftName: string) {
  const payload = {
    serviceType: "private-aviation",
    vehicleOrAircraft: aircraftName,
    pickupLocation: "Dubai",
    destination: "",
    requestedDate: "",
    notes: "",
  };

  console.log("Transport request submitted:", payload);
}

function JetCard({ item }: { item: JetFleetItem }) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition hover:shadow-md">
      <div className="mb-4 aspect-[16/10] overflow-hidden rounded-xl bg-neutral-100">
        <img
          src={item.image}
          alt={item.model}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="space-y-2">
        <p className="text-xs uppercase tracking-wide text-neutral-500">
          {item.cabinType}
        </p>

        <h3 className="text-xl font-semibold text-neutral-900">
          {item.model}
        </h3>

        <p className="text-sm text-neutral-600">
          Up to {item.passengers} passengers
        </p>

        <p className="text-sm text-neutral-600">
          Range: {item.range}
        </p>

        <p className="text-sm leading-6 text-neutral-600">
          {item.description}
        </p>

        <button
          onClick={() => handleTransportRequest(item.model)}
          className="mt-4 rounded-xl bg-black px-4 py-3 text-sm font-medium text-white transition hover:opacity-90"
        >
          Request Charter
        </button>
      </div>
    </div>
  );
}

export default function JetFleet() {
  return (
    <section className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-3xl font-semibold text-neutral-900">
          Private Aviation
        </h2>
        <p className="max-w-2xl text-neutral-600">
          Request private charter flights departing from Dubai for regional and
          international routes.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {jetFleet.map((item) => (
          <JetCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
