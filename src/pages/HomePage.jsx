import React from 'react';
import { MuscleLayer } from '@components/layers/MuscleLayer';
import { SystemBlocks } from '@components/blocks/SystemBlocks';
import { LayerSlider } from '@components/layers/LayerSlider';

/**
 * HomePage Component
 * Main page with muscle visualization
 */
export function HomePage() {
  return (
    <div className="page home-page">
      <main className="main-content">
        {/* Muscle Layer with SVG */}
        <MuscleLayer />

        {/* System Blocks (for other layers) */}
        <SystemBlocks />

        {/* Layer Slider */}
        <LayerSlider />
      </main>
    </div>
  );
}
