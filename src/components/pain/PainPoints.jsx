import React, { useState } from 'react';
import painPointsData from '@data/painPoints.json';

/**
 * PainPoints Component
 * Displays pulsating red circles with labels on the pain layer
 * Labels are grouped with circles and positioned relative to them
 */
export function PainPoints({ onPointClick }) {
  const [hoveredPoint, setHoveredPoint] = useState(null);

  const handlePointClick = (point) => {
    console.log('Pain point clicked:', point.title);
    if (onPointClick) {
      onPointClick(point);
    }
  };

  return (
    <div className="pain-points-container">
      {painPointsData.map(point => {
        // Determine callout position class
        const calloutClass = point.calloutTop ? 'callout-top' : 'callout-bottom';

        return (
          <div
            key={point.id}
            className="pain-point"
            style={{
              left: `${point.position.x}%`,
              top: `${point.position.y}%`
            }}
            onMouseEnter={() => setHoveredPoint(point.id)}
            onMouseLeave={() => setHoveredPoint(null)}
            onClick={() => handlePointClick(point)}
          >
            {/* Pulsating red circle */}
            <div className="pain-circle" />

            {/* Label positioned relative to circle */}
            <div
              className={`pain-label ${calloutClass}`}
              data-position={point.labelPosition}
            >
              {point.title}
            </div>
          </div>
        );
      })}
    </div>
  );
}
