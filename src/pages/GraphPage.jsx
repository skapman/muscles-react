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
      <header className="graph-header">
        <h1>📊 Граф Связей</h1>

        <div className="goal-selector">
          <button
            className={`goal-btn ${selectedGoal === 'bench-100kg' && !showAllGoals ? 'active' : ''}`}
            onClick={() => {
              setSelectedGoal('bench-100kg');
              setShowAllGoals(false);
            }}
            title="Жим 100кг"
          >
            🏋️
          </button>
          <button
            className={`goal-btn ${selectedGoal === 'pullups-20' && !showAllGoals ? 'active' : ''}`}
            onClick={() => {
              setSelectedGoal('pullups-20');
              setShowAllGoals(false);
            }}
            title="20 подтягиваний"
          >
            💪
          </button>
          <button
            className={`goal-btn ${selectedGoal === 'pain-relief' && !showAllGoals ? 'active' : ''}`}
            onClick={() => {
              setSelectedGoal('pain-relief');
              setShowAllGoals(false);
            }}
            title="Избавиться от боли"
          >
            ⚠️
          </button>
          <button
            className={`goal-btn ${showAllGoals ? 'active' : ''}`}
            onClick={() => setShowAllGoals(true)}
            title="Все цели"
          >
            🎯
          </button>
        </div>
      </header>

      <div className="graph-container">
        <RelationshipGraph
          entityType="goals"
          entityId={showAllGoals ? 'all' : selectedGoal}
          depth={2}
        />
      </div>

      <style>{`
        .graph-page {
          display: flex;
          flex-direction: column;
          height: 100vh;
          padding: 0;
        }

        .graph-header {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1.5rem;
          padding: 1rem 2rem;
          background: var(--bg-secondary);
          border-bottom: 1px solid var(--border-color);
        }

        .graph-header h1 {
          margin: 0;
          font-size: 1.5rem;
          font-weight: 600;
          letter-spacing: -0.02em;
        }

        .goal-selector {
          display: flex;
          gap: 0.5rem;
        }

        .goal-btn {
          width: 40px;
          height: 40px;
          padding: 0;
          background: var(--bg-tertiary);
          color: var(--text-primary);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          cursor: pointer;
          font-size: 20px;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .goal-btn:hover {
          background: var(--bg-primary);
          border-color: var(--accent-primary);
          transform: translateY(-2px);
        }

        .goal-btn.active {
          background: var(--accent-primary);
          border-color: var(--accent-primary);
          transform: scale(1.05);
        }

        .graph-container {
          flex: 1;
          background: var(--bg-primary);
          overflow: hidden;
        }

        @media (max-width: 768px) {
          .graph-header {
            flex-direction: column;
            gap: 1rem;
            padding: 1rem;
          }

          .graph-header h1 {
            font-size: 1.3rem;
          }

          .goal-btn {
            width: 44px;
            height: 44px;
            font-size: 22px;
          }
        }
      `}</style>
    </div>
  );
}
