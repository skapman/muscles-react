import { useApp } from '@context/AppContext';
import layers from '@data/layers.json';

/**
 * useLayer hook - manages layer state and provides layer utilities
 * @returns {Object} Layer state and methods
 */
export function useLayer() {
  const { currentLayer, setCurrentLayer } = useApp();

  /**
   * Get current layer data
   */
  const getCurrentLayerData = () => {
    return layers[currentLayer] || null;
  };

  /**
   * Get all available layers
   */
  const getAllLayers = () => {
    return Object.entries(layers).map(([id, data]) => ({
      id,
      ...data
    }));
  };

  /**
   * Check if layer has blocks
   */
  const hasBlocks = () => {
    const layer = getCurrentLayerData();
    return layer?.hasBlocks || false;
  };

  /**
   * Check if layer has SVG
   */
  const hasSVG = () => {
    const layer = getCurrentLayerData();
    return layer?.hasSVG !== false; // Default to true
  };

  /**
   * Switch to a different layer
   */
  const switchLayer = (layerId) => {
    if (layers[layerId]) {
      setCurrentLayer(layerId);
    } else {
      console.warn(`Layer not found: ${layerId}`);
    }
  };

  /**
   * Get layer by ID
   */
  const getLayer = (layerId) => {
    return layers[layerId] || null;
  };

  return {
    // Current layer
    currentLayer,
    currentLayerData: getCurrentLayerData(),

    // Layer data
    layers,
    allLayers: getAllLayers(),

    // Methods
    switchLayer,
    setLayer: setCurrentLayer,
    getLayer,

    // Utilities
    hasBlocks: hasBlocks(),
    hasSVG: hasSVG(),
  };
}
