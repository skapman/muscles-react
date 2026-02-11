/**
 * Data Resolver
 * Handles relationships between different entities (muscles, exercises, goals, pain, etc.)
 * Builds relationship graphs for visualization
 */

import { muscleData } from '@data/muscleData.js';
import { systemBlocks } from '@data/systemBlocks.js';
import { goalData } from '@data/goalData.js';
import { exerciseData } from '@data/exerciseData.js';

export class DataResolver {
    /**
     * Resolve entity by type and ID
     * @param {string} type - Entity type (muscles, pain, nervous, etc.)
     * @param {string} id - Entity ID
     * @returns {Object|null} Entity data or null
     */
    static resolveEntity(type, id) {
        const dataMap = {
            muscles: muscleData,
            pain: systemBlocks.pain,
            nervous: systemBlocks.nervous,
            respiratory: systemBlocks.respiratory,
            cardiovascular: systemBlocks.cardiovascular,
            gadgets: systemBlocks.gadgets,
            goals: goalData,
            exercises: exerciseData
        };

        const data = dataMap[type];
        if (!data) return null;

        // For arrays (blocks), find by id
        if (Array.isArray(data)) {
            return data.find(item => item.id === id) || null;
        }

        // For objects (like muscleData), direct access
        return data[id] || null;
    }

    /**
     * Build relationship graph for an entity
     * @param {string} entityType - Type of entity
     * @param {string} entityId - Entity ID
     * @param {number} depth - How many levels deep to traverse (default: 2)
     * @returns {Object} Graph with nodes and edges
     */
    static buildRelationshipGraph(entityType, entityId, depth = 2) {
        const nodes = [];
        const edges = [];
        const visited = new Set();

        // Start with the root entity
        const rootEntity = this.resolveEntity(entityType, entityId);
        if (!rootEntity) {
            return { nodes: [], edges: [] };
        }

        // Add root node
        nodes.push({
            id: `${entityType}:${entityId}`,
            type: entityType,
            data: rootEntity,
            level: 0
        });
        visited.add(`${entityType}:${entityId}`);

        // Traverse relationships
        this._traverseRelationships(entityType, entityId, rootEntity, nodes, edges, visited, 1, depth);

        return { nodes, edges };
    }

    /**
     * Recursively traverse relationships
     * @private
     */
    static _traverseRelationships(entityType, entityId, entity, nodes, edges, visited, currentLevel, maxDepth) {
        if (currentLevel > maxDepth) return;

        const currentNodeId = `${entityType}:${entityId}`;

        // Handle different entity types
        switch (entityType) {
            case 'muscles':
                this._traverseMuscleRelationships(entity, currentNodeId, nodes, edges, visited, currentLevel, maxDepth);
                break;
            case 'pain':
                this._traversePainRelationships(entity, currentNodeId, nodes, edges, visited, currentLevel, maxDepth);
                break;
            case 'goals':
                this._traverseGoalRelationships(entity, currentNodeId, nodes, edges, visited, currentLevel, maxDepth);
                break;
            case 'exercises':
                this._traverseExerciseRelationships(entity, currentNodeId, nodes, edges, visited, currentLevel, maxDepth);
                break;
        }
    }

