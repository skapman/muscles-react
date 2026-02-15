import React from 'react';

/**
 * GraphControls Component
 * Threshold slider control (moved to bottom-left corner)
 */
export function GraphControls({
  threshold,
  onThresholdChange
}) {
  return (
    <div className="graph-threshold-control">
      <label>Связи: {threshold}+</label>
      <input
        type="range"
        min="0"
        max="10"
        value={threshold}
        onChange={(e) => onThresholdChange(parseInt(e.target.value))}
        className="threshold-slider"
      />

      <style>{`
        .graph-threshold-control {
          position: absolute;
          bottom: 120px;
          left: 20px;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          background: rgba(30, 30, 30, 0.95);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          backdrop-filter: blur(10px);
          z-index: 10;
        }

        .graph-threshold-control label {
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--text-primary);
          white-space: nowrap;
        }

        .threshold-slider {
          width: 120px;
          height: 4px;
          -webkit-appearance: none;
          appearance: none;
          background: var(--border-color);
          border-radius: 2px;
          outline: none;
        }

        .threshold-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 16px;
          height: 16px;
          background: var(--accent-primary);
          border-radius: 50%;
          cursor: pointer;
          transition: transform 0.2s;
        }

        .threshold-slider::-webkit-slider-thumb:hover {
          transform: scale(1.2);
        }

        .threshold-slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          background: var(--accent-primary);
          border-radius: 50%;
          cursor: pointer;
          border: none;
        }

        @media (max-width: 768px) {
          .graph-threshold-control {
            bottom: 140px;
            left: 10px;
          }
        }
      `}</style>
    </div>
  );
}
