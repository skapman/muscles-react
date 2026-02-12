import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

/**
 * Custom hook for D3 force simulation
 * Manages force-directed graph layout
 */
export function useForceSimulation(graphData, width, height, options = {}) {
  const {
    linkDistance = 80,
    chargeStrength = -300,
    centerStrength = 0.1,
    onStable = null
  } = options;

  const [nodes, setNodes] = useState([]);
  const [links, setLinks] = useState([]);
  const simulationRef = useRef(null);
  const [isStable, setIsStable] = useState(false);

  useEffect(() => {
    if (!graphData.nodes.length || !width || !height) return;

    // Validate and prepare nodes
    const validNodes = graphData.nodes
      .filter(node => node.id)
      .map(node => ({ ...node })); // Clone to avoid mutation

    if (validNodes.length === 0) {
      console.error('No valid nodes with ids found');
      return;
    }

    // Prepare edges
    const validLinks = graphData.edges
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

    console.log('✅ Initializing force simulation:', {
      nodes: validNodes.length,
      links: validLinks.length,
      size: [width, height]
    });

    // Stop previous simulation
    if (simulationRef.current) {
      simulationRef.current.stop();
    }

    // Adjust forces based on node count
    const nodeCount = validNodes.length;
    const adjustedLinkDistance = nodeCount > 20 ? 50 : linkDistance;
    const adjustedChargeStrength = nodeCount > 20 ? -150 : chargeStrength;

    // Create D3 force simulation
    const simulation = d3.forceSimulation(validNodes)
      .force('link', d3.forceLink(validLinks)
        .id(d => d.id)
        .distance(adjustedLinkDistance)
        .strength(0.8))
      .force('charge', d3.forceManyBody()
        .strength(adjustedChargeStrength)
        .distanceMax(adjustedLinkDistance * 3))
      .force('center', d3.forceCenter(width / 2, height / 2).strength(centerStrength))
      .force('collide', d3.forceCollide()
        .radius(d => getNodeRadius(d, validLinks) + 15)
        .strength(1))
      .velocityDecay(0.6)
      .alphaDecay(0.08)
      .alphaMin(0.001);

    simulationRef.current = simulation;
    setIsStable(false);

    // Update state on each tick
    simulation.on('tick', () => {
      setNodes([...validNodes]);
      setLinks([...validLinks]);
    });

    // Handle simulation end
    simulation.on('end', () => {
      console.log('✅ Simulation stabilized');
      setIsStable(true);
      if (onStable) {
        onStable(validNodes, validLinks);
      }
    });

    return () => {
      if (simulation) {
        simulation.stop();
      }
    };
  }, [graphData, width, height, linkDistance, chargeStrength, centerStrength]);

  return {
    nodes,
    links,
    simulation: simulationRef.current,
    isStable
  };
}

/**
 * Calculate node radius based on connections
 */
function getNodeRadius(node, links) {
  const connections = links.filter(link => {
    const sourceId = link.source?.id || link.source;
    const targetId = link.target?.id || link.target;
    return sourceId === node.id || targetId === node.id;
  }).length;

  const baseSize = 15;
  const connectionBonus = connections * 3;
  const maxSize = 50;

  return Math.min(baseSize + connectionBonus, maxSize);
}