    /**
     * Traverse muscle relationships
     * @private
     */
    static _traverseMuscleRelationships(muscle, currentNodeId, nodes, edges, visited, currentLevel, maxDepth) {
        // Find pain issues affecting this muscle
        const affectingPain = systemBlocks.pain.filter(pain =>
            pain.affectedAreas?.some(area => area.muscleId === muscle.id)
        );

        affectingPain.forEach(pain => {
            const painNodeId = `pain:${pain.id}`;
            if (!visited.has(painNodeId)) {
                nodes.push({
                    id: painNodeId,
                    type: 'pain',
                    data: pain,
                    level: currentLevel
                });
                visited.add(painNodeId);
            }

            edges.push({
                from: painNodeId,
                to: currentNodeId,
                type: 'affects',
                label: 'Affects'
            });

            // Recursively traverse pain relationships
            if (currentLevel < maxDepth) {
                this._traversePainRelationships(pain, painNodeId, nodes, edges, visited, currentLevel + 1, maxDepth);
            }
        });

        // Find exercises that target this muscle
        const targetingExercises = Object.values(exerciseData).filter(exercise =>
            exercise.primaryMuscles?.includes(muscle.id) ||
            exercise.secondaryMuscles?.includes(muscle.id)
        );

        targetingExercises.forEach(exercise => {
            const exerciseNodeId = `exercises:${exercise.id}`;
            if (!visited.has(exerciseNodeId)) {
                nodes.push({
                    id: exerciseNodeId,
                    type: 'exercises',
                    data: exercise,
                    level: currentLevel
                });
                visited.add(exerciseNodeId);
            }

            edges.push({
                from: exerciseNodeId,
                to: currentNodeId,
                type: 'targets',
                label: exercise.primaryMuscles?.includes(muscle.id) ? 'Primary' : 'Secondary'
            });

            // Recursively traverse exercise relationships
            if (currentLevel < maxDepth) {
                this._traverseExerciseRelationships(exercise, exerciseNodeId, nodes, edges, visited, currentLevel + 1, maxDepth);
            }
        });

        // Find goals that involve this muscle
        const relatedGoals = Object.values(goalData).filter(goal =>
            goal.primaryMuscles?.includes(muscle.id) ||
            goal.secondaryMuscles?.includes(muscle.id)
        );

        relatedGoals.forEach(goal => {
            const goalNodeId = `goals:${goal.id}`;
            if (!visited.has(goalNodeId)) {
                nodes.push({
                    id: goalNodeId,
                    type: 'goals',
                    data: goal,
                    level: currentLevel
                });
                visited.add(goalNodeId);
            }

            edges.push({
                from: goalNodeId,
                to: currentNodeId,
                type: 'involves',
                label: goal.primaryMuscles?.includes(muscle.id) ? 'Primary' : 'Secondary'
            });
        });
    }

    /**
     * Traverse pain relationships
     * @private
     */
    static _traversePainRelationships(pain, currentNodeId, nodes, edges, visited, currentLevel, maxDepth) {
        // Add affected muscles
        if (pain.affectedAreas) {
            pain.affectedAreas.forEach(area => {
                const muscle = muscleData[area.muscleId];
                if (!muscle) return;

                const muscleNodeId = `muscles:${area.muscleId}`;
                if (!visited.has(muscleNodeId)) {
                    nodes.push({
                        id: muscleNodeId,
                        type: 'muscles',
                        data: muscle,
                        level: currentLevel
                    });
                    visited.add(muscleNodeId);
                }

                edges.push({
                    from: currentNodeId,
                    to: muscleNodeId,
                    type: 'affects',
                    label: `${area.intensity} intensity`,
                    intensity: area.intensity
                });
            });
        }

        // Add exercise solutions for pain
        if (pain.exerciseIds) {
            pain.exerciseIds.forEach(exerciseId => {
                const exercise = exerciseData[exerciseId];
                if (!exercise) return;

                const exerciseNodeId = `exercises:${exerciseId}`;
                if (!visited.has(exerciseNodeId)) {
                    nodes.push({
                        id: exerciseNodeId,
                        type: 'exercises',
                        data: exercise,
                        level: currentLevel
                    });
                    visited.add(exerciseNodeId);
                }

                edges.push({
                    from: currentNodeId,
                    to: exerciseNodeId,
                    type: 'solution',
                    label: 'Helps with'
                });
            });
        }

        // Add related goals (therapeutic goals for pain relief)
        const relatedGoals = Object.values(goalData).filter(goal =>
            goal.problem?.painId === pain.id
        );

        relatedGoals.forEach(goal => {
            const goalNodeId = `goals:${goal.id}`;
            if (!visited.has(goalNodeId)) {
                nodes.push({
                    id: goalNodeId,
                    type: 'goals',
                    data: goal,
                    level: currentLevel
                });
                visited.add(goalNodeId);
            }

            edges.push({
                from: goalNodeId,
                to: currentNodeId,
                type: 'addresses',
                label: 'Addresses'
            });
        });
    }

