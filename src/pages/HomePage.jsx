import React from 'react';
import { MuscleLayer } from '@components/layers/MuscleLayer';
import { GenericLayer } from '@components/layers/GenericLayer';
import { LayerSlider } from '@components/layers/LayerSlider';
import { useLayer } from '@hooks/useLayer';

/**
 * HomePage Component
 * Main page with muscle visualization
 */
export function HomePage() {
  const { currentLayer, currentLayerData, hasBlocks } = useLayer();

  console.log('🏠 HomePage render', { currentLayer, hasBlocks, layerData: currentLayerData });

  // Get SVG path for current layer
  const svgPath = currentLayerData?.svgFiles?.[0]?.path || null;

  return (
    <div className="page home-page" data-layer={currentLayer}>
      <main className="main-content">
        {/* Show MuscleLayer only for muscles layer */}
        {currentLayer === 'muscles' && <MuscleLayer />}

        {/* Show GenericLayer for other layers */}
        {currentLayer !== 'muscles' && (
          <GenericLayer
            layerId={currentLayer}
            svgPath={svgPath}
            hasBlocks={hasBlocks}
          />
        )}

        {/* Layer Slider - always visible */}
        <LayerSlider />
      </main>
    </div>
  );
}
