export default function App() {
  const colors = {
    canvas: '#ffffff',
    surfaceSoft: '#f1f4f7',
    inkDeep: '#0a1317',
    ink: '#1c1e21',
    slate: '#4b4c4f',
    steel: '#5d6c7b',
    hairlineSoft: '#dee3e9',
    cobalt: '#0064e0',
  };

  const steps = [
    {
      number: '1',
      title: 'Add a movie',
      copy: 'Start with a title you watched recently.',
    },
    {
      number: '2',
      title: 'Choose a bucket',
      copy: 'Place it into Liked, Fine, or Disliked first.',
    },
    {
      number: '3',
      title: 'Compare within that bucket',
      copy: 'Refine the position with fewer decisions.',
    },
    {
      number: '4',
      title: 'View your ranked list',
      copy: 'See buckets combine into one ordered ranking.',
    },
  ];

  return (
    <main
      style={{
        minHeight: '100vh',
        background: colors.canvas,
        color: colors.inkDeep,
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        padding: '48px 20px',
      }}
    >
      <header style={{ maxWidth: 880, margin: '0 auto 32px' }}>
        <p
          style={{
            color: colors.cobalt,
            fontSize: 14,
            fontWeight: 700,
            margin: '0 0 12px',
          }}
        >
          Bucket-first movie ranking
        </p>
        <h1
          style={{
            fontSize: 'clamp(40px, 8vw, 64px)',
            fontWeight: 600,
            letterSpacing: 0,
            lineHeight: 1.08,
            margin: 0,
            maxWidth: 760,
          }}
        >
          Rank movies without turning taste into homework.
        </h1>
        <p
          style={{
            color: colors.slate,
            fontSize: 18,
            lineHeight: 1.55,
            margin: '20px 0 0',
            maxWidth: 680,
          }}
        >
          Add what you watched, choose a simple preference bucket, then compare only inside that bucket to build a ranked list.
        </p>

        <nav style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 28 }}>
          <a
            href="/add-movie"
            style={{
              background: colors.inkDeep,
              borderRadius: 100,
              color: colors.canvas,
              display: 'inline-block',
              fontSize: 14,
              fontWeight: 700,
              padding: '14px 28px',
              textDecoration: 'none',
            }}
          >
            Add a movie
          </a>
          <a
            href="/ranking"
            style={{
              background: 'transparent',
              border: `2px solid ${colors.inkDeep}`,
              borderRadius: 100,
              color: colors.inkDeep,
              display: 'inline-block',
              fontSize: 14,
              fontWeight: 700,
              padding: '12px 26px',
              textDecoration: 'none',
            }}
          >
            View ranking
          </a>
        </nav>
      </header>

      <section
        style={{
          background: colors.surfaceSoft,
          borderRadius: 32,
          margin: '0 auto',
          maxWidth: 880,
          padding: 24,
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 24 }}>
          {['Liked', 'Fine', 'Disliked'].map((bucket, index) => (
            <span
              key={bucket}
              style={{
                background: index === 0 ? colors.cobalt : colors.canvas,
                border: index === 0 ? `1px solid ${colors.cobalt}` : `1px solid ${colors.hairlineSoft}`,
                borderRadius: 100,
                color: index === 0 ? colors.canvas : colors.ink,
                fontSize: 14,
                fontWeight: 700,
                padding: '8px 16px',
              }}
            >
              {bucket}
            </span>
          ))}
        </div>

        <div
          style={{
            display: 'grid',
            gap: 16,
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          }}
        >
          {steps.map((step) => (
            <article
              key={step.number}
              style={{
                background: colors.canvas,
                border: `1px solid ${colors.hairlineSoft}`,
                borderRadius: 24,
                padding: 20,
              }}
            >
              <span
                style={{
                  alignItems: 'center',
                  background: colors.inkDeep,
                  borderRadius: '50%',
                  color: colors.canvas,
                  display: 'inline-flex',
                  fontSize: 13,
                  fontWeight: 700,
                  height: 32,
                  justifyContent: 'center',
                  width: 32,
                }}
              >
                {step.number}
              </span>
              <h2 style={{ fontSize: 20, lineHeight: 1.25, margin: '18px 0 8px' }}>{step.title}</h2>
              <p style={{ color: colors.steel, fontSize: 15, lineHeight: 1.5, margin: 0 }}>{step.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section style={{ maxWidth: 880, margin: '32px auto 0' }}>
        <div
          style={{
            border: `1px solid ${colors.hairlineSoft}`,
            borderRadius: 24,
            padding: 24,
          }}
        >
          <h2 style={{ fontSize: 24, lineHeight: 1.25, margin: '0 0 10px' }}>Why this stays simple</h2>
          <p style={{ color: colors.slate, fontSize: 16, lineHeight: 1.6, margin: 0, maxWidth: 720 }}>
            Bucket selection reduces comparison friction, and within-bucket placement keeps each decision focused. The result is a ranked list that feels useful before the app needs advanced scoring.
          </p>
        </div>
      </section>
    </main>
  );
}
