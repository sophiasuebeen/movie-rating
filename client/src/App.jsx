import { useEffect, useState } from 'react';

const apiBaseUrl = 'http://localhost:4000';
const requestTimeoutMs = 10000;

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
  success: '#31a24c',
};

const bucketOptions = [
  { bucket: 'liked', label: 'I liked it' },
  { bucket: 'fine', label: 'It was fine' },
  { bucket: 'disliked', label: "I didn't like it" },
];

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

const fallbackBuckets = bucketOptions.map((bucket) => ({ ...bucket, movies: [] }));

const pageStyle = {
  minHeight: '100vh',
  background: colors.canvas,
  color: colors.inkDeep,
  fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  padding: '48px 20px',
};

const primaryButtonStyle = {
  background: colors.inkDeep,
  border: `2px solid ${colors.inkDeep}`,
  borderRadius: 100,
  color: colors.canvas,
  cursor: 'pointer',
  display: 'inline-block',
  fontSize: 14,
  fontWeight: 700,
  padding: '14px 28px',
  textDecoration: 'none',
};

const secondaryButtonStyle = {
  background: 'transparent',
  border: `2px solid ${colors.inkDeep}`,
  borderRadius: 100,
  color: colors.inkDeep,
  cursor: 'pointer',
  display: 'inline-block',
  fontSize: 14,
  fontWeight: 700,
  padding: '12px 26px',
  textDecoration: 'none',
};

function getListId() {
  const params = new URLSearchParams(window.location.search);
  const listId = params.get('listId') || window.localStorage.getItem('movieListId') || '';

  if (listId === 'undefined' || listId === 'null') {
    return '';
  }

  return listId.trim();
}

function getBucketLabel(bucketValue) {
  return bucketOptions.find((option) => option.bucket === bucketValue)?.label || bucketValue;
}

async function apiRequest(path, options = {}) {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), requestTimeoutMs);

  try {
    const response = await fetch(`${apiBaseUrl}${path}`, {
      ...options,
      signal: controller.signal,
    });
    const contentType = response.headers.get('content-type') || '';
    const data = contentType.includes('application/json') ? await response.json() : {};

    if (!response.ok) {
      throw new Error(data.error || `Request failed with status ${response.status}.`);
    }

    return data;
  } catch (requestError) {
    if (requestError.name === 'AbortError') {
      throw new Error('The backend request timed out. Make sure the server is running on http://localhost:4000.');
    }

    throw requestError;
  } finally {
    window.clearTimeout(timeoutId);
  }
}

async function createList() {
  const data = await apiRequest('/api/lists', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'My Movie Ranking' }),
  });

  window.localStorage.setItem('movieListId', data.id);
  return data.id;
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
          <a href="/add-movie" style={primaryButtonStyle}>
            Add a movie
          </a>
          <a href="/ranking" style={secondaryButtonStyle}>
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

