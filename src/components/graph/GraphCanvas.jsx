import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';

/**
 * GraphCanvas Component
 * Renders force-directed graph on Canvas using D3.js
 * Supports zoom, pan, and node dragging
 */
export function GraphCanvas({
  graphData,
  width,
  height,
  onNodeClick,
  onNodeHover
}) {
  const canvasRef = useRef(null);
  const simulationRef = useRef(null);
  const [transform, setTransform] = useState({
    scale: 1,
    translateX: 0,
    translateY: 0
  });
  const [hoveredNode, setHoveredNode] = useState(null);
  const [highlightedNodes, setHighlightedNodes] = useState(new Set());

  // Initialize D3 simulation
  useEffect(() => {
    if (!graphData.nodes.length || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Stop previous simulation
    if (simulationRef.current) {
      simulationRef.current.stop();
    }

    // Adjust forces based on node count
    const nodeCount = graphData.nodes.length;
    const linkDistance = nodeCount > 20 ? 35 : 60;
    const chargeStrength = nodeCount > 20 ? -100 : -200;
    const maxRepulsionDistance = linkDistance * 2;

    // Create D3 force simulation
    const simulation = d3.forceSimulation(graphData.nodes)
      .force('link', d3.forceLink(graphData.edges)
        .id(d => d.id)
        .distance(linkDistance)
        .strength(1))
      .force('charge', d3.forceManyBody()
        .strength(chargeStrength)
        .distanceMax(maxRepulsionDistance))
      .force('x', d3.forceX(width / 2).strength(0.05))
      .force('y', d3.forceY(height / 2).strength(0.15))
      .force('collide', d3.forceCollide()
        .radius(25)
        .strength(0.9))
      .velocityDecay(0.4)
      .alphaDecay(0.02)
      .alphaMin(0.001);

    simulationRef.current = simulation;

    // Render on each tick
    simulation.on('tick', () => {
      render(ctx, graphData, transform, hoveredNode, highlightedNodes);
    });

    // Auto-zoom after 50 ticks
    let tickCount = 0;
    let hasAutoZoomed = false;
    simulation.on('tick', () => {
      render(ctx, graphData, transform, hoveredNode, highlightedNodes);
      tickCount++;
      if (tickCount === 50 && !hasAutoZoomed) {
        hasAutoZoomed = true;
        autoZoomToFit(graphData.nodes, width, height, setTransform);
      }
    });

    return () => {
      simulation.stop();
    };
  }, [graphData, width, height, transform, hoveredNode, highlightedNodes]);

  // Handle mouse move for hover
  const handleMouseMove = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const node = findNodeAtPosition(x, y, graphData.nodes, transform);

    if (node !== hoveredNode) {
      setHoveredNode(node);

      if (node) {
        // Highlight connected nodes
        const connected = new Set([node.id]);
        graphData.edges.forEach(edge => {
          const sourceId = edge.source?.id || edge.source;
          const targetId = edge.target?.id || edge.target;
          if (sourceId === node.id) connected.add(targetId);
          if (targetId === node.id) connected.add(sourceId);
        });
        setHighlightedNodes(connected);

        if (onNodeHover) {
          onNodeHover(node);
        }
      } else {
        setHighlightedNodes(new Set());
      }
    }
  };

  // Handle click
  const handleClick = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const node = findNodeAtPosition(x, y, graphData.nodes, transform);

    if (node && onNodeClick) {
      onNodeClick(node);
    }
  };

  // Handle wheel zoom
  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setTransform(prev => ({
      ...prev,
      scale: prev.scale * delta
    }));
  };

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      onMouseMove={handleMouseMove}
      onClick={handleClick}
      onWheel={handleWheel}
      style={{ cursor: hoveredNode ? 'pointer' : 'grab' }}
    />
  );
}

/**
 * Render graph to canvas
 */
function render(ctx, graphData, transform, hoveredNode, highlightedNodes) {
  const width = ctx.canvas.width;
  const height = ctx.canvas.height;

  // Clear canvas
  ctx.clearRect(0, 0, width, height);

  // Apply transformations
  ctx.save();
  ctx.translate(width / 2, height / 2);
  ctx.scale(transform.scale, transform.scale);
  ctx.translate(
    transform.translateX / transform.scale,
    transform.translateY / transform.scale
  );
  ctx.translate(-width / 2, -height / 2);

  // Draw edges
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.lineWidth = 2;
  graphData.edges.forEach(edge => {
    const source = edge.source;
    const target = edge.target;

    if (source?.x && source?.y && target?.x && target?.y) {
      ctx.beginPath();
      ctx.moveTo(source.x, source.y);
      ctx.lineTo(target.x, target.y);
      ctx.stroke();
    }
  });

  // Draw nodes
  graphData.nodes.forEach(node => {
    if (!node.x || !node.y) return;

    const isHighlighted = highlightedNodes.has(node.id);
    const isHovered = hoveredNode === node;
    const isDimmed = hoveredNode && !isHighlighted;

    const color = getNodeColor(node.type);
    let radius = getNodeRadius(node, graphData.edges);

    if (isHovered) radius *= 1.2;

    const opacity = isDimmed ? 0.3 : 1.0;

    // Draw node
    ctx.globalAlpha = opacity;
    ctx.beginPath();
    ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();

    if (isHovered) {
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      ctx.stroke();
    }

    ctx.globalAlpha = 1.0;

    // Draw label
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
    ctx.shadowBlur = 6;
    ctx.shadowOffsetY = 2;
    ctx.font = '300 11px Inter, sans-serif';
    ctx.textAlign = 'center';
    const label = (node.data.title || node.data.name || '').substring(0, 15);
    ctx.fillText(label, node.x, node.y + radius + 16);

    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;
  });

  ctx.restore();
}

/**
 * Find node at position
 */
function findNodeAtPosition(x, y, nodes, transform) {
  const adjustedX = (x - transform.translateX) / transform.scale;
  const adjustedY = (y - transform.translateY) / transform.scale;

  return nodes.find(node => {
    const dx = node.x - adjustedX;
    const dy = node.y - adjustedY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < 25;
  });
}

/**
 * Auto-zoom to fit all nodes
 */
function autoZoomToFit(nodes, width, height, setTransform) {
  if (!nodes.length) return;

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

  const padding = 100;
  const graphWidth = maxX - minX + padding * 2;
  const graphHeight = maxY - minY + padding * 2;

  const scaleX = width / graphWidth;
  const scaleY = height / graphHeight;
  const scale = Math.min(scaleX, scaleY, 1);

  setTransform({
    scale,
    translateX: 0,
    translateY: 0
  });
}

/**
 * Get node color by type
 */
function getNodeColor(type) {
  const colors = {
    goals: '#4caf50',
    exercises: '#00d4ff',
    muscles: '#ff5252',
    pain: '#f44336'
  };
  return colors[type] || '#999';
}

/**
 * Get node radius based on connections
 */
function getNodeRadius(node, edges) {
  const connections = edges.filter(edge => {
    const sourceId = edge.source?.id || edge.source;
    const targetId = edge.target?.id || edge.target;
    return sourceId === node.id || targetId === node.id;
  }).length;

  const baseSize = 15;
  const connectionBonus = connections * 3;
  const maxSize = 50;

  return Math.min(baseSize + connectionBonus, maxSize);
}
