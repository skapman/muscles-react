import { useState, useEffect, useMemo } from 'react';
import { useData } from '@context/DataContext';

/**
 * useGraphData hook
 * Manages graph data building and filtering
 */
export function useGraphData(entityType, entityId, depth = 2) {
  const { buildRelationshipGraph, getAllEntities } = useData();
  const [graphData, setGraphData] = useState({ nodes: [], edges: [] });
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    goals: true,
    exercises: true,
    muscles: true,
    pain: true
  });
  const [threshold, setThreshold] = useState(0);

  // Build graph when entity changes
  useEffect(() => {
    if (!entityType || !entityId) return;

    setLoading(true);

    try {
      let data;

      if (entityId === 'all' && entityType === 'goals') {
        // Build combined graph for all goals
        data = buildAllGoalsGraph(depth);
      } else {
        // Build graph for single entity
        data = buildRelationshipGraph(entityType, entityId, depth);
      }

      setGraphData(data);
    } catch (error) {
      console.error('Error building graph:', error);
    } finally {
      setLoading(false);
    }
  }, [entityType, entityId, depth, buildRelationshipGraph]);

  // Build combined graph for all goals
  const buildAllGoalsGraph = (depth) => {
    const allGoals = getAllEntities('goals');
    const combinedNodes = new Map();
    const combinedEdges = [];

    allGoals.forEach(goal => {
      const goalGraph = buildRelationshipGraph('goals', goal.id, depth);

      // Add nodes
      goalGraph.nodes.forEach(node => {
        if (!combinedNodes.has(node.id)) {
          combinedNodes.set(node.id, node);
        }
      });

      // Add edges (avoid duplicates)
      goalGraph.edges.forEach(edge => {
        const edgeExists = combinedEdges.some(e =>
          e.from === edge.from && e.to === edge.to
        );
        if (!edgeExists) {
          combinedEdges.push(edge);
        }
      });
    });

    return {
      nodes: Array.from(combinedNodes.values()),
      edges: combinedEdges
    };
  };

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
  };
}
