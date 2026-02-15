import { useState, useEffect, useMemo } from 'react';
import { buildGraphData } from './useContentIndex';

/**
 * useGraphData hook
 * Manages graph data building and filtering
 * Now uses content-index.json as data source
 */
export function useGraphData(entityType, entityId, depth = 2) {
  const [graphData, setGraphData] = useState({ nodes: [], edges: [] });
  const [loading, setLoading] = useState(false);
  // ✅ Using singular types to match content-index.json
  const [filters, setFilters] = useState({
    goal: true,
    exercise: true,
    muscle: true,
    pain: true
  });
  const [threshold, setThreshold] = useState(0);

  // Build graph when component mounts or when filters change
  useEffect(() => {
    setLoading(true);

    try {
      // Get full graph data from content index
      const data = buildGraphData();

      // Debug logging
      console.log('📊 Graph Data Built:', {
        nodes: data.nodes.length,
        links: data.links.length,
        types: [...new Set(data.nodes.map(n => n.type))],
        sampleNode: data.nodes[0],
        sampleLink: data.links[0]
      });

      // Convert edges format to match existing graph expectations
      const formattedData = {
        nodes: data.nodes,
        edges: data.links.map(link => ({
          source: link.source,
          target: link.target,
          from: link.from,
          to: link.to
        }))
      };

      setGraphData(formattedData);
    } catch (error) {
      console.error('Error building graph:', error);
      setGraphData({ nodes: [], edges: [] });
    } finally {
      setLoading(false);
    }
  }, []); // Only run once on mount

  // Filter nodes by type and threshold
  const filteredData = useMemo(() => {
    if (!graphData.nodes.length) return graphData;

    // Count connections for each node
    const connectionCounts = new Map();
    graphData.nodes.forEach(node => {
      const count = graphData.edges.filter(edge => {
        const sourceId = edge.source?.id || edge.source || edge.from;
        const targetId = edge.target?.id || edge.target || edge.to;
        return sourceId === node.id || targetId === node.id;
      }).length;
      connectionCounts.set(node.id, count);
    });

    // Filter nodes
    const visibleNodes = graphData.nodes.filter(node => {
      const hasEnoughConnections = connectionCounts.get(node.id) >= threshold;
      const typeEnabled = filters[node.type] !== false;
      return hasEnoughConnections && typeEnabled;
    });

    const visibleNodeIds = new Set(visibleNodes.map(n => n.id));

    // Filter edges (both nodes must be visible)
    const visibleEdges = graphData.edges.filter(edge => {
      const sourceId = edge.source?.id || edge.source || edge.from;
      const targetId = edge.target?.id || edge.target || edge.to;
      return visibleNodeIds.has(sourceId) && visibleNodeIds.has(targetId);
    });

    return {
      nodes: visibleNodes,
      edges: visibleEdges
    };
  }, [graphData, filters, threshold]);

  // Toggle filter
  const toggleFilter = (type) => {
    setFilters(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      goal: true,
      exercise: true,
      muscle: true,
      pain: true
    });
    setThreshold(0);
  };

  // Get filter counts
  const filterCounts = useMemo(() => {
    const counts = {};
    Object.keys(filters).forEach(type => {
      counts[type] = filteredData.nodes.filter(n => n.type === type).length;
    });
    return counts;
  }, [filteredData, filters]);

  return {
    graphData: filteredData,
    loading,
    filters,
    threshold,
    filterCounts,
    toggleFilter,
    setThreshold,
    resetFilters,
  };
}
