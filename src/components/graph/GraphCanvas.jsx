import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';

/**
 * GraphCanvas Component
 * Renders force-directed graph on Canvas using D3.js
 * Supports zoom, pan, and node dragging using D3 zoom behavior
 */
export function GraphCanvas({
  graphData,
  width,
  height,
  sizeReady = false,
  onNodeClick,
  onNodeHover
}) {
  const canvasRef = useRef(null);
  const simulationRef = useRef(null);
  const zoomRef = useRef(null);

  // State for rendering
  const [transform, setTransform] = useState(d3.zoomIdentity);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [highlightedNodes, setHighlightedNodes] = useState(new Set());
  const [isReady, setIsReady] = useState(false);

  // Refs for event handlers (avoid closure issues)
  const draggedNodeRef = useRef(null);
  const transformRef = useRef(transform);
  const simulationDataRef = useRef({ nodes: [], edges: [] });

  // Keep transformRef in sync with transform state
  useEffect(() => {
    transformRef.current = transform;
  }, [transform]);

  // Initialize D3 zoom behavior with filter to allow node dragging
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;

    // Create D3 zoom behavior with filter
    const zoom = d3.zoom()
      .scaleExtent([0.1, 4])
      .filter((event) => {
        // Allow zoom on wheel events
        if (event.type === 'wheel') return true;
        // Allow pan only if not dragging a node
        if (event.type === 'mousedown' || event.type === 'touchstart') {
          const rect = canvas.getBoundingClientRect();
          const x = event.type === 'touchstart' ? event.touches[0].clientX - rect.left : event.clientX - rect.left;
          const y = event.type === 'touchstart' ? event.touches[0].clientY - rect.top : event.clientY - rect.top;
          const node = findNodeAtPosition(x, y, simulationDataRef.current.nodes, transformRef.current);
          // If clicking on a node, don't allow zoom/pan (let drag handle it)
          return !node;
        }
        return true;
      })
      .on('zoom', (event) => {
        setTransform(event.transform);
      });

    // Apply zoom to canvas
    const selection = d3.select(canvas);
    selection.call(zoom);

    zoomRef.current = zoom;

    console.log('D3 zoom behavior initialized with node drag filter');

    return () => {
      selection.on('.zoom', null);
    };
  }, []);

  // Initialize D3 simulation - only when graphData changes AND real canvas size is known
  useEffect(() => {
    if (!graphData.nodes.length || !canvasRef.current || !width || !height || !sizeReady) {
      if (!sizeReady && graphData.nodes.length) {
        console.log('⏳ Waiting for real canvas size before initializing simulation...');
      }
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Stop previous simulation
    if (simulationRef.current) {
      simulationRef.current.stop();
    }

    console.log('✅ Initializing graph simulation with REAL canvas size:', width, 'x', height);

    // Validate nodes have ids
    const validNodes = graphData.nodes.filter(node => node.id);
    if (validNodes.length === 0) {
      console.error('No valid nodes with ids found');
      return;
    }

    // Convert edges from {from, to} to {source, target} format
    const validEdges = graphData.edges
      .filter(edge => {
        const sourceId = edge.source?.id || edge.source || edge.from;
        const targetId = edge.target?.id || edge.target || edge.to;
        return sourceId && targetId;
      })
      .map(edge => ({
        source: edge.source?.id || edge.source || edge.from,
        target: edge.target?.id || edge.target || edge.to,
        type: edge.type,
        label: edge.label
      }));

    // Store in ref for use in other effects
    simulationDataRef.current = { nodes: validNodes, edges: validEdges };

    // Adjust forces based on node count - increased spacing
    const nodeCount = validNodes.length;
    const linkDistance = nodeCount > 20 ? 50 : 80;
    const chargeStrength = nodeCount > 20 ? -150 : -300;
    const maxRepulsionDistance = linkDistance * 3;

    // Create D3 force simulation with better spacing
    // IMPORTANT: Center forces use current width/height
    const simulation = d3.forceSimulation(validNodes)
      .force('link', d3.forceLink(validEdges)
        .id(d => d.id)
        .distance(linkDistance)
        .strength(0.8))
      .force('charge', d3.forceManyBody()
        .strength(chargeStrength)
        .distanceMax(maxRepulsionDistance))
      .force('x', d3.forceX(width / 2).strength(0.03))  // Centers at width/2
      .force('y', d3.forceY(height / 2).strength(0.1))  // Centers at height/2
      .force('collide', d3.forceCollide()
        .radius(d => getNodeRadius(d, validEdges) + 15)
        .strength(1))
      .velocityDecay(0.6)
      .alphaDecay(0.08)
      .alphaMin(0.001);

    console.log('D3 forces centered at:', width / 2, height / 2);

    simulationRef.current = simulation;

    // Hide canvas initially
    setIsReady(false);

    // Render on each tick
    simulation.on('tick', () => {
      render(ctx, simulationDataRef.current, transform, hoveredNode, highlightedNodes);
    });

    // Handle simulation end - this is when nodes have stabilized
    simulation.on('end', () => {
      console.log('✅ Simulation ended - nodes are stable');

      if (zoomRef.current && canvasRef.current) {
        // Get actual current canvas dimensions
        const currentWidth = canvasRef.current.width;
        const currentHeight = canvasRef.current.height;
        console.log('Auto-zooming with canvas size:', currentWidth, 'x', currentHeight);

        autoZoomToFit(validNodes, currentWidth, currentHeight, canvasRef.current, zoomRef.current, () => {
          // Show canvas after zoom animation completes
          console.log('Zoom animation completed, showing graph');
          setTimeout(() => {
            setIsReady(true);
            console.log('✅ Graph is now visible');
          }, 100); // Small buffer after zoom completes
        });
      }
    });

    return () => {
      if (simulation) {
        simulation.stop();
      }
      setIsReady(false);
    };
  }, [graphData.nodes.length, sizeReady]); // Re-initialize when graph data changes OR size becomes ready

  // Update D3 forces when canvas size changes (without restarting simulation)
  useEffect(() => {
    if (!simulationRef.current || !width || !height || !sizeReady) return;

    console.log('Updating D3 forces for new canvas size:', width, 'x', height);

    // Update centering forces to new canvas center
    simulationRef.current
      .force('x', d3.forceX(width / 2).strength(0.03))
      .force('y', d3.forceY(height / 2).strength(0.1))
      .alpha(0.3)  // Reheat simulation slightly
      .restart();

    // Note: Auto-zoom will be handled by the tick handler at tick 40
  }, [width, height]);

  // Re-render when transform, hover, or highlights change (without restarting simulation)
  useEffect(() => {
    if (!canvasRef.current || !simulationDataRef.current.nodes.length) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // IMPORTANT: Use simulationDataRef - D3 has modified these objects with x, y, and linked edges
    render(ctx, simulationDataRef.current, transform, hoveredNode, highlightedNodes);
  }, [transform, hoveredNode, highlightedNodes]);

  // Setup node interaction handlers (hover and D3 drag)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Mouse Move Handler for hover
    const handleMove = (e) => {
      // Skip hover detection while dragging
      if (draggedNodeRef.current) return;

      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const node = findNodeAtPosition(x, y, simulationDataRef.current.nodes, transformRef.current);

      setHoveredNode(prev => {
        if (node !== prev) {
          if (node) {
            const connected = new Set([node.id]);
            simulationDataRef.current.edges.forEach(edge => {
              const sourceId = edge.source?.id || edge.source;
              const targetId = edge.target?.id || edge.target;
              if (sourceId === node.id) connected.add(targetId);
              if (targetId === node.id) connected.add(sourceId);
            });
            setHighlightedNodes(connected);
            if (onNodeHover) onNodeHover(node);
          } else {
            setHighlightedNodes(new Set());
          }
          return node;
        }
        return prev;
      });
    };

    // D3 drag behavior for nodes
    const drag = d3.drag()
      .subject((event) => {
        const rect = canvas.getBoundingClientRect();
        const x = event.x - rect.left;
        const y = event.y - rect.top;
        const node = findNodeAtPosition(x, y, simulationDataRef.current.nodes, transformRef.current);
        return node || null;
      })
      .on('start', (event) => {
        if (!event.subject) return;

        console.log('🎯 Node drag started');
        draggedNodeRef.current = event.subject;
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;

        if (simulationRef.current) {
          simulationRef.current.alphaTarget(0.3).restart();
        }
      })
      .on('drag', (event) => {
        if (!event.subject) return;

        const [graphX, graphY] = transformRef.current.invert([event.x, event.y]);
        event.subject.fx = graphX;
        event.subject.fy = graphY;
      })
      .on('end', (event) => {
        if (!event.subject) return;

        console.log('🎯 Node drag ended');

        // Check if it was a click (no significant movement)
        const dx = event.subject.x - event.subject.fx;
        const dy = event.subject.y - event.subject.fy;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 5 && onNodeClick) {
          onNodeClick(event.subject);
        }

        event.subject.fx = null;
        event.subject.fy = null;
        draggedNodeRef.current = null;

        if (simulationRef.current) {
          simulationRef.current.alphaTarget(0);
        }
      });

    // Apply drag behavior to canvas
    d3.select(canvas).call(drag);

    canvas.addEventListener('mousemove', handleMove);

    return () => {
      d3.select(canvas).on('.drag', null);
      canvas.removeEventListener('mousemove', handleMove);
    };
  }, [onNodeClick, onNodeHover]);

  return (
    <>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{
          display: 'block',
          opacity: isReady ? 1 : 0,
          transition: 'opacity 0.3s ease-in',
          cursor: draggedNodeRef.current ? 'grabbing' : hoveredNode ? 'pointer' : 'grab',
          touchAction: 'none',
          WebkitTouchCallout: 'none',
          WebkitUserSelect: 'none',
          userSelect: 'none'
        }}
      />
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

