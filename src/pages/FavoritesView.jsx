import React from 'react';

/**
 * FavoritesView Component
 * Page for user's favorite items
 */
export function FavoritesView() {
  return (
    <div className="page favorites-view">
      <div className="hub-container">
        <header className="hub-header">
          <h1>⭐ Избранное</h1>
          <p className="hub-description">
            Ваши сохранённые мышцы, упражнения и цели
          </p>
        </header>

        <div className="hub-content">
          <div className="placeholder-message">
            <div className="placeholder-icon">⭐</div>
            <h2>Раздел в разработке</h2>
            <p>Здесь будут отображаться:</p>
            <ul>
              <li>💪 Избранные мышцы</li>
              <li>🏋️ Избранные упражнения</li>
              <li>🎯 Избранные цели</li>
              <li>📊 Статистика изучения</li>
              <li>📤 Экспорт избранного</li>
            </ul>
          </div>
        </div>
      </div>

      <style>{`
        .favorites-view {
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
          .favorites-view {
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
