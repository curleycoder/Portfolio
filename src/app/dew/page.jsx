export default function DewPage() {
  return (
    <main
      style={{
        maxWidth: 720,
        margin: "80px auto",
        padding: "0 20px",
        color: "#e5e7eb",
        fontFamily: "system-ui",
      }}
    >
      {/* Title */}
      <h1
        style={{
          fontSize: 32,
          fontWeight: 700,
          marginBottom: 24,
          color: "#fff",
        }}
      >
        Dew — AI FAQ assistant for business websites
      </h1>

      {/* Bullets */}
      <ul
        style={{
          marginBottom: 32,
          paddingLeft: 20,
          lineHeight: "1.8",
          fontSize: 16,
        }}
      >
        <li>Answers FAQs instantly</li>
        <li>Reduces messages & calls</li>
        <li>Drives bookings & leads</li>
      </ul>

      {/* Pricing */}
      <div style={{ marginBottom: 40, fontSize: 16 }}>
        <p style={{ marginBottom: 8 }}>
          <strong>Basic</strong> — $29 / month <br />
          <span style={{ opacity: 0.7 }}>Powered by Dew</span>
        </p>
        <p>
          <strong>Pro</strong> — $79 / month <br />
          <span style={{ opacity: 0.7 }}>White-label</span>
        </p>
      </div>

      {/* CTA */}
      <a
        href="https://www.beiraghian.com/calendar"
        style={{
          display: "inline-block",
          padding: "14px 20px",
          borderRadius: 10,
          background: "#2563eb",
          color: "#fff",
          fontWeight: 600,
          textDecoration: "none",
        }}
      >
        Request demo / Book a call
      </a>
    </main>
  );
}
