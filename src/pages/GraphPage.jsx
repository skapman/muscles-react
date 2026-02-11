import React, { useState } from 'react';
import { RelationshipGraph } from '@components/graph/RelationshipGraph';

/**
 * GraphPage Component
 * Page for graph visualization
 */
export function GraphPage() {
  const [selectedGoal, setSelectedGoal] = useState('bench-100kg');
  const [showAllGoals, setShowAllGoals] = useState(false);

  return (
    <div className="page graph-page">
      <div className="page-header">
        <h1>📊 Граф Связей</h1>
        <p>Визуализация связей между целями, упражнениями, мышцами и болями</p>
      </div>

      <div className="goal-selector">
        <h3>Выберите цель:</h3>
        <div className="goal-buttons">
          <button
            className={`goal-btn ${selectedGoal === 'bench-100kg' && !showAllGoals ? 'active' : ''}`}
            onClick={() => {
              setSelectedGoal('bench-100kg');
              setShowAllGoals(false);
            }}
          >
            🏋️ Жим 100кг
          </button>
          <button
            className={`goal-btn ${selectedGoal === 'pullups-20' && !showAllGoals ? 'active' : ''}`}
            onClick={() => {
              setSelectedGoal('pullups-20');
              setShowAllGoals(false);
            }}
          >
            💪 20 подтягиваний
          </button>
          <button
            className={`goal-btn ${selectedGoal === 'pain-relief' && !showAllGoals ? 'active' : ''}`}
            onClick={() => {
              setSelectedGoal('pain-relief');
              setShowAllGoals(false);
            }}
          >
            ⚠️ Избавиться от боли
          </button>
          <button
            className={`goal-btn ${showAllGoals ? 'active' : ''}`}
            onClick={() => setShowAllGoals(true)}
          >
            🎯 Все цели
          </button>
        </div>
      </div>

      <div className="graph-container">
        <RelationshipGraph
          entityType="goals"
          entityId={showAllGoals ? 'all' : selectedGoal}
          depth={2}
        />
      </div>

      <style>{`
        .graph-page {
          padding: 2rem;
        }

        .page-header {
          margin-bottom: 2rem;
        }

        .page-header h1 {
          margin: 0 0 0.5rem 0;
        }

        .page-header p {
          margin: 0;
          opacity: 0.8;
        }

        .goal-selector {
          margin-bottom: 2rem;
        }

        .goal-selector h3 {
          margin: 0 0 1rem 0;
        }

        .goal-buttons {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .goal-btn {
          padding: 12px 24px;
          background: var(--color-bg-secondary);
          color: var(--color-text);
          border: 2px solid var(--color-border);
          border-radius: 8px;
          cursor: pointer;
          font-size: 16px;
          transition: all 0.3s ease;
        }

        .goal-btn:hover {
          background: var(--color-primary);
          color: white;
        }

        .goal-btn.active {
          background: var(--color-primary);
          color: white;
          font-weight: bold;
        }

        .graph-container {
          background: var(--color-bg-secondary);
          border: 2px solid var(--color-border);
          border-radius: 12px;
          padding: 1rem;
          min-height: 600px;
        }
      `}</style>
    </div>
  );
}