    /**
     * Traverse goal relationships
     * @private
     */
    static _traverseGoalRelationships(goal, currentNodeId, nodes, edges, visited, currentLevel, maxDepth) {
        // Add primary exercises
        const primaryExercises = Array.isArray(goal.primaryExercises)
            ? goal.primaryExercises
            : goal.primaryExercises?.map(e => typeof e === 'string' ? e : e.id) || [];

        primaryExercises.forEach(exerciseId => {
            const exercise = exerciseData[exerciseId];
            if (!exercise) return;

            const exerciseNodeId = `exercises:${exerciseId}`;
            if (!visited.has(exerciseNodeId)) {
                nodes.push({
                    id: exerciseNodeId,
                    type: 'exercises',
                    data: exercise,
                    level: currentLevel
                });
                visited.add(exerciseNodeId);
            }

            edges.push({
                from: currentNodeId,
                to: exerciseNodeId,
                type: 'requires',
                label: 'Primary Exercise'
            });

            // Recursively traverse exercise relationships
            if (currentLevel < maxDepth) {
                this._traverseExerciseRelationships(exercise, exerciseNodeId, nodes, edges, visited, currentLevel + 1, maxDepth);
            }
        });

        // Add supportive exercises
        const supportiveExercises = goal.supportiveExercises || [];
        supportiveExercises.forEach(exerciseId => {
            const exercise = exerciseData[exerciseId];
            if (!exercise) return;

            const exerciseNodeId = `exercises:${exerciseId}`;
            if (!visited.has(exerciseNodeId)) {
                nodes.push({
                    id: exerciseNodeId,
                    type: 'exercises',
                    data: exercise,
                    level: currentLevel
                });
                visited.add(exerciseNodeId);
            }

            edges.push({
                from: currentNodeId,
                to: exerciseNodeId,
                type: 'includes',
                label: 'Supportive Exercise'
            });
        });

        // Add primary muscles
        const primaryMuscles = goal.primaryMuscles || [];
        primaryMuscles.forEach(muscleId => {
            const muscle = muscleData[muscleId];
            if (!muscle) {
                console.warn(`Muscle not found: ${muscleId}`);
                return;
            }

            const muscleNodeId = `muscles:${muscleId}`;
            if (!visited.has(muscleNodeId)) {
                nodes.push({
                    id: muscleNodeId,
                    type: 'muscles',
                    data: { ...muscle, id: muscleId },
                    level: currentLevel
                });
                visited.add(muscleNodeId);
            }

            edges.push({
                from: currentNodeId,
                to: muscleNodeId,
                type: 'targets',
                label: 'Primary Muscle'
            });
        });

        // Add related pain (for therapeutic goals)
        if (goal.problem?.painId) {
            const pain = systemBlocks.pain.find(p => p.id === goal.problem.painId);
            if (pain) {
                const painNodeId = `pain:${pain.id}`;
                if (!visited.has(painNodeId)) {
                    nodes.push({
                        id: painNodeId,
                        type: 'pain',
                        data: pain,
                        level: currentLevel
                    });
                    visited.add(painNodeId);
                }

                edges.push({
                    from: currentNodeId,
                    to: painNodeId,
                    type: 'addresses',
                    label: 'Addresses'
                });
            }
        }
    }

