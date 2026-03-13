import { useState } from "react";

export default function AirportTransfer() {
  const [pickupLocation, setPickupLocation] = useState("");
  const [destination, setDestination] = useState("DXB Airport");
  const [requestedDate, setRequestedDate] = useState("");
  const [notes, setNotes] = useState("");

  function handleTransportRequest() {
    const payload = {
      serviceType: "airport-transfer",
      vehicleOrAircraft: "Assigned on request",
      pickupLocation,
      destination,
      requestedDate,
      notes,
    };

    console.log("Transport request submitted:", payload);
  }

  return (
    <section className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-3xl font-semibold text-neutral-900">
          Airport Transfer
        </h2>
        <p className="max-w-2xl text-neutral-600">
          Scheduled airport transfer services for hotel pickups, departures, and
          arrivals across Dubai.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-xl font-semibold text-neutral-900">
            Request Transfer
          </h3>

          <div className="space-y-4">
            <input
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
              placeholder="Pickup location"
              className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-black"
            />

            <input
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Destination"
              className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-black"
            />

            <input
              type="datetime-local"
              value={requestedDate}
              onChange={(e) => setRequestedDate(e.target.value)}
              className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-black"
            />

            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Notes"
              className="min-h-[120px] w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-black"
            />

            <button
              onClick={handleTransportRequest}
              className="rounded-xl bg-black px-4 py-3 text-sm font-medium text-white transition hover:opacity-90"
            >
              Request Transfer
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-xl font-semibold text-neutral-900">
            Typical Routes
          </h3>

          <div className="space-y-3 text-neutral-600">
            <p>Dubai Marina to DXB Airport</p>
            <p>Palm Jumeirah to DXB Airport</p>
            <p>Downtown Dubai to Al Maktoum Airport</p>
          </div>
        </div>
      </div>
    </section>
  );
}
