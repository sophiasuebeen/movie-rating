export default function App() {
  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', padding: '2rem', maxWidth: 720, margin: '0 auto' }}>
      <header>
        <h1>Movie Rating</h1>
        <p style={{ color: '#444', lineHeight: 1.7 }}>
          Add the movies you watched, choose a rough preference bucket, and place each movie into a ranked list. The app keeps the process simple by using broad buckets first, then refining the order inside the chosen bucket.
        </p>
      </header>

      <section style={{ marginTop: '2rem' }}>
        <h2>Get started</h2>
        <ul style={{ listStyle: 'none', padding: 0, lineHeight: 1.8 }}>
          <li>
            <a href="/add-movie">Add a new movie</a>
          </li>
          <li>
            <a href="/ranking">View your ranked list</a>
          </li>
        </ul>
      </section>

      <section style={{ marginTop: '2rem' }}>
        <h2>Why this works</h2>
        <ul style={{ color: '#444', lineHeight: 1.7 }}>
          <li>Bucket selection reduces comparison friction.</li>
          <li>Within-bucket placement keeps ranking fast and intuitive.</li>
          <li>The final list is converted into an approximate 1–10 score.</li>
        </ul>
      </section>
    </main>
  );
}
