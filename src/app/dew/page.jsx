export default function DewPage() {
  return (
    <main
      style={{
        maxWidth: 820,
        margin: "100px auto",
        padding: "0 20px",
        color: "#e5e7eb",
        fontFamily: "system-ui",
      }}
    >
      {/* HERO */}
      <h1
        style={{
          fontSize: 38,
          fontWeight: 800,
          marginBottom: 14,
          color: "#fff",
          lineHeight: 1.2,
        }}
      >
        Dew answers customer questions
        <br />
        so you don’t have to.
      </h1>

      <p style={{ fontSize: 18, opacity: 0.9, marginBottom: 10 }}>
        Dew is an AI assistant that lives on your website, answers FAQs 24/7,
        and guides visitors to book or contact you.
      </p>

      <p style={{ fontSize: 15, opacity: 0.7, marginBottom: 28 }}>
        This page is using Dew. Try the assistant in the bottom-right corner →
      </p>

      {/* PRIMARY CTA */}
      <div style={{ marginBottom: 70 }}>
        <a
          href="#how-it-works"
          style={{
            display: "inline-block",
            padding: "14px 26px",
            borderRadius: 12,
            background: "#2563eb",
            color: "#fff",
            fontWeight: 700,
            textDecoration: "none",
            marginRight: 14,
          }}
        >
          See it in action
        </a>

        <a
          href="https://www.beiraghian.com/calendar"
          style={{
            fontSize: 14,
            color: "#93c5fd",
            textDecoration: "underline",
          }}
        >
          Or book a 15-min call
        </a>
      </div>

      {/* HOW IT WORKS */}
      <section id="how-it-works" style={{ marginBottom: 70 }}>
        <h2
          style={{
            fontSize: 24,
            fontWeight: 700,
            marginBottom: 24,
            color: "#fff",
          }}
        >
          How Dew works
        </h2>

        <ol style={{ lineHeight: "1.9", fontSize: 16 }}>
          <li>
            <strong>Add Dew to your website</strong>
            <br />A small chat widget appears in the corner. No redesign
            required.
          </li>

          <li>
            <strong>Dew answers common questions instantly</strong>
            <br />
            Services, pricing, hours, policies, bookings — automatically.
          </li>

          <li>
            <strong>Visitors take action faster</strong>
            <br />
            Fewer messages. Fewer calls. More qualified leads.
          </li>
        </ol>
      </section>

      {/* BEFORE / AFTER */}
      <section style={{ marginBottom: 70 }}>
        <h2
          style={{
            fontSize: 24,
            fontWeight: 700,
            marginBottom: 20,
            color: "#fff",
          }}
        >
          Before & after Dew
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 40,
            fontSize: 15,
            lineHeight: 1.8,
          }}
        >
          <div>
            <strong>Before Dew</strong>
            <ul style={{ opacity: 0.75 }}>
              <li>Answering the same questions repeatedly</li>
              <li>Missed messages and slow replies</li>
              <li>Visitors leave without booking</li>
            </ul>
          </div>

          <div>
            <strong>After Dew</strong>
            <ul style={{ opacity: 0.75 }}>
              <li>Questions answered instantly</li>
              <li>Less interruption during your work</li>
              <li>More bookings without extra effort</li>
            </ul>
          </div>
        </div>
      </section>

      {/* WHO IT'S FOR */}
      <section style={{ marginBottom: 70 }}>
        <h2
          style={{
            fontSize: 24,
            fontWeight: 700,
            marginBottom: 20,
            color: "#fff",
          }}
        >
          Who Dew is for
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 40,
            fontSize: 15,
            lineHeight: 1.8,
          }}
        >
          <div>
            <strong>Great fit for</strong>
            <ul style={{ opacity: 0.75 }}>
              <li>Small businesses</li>
              <li>Service providers</li>
              <li>Solo founders & local brands</li>
            </ul>
          </div>

          <div>
            <strong>Not for</strong>
            <ul style={{ opacity: 0.75 }}>
              <li>Complex enterprise workflows</li>
              <li>Custom AI research projects</li>
              <li>Businesses needing full manual control</li>
            </ul>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section style={{ marginBottom: 70 }}>
        <h2
          style={{
            fontSize: 24,
            fontWeight: 700,
            marginBottom: 20,
            color: "#fff",
          }}
        >
          Simple pricing
        </h2>

        <div style={{ fontSize: 16 }}>
          <p style={{ marginBottom: 14 }}>
            <strong>Basic — $29 / month</strong>
            <br />
            <span style={{ opacity: 0.7 }}>
              Powered by Dew • best for most small businesses
            </span>
          </p>

          <p>
            <strong>Pro — $79 / month</strong>
            <br />
            <span style={{ opacity: 0.7 }}>White-label • no Dew branding</span>
          </p>
        </div>
      </section>

      {/* FINAL CTA */}
      <section>
        <h3
          style={{
            fontSize: 22,
            fontWeight: 700,
            marginBottom: 12,
            color: "#fff",
          }}
        >
          Want Dew on your website?
        </h3>

        <a
          href="https://www.beiraghian.com/calendar"
          style={{
            display: "inline-block",
            padding: "14px 26px",
            borderRadius: 12,
            background: "#2563eb",
            color: "#fff",
            fontWeight: 700,
            textDecoration: "none",
          }}
        >
          Book a quick demo
        </a>
      </section>
    </main>
  );
}
