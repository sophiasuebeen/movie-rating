import { useEffect, useState } from 'react';

const colors = {
  canvas: '#ffffff',
  surfaceSoft: '#f1f4f7',
  inkDeep: '#0a1317',
  ink: '#1c1e21',
  slate: '#4b4c4f',
  steel: '#5d6c7b',
  hairlineSoft: '#dee3e9',
  cobalt: '#0064e0',
  critical: '#e41e3f',
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

const fallbackBuckets = [
  { bucket: 'liked', label: 'I liked it', movies: [] },
  { bucket: 'fine', label: 'It was fine', movies: [] },
  { bucket: 'disliked', label: "I didn't like it", movies: [] },
];

const pageStyle = {
  minHeight: '100vh',
  background: colors.canvas,
  color: colors.inkDeep,
  fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  padding: '48px 20px',
};

function getListId() {
  const params = new URLSearchParams(window.location.search);
  return params.get('listId') || window.localStorage.getItem('movieListId') || '';
}

function HomePage() {
  return (
    <main style={pageStyle}>
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

function RankingPage() {
  const [listId] = useState(getListId);
  const [buckets, setBuckets] = useState(fallbackBuckets);
  const [status, setStatus] = useState(listId ? 'loading' : 'missing-list');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!listId) {
      return;
    }

    async function loadMovies() {
      try {
        const response = await fetch(`http://localhost:4000/api/lists/${listId}/movies`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to load ranking.');
        }

        setBuckets(data.buckets);
        setStatus('ready');
      } catch (loadError) {
        setError(loadError.message);
        setStatus('error');
      }
    }

    loadMovies();
  }, [listId]);

  return (
    <main style={pageStyle}>
      <header style={{ maxWidth: 880, margin: '0 auto 32px' }}>
        <a href="/" style={{ color: colors.steel, fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>
          Back home
        </a>
        <h1 style={{ fontSize: 'clamp(36px, 7vw, 56px)', lineHeight: 1.1, margin: '18px 0 12px' }}>
          Your ranked movies
        </h1>
        <p style={{ color: colors.slate, fontSize: 18, lineHeight: 1.55, margin: 0, maxWidth: 680 }}>
          Movies are grouped by bucket and ordered by their position inside that bucket.
        </p>
      </header>

      <section style={{ display: 'grid', gap: 18, margin: '0 auto', maxWidth: 880 }}>
        {status === 'missing-list' && (
          <p style={{ background: colors.surfaceSoft, borderRadius: 24, color: colors.slate, margin: 0, padding: 24 }}>
            Add a list id to the URL to load rankings, for example: /ranking?listId=YOUR_LIST_ID
          </p>
        )}

        {status === 'loading' && (
          <p style={{ background: colors.surfaceSoft, borderRadius: 24, color: colors.slate, margin: 0, padding: 24 }}>
            Loading movies...
          </p>
        )}

        {status === 'error' && (
          <p style={{ border: `1px solid ${colors.critical}`, borderRadius: 24, color: colors.critical, margin: 0, padding: 24 }}>
            {error}
          </p>
        )}

        {status === 'ready' &&
          buckets.map((bucket) => (
            <article
              key={bucket.bucket}
              style={{
                border: `1px solid ${colors.hairlineSoft}`,
                borderRadius: 24,
                overflow: 'hidden',
              }}
            >
              <header style={{ background: colors.surfaceSoft, padding: '18px 20px' }}>
                <h2 style={{ fontSize: 22, lineHeight: 1.25, margin: 0 }}>{bucket.label}</h2>
              </header>

              {bucket.movies.length === 0 ? (
                <p style={{ color: colors.steel, margin: 0, padding: 20 }}>No movies in this bucket yet.</p>
              ) : (
                <ol style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                  {bucket.movies.map((movie) => (
                    <li
                      key={movie.id}
                      style={{
                        alignItems: 'center',
                        borderTop: `1px solid ${colors.hairlineSoft}`,
                        display: 'grid',
                        gap: 12,
                        gridTemplateColumns: '56px 1fr',
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
                          fontSize: 14,
                          fontWeight: 700,
                          height: 36,
                          justifyContent: 'center',
                          width: 36,
                        }}
                      >
                        {movie.position}
                      </span>
                      <div>
                        <h3 style={{ fontSize: 18, lineHeight: 1.35, margin: 0 }}>{movie.title}</h3>
                        <p style={{ color: colors.steel, fontSize: 14, lineHeight: 1.45, margin: '4px 0 0' }}>
                          {bucket.label} - position {movie.position}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              )}
            </article>
          ))}
      </section>
    </main>
  );
}

export default function App() {
  if (window.location.pathname === '/ranking') {
    return <RankingPage />;
  }

  return <HomePage />;
}
