import { useState, useEffect } from "react";
import AdmissionTicket from "./components/AdmissionTicket";
import "./App.css";

const events = [];

const App = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [confirmation, setConfirmation] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const total = selectedEvent ? selectedEvent.price * quantity : 0;

  const handleReservation = async (e) => {
    e.preventDefault();
    console.log("🎟️ Reservation button clicked!");

    if (!selectedEvent) return;

    try {
      const response = await fetch("http://localhost:3001/api/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventId: selectedEvent.id,
          name,
          email,
          quantity,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Reservation failed");
        return;
      }

      setConfirmation(data);
      setSelectedEvent(null);
      await loadEvents();
    } catch (error) {
      console.error("Reservation error:", error);
      alert("Could not connect to the ticketing server.");
    }
  };
  const loadEvents = async () => {
    try {
      setError("");

      const response = await fetch("http://localhost:3001/api/events");

      if (!response.ok) {
        throw new Error("Failed to load events");
      }

      const data = await response.json();
      setEvents(data);
    } catch (err) {
      console.error(err);
      setError("Could not load museum events.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const selectEvent = (event) => {
    setSelectedEvent(event);
    setConfirmation(null);
    setName("");
    setEmail("");
    setQuantity(1);
  };

  return (
    <main>
      <h1>🎟️ Open Admission 🎟️</h1>
      <p>Discover and reserve your next science experience.</p>
      {loading && <p>Loading events...</p>}
      {error && <p role="alert">{error}</p>}
      <section className="events">
        {events.map((event) => (
          <article className="event-card" key={event.id}>
            <h2>{event.title}</h2>
            <p>
              {event.date} at {event.time}
            </p>
            <p>${event.price} per ticket</p>
            <p>{event.available} tickets remaining</p>
            <button
              disabled={event.available === 0}
              onClick={() => selectEvent(event)}
            >
              {event.available === 0 ? "Sold Out" : "Reserve Ticket"}
            </button>{" "}
          </article>
        ))}
      </section>

      {selectedEvent && (
        <section className="confirmation">
          <h2>Reserve: {selectedEvent.title}</h2>

          <form onSubmit={handleReservation}>
            <label htmlFor="visitor-name">Full name</label>
            <input
              id="visitor-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <label htmlFor="visitor-email">Email</label>
            <input
              id="visitor-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label htmlFor="ticket-quantity">Number of tickets</label>
            <input
              id="ticket-quantity"
              type="number"
              min="1"
              max={selectedEvent.available}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              required
            />

            <h3>Total: ${total.toFixed(2)}</h3>
            <button type="submit">Confirm Reservation</button>
            <button type="button" onClick={() => setSelectedEvent(null)}>
              Cancel
            </button>
          </form>
        </section>
      )}

      {confirmation && (
        <section className="confirmation" role="status">
          <AdmissionTicket reservation={confirmation} />
        </section>
      )}
    </main>
  );
};
export default App;
