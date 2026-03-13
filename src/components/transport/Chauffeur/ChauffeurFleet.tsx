import { chauffeurFleet } from "../../../data/transport/chauffeurFleet";

type ChauffeurFleetItem = {
  id: string;
  name: string;
  category: string;
  passengers: number;
  description: string;
  image: string;
};

function handleTransportRequest(vehicleName: string) {
  const payload = {
    serviceType: "chauffeur",
    vehicleOrAircraft: vehicleName,
    pickupLocation: "",
    destination: "",
    requestedDate: "",
    notes: "",
  };

  console.log("Transport request submitted:", payload);
}

function ChauffeurCard({ item }: { item: ChauffeurFleetItem }) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition hover:shadow-md">
      <div className="mb-4 aspect-[16/10] overflow-hidden rounded-xl bg-neutral-100">
        <img
          src={item.image}
          alt={item.name}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="space-y-2">
        <p className="text-xs uppercase tracking-wide text-neutral-500">
          {item.category}
        </p>

        <h3 className="text-xl font-semibold text-neutral-900">
          {item.name}
        </h3>

        <p className="text-sm text-neutral-600">
          Up to {item.passengers} passengers
        </p>

        <p className="text-sm leading-6 text-neutral-600">
          {item.description}
        </p>

        <button
          onClick={() => handleTransportRequest(item.name)}
          className="mt-4 rounded-xl bg-black px-4 py-3 text-sm font-medium text-white transition hover:opacity-90"
        >
          Request Service
        </button>
      </div>
    </div>
  );
}

export default function ChauffeurFleet() {
  return (
    <section className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-3xl font-semibold text-neutral-900">
          Chauffeur Service
        </h2>
        <p className="max-w-2xl text-neutral-600">
          Professional driver service across Dubai for airport transfers,
          meetings, hotel pickups, and scheduled transport.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {chauffeurFleet.map((item) => (
          <ChauffeurCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
