import React from 'react';

/**
 * GraphControls Component
 * Threshold slider control (moved to bottom-left corner)
 * Styles in: src/styles/components/graph-svg.css
 */
export function GraphControls({
  threshold,
  maxConnections = 10,
  onThresholdChange
}) {
  // Calculate percentage for gradient
  const percentage = (threshold / maxConnections) * 100;

  return (
    <div className="graph-threshold-control">
      <label>Связи: {threshold}+</label>
      <input
        type="range"
        min="0"
        max={maxConnections}
        value={threshold}
        onChange={(e) => onThresholdChange(parseInt(e.target.value))}
        className="threshold-slider"
        style={{
          background: `linear-gradient(to right, var(--accent-primary) 0%, var(--accent-primary) ${percentage}%, var(--border-color) ${percentage}%, var(--border-color) 100%)`
        }}
      />
    </div>
  );
}
