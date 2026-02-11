import { lazy, Suspense } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { ThemeToggle } from '@components/common/ThemeToggle'

// Lazy load pages for code splitting
const HomePage = lazy(() => import('@pages/HomePage').then(module => ({ default: module.HomePage })))
const GraphPage = lazy(() => import('@pages/GraphPage').then(module => ({ default: module.GraphPage })))

function App() {
  const location = useLocation()

  return (
    <div className="app">
      {/* Header with Navigation */}
      <header className="app-header">
        <nav className="app-nav">
          <Link
            to="/"
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            🏋️ Мышцы
          </Link>
          <Link
            to="/graph"
            className={`nav-link ${location.pathname === '/graph' ? 'active' : ''}`}
          >
            📊 Граф
          </Link>
        </nav>

        <ThemeToggle />
      </header>

      {/* Routes with Suspense for lazy loading */}
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/graph" element={<GraphPage />} />
        </Routes>
      </Suspense>

      <style>{`
        .app {
          min-height: 100vh;
        }

        .app-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 60px;
          background: var(--color-bg-secondary);
          border-bottom: 2px solid var(--color-border);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 2rem;
          z-index: 1000;
        }

        .app-nav {
          display: flex;
          gap: 1rem;
        }

        .nav-link {
          padding: 0.75rem 1.5rem;
          background: transparent;
          color: var(--color-text);
          text-decoration: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 500;
          transition: all 0.3s ease;
          border: 2px solid transparent;
        }

        .nav-link:hover {
          background: var(--color-bg);
          border-color: var(--color-border);
        }

        .nav-link.active {
          background: var(--color-primary);
          color: white;
          font-weight: bold;
        }

        .page {
          padding-top: 60px;
          min-height: 100vh;
        }

        @media (max-width: 768px) {
          .app-header {
            padding: 0 1rem;
          }

          .nav-link {
            padding: 0.5rem 1rem;
            font-size: 14px;
          }
        }
      `}</style>
    </div>
  )
}

/**
 * Loading Fallback Component
 */
function LoadingFallback() {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      paddingTop: '60px'
    }}>
      <div style={{
        textAlign: 'center'
      }}>
        <div className="loading-spinner" style={{
          width: '50px',
          height: '50px',
          border: '4px solid var(--color-border)',
          borderTop: '4px solid var(--color-primary)',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 1rem'
        }}></div>
        <p>Загрузка...</p>
      </div>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

export default App
