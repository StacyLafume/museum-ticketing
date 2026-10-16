import { QRCodeSVG } from "qrcode.react";

const AdmissionTicket = ({ reservation }) => {
  if (!reservation) return null;

  const ticketUrl = `${window.location.origin}/tickets/${reservation.id}`;

  return (
    <section className="admission-ticket">
      <p className="ticket-label">OPEN ADMISSION</p>

      <h2>🎟️ Your Admission Ticket 🎟️ </h2>

      <h3>{reservation.event}</h3>

      <p>Guest: {reservation.name}</p>
      <p>Tickets: {reservation.quantity}</p>
      <p>Total: ${reservation.total.toFixed(2)}</p>

      <div className="qr-container">
        <QRCodeSVG
          value={ticketUrl}
          size={180}
          level="H"
          marginSize={2}
          title="Admission ticket QR code"
        />
      </div>

      <p className="ticket-code">Confirmation: {reservation.id}</p>

      <p className="ticket-note">Present this QR code at admission.</p>
    </section>
  );
};

export default AdmissionTicket;
