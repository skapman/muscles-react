import { Link } from 'react-router-dom'
import { getEntryById } from '@hooks/useContentIndex'

/**
 * ContentLink Component
 * Creates internal links between content articles
 * Used inside MDX content for cross-references
 *
 * Usage in MDX:
 * <ContentLink id="gluteus">ягодичные мышцы</ContentLink>
 * <ContentLink id="squat" />
 */
export default function ContentLink({ id, children }) {
  const entry = getEntryById(id)

  // If entry doesn't exist, render as plain text (graceful degradation)
  if (!entry) {
    console.warn(`ContentLink: Entry "${id}" not found`)
    return <span className="content-link-missing">{children || id}</span>
  }

  // Build URL from entry path
  const url = `/${entry.path}`

  // Use children if provided, otherwise use entry title
  const linkText = children || entry.titleShort || entry.title

  return (
    <Link
      to={url}
      className="content-link"
      title={entry.title}
    >
      {linkText}
    </Link>
  )
}
