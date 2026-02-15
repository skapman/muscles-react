import { useParams } from 'react-router-dom'
import { Suspense, useEffect, useState } from 'react'
import { useContentIndex, getEntryById } from '@hooks/useContentIndex'
import '../styles/article.css'

// Preload all MDX files using import.meta.glob
const articles = import.meta.glob('../../content/**/*.mdx')

/**
 * ArticleView Component
 * Renders MDX articles dynamically based on URL params
 * URL format: /{type}/{slug}
 * Example: /muscles/gluteus
 */
export function ArticleView({ type: typeProp }) {
  const { slug } = useParams()
  const type = typeProp // Use prop instead of URL param
  const [Article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const contentIndex = useContentIndex()

  // Find entry in content index by matching slug and type
  const entry = Object.values(contentIndex).find(
    e => e.slug === slug && e.path.startsWith(type)
  )

  // Load MDX article
  useEffect(() => {
    if (!type || !slug) {
      setError('Invalid URL')
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    // Build path to MDX file
    const articlePath = `../../content/${type}/${slug}.mdx`
    const articleLoader = articles[articlePath]

    if (!articleLoader) {
      setError('Article not found')
      setLoading(false)
      return
    }

    // Load the MDX module
    articleLoader()
      .then(mod => {
        setArticle(() => mod.default)
        setLoading(false)
      })
      .catch(err => {
        console.error('Error loading article:', err)
        setError('Failed to load article')
        setLoading(false)
      })
  }, [type, slug])

  // Loading state
  if (loading) {
    return (
      <div className="article-page">
        <div className="article-wrapper">
          <div className="article-loading">
            <div className="loading-spinner"></div>
            <p>Загрузка статьи...</p>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error || !entry) {
    return (
      <div className="article-page">
        <div className="article-wrapper">
          <div className="article-inner">
            <div className="article-error">
              <h1>😕 Статья не найдена</h1>
              <p>{error || 'Запрошенная статья не существует'}</p>
              <a href="/" className="back-link">← Вернуться на главную</a>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="article-page">
      <div className="article-wrapper">
        <div className="article-inner">
          {/* Article Header */}
          <header className="article-header">
            <h1>{entry.title}</h1>

            {entry.tags && entry.tags.length > 0 && (
              <div className="article-tags">
                {entry.tags.map(tag => (
                  <span key={tag} className="tag">{tag}</span>
                ))}
              </div>
            )}
          </header>

          {/* Article Content */}
          <Suspense fallback={<div className="article-loading">Загрузка...</div>}>
            <article className="article-content">
              {Article && <Article />}
            </article>
          </Suspense>

          {/* Related Materials */}
          {entry.related && Object.keys(entry.related).length > 0 && (
            <RelatedPanel related={entry.related} />
          )}
        </div>
      </div>
    </div>
  )
}

/**
 * RelatedPanel Component
 * Shows related content grouped by type
 */
function RelatedPanel({ related }) {

  const typeLabels = {
    muscles: '💪 Связанные мышцы',
    exercises: '🏋️ Упражнения',
    goals: '🎯 Цели',
    pain: '🩹 Боли и травмы'
  }

  return (
    <aside className="related-panel">
      <h2>Связанные материалы</h2>

      {Object.entries(related).map(([type, ids]) => {
        if (!ids || ids.length === 0) return null

        // Filter out non-existent entries
        const entries = ids
          .map(id => getEntryById(id))
          .filter(Boolean)

        if (entries.length === 0) return null

        return (
          <div key={type} className="related-section">
            <h3>{typeLabels[type] || type}</h3>
            <ul className="related-list">
              {entries.map(entry => (
                <li key={entry.id}>
                  <a href={`/${entry.path}`} className="related-link">
                    {entry.titleShort || entry.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )
      })}
    </aside>
  )
}
