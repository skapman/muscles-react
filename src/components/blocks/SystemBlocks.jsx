import React from 'react';
import { useLayer } from '@hooks/useLayer';
import { useData } from '@context/DataContext';
import { BlockCard } from './BlockCard';

/**
 * SystemBlocks Component
 * Renders information blocks for overlay-type layers
 * (pain, nervous, respiratory, cardiovascular, gadgets)
 */
export function SystemBlocks() {
  const { currentLayer, hasBlocks } = useLayer();
  const { systemBlocks } = useData();

  // Don't render if current layer doesn't have blocks
  if (!hasBlocks) {
    return null;
  }

  // Get blocks for current layer
  const blocks = systemBlocks[currentLayer] || [];

  if (blocks.length === 0) {
    return null;
  }

  return (
    <div className="system-blocks-container">
      {blocks.map(block => (
        <BlockCard key={block.id} block={block} />
      ))}
    </div>
  );
}
