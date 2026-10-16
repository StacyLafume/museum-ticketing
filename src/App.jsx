import { useState } from "react";
import "./App.css";

const events = [
  {
    id: 1,
    title: "Planetarium Experience",
    date: "October 25, 2026",
    time: "2:00 PM",
    price: 15,
    capacity: 50,
  },
  {
    id: 2,
    title: "Science After Dark",
    date: "October 30, 2026",
    time: "7:00 PM",
    price: 25,
    capacity: 100,
  },
];

const App = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [confirmation, setConfirmation] = useState(null);

  const total = selectedEvent ? selectedEvent.price * quantity : 0;

  const handleReservation = (e) => {
    e.preventDefault();

    if (!selectedEvent || quantity > selectedEvent.capacity) {
      return;
    }

    const reservation = {
      id: crypto.randomUUID(),
      event: selectedEvent.title,
      name,
      email,
      quantity,
      total,
    };

    setConfirmation(reservation);
    setSelectedEvent(null);
  };

  function selectEvent(event) {
    setSelectedEvent(event);
    setConfirmation(null);
    setName("");
    setEmail("");
    setQuantity(1);
  }

  return (
    <main>
      <h1>🎟️ OpenAdmission</h1>
      <p>Discover and reserve your next science experience.</p>

      <section className="events">
        {events.map((event) => (
          <article className="event-card" key={event.id}>
            <h2>{event.title}</h2>
            <p>
              {event.date} at {event.time}
            </p>
            <p>${event.price} per ticket</p>
            <p>{event.capacity} tickets available</p>
            <button onClick={() => selectEvent(event)}>Reserve Ticket</button>
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
              max={selectedEvent.capacity}
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
          <h2>Reservation Confirmed! 🎉</h2>
          <p>Thank you, {confirmation.name}.</p>
          <p>Event: {confirmation.event}</p>
          <p>Tickets: {confirmation.quantity}</p>
          <p>Total: ${confirmation.total.toFixed(2)}</p>
          <p>
            Confirmation: <code>{confirmation.id}</code>
          </p>
        </section>
      )}
    </main>
  );
};
export default App;
