import React from 'react';

/**
 * GraphControls Component
 * Controls for graph filtering (threshold slider and type filters)
 */
export function GraphControls({
  threshold,
  onThresholdChange,
  filters,
  onFilterToggle,
  filterCounts
}) {
  return (
    <div className="graph-controls">
      {/* Threshold Slider - Compact */}
      <div className="threshold-control">
        <label>Связи: {threshold}+</label>
        <input
          type="range"
          min="0"
          max="10"
          value={threshold}
          onChange={(e) => onThresholdChange(parseInt(e.target.value))}
          className="threshold-slider"
        />
      </div>

      {/* Filter Buttons - Compact */}
      <div className="filter-buttons">
        <FilterButton
          type="goals"
          icon="🎯"
          label="Цели"
          active={filters.goals}
          count={filterCounts.goals}
          onClick={() => onFilterToggle('goals')}
        />
        <FilterButton
          type="exercises"
          icon="🏋️"
          label="Упражнения"
          active={filters.exercises}
          count={filterCounts.exercises}
          onClick={() => onFilterToggle('exercises')}
        />
        <FilterButton
          type="muscles"
          icon="💪"
          label="Мышцы"
          active={filters.muscles}
          count={filterCounts.muscles}
          onClick={() => onFilterToggle('muscles')}
        />
        <FilterButton
          type="pain"
          icon="⚠️"
          label="Боли"
          active={filters.pain}
          count={filterCounts.pain}
          onClick={() => onFilterToggle('pain')}
        />
      </div>

      <style>{`
        .graph-controls {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          padding: 0.75rem 1rem;
          background: var(--bg-secondary);
          border-bottom: 1px solid var(--border-color);
        }

        .threshold-control {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .threshold-control label {
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--text-primary);
          white-space: nowrap;
          min-width: 80px;
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

        .filter-buttons {
          display: flex;
          gap: 0.5rem;
          margin-left: auto;
        }

        .filter-btn {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          padding: 0.375rem 0.75rem;
          background: var(--bg-tertiary);
          color: var(--text-primary);
          border: 1px solid var(--border-color);
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.875rem;
          font-weight: 500;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .filter-btn:hover {
          background: var(--bg-primary);
          border-color: var(--accent-primary);
        }

        .filter-btn.active {
          background: var(--accent-primary);
          border-color: var(--accent-primary);
          color: white;
        }

        .filter-icon {
          font-size: 1rem;
        }

        .filter-count {
          font-size: 0.75rem;
          opacity: 0.8;
        }

        @media (max-width: 768px) {
          .graph-controls {
            flex-wrap: wrap;
            gap: 1rem;
          }

          .threshold-control {
            flex: 1;
            min-width: 200px;
          }

          .filter-buttons {
            width: 100%;
            margin-left: 0;
            justify-content: space-between;
          }

          .filter-btn {
            flex: 1;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}

/**
 * FilterButton Component
 */
function FilterButton({ type, icon, label, active, count, onClick }) {
  return (
    <button
      className={`filter-btn ${active ? 'active' : ''}`}
      onClick={onClick}
      title={label}
      data-type={type}
    >
      <span className="filter-icon">{icon}</span>
      <span className="filter-count">{count}</span>
    </button>
  );
}
