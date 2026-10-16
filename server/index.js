
const express = require("express");
const cors = require("cors");
const { randomUUID } = require("node:crypto");

const app = express();
const PORT = 3001;

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

const events = [
 {
  id: 1,
  title: "Planetarium Experience",
  date: "October 25, 2026",
  time: "2:00 PM",
  price: 15,
  capacity: 50
},
{
  id: 2,
  title: "Science After Dark",
  date: "October 30, 2026",
  time: "7:00 PM",
  price: 25,
  capacity: 100
}
];

const reservations = [];

app.get("/api/events", (req, res) => {
  res.json(events.map(event => ({
    ...event,
    available: event.capacity -
      reservations
        .filter(r => r.eventId === event.id)
        .reduce((sum, r) => sum + r.quantity, 0)
  })));
});

app.get("/", (req, res) => {
    res.send("Welcome to the Museum Ticketing API!");
    console.log("Welcome to the Museum Ticketing API!");
});

app.post("/api/reservations", (req, res) => {
  const { eventId, name, email, quantity } = req.body;

  const event = events.find(e => e.id === eventId);

  if (!event) {
    return res.status(404).json({
      error: "Event not found"
    });
  }

  if (
    typeof name !== "string" ||
    !name.trim() ||
    typeof email !== "string" ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    !Number.isInteger(quantity) ||
    quantity < 1
  ) {
    return res.status(400).json({
      error: "Invalid reservation details"
    });
  }

  const reserved = reservations
    .filter(r => r.eventId === eventId)
    .reduce((sum, r) => sum + r.quantity, 0);

  if (reserved + quantity > event.capacity) {
    return res.status(409).json({
      error: "Not enough tickets available"
    });
  }

  const reservation = {
    id: randomUUID(),
    eventId,
    event: event.title,
    name: name.trim(),
    email: email.trim(),
    quantity,
    total: event.price * quantity,
  };

  reservations.push(reservation);
  console.log("🎟️ New reservation received!");
  console.log(reservation);
  console.log("Total reservations:", reservations.length);
  console.log("Reservation created:", {
  reservationId: reservation.id,
  eventId: reservation.eventId,
  quantity: reservation.quantity
});
  res.status(201).json(reservation);
  
});

app.listen(PORT, () => {
  console.log(`✨ 🎟️ API magic running on http://localhost:${PORT} ✨`);

});
