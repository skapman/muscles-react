import React, { useState } from 'react';

/**
 * BlockCard Component
 * Displays a single system block with expandable content
 */
export function BlockCard({ block }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className={`system-block block-type-${block.type}`}
      style={{
        left: block.position?.x,
        top: block.position?.y
      }}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="block-header">
        {block.icon && <span className="block-icon">{block.icon}</span>}
        <h3 className="block-title">{block.title}</h3>
      </div>

      {isExpanded && (
        <div className="block-content">
          {block.content && <p>{block.content}</p>}

          {block.causes && (
            <div className="block-list-container">
              <h4>Причины:</h4>
              <ul className="block-list">
                {block.causes.map((cause, i) => (
                  <li key={i}>{cause}</li>
                ))}
              </ul>
            </div>
          )}

          {block.symptoms && (
            <div className="block-list-container">
              <h4>Симптомы:</h4>
              <ul className="block-list">
                {block.symptoms.map((symptom, i) => (
                  <li key={i}>{symptom}</li>
                ))}
              </ul>
            </div>
          )}

          {block.tips && (
            <div className="block-list-container">
              <h4>Советы:</h4>
              <ul className="block-list">
                {block.tips.map((tip, i) => (
                  <li key={i}>{tip}</li>
                ))}
              </ul>
            </div>
          )}

          {block.metrics && (
            <div className="block-metrics">
              {Object.entries(block.metrics).map(([key, value]) => (
                <div key={key} className="metric-item">
                  <span className="metric-label">{formatMetricLabel(key)}</span>
                  <span className="metric-value">{value}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Format metric label
 */
function formatMetricLabel(key) {
  const labels = {
    capacity: 'Объём:',
    vo2max: 'VO2 max:',
    respiratoryRate: 'Частота:',
    restingHR: 'ЧСС покоя:',
    maxHR: 'Макс ЧСС:',
    strokeVolume: 'Ударный объём:'
  };
  return labels[key] || key;
}
