import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { useForceSimulation } from '@hooks/useForceSimulation';

/**
 * GraphSVG Component
 * Renders force-directed graph using SVG and D3.js
 * Supports zoom, pan, and node dragging natively
 */
export function GraphSVG({
  graphData,
  width,
  height,
  sizeReady = true,
  onNodeClick,
  onNodeHover
}) {
  const svgRef = useRef(null);
  const gRef = useRef(null);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [highlightedNodes, setHighlightedNodes] = useState(new Set());
  const [isReady, setIsReady] = useState(false);
  const hasAutoZoomedRef = useRef(false);

  // Use force simulation hook (only when size is ready)
  const { nodes, links, simulation, isStable } = useForceSimulation(
    sizeReady ? graphData : { nodes: [], edges: [] },
    width,
    height,
    {
      onStable: () => {
        // Auto-zoom to fit after stabilization (only once)
        if (!hasAutoZoomedRef.current) {
          setTimeout(() => {
            autoZoomToFit();
            hasAutoZoomedRef.current = true;
            setTimeout(() => setIsReady(true), 100);
          }, 100);
        }
      }
    }
  );

  // Setup D3 zoom behavior
  useEffect(() => {
    if (!svgRef.current || !gRef.current) return;

    const svg = d3.select(svgRef.current);
    const g = d3.select(gRef.current);

    const zoom = d3.zoom()
      .scaleExtent([0.1, 4])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    // ✅ FIX: Properly initialize D3 zoom
    // Apply zoom behavior first, which sets up event handlers
    svg.call(zoom);

    // Then explicitly set the transform state (D3 stores this in __zoom property)
    // This must be done AFTER svg.call(zoom) to ensure proper initialization
    svg.call(zoom.transform, d3.zoomIdentity);

    // Store zoom behavior reference for programmatic control (not in __zoom!)
    svgRef.current.__zoomBehavior = zoom;

    return () => {
      svg.on('.zoom', null);
    };
  }, []);

  // Setup D3 drag behavior for nodes
  useEffect(() => {
    if (!simulation || !gRef.current || nodes.length === 0) return;

    // Create drag behavior that works with React-rendered elements
    const drag = d3.drag()
      .on('start', function(event, d) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
        d3.select(this).classed('dragging', true);
        console.log('🎯 Drag started:', d.title || d.label || d.data?.title || d.data?.name);
      })
      .on('drag', function(event, d) {
        d.fx = event.x;
        d.fy = event.y;
      })
      .on('end', function(event, d) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
        d3.select(this).classed('dragging', false);
        console.log('🎯 Drag ended');
      });

    // Apply drag to all node elements
    // D3 will automatically pass node data as second parameter
    d3.select(gRef.current)
      .selectAll('.node')
      .call(drag);

    return () => {
      d3.select(gRef.current).selectAll('.node').on('.drag', null);
    };
  }, [simulation, nodes.length]);

  // Auto-zoom to fit all nodes
  const autoZoomToFit = () => {
    if (!svgRef.current || !gRef.current || nodes.length === 0) return;

    const svg = d3.select(svgRef.current);
    const zoom = svgRef.current.__zoomBehavior;
    if (!zoom) return;

    // Calculate bounds
    let minX = Infinity, maxX = -Infinity;
    let minY = Infinity, maxY = -Infinity;

    nodes.forEach(node => {
      if (node.x && node.y) {
        minX = Math.min(minX, node.x);
        maxX = Math.max(maxX, node.x);
        minY = Math.min(minY, node.y);
        maxY = Math.max(maxY, node.y);
      }
    });

    if (!isFinite(minX)) return;

    const graphWidth = maxX - minX;
    const graphHeight = maxY - minY;
    const graphCenterX = (minX + maxX) / 2;
    const graphCenterY = (minY + maxY) / 2;

    // Calculate scale to fit with padding
    const padding = 60;
    const scaleX = (width - padding * 2) / graphWidth;
    const scaleY = (height - padding * 2) / graphHeight;
    const scale = Math.min(scaleX, scaleY, 1);

    // Calculate translation to center
    const translateX = width / 2 - graphCenterX * scale;
    const translateY = height / 2 - graphCenterY * scale;

    console.log('Auto-zoom to fit:', {
      scale,
      translate: [translateX, translateY],
      graphCenter: [graphCenterX, graphCenterY]
    });

    // Apply transform with animation
    const transform = d3.zoomIdentity
      .translate(translateX, translateY)
      .scale(scale);

    // Apply transform without transition to avoid .invert() errors
    svg.call(zoom.transform, transform);
  };

  // Handle node hover
  const handleNodeMouseEnter = (node) => {
    setHoveredNode(node);

    // Find connected nodes
    const connected = new Set([node.id]);
    links.forEach(link => {
      const sourceId = link.source?.id || link.source;
      const targetId = link.target?.id || link.target;
      if (sourceId === node.id) connected.add(targetId);
      if (targetId === node.id) connected.add(sourceId);
    });
    setHighlightedNodes(connected);

    if (onNodeHover) onNodeHover(node);
  };

  const handleNodeMouseLeave = () => {
    setHoveredNode(null);
    setHighlightedNodes(new Set());
  };

  const handleNodeClick = (node) => {
    if (onNodeClick) onNodeClick(node);
  };

  // Get node color by type from CSS variables
  const getNodeColor = (type) => {
    // Get computed CSS variable values from :root
    const root = document.documentElement;
    const style = getComputedStyle(root);

    const colorMap = {
      goal: style.getPropertyValue('--layer-goals').trim(),
      exercise: style.getPropertyValue('--layer-exercises').trim(),
      muscle: style.getPropertyValue('--layer-muscles').trim(),
      pain: style.getPropertyValue('--layer-pain').trim()
    };

    return colorMap[type] || '#999';
  };

  // Get node radius based on connections
  const getNodeRadius = (node) => {
    const connections = links.filter(link => {
      const sourceId = link.source?.id || link.source;
      const targetId = link.target?.id || link.target;
      return sourceId === node.id || targetId === node.id;
    }).length;

    const baseSize = 15;
    const connectionBonus = connections * 3;
    const maxSize = 50;

    return Math.min(baseSize + connectionBonus, maxSize);
  };

  // Debug logging for rendered nodes
  useEffect(() => {
    if (nodes.length > 0) {
      console.log('🎨 Rendering Graph:', {
        nodeCount: nodes.length,
        linkCount: links.length,
        nodeTypes: [...new Set(nodes.map(n => n.type))],
        sampleNode: nodes[0],
        sampleNodeColor: getNodeColor(nodes[0]?.type)
      });
    }
  }, [nodes.length]);

  return (
    <>
      <svg
        ref={svgRef}
        width={width}
        height={height}
        style={{
          display: 'block',
          opacity: isReady ? 1 : 0,
          transition: 'opacity 0.3s ease-in',
          cursor: 'grab',
          touchAction: 'none'
        }}
      >
        <g ref={gRef}>
          {/* Links */}
          <g className="links">
            {links.map((link, i) => {
              const source = link.source;
              const target = link.target;
              if (!source?.x || !source?.y || !target?.x || !target?.y) return null;

              const isHighlighted = highlightedNodes.has(source.id) && highlightedNodes.has(target.id);

              return (
                <line
                  key={`link-${i}`}
                  x1={source.x}
                  y1={source.y}
                  x2={target.x}
                  y2={target.y}
                  stroke={isHighlighted ? 'rgba(255, 255, 255, 0.4)' : 'rgba(255, 255, 255, 0.15)'}
                  strokeWidth={isHighlighted ? 2 : 1.5}
                />
              );
            })}
          </g>

          {/* Nodes */}
          <g className="nodes">
            {nodes.map(node => {
              if (!node.x || !node.y) return null;

              const isHighlighted = highlightedNodes.has(node.id);
              const isHovered = hoveredNode === node;
              const isDimmed = hoveredNode && !isHighlighted;
              const radius = getNodeRadius(node);
              const color = getNodeColor(node.type);

              return (
                <g
                  key={node.id}
                  className="node"
                  data-node-id={node.id}
                  transform={`translate(${node.x},${node.y})`}
                  onMouseEnter={() => handleNodeMouseEnter(node)}
                  onMouseLeave={handleNodeMouseLeave}
                  onClick={() => handleNodeClick(node)}
                  style={{ cursor: 'pointer' }}
                  ref={(el) => {
                    // Attach node data to DOM element for D3 drag
                    if (el) {
                      el.__data__ = node;
                    }
                  }}
                >
                  <circle
                    r={isHovered ? radius * 1.2 : radius}
                    fill={color}
                    opacity={isDimmed ? 0.3 : 1}
                    stroke={isHovered ? '#ffffff' : 'none'}
                    strokeWidth={isHovered ? 3 : 0}
                  />
                  <text
                    y={radius + 18}
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="10px"
                    fontWeight="500"
                    style={{
                      textShadow: '0 1px 4px rgba(0, 0, 0, 0.9)',
                      pointerEvents: 'none',
                      userSelect: 'none'
                    }}
                  >
                    {(node.title || node.label || node.data?.title || node.data?.name || '').substring(0, 12)}
                  </text>
                </g>
              );
            })}
          </g>
        </g>
      </svg>

      {/* Loading indicator */}
      {!isReady && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div className="loading-spinner"></div>
          <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}>
            Построение графа...
          </p>
        </div>
      )}
    </>
  );
}