function AddMoviePage() {
  const [listId, setListId] = useState(getListId);
  const [title, setTitle] = useState('');
  const [bucket, setBucket] = useState('liked');
  const [pendingMovie, setPendingMovie] = useState(null);
  const [candidate, setCandidate] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  async function ensureListId() {
    if (listId) {
      return listId;
    }

    const newListId = await createList();
    setListId(newListId);
    return newListId;
  }

  async function handleAddMovie(event) {
    event.preventDefault();
    setError('');
    setMessage('');
    setIsSaving(true);

    try {
      const activeListId = await ensureListId();
      const data = await apiRequest(`/api/lists/${activeListId}/movies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, bucket }),
      });

      setTitle('');

      if (data.complete) {
        setPendingMovie(null);
        setCandidate(null);
        setMessage(`${data.movie.title} was placed in ${getBucketLabel(data.movie.bucket)} at position ${data.movie.position}.`);
      } else {
        setPendingMovie(data.movie);
        setCandidate(data.candidate);
        setMessage('');
      }
    } catch (addError) {
      setError(addError.message);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleComparison(winnerMovieId) {
    setError('');
    setMessage('');
    setIsSaving(true);

    try {
      const data = await apiRequest(`/api/lists/${listId}/movies/${pendingMovie.id}/compare`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidateMovieId: candidate.id,
          winnerMovieId,
        }),
      });

      if (data.complete) {
        setPendingMovie(null);
        setCandidate(null);
        setMessage(`${data.movie.title} was placed in ${getBucketLabel(data.movie.bucket)} at position ${data.movie.position}.`);
      } else {
        setPendingMovie(data.movie);
        setCandidate(data.candidate);
      }
    } catch (compareError) {
      setError(compareError.message);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <main style={pageStyle}>
      <header style={{ maxWidth: 760, margin: '0 auto 28px' }}>
        <a href="/" style={{ color: colors.steel, fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>
          Back home
        </a>
        <h1 style={{ fontSize: 'clamp(36px, 7vw, 56px)', lineHeight: 1.1, margin: '18px 0 12px' }}>
          Add a movie
        </h1>
        <p style={{ color: colors.slate, fontSize: 18, lineHeight: 1.55, margin: 0 }}>
          Choose a bucket first. If that bucket has movies already, compare only within that bucket until the new movie is placed.
        </p>
      </header>

      <section style={{ display: 'grid', gap: 20, margin: '0 auto', maxWidth: 760 }}>
        <form
          onSubmit={handleAddMovie}
          style={{
            border: `1px solid ${colors.hairlineSoft}`,
            borderRadius: 24,
            display: 'grid',
            gap: 18,
            padding: 24,
          }}
        >
          <label style={{ color: colors.ink, display: 'grid', fontSize: 14, fontWeight: 700, gap: 8 }}>
            Movie title
            <input
              disabled={Boolean(pendingMovie)}
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Movie title"
              style={{
                border: `1px solid ${colors.hairlineSoft}`,
                borderRadius: 8,
                color: colors.ink,
                font: 'inherit',
                padding: '12px 14px',
              }}
            />
          </label>

          <div>
            <p style={{ color: colors.ink, fontSize: 14, fontWeight: 700, margin: '0 0 10px' }}>Bucket</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {bucketOptions.map((option) => (
                <button
                  key={option.bucket}
                  type="button"
                  disabled={Boolean(pendingMovie)}
                  onClick={() => setBucket(option.bucket)}
                  style={{
                    background: bucket === option.bucket ? colors.cobalt : colors.canvas,
                    border: bucket === option.bucket ? `1px solid ${colors.cobalt}` : `1px solid ${colors.hairlineSoft}`,
                    borderRadius: 100,
                    color: bucket === option.bucket ? colors.canvas : colors.ink,
                    cursor: 'pointer',
                    fontSize: 14,
                    fontWeight: 700,
                    padding: '10px 16px',
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <button
            disabled={isSaving || Boolean(pendingMovie)}
            style={{ ...primaryButtonStyle, opacity: isSaving || pendingMovie ? 0.65 : 1 }}
            type="submit"
          >
            {isSaving ? 'Saving...' : 'Add movie'}
          </button>
        </form>

        {pendingMovie && candidate && (
          <section
            style={{
              background: colors.surfaceSoft,
              borderRadius: 24,
              padding: 24,
            }}
          >
            <p style={{ color: colors.cobalt, fontSize: 14, fontWeight: 700, margin: '0 0 8px' }}>
              {getBucketLabel(pendingMovie.bucket)}
            </p>
            <h2 style={{ fontSize: 26, lineHeight: 1.2, margin: '0 0 18px' }}>Which movie did you like better?</h2>
            <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
              {[pendingMovie, candidate].map((movie) => (
                <button
                  key={movie.id}
                  disabled={isSaving}
                  onClick={() => handleComparison(movie.id)}
                  style={{
                    background: colors.canvas,
                    border: `1px solid ${colors.hairlineSoft}`,
                    borderRadius: 20,
                    color: colors.inkDeep,
                    cursor: 'pointer',
                    font: 'inherit',
                    padding: 20,
                    textAlign: 'left',
                  }}
                  type="button"
                >
                  <strong style={{ display: 'block', fontSize: 20, lineHeight: 1.3 }}>{movie.title}</strong>
                  <span style={{ color: colors.steel, display: 'block', fontSize: 14, marginTop: 8 }}>
                    {movie.id === pendingMovie.id ? 'New movie' : `Current position ${movie.position}`}
                  </span>
                </button>
              ))}
            </div>
          </section>
        )}

        {message && (
          <p style={{ border: `1px solid ${colors.success}`, borderRadius: 20, color: colors.success, margin: 0, padding: 18 }}>
            {message}{' '}
            {listId && (
              <a href={`/ranking?listId=${listId}`} style={{ color: colors.inkDeep, fontWeight: 700 }}>
                View ranking
              </a>
            )}
          </p>
        )}

        {error && (
          <p style={{ border: `1px solid ${colors.critical}`, borderRadius: 20, color: colors.critical, margin: 0, padding: 18 }}>
            {error}
          </p>
        )}
      </section>
    </main>
  );
}

function RankingPage() {
  const [listId] = useState(getListId);
  const [buckets, setBuckets] = useState(fallbackBuckets);
  const [status, setStatus] = useState(listId ? 'loading' : 'missing-list');
  const [error, setError] = useState('');
  const [shareLink, setShareLink] = useState('');
  const [shareError, setShareError] = useState('');
  const [isSharing, setIsSharing] = useState(false);

  useEffect(() => {
    if (!listId) {
      return;
    }

    async function loadMovies() {
      try {
        const data = await apiRequest(`/api/lists/${listId}/movies`);

        setBuckets(data.buckets);
        setStatus('ready');
      } catch (loadError) {
        setError(loadError.message);
        setStatus('error');
      }
    }

    loadMovies();
  }, [listId]);

  async function handleShare() {
    if (!listId) {
      setShareError('Create or load a list before sharing.');
      return;
    }

    setShareError('');
    setIsSharing(true);

    try {
      const data = await apiRequest(`/api/lists/${listId}/share`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      setShareLink(`${window.location.origin}/public/${data.shareSlug}`);
    } catch (shareRequestError) {
      if (shareRequestError.message.includes('404')) {
        setShareError('Share route or list was not found. Restart the backend and make sure this ranking list still exists.');
      } else {
        setShareError(shareRequestError.message);
      }
    } finally {
      setIsSharing(false);
    }
  }

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
        {listId && status === 'ready' && (
          <div style={{ display: 'grid', gap: 12, marginTop: 24, maxWidth: 680 }}>
            <button
              disabled={isSharing}
              onClick={handleShare}
              style={{ ...primaryButtonStyle, opacity: isSharing ? 0.65 : 1, width: 'fit-content' }}
              type="button"
            >
              {isSharing ? 'Creating link...' : 'Share ranking'}
            </button>
            {shareLink && (
              <p style={{ background: colors.surfaceSoft, borderRadius: 20, color: colors.slate, margin: 0, padding: 16 }}>
                Public link:{' '}
                <a href={shareLink} style={{ color: colors.inkDeep, fontWeight: 700 }}>
                  {shareLink}
                </a>
              </p>
            )}
            {shareError && (
              <p style={{ border: `1px solid ${colors.critical}`, borderRadius: 20, color: colors.critical, margin: 0, padding: 16 }}>
                {shareError}
              </p>
            )}
          </div>
        )}
      </header>

      <RankingBuckets buckets={buckets} status={status} error={error} />
    </main>
  );
}

function RankingBuckets({ buckets, status, error }) {
  return (
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
                          {bucket.label} - position {movie.position} - approx. {movie.score.toFixed(1)}/10
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              )}
            </article>
          ))}
      </section>
  );
}

function PublicRankingPage() {
  const shareSlug = window.location.pathname.split('/').filter(Boolean)[1] || '';
  const [listName, setListName] = useState('Shared movie ranking');
  const [buckets, setBuckets] = useState(fallbackBuckets);
  const [status, setStatus] = useState(shareSlug ? 'loading' : 'error');
  const [error, setError] = useState(shareSlug ? '' : 'Shared ranking not found.');

  useEffect(() => {
    if (!shareSlug) {
      return;
    }

    async function loadPublicRanking() {
      try {
        const data = await apiRequest(`/api/public/${shareSlug}`);
        setListName(data.list.name);
        setBuckets(data.buckets);
        setStatus('ready');
      } catch (loadError) {
        setError(loadError.message);
        setStatus('error');
      }
    }

    loadPublicRanking();
  }, [shareSlug]);

  return (
    <main style={pageStyle}>
      <header style={{ maxWidth: 880, margin: '0 auto 32px' }}>
        <p style={{ color: colors.cobalt, fontSize: 14, fontWeight: 700, margin: '0 0 12px' }}>
          Shared ranking
        </p>
        <h1 style={{ fontSize: 'clamp(36px, 7vw, 56px)', lineHeight: 1.1, margin: '0 0 12px' }}>
          {listName}
        </h1>
        <p style={{ color: colors.slate, fontSize: 18, lineHeight: 1.55, margin: 0, maxWidth: 680 }}>
          This is a read-only movie ranking grouped by bucket with approximate 1-10 scores.
        </p>
      </header>

      <RankingBuckets buckets={buckets} status={status} error={error} />
    </main>
  );
}

export default function App() {
  if (window.location.pathname.startsWith('/public/')) {
    return <PublicRankingPage />;
  }

  if (window.location.pathname === '/add-movie') {
    return <AddMoviePage />;
  }

  if (window.location.pathname === '/ranking') {
    return <RankingPage />;
  }

  return <HomePage />;
}
