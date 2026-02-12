import React from 'react';

/**
 * GoalsHub Component
 * Hub page for fitness goals
 */
export function GoalsHub() {
  return (
    <div className="page goals-hub">
      <div className="hub-container">
        <header className="hub-header">
          <h1>🎯 Цели</h1>
          <p className="hub-description">
            Выберите свою цель и получите персонализированные рекомендации
          </p>
        </header>

        <div className="hub-content">
          <div className="placeholder-message">
            <div className="placeholder-icon">🎯</div>
            <h2>Раздел в разработке</h2>
            <p>Здесь будут карточки с различными фитнес-целями:</p>
            <ul>
              <li>💪 Набор мышечной массы</li>
              <li>🏋️ Развитие силы</li>
              <li>🎯 Эстетика и рельеф</li>
              <li>🏃 Выносливость</li>
              <li>🩹 Реабилитация</li>
              <li>🧘 Гибкость</li>
            </ul>
          </div>
        </div>
      </div>

      <style>{`
        .goals-hub {
          padding: 2rem;
          min-height: 100vh;
        }

        .hub-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .hub-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .hub-header h1 {
          font-size: 2.5rem;
          color: var(--text-primary);
          margin-bottom: 1rem;
        }

        .hub-description {
          font-size: 1.1rem;
          color: var(--text-secondary);
        }

        .hub-content {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 400px;
        }

        .placeholder-message {
          text-align: center;
          padding: 3rem;
          background: var(--bg-secondary);
          border: 2px solid var(--border-color);
          border-radius: 16px;
          max-width: 500px;
        }

        .placeholder-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
        }

        .placeholder-message h2 {
          color: var(--text-primary);
          margin-bottom: 1rem;
        }

        .placeholder-message p {
          color: var(--text-secondary);
          margin-bottom: 1.5rem;
        }

        .placeholder-message ul {
          list-style: none;
          padding: 0;
          text-align: left;
        }

        .placeholder-message li {
          padding: 0.5rem 0;
          color: var(--text-primary);
        }

        @media (max-width: 768px) {
          .goals-hub {
            padding: 1rem;
          }

          .hub-header h1 {
            font-size: 2rem;
          }

          .placeholder-message {
            padding: 2rem 1.5rem;
          }
        }
      `}</style>
    </div>
  );
}