/**
 * Render graph to canvas using D3 zoom transform
 */
function render(ctx, graphData, transform, hoveredNode, highlightedNodes) {
  const width = ctx.canvas.width;
  const height = ctx.canvas.height;

  // Clear canvas
  ctx.clearRect(0, 0, width, height);

  // Apply D3 zoom transform (simple and correct)
  ctx.save();
  ctx.translate(transform.x, transform.y);
  ctx.scale(transform.k, transform.k);

  // Draw edges - subtle but visible
  graphData.edges.forEach(edge => {
    const source = edge.source;
    const target = edge.target;

    if (source?.x && source?.y && target?.x && target?.y) {
      const isHighlighted = highlightedNodes.has(source.id) && highlightedNodes.has(target.id);

      ctx.strokeStyle = isHighlighted
        ? 'rgba(255, 255, 255, 0.4)'
        : 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = isHighlighted ? 2 : 1.5;

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

    // Draw label - compact
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetY = 1;
    ctx.font = '500 10px Inter, sans-serif';
    ctx.textAlign = 'center';
    const label = (node.data.title || node.data.name || '').substring(0, 12);
    ctx.fillText(label, node.x, node.y + radius + 14);

    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;
  });

  ctx.restore();
}

/**
 * Find node at position using D3 zoom transform
 */
function findNodeAtPosition(screenX, screenY, nodes, transform) {
  // D3 transform.invert() handles the coordinate conversion
  const [graphX, graphY] = transform.invert([screenX, screenY]);

  return nodes.find(node => {
    if (!node.x || !node.y) return false;
    const dx = node.x - graphX;
    const dy = node.y - graphY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const found = distance < 25;
    if (found) {
      console.log('Found node:', {
        nodePos: [node.x, node.y],
        graphPos: [graphX, graphY],
        distance
      });
    }
    return found;
  });
}

/**
 * Auto-zoom to fit all nodes and center them using D3 zoom
 */
function autoZoomToFit(nodes, width, height, canvas, zoom, onComplete) {
  if (!nodes.length || !zoom) return;

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

  // Calculate graph bounds
  const graphWidth = maxX - minX;
  const graphHeight = maxY - minY;
  const graphCenterX = (minX + maxX) / 2;
  const graphCenterY = (minY + maxY) / 2;

  // Add padding
  const padding = 60;
  const availableWidth = width - padding * 2;
  const availableHeight = height - padding * 2;

  // Calculate scale to fit
  const scaleX = availableWidth / graphWidth;
  const scaleY = availableHeight / graphHeight;
  const scale = Math.min(scaleX, scaleY, 1);

  // Calculate translation to center the graph
  const translateX = width / 2 - graphCenterX * scale;
  const translateY = height / 2 - graphCenterY * scale;

  console.log('Auto-zoom calculation:', {
    scale,
    translate: [translateX, translateY],
    graphCenter: [graphCenterX, graphCenterY],
    canvasCenter: [width / 2, height / 2],
    graphBounds: { minX, maxX, minY, maxY },
    graphSize: [graphWidth, graphHeight]
  });

  // Apply transform using D3 zoom
  const transform = d3.zoomIdentity
    .translate(translateX, translateY)
    .scale(scale);

  console.log('Applying D3 zoom transform:', {
    x: transform.x,
    y: transform.y,
    k: transform.k
  });

  const transition = d3.select(canvas)
    .transition()
    .duration(750)
    .call(zoom.transform, transform);

  // Call onComplete callback after transition
  if (onComplete) {
    transition.on('end', () => {
      console.log('D3 zoom transition completed');
      onComplete();
    });
  }
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
