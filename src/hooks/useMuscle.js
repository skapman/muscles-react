import { useState, useCallback } from 'react';
import { useData } from '@context/DataContext';
import { useApp } from '@context/AppContext';

/**
 * useMuscle hook - manages muscle selection and data
 * @returns {Object} Muscle state and methods
 */
export function useMuscle() {
  const { muscleData, resolveEntity, getRelated } = useData();
  const { selectedEntity, selectEntity, clearSelection } = useApp();

  const [hoveredMuscle, setHoveredMuscle] = useState(null);

  /**
   * Get muscle by ID
   */
  const getMuscle = useCallback((muscleId) => {
    return muscleData[muscleId] || null;
  }, [muscleData]);

  /**
   * Get all muscles
   */
  const getAllMuscles = useCallback(() => {
    return Object.entries(muscleData).map(([id, data]) => ({
      id,
      ...data
    }));
  }, [muscleData]);

  /**
   * Select a muscle
   */
  const selectMuscle = useCallback((muscleId) => {
    const muscle = getMuscle(muscleId);
    if (muscle) {
      selectEntity('muscles', muscleId, muscle);
    }
  }, [getMuscle, selectEntity]);

  /**
   * Get related entities for a muscle
   */
  const getRelatedEntities = useCallback((muscleId) => {
    return getRelated('muscles', muscleId);
  }, [getRelated]);

  /**
   * Search muscles
   */
  const searchMuscles = useCallback((query) => {
    const lowerQuery = query.toLowerCase();
    return getAllMuscles().filter(muscle =>
      muscle.name?.toLowerCase().includes(lowerQuery) ||
      muscle.nameEn?.toLowerCase().includes(lowerQuery) ||
      muscle.function?.toLowerCase().includes(lowerQuery)
    );
  }, [getAllMuscles]);

  /**
   * Get muscles by group
   */
  const getMusclesByGroup = useCallback((group) => {
    return getAllMuscles().filter(muscle =>
      muscle.group === group
    );
  }, [getAllMuscles]);

  return {
    // Data
    muscleData,
    allMuscles: getAllMuscles(),

    // Selection state
    selectedMuscle: selectedEntity?.type === 'muscles' ? selectedEntity : null,
    hoveredMuscle,

    // Methods
    getMuscle,
    getAllMuscles,
    selectMuscle,
    clearSelection,
    setHoveredMuscle,
    getRelatedEntities,
    searchMuscles,
    getMusclesByGroup,
  };
}
