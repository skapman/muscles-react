import React, { useState, useRef, useEffect } from 'react';
import { useResponsive } from '@hooks/useResponsive';
import { useGraphData } from '@hooks/useGraphData';
import { GraphSVG } from './GraphSVG';
import { GraphControls } from './GraphControls';
import '@styles/components/graph-svg.css';

/**
 * RelationshipGraph Component
 * Main graph visualization component
 * Combines canvas, controls, and node details
 */
export function RelationshipGraph({ entityType, entityId, depth = 2 }) {
  const { isMobile, width: screenWidth } = useResponsive();
  const {
    graphData,
    loading,
    filters,
    threshold,
    maxConnections,
    filterCounts,
    toggleFilter,
    setThreshold,
    resetFilters
  } = useGraphData(entityType, entityId, depth);

  const [hoveredNode, setHoveredNode] = useState(null);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });
  const [sizeReady, setSizeReady] = useState(false);
  const containerRef = useRef(null);
  const canvasContainerRef = useRef(null);

  // Measure canvas container size using ResizeObserver
  // Only run after graphData is loaded and component is fully rendered
  useEffect(() => {
    if (!graphData.nodes.length) {
      console.log('Skipping size measurement - no graph data yet');
      return;
    }

    console.log('=== Canvas size measurement effect started ===');
    console.log('canvasContainerRef.current:', canvasContainerRef.current);

    if (!canvasContainerRef.current) {
      console.warn('canvasContainerRef.current is null!');
      return;
    }

    const updateSize = (entries) => {
      if (!entries || entries.length === 0) return;

      const entry = entries[0];
      const { width, height } = entry.contentRect;

      // Only update if dimensions are valid
      if (width > 0 && height > 0) {
        console.log('✅ Canvas container size (ResizeObserver):', width, 'x', height);
        setCanvasSize({
          width: Math.floor(width),
          height: Math.floor(height)
        });
        setSizeReady(true); // Mark size as ready
      } else {
        console.warn('Invalid dimensions from ResizeObserver:', width, 'x', height);
      }
    };

    // Manual measurement function
    const measureManually = () => {
      if (canvasContainerRef.current) {
        const rect = canvasContainerRef.current.getBoundingClientRect();
        console.log('✅ Canvas container size (manual):', rect.width, 'x', rect.height);
        console.log('Window height:', window.innerHeight);
        if (rect.width > 0 && rect.height > 0) {
          setCanvasSize({
            width: Math.floor(rect.width),
            height: Math.floor(rect.height)
          });
          setSizeReady(true); // Mark size as ready
        } else {
          console.warn('Invalid dimensions from manual measurement:', rect.width, 'x', rect.height);
        }
      } else {
        console.warn('canvasContainerRef.current is null in measureManually!');
      }
    };

    // ResizeObserver automatically detects size changes
    const resizeObserver = new ResizeObserver(updateSize);
    resizeObserver.observe(canvasContainerRef.current);
    console.log('ResizeObserver attached');

    // Force initial measurement after a short delay
    const timer = setTimeout(() => {
      console.log('Timeout fired, measuring manually...');
      measureManually();
    }, 100);

    // Fallback for window resize
    window.addEventListener('resize', measureManually);

    return () => {
      clearTimeout(timer);
      resizeObserver.disconnect();
      window.removeEventListener('resize', measureManually);
      console.log('=== Canvas size measurement effect cleaned up ===');
    };
  }, [graphData.nodes.length]); // Re-run when graph data loads

  const handleNodeClick = (node) => {
    // Отключено - не показываем панель
    console.log('Node clicked:', node.data.title || node.data.name);
  };

  const handleNodeHover = (node) => {
    setHoveredNode(node);
  };

  if (loading) {
    return (
      <div className="graph-loading">
        <div className="loading-spinner"></div>
        <p>Загрузка графа...</p>
      </div>
    );
  }

  return (
    <div className="relationship-graph-container" ref={containerRef} style={{
      position: 'relative',
      width: '100%',
      height: '100%'
    }}>
      {/* Empty state or Graph */}
      {!graphData.nodes.length ? (
        <div className="graph-empty" style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          gap: '1rem'
        }}>
          <p style={{ margin: 0 }}>Нет данных для отображения</p>
          <button
            onClick={resetFilters}
            style={{
              padding: '0.5rem 1rem',
              background: 'var(--accent-primary)',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: 500,
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => e.target.style.opacity = '0.8'}
            onMouseOut={(e) => e.target.style.opacity = '1'}
          >
            Сбросить фильтры
          </button>
        </div>
      ) : (
        <>
          {/* Threshold Control */}
          <GraphControls
            threshold={threshold}
            maxConnections={maxConnections}
            onThresholdChange={setThreshold}
          />

          {/* Graph Canvas */}
          <div
            ref={canvasContainerRef}
            className="graph-canvas-container"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%'
            }}
          >
            <GraphSVG
              graphData={graphData}
              width={canvasSize.width}
              height={canvasSize.height}
              sizeReady={sizeReady}
              onNodeClick={handleNodeClick}
              onNodeHover={handleNodeHover}
            />
          </div>
        </>
      )}

      {/* Legend - always in same position */}
      <div className="graph-legend">
        <div
          className={`legend-item ${filters.goal ? 'active' : 'inactive'}`}
          onClick={() => toggleFilter('goal')}
          title="Цели - нажмите для фильтрации"
        >
          <span className="legend-dot legend-dot-goal" />
          <span className="legend-label">Цели</span>
        </div>
        <div
          className={`legend-item ${filters.exercise ? 'active' : 'inactive'}`}
          onClick={() => toggleFilter('exercise')}
          title="Упражнения - нажмите для фильтрации"
        >
          <span className="legend-dot legend-dot-exercise" />
          <span className="legend-label">Упражнения</span>
        </div>
        <div
          className={`legend-item ${filters.muscle ? 'active' : 'inactive'}`}
          onClick={() => toggleFilter('muscle')}
          title="Мышцы - нажмите для фильтрации"
        >
          <span className="legend-dot legend-dot-muscle" />
          <span className="legend-label">Мышцы</span>
        </div>
        <div
          className={`legend-item ${filters.pain ? 'active' : 'inactive'}`}
          onClick={() => toggleFilter('pain')}
          title="Боли - нажмите для фильтрации"
        >
          <span className="legend-dot legend-dot-pain" />
          <span className="legend-label">Боли</span>
        </div>
      </div>

      {/* Node Details - отключено */}
    </div>
  );
}

// NodeDetails component removed - not needed
