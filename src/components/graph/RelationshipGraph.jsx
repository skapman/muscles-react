import React, { useState } from 'react';
import { useResponsive } from '@hooks/useResponsive';
import { useGraphData } from '@hooks/useGraphData';
import { GraphCanvas } from './GraphCanvas';
import { GraphControls } from './GraphControls';
import { BottomSheet } from '@components/common/BottomSheet';

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
    filterCounts,
    toggleFilter,
    setThreshold
  } = useGraphData(entityType, entityId, depth);

  const [selectedNode, setSelectedNode] = useState(null);
  const [hoveredNode, setHoveredNode] = useState(null);

  // Graph dimensions
  const graphWidth = isMobile ? screenWidth : screenWidth - 400;
  const graphHeight = isMobile ? 500 : 600;

  const handleNodeClick = (node) => {
    setSelectedNode(node);
  };

  const handleNodeHover = (node) => {
    setHoveredNode(node);
  };

  const handleCloseDetails = () => {
    setSelectedNode(null);
  };

  if (loading) {
    return (
      <div className="graph-loading">
        <div className="loading-spinner"></div>
        <p>Загрузка графа...</p>
      </div>
    );
  }

  if (!graphData.nodes.length) {
    return (
      <div className="graph-empty">
        <p>Нет данных для отображения</p>
      </div>
    );
  }

  return (
    <div className="relationship-graph-container">
      {/* Controls */}
      <GraphControls
        threshold={threshold}
        onThresholdChange={setThreshold}
        filters={filters}
        onFilterToggle={toggleFilter}
        filterCounts={filterCounts}
      />

      {/* Graph Canvas */}
      <div className="graph-canvas-container">
        <GraphCanvas
          graphData={graphData}
          width={graphWidth}
          height={graphHeight}
          onNodeClick={handleNodeClick}
          onNodeHover={handleNodeHover}
        />
      </div>

      {/* Legend */}
      <div className="graph-legend">
        <div className="legend-item">
          <span className="legend-dot" style={{ backgroundColor: '#4caf50' }} />
          <span>🎯 Цели</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot" style={{ backgroundColor: '#00d4ff' }} />
          <span>🏋️ Упражнения</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot" style={{ backgroundColor: '#ff5252' }} />
          <span>💪 Мышцы</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot" style={{ backgroundColor: '#f44336' }} />
          <span>⚠️ Боли</span>
        </div>
      </div>

      {/* Node Details (Mobile: Bottom Sheet, Desktop: Sidebar) */}
      {isMobile ? (
        <BottomSheet
          isOpen={!!selectedNode}
          onClose={handleCloseDetails}
        >
          <NodeDetails node={selectedNode} />
        </BottomSheet>
      ) : (
        selectedNode && (
          <div className="graph-sidebar">
            <button
              className="close-btn"
              onClick={handleCloseDetails}
            >
              ×
            </button>
            <NodeDetails node={selectedNode} />
          </div>
        )
      )}
    </div>
  );
}

/**
 * NodeDetails Component
 * Displays detailed information about a node
 */
function NodeDetails({ node }) {
  if (!node) return null;

  const typeIcons = {
    goals: '🎯',
    exercises: '🏋️',
    muscles: '💪',
    pain: '⚠️'
  };

  const data = node.data;

  return (
    <div className="node-details">
      <div className="node-header">
        <span className="node-icon">{typeIcons[node.type] || '•'}</span>
        <h3>{data.title || data.name || 'Unknown'}</h3>
      </div>

      {(data.titleEn || data.nameEn) && (
        <p className="node-subtitle">{data.titleEn || data.nameEn}</p>
      )}

      <div className="node-description">
        {data.description || data.content || data.function || 'No description available'}
      </div>

      {data.category && (
        <div className="node-meta">
          <strong>Категория:</strong> {data.category}
        </div>
      )}

      {data.group && (
        <div className="node-meta">
          <strong>Группа:</strong> {data.group}
        </div>
      )}
    </div>
  );
}
