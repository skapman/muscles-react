import React from 'react';
import { RelationshipGraph } from '@components/graph/RelationshipGraph';

/**
 * GraphPage Component
 * Page for graph visualization
 */
export function GraphPage() {
  return (
    <div className="page graph-page">
      <header className="graph-header">
        <h1>📊 Граф Связей</h1>
      </header>

      <div className="graph-container">
        <RelationshipGraph
          entityType="goals"
          entityId="all"
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

        .graph-container {
          flex: 1;
          background: var(--bg-primary);
          overflow: hidden;
        }

        @media (max-width: 768px) {
          .graph-header {
            padding: 1rem;
          }

          .graph-header h1 {
            font-size: 1.3rem;
          }
        }
      `}</style>
    </div>
  );
}
