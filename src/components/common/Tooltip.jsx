import React from 'react';
import { createPortal } from 'react-dom';

/**
 * Tooltip Component
 * Displays hover information for muscles
 * Uses React Portal to render outside component hierarchy
 */
export function Tooltip({ visible, position, content }) {
  if (!visible || !content) return null;

  return createPortal(
    <div
      className="hover-tooltip"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        opacity: visible ? 1 : 0,
        pointerEvents: 'none',
      }}
    >
      <div className="tooltip-name">{content.name}</div>
      {content.function && (
        <div className="tooltip-function">{content.function}</div>
      )}
    </div>,
    document.body
  );
}
