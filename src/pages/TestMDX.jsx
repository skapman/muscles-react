import { Suspense, lazy } from 'react'
import '../styles/article.css'

// Импортируем MDX файл
const GluteusArticle = lazy(() => import('../../content/muscles/gluteus.mdx'))

export function TestMDX() {
  return (
    <div className="article-page">
      <div className="article-wrapper">
        <div className="article-inner">
          <div className="article-header">
            <h1>MDX Test Page</h1>
            <p style={{ color: 'var(--text-secondary)' }}>
              Testing MDX import and rendering...
            </p>
          </div>

          <hr style={{ margin: '2rem 0', border: 'none', borderTop: '1px solid var(--border-color)' }} />

          <Suspense fallback={<div className="article-loading">Loading article...</div>}>
            <div className="article-content">
              <GluteusArticle />
            </div>
          </Suspense>
        </div>
      </div>
    </div>
  )
}
