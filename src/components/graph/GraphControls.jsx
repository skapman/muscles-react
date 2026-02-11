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
      {/* Threshold Slider */}
      <div className="threshold-slider-container">
        <label className="threshold-label">
          Порог связей:
        </label>
        <input
          type="range"
          min="0"
          max="10"
          value={threshold}
          onChange={(e) => onThresholdChange(parseInt(e.target.value))}
          className="threshold-slider"
        />
        <span className="threshold-value">
          {threshold}+ связей
        </span>
      </div>

      {/* Filter Buttons */}
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
