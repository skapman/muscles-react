import React from 'react';
import { useLayer } from '@hooks/useLayer';

/**
 * LayerSlider Component
 * UI for switching between anatomical/functional layers
 * Mobile-first design with touch support
 */
export function LayerSlider() {
  const { currentLayer, allLayers, switchLayer } = useLayer();

  return (
    <div className="layer-slider-container">
      {allLayers.map((layer) => (
        <button
          key={layer.id}
          className={`layer-btn ${currentLayer === layer.id ? 'active' : ''}`}
          onClick={() => switchLayer(layer.id)}
          title={layer.name}
          aria-label={layer.name}
          data-layer={layer.id}
        >
          <span className="layer-icon">{layer.icon}</span>
        </button>
      ))}
    </div>
  );
}
