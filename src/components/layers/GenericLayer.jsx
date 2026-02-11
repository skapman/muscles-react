import React from 'react';
import { useResponsive } from '@hooks/useResponsive';
import { SVGViewer } from '@components/svg/SVGViewer';
import { SystemBlocks } from '@components/blocks/SystemBlocks';
import { PainPoints } from '@components/pain/PainPoints';

/**
 * GenericLayer Component
 * Universal component for non-muscle layers (pain, nervous, respiratory, etc.)
 * Displays single SVG view without swipe functionality
 */
export function GenericLayer({ layerId, svgPath, hasBlocks = false }) {
  console.log('🎨 GenericLayer render', { layerId, svgPath, hasBlocks });

  const { isMobile } = useResponsive();
  const isPainLayer = layerId === 'pain';

  const handlePainPointClick = (point) => {
    console.log('Pain point clicked:', point);
    // TODO: Show detail modal/bottom sheet
  };

  return (
    <div className={`generic-layer ${layerId}-layer`}>
      {/* SVG View - full screen, centered like muscles layer */}
      {svgPath && (
        <div className="svg-wrapper">
          <SVGViewer
            view={layerId}
            svgUrl={svgPath}
            hasInteractivity={false}
          />

          {/* Pain Points - only for pain layer */}
          {isPainLayer && (
            <PainPoints onPointClick={handlePainPointClick} />
          )}
        </div>
      )}

      {/* System Blocks */}
      {hasBlocks && !isPainLayer && (
        <SystemBlocks layerId={layerId} />
      )}
    </div>
  );
}