    /**
     * Traverse exercise relationships
     * @private
     */
    static _traverseExerciseRelationships(exercise, currentNodeId, nodes, edges, visited, currentLevel, maxDepth) {
        // Add primary muscles
        const primaryMuscles = exercise.primaryMuscles || [];
        primaryMuscles.forEach(muscleId => {
            const muscle = muscleData[muscleId];
            if (!muscle) {
                console.warn(`Muscle not found: ${muscleId}`);
                return;
            }

            const muscleNodeId = `muscles:${muscleId}`;
            if (!visited.has(muscleNodeId)) {
                nodes.push({
                    id: muscleNodeId,
                    type: 'muscles',
                    data: { ...muscle, id: muscleId },
                    level: currentLevel
                });
                visited.add(muscleNodeId);
            }

            edges.push({
                from: currentNodeId,
                to: muscleNodeId,
                type: 'targets',
                label: 'Primary'
            });
        });

        // Add secondary muscles
        const secondaryMuscles = exercise.secondaryMuscles || [];
        secondaryMuscles.forEach(muscleId => {
            const muscle = muscleData[muscleId];
            if (!muscle) {
                console.warn(`Muscle not found: ${muscleId}`);
                return;
            }

            const muscleNodeId = `muscles:${muscleId}`;
            if (!visited.has(muscleNodeId)) {
                nodes.push({
                    id: muscleNodeId,
                    type: 'muscles',
                    data: { ...muscle, id: muscleId },
                    level: currentLevel
                });
                visited.add(muscleNodeId);
            }

            edges.push({
                from: currentNodeId,
                to: muscleNodeId,
                type: 'targets',
                label: 'Secondary'
            });
        });

        // Add exercise variations
        const variations = exercise.variations || [];
        variations.forEach(variationId => {
            const variation = exerciseData[variationId];
            if (!variation) return;

            const variationNodeId = `exercises:${variationId}`;
            if (!visited.has(variationNodeId)) {
                nodes.push({
                    id: variationNodeId,
                    type: 'exercises',
                    data: variation,
                    level: currentLevel
                });
                visited.add(variationNodeId);
            }

            edges.push({
                from: currentNodeId,
                to: variationNodeId,
                type: 'variation',
                label: 'Variation'
            });
        });
    }

    /**
     * Get all entities of a specific type
     * @param {string} type - Entity type
     * @returns {Array} Array of entities
     */
    static getAllEntities(type) {
        const dataMap = {
            muscles: muscleData,
            pain: systemBlocks.pain,
            nervous: systemBlocks.nervous,
            respiratory: systemBlocks.respiratory,
            cardiovascular: systemBlocks.cardiovascular,
            gadgets: systemBlocks.gadgets,
            goals: goalData,
            exercises: exerciseData
        };

        const data = dataMap[type];
        if (!data) return [];

        // Convert object to array if needed
        if (Array.isArray(data)) {
            return data;
        }

        return Object.keys(data).map(key => ({
            id: key,
            ...data[key]
        }));
    }

    /**
     * Search entities by query
     * @param {string} query - Search query
     * @param {Array<string>} types - Entity types to search (default: all)
     * @returns {Array} Search results
     */
    static search(query, types = ['muscles', 'pain', 'nervous', 'respiratory', 'cardiovascular', 'gadgets', 'goals', 'exercises']) {
        const results = [];
        const lowerQuery = query.toLowerCase();

        types.forEach(type => {
            const entities = this.getAllEntities(type);

            entities.forEach(entity => {
                const score = this._calculateSearchScore(entity, lowerQuery);
                if (score > 0) {
                    results.push({
                        type,
                        entity,
                        score
                    });
                }
            });
        });

        // Sort by score (descending)
        return results.sort((a, b) => b.score - a.score);
    }

    /**
     * Calculate search score for an entity
     * @private
     */
    static _calculateSearchScore(entity, query) {
        let score = 0;

        // Check title/name (highest weight)
        const title = (entity.title || entity.name || '').toLowerCase();
        if (title.includes(query)) {
            score += title.startsWith(query) ? 10 : 5;
        }

        // Check English title
        const titleEn = (entity.titleEn || entity.nameEn || '').toLowerCase();
        if (titleEn.includes(query)) {
            score += 3;
        }

        // Check content/description
        const content = (entity.content || entity.description || '').toLowerCase();
        if (content.includes(query)) {
            score += 2;
        }

        // Check tags
        if (entity.tags && Array.isArray(entity.tags)) {
            if (entity.tags.some(tag => tag.toLowerCase().includes(query))) {
                score += 4;
            }
        }

        return score;
    }

