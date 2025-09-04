import Navbar from '../components/Navbar'

export default function Home() {
  return (
    <div>
      <Navbar />
      <main className="hero">
        <div className="hero-inner">
          <h1 className="hero-title">Tutorial: VSCode + Copilot per una webapp Next.js</h1>
          <p className="hero-sub">Impara passo passo a costruire una webapp moderna con Next.js, FastAPI e SQLite.</p>
          <div className="hero-cta">
            <a href="/login" className="btn btn-primary">Inizia</a>
            <a href="/dashboard" className="btn btn-outline">Dashboard</a>
          </div>
        </div>
      </main>
    </div>
  )
}
