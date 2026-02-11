import React, { createContext, useContext, useMemo } from 'react';
import { DataResolver } from '@core/dataResolver';
import { muscleData } from '@data/muscleData';
import { goalData } from '@data/goalData';
import { exerciseData } from '@data/exerciseData';
import layers from '@data/layers.json';
import blocks from '@data/blocks.json';
import painPoints from '@data/painPoints.json';

const DataContext = createContext(null);

/**
 * DataProvider Component
 * Provides data and data-related functions to the app
 * Optimized with useMemo to prevent unnecessary re-renders
 */
export function DataProvider({ children }) {
  // Memoize data objects
  const data = useMemo(() => ({
    muscleData,
    goalData,
    exerciseData,
    layers,
    systemBlocks: blocks,
    painPoints
  }), []); // Empty deps - data is static

  // Memoize DataResolver methods
  const resolverMethods = useMemo(() => ({
    resolveEntity: (type, id) => DataResolver.resolveEntity(type, id),
    getRelated: (type, id, depth = 1) => DataResolver.getRelated(type, id, depth),
    buildRelationshipGraph: (type, id, depth = 2) =>
      DataResolver.buildRelationshipGraph(type, id, depth),
    getAllEntities: (type) => DataResolver.getAllEntities(type),
  }), []); // Empty deps - methods don't change

  // Memoize statistics
  const statistics = useMemo(() => ({
    muscles: Object.keys(muscleData).length,
    exercises: Object.keys(exerciseData).length,
    goals: Object.keys(goalData).length,
    pain: painPoints.length,
    total: Object.keys(muscleData).length +
           Object.keys(exerciseData).length +
           Object.keys(goalData).length +
           painPoints.length
  }), []); // Empty deps - data is static

  // Memoize getStatistics function
  const getStatistics = useMemo(() => () => statistics, [statistics]);

  // Memoize context value
  const value = useMemo(() => ({
    ...data,
    ...resolverMethods,
    getStatistics
  }), [data, resolverMethods, getStatistics]);

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}

/**
 * useData hook
 * Access data context
 */
export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
}