    /**
     * Get related entities
     * @param {string} entityType - Type of entity
     * @param {string} entityId - Entity ID
     * @returns {Object} Related entities grouped by type
     */
    static getRelatedEntities(entityType, entityId) {
        const entity = this.resolveEntity(entityType, entityId);
        if (!entity) return {};

        const related = {
            muscles: [],
            pain: [],
            exercises: [],
            goals: []
        };

        // Get relationships based on entity type
        if (entityType === 'muscles') {
            // Find pain affecting this muscle
            related.pain = systemBlocks.pain.filter(pain =>
                pain.affectedAreas?.some(area => area.muscleId === entityId)
            );

            // Find exercises targeting this muscle
            related.exercises = Object.values(exerciseData).filter(exercise =>
                exercise.primaryMuscles?.includes(entityId) ||
                exercise.secondaryMuscles?.includes(entityId)
            );

            // Find goals involving this muscle
            related.goals = Object.values(goalData).filter(goal =>
                goal.primaryMuscles?.includes(entityId) ||
                goal.secondaryMuscles?.includes(entityId)
            );
        } else if (entityType === 'pain') {
            // Get affected muscles
            if (entity.affectedAreas) {
                related.muscles = entity.affectedAreas
                    .map(area => muscleData[area.muscleId])
                    .filter(Boolean);
            }

            // Get therapeutic goals
            related.goals = Object.values(goalData).filter(goal =>
                goal.problem?.painId === entityId
            );

            // Get exercise solutions
            if (entity.exerciseIds) {
                related.exercises = entity.exerciseIds
                    .map(id => exerciseData[id])
                    .filter(Boolean);
            }
        } else if (entityType === 'goals') {
            // Get exercises for this goal
            const primaryExercises = Array.isArray(entity.primaryExercises)
                ? entity.primaryExercises
                : entity.primaryExercises?.map(e => typeof e === 'string' ? e : e.id) || [];

            related.exercises = primaryExercises
                .map(id => exerciseData[id])
                .filter(Boolean);

            // Get target muscles
            const allMuscles = [...(entity.primaryMuscles || []), ...(entity.secondaryMuscles || [])];
            related.muscles = allMuscles
                .map(id => muscleData[id])
                .filter(Boolean);

            // Get related pain (for therapeutic goals)
            if (entity.problem?.painId) {
                const pain = systemBlocks.pain.find(p => p.id === entity.problem.painId);
                if (pain) related.pain = [pain];
            }
        } else if (entityType === 'exercises') {
            // Get target muscles
            const allMuscles = [...(entity.primaryMuscles || []), ...(entity.secondaryMuscles || [])];
            related.muscles = allMuscles
                .map(id => muscleData[id])
                .filter(Boolean);

            // Get goals that use this exercise
            related.goals = Object.values(goalData).filter(goal => {
                const primaryExercises = Array.isArray(goal.primaryExercises)
                    ? goal.primaryExercises
                    : goal.primaryExercises?.map(e => typeof e === 'string' ? e : e.id) || [];
                const supportiveExercises = goal.supportiveExercises || [];

                return primaryExercises.includes(entityId) || supportiveExercises.includes(entityId);
            });
        }

        return related;
    }

    /**
     * Get statistics about the data
     * @returns {Object} Statistics
     */
    static getStatistics() {
        return {
            muscles: Object.keys(muscleData).length,
            pain: systemBlocks.pain.length,
            nervous: systemBlocks.nervous.length,
            respiratory: systemBlocks.respiratory.length,
            cardiovascular: systemBlocks.cardiovascular.length,
            gadgets: systemBlocks.gadgets.length,
            goals: Object.keys(goalData).length,
            exercises: Object.keys(exerciseData).length,
            total: Object.keys(muscleData).length +
                   systemBlocks.pain.length +
                   systemBlocks.nervous.length +
                   systemBlocks.respiratory.length +
                   systemBlocks.cardiovascular.length +
                   systemBlocks.gadgets.length +
                   Object.keys(goalData).length +
                   Object.keys(exerciseData).length
        };
    }
}
