import React from 'react';
import { useOnboarding } from '@context/OnboardingContext';

/**
 * SettingsView Component
 * Application settings page
 */
export function SettingsView() {
  const { resetOnboarding } = useOnboarding();

  return (
    <div className="page settings-view">
      <div className="hub-container">
        <header className="hub-header">
          <h1>⚙️ Настройки</h1>
          <p className="hub-description">
            Персонализируйте работу приложения
          </p>
        </header>

        <div className="hub-content">
          <div className="placeholder-message">
            <div className="placeholder-icon">⚙️</div>
            <h2>Раздел в разработке</h2>
            <p>Здесь будут доступны настройки:</p>
            <ul>
              <li>🏠 Стартовая страница</li>
              <li>🌓 Тема оформления</li>
              <li>🌍 Язык интерфейса</li>
              <li>📏 Единицы измерения</li>
              <li>📊 Показывать прогресс</li>
              <li>🗑️ Очистить историю</li>
              <li>📤 Экспорт данных</li>
            </ul>

            <div style={{ marginTop: '2rem' }}>
              <button
                onClick={resetOnboarding}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: 'var(--accent-primary)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
              >
                🔄 Сбросить онбординг
              </button>
              <p style={{
                marginTop: '0.5rem',
                fontSize: '0.85rem',
                color: 'var(--text-secondary)'
              }}>
                Показать приветственный тур заново
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .settings-view {
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
          .settings-view {
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
