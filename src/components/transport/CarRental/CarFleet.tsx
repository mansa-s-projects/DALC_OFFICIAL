import { carFleet } from "../../../data/transport/carFleet";

type CarFleetItem = {
  id: string;
  name: string;
  category: string;
  horsepower: number;
  topSpeed: string;
  acceleration: string;
  description: string;
  image: string;
};

function handleTransportRequest(vehicleName: string) {
  const payload = {
    serviceType: "car-rental",
    vehicleOrAircraft: vehicleName,
    pickupLocation: "",
    destination: "",
    requestedDate: "",
    notes: "",
  };

  console.log("Transport request submitted:", payload);
}

function CarCard({ item }: { item: CarFleetItem }) {
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

        <div className="grid grid-cols-3 gap-3 text-sm text-neutral-600">
          <div>
            <p className="font-medium text-neutral-900">{item.horsepower}</p>
            <p>HP</p>
          </div>
          <div>
            <p className="font-medium text-neutral-900">{item.topSpeed}</p>
            <p>Top speed</p>
          </div>
          <div>
            <p className="font-medium text-neutral-900">{item.acceleration}</p>
            <p>0 to 100</p>
          </div>
        </div>

        <p className="text-sm leading-6 text-neutral-600">
          {item.description}
        </p>

        <button
          onClick={() => handleTransportRequest(item.name)}
          className="mt-4 rounded-xl bg-black px-4 py-3 text-sm font-medium text-white transition hover:opacity-90"
        >
          Request Rental
        </button>
      </div>
    </div>
  );
}

export default function CarFleet() {
  return (
    <section className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-3xl font-semibold text-neutral-900">
          Car Rental
        </h2>
        <p className="max-w-2xl text-neutral-600">
          Browse available rental vehicles for city use, business travel, and
          short term stays in Dubai.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {carFleet.map((item) => (
          <CarCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
