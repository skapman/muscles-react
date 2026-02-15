import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { NavigationProvider } from '@context/NavigationContext'
import { OnboardingProvider } from '@context/OnboardingContext'
import { BurgerIcon } from '@components/layout/BurgerIcon'
import { BurgerMenu } from '@components/layout/BurgerMenu'
import { OnboardingModal } from '@components/onboarding/OnboardingModal'
import { ThemeToggle } from '@components/common/ThemeToggle'

// Lazy load pages for code splitting
const HomePage = lazy(() => import('@pages/HomePage').then(module => ({ default: module.HomePage })))
const GraphPage = lazy(() => import('@pages/GraphPage').then(module => ({ default: module.GraphPage })))
const GoalsHub = lazy(() => import('@pages/GoalsHub').then(module => ({ default: module.GoalsHub })))
const ExercisesHub = lazy(() => import('@pages/ExercisesHub').then(module => ({ default: module.ExercisesHub })))
const FavoritesView = lazy(() => import('@pages/FavoritesView').then(module => ({ default: module.FavoritesView })))
const SettingsView = lazy(() => import('@pages/SettingsView').then(module => ({ default: module.SettingsView })))
const AboutView = lazy(() => import('@pages/AboutView').then(module => ({ default: module.AboutView })))
const TestMDX = lazy(() => import('@pages/TestMDX').then(module => ({ default: module.TestMDX })))
const ArticleView = lazy(() => import('@pages/ArticleView').then(module => ({ default: module.ArticleView })))

function App() {
  return (
    <OnboardingProvider>
      <NavigationProvider>
        <div className="app">
          {/* Onboarding Modal */}
          <OnboardingModal />

          {/* Burger Menu Navigation */}
          <BurgerIcon />
          <BurgerMenu />

          {/* Temporary: Keep old ThemeToggle visible */}
          <div className="temp-theme-toggle">
            <ThemeToggle />
          </div>

        {/* Routes with Suspense for lazy loading */}
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/graph" element={<GraphPage />} />
            <Route path="/goals" element={<GoalsHub />} />
            <Route path="/exercises" element={<ExercisesHub />} />
            <Route path="/favorites" element={<FavoritesView />} />
            <Route path="/settings" element={<SettingsView />} />
            <Route path="/about" element={<AboutView />} />
            <Route path="/test-mdx" element={<TestMDX />} />

            {/* Article routes */}
            <Route path="/muscles/:slug" element={<ArticleView type="muscles" />} />
            <Route path="/exercises/:slug" element={<ArticleView type="exercises" />} />
            <Route path="/goals/:slug" element={<ArticleView type="goals" />} />
            <Route path="/pain/:slug" element={<ArticleView type="pain" />} />
          </Routes>
        </Suspense>

        <style>{`
          .app {
            min-height: 100vh;
            background: var(--bg-primary);
          }

          /* Temporary ThemeToggle positioning (top-right) */
          .temp-theme-toggle {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1001;
          }

          .page {
            min-height: 100vh;
            background: var(--bg-primary);
          }

          @media (max-width: 768px) {
            .temp-theme-toggle {
              top: 16px;
              right: 16px;
            }
          }
        `}</style>
        </div>
      </NavigationProvider>
    </OnboardingProvider>
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
          border: '4px solid var(--border-color)',
          borderTop: '4px solid var(--accent-primary)',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 1rem'
        }}></div>
        <p style={{ color: 'var(--text-primary)' }}>Загрузка...</p>
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
