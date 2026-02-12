import React from 'react';
import { useOnboarding } from '@context/OnboardingContext';

/**
 * WelcomeScreen Component
 * Second onboarding screen with welcome message
 */
export function WelcomeScreen() {
  const { nextStep, prevStep } = useOnboarding();

  return (
    <div className="welcome-screen">
      <div className="welcome-icon">👋</div>

      <h1 className="welcome-title">Добро пожаловать!</h1>

      <p className="welcome-subtitle">
        Muscles React — ваш персональный гид по анатомии и фитнесу
      </p>

      <div className="welcome-content">
        <div className="welcome-card">
          <div className="card-icon">🏋️</div>
          <h3>Изучайте анатомию</h3>
          <p>
            Интерактивная визуализация мышц человеческого тела с детальными описаниями
          </p>
        </div>

        <div className="welcome-card">
          <div className="card-icon">💪</div>
          <h3>Подбирайте упражнения</h3>
          <p>
            База упражнений с техникой выполнения и работающими мышечными группами
          </p>
        </div>

        <div className="welcome-card">
          <div className="card-icon">🎯</div>
          <h3>Достигайте целей</h3>
          <p>
            Персонализированные рекомендации для достижения ваших фитнес-целей
          </p>
        </div>

        <div className="welcome-card">
          <div className="card-icon">📊</div>
          <h3>Исследуйте связи</h3>
          <p>
            Граф связей между мышцами, упражнениями и целями для глубокого понимания
          </p>
        </div>
      </div>

      <div className="welcome-actions">
        <button
          className="welcome-button secondary"
          onClick={prevStep}
        >
          Назад
        </button>
        <button
          className="welcome-button primary"
          onClick={nextStep}
        >
          Далее
        </button>
      </div>

      <style>{`
        .welcome-screen {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .welcome-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
          animation: wave 2s ease-in-out infinite;
        }

        @keyframes wave {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(20deg); }
          75% { transform: rotate(-20deg); }
        }

        .welcome-title {
          font-size: 2.5rem;
          color: var(--text-primary);
          margin-bottom: 0.5rem;
          font-weight: 700;
        }

        .welcome-subtitle {
          font-size: 1.2rem;
          color: var(--text-secondary);
          margin-bottom: 2rem;
          line-height: 1.5;
        }

        .welcome-content {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
          width: 100%;
          margin-bottom: 2rem;
        }

        .welcome-card {
          background: var(--bg-primary);
          padding: 1.5rem;
          border-radius: 12px;
          border: 2px solid var(--border-color);
          transition: all 0.3s ease;
        }

        .welcome-card:hover {
          border-color: var(--accent-primary);
          transform: translateY(-4px);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
        }

        .card-icon {
          font-size: 2.5rem;
          margin-bottom: 0.75rem;
        }

        .welcome-card h3 {
          font-size: 1.1rem;
          color: var(--text-primary);
          margin-bottom: 0.5rem;
          font-weight: 600;
        }

        .welcome-card p {
          font-size: 0.9rem;
          color: var(--text-secondary);
          line-height: 1.5;
          margin: 0;
        }

        .welcome-actions {
          display: flex;
          gap: 1rem;
          width: 100%;
        }

        .welcome-button {
          flex: 1;
          padding: 1rem 2rem;
          border: none;
          border-radius: 12px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .welcome-button.primary {
          background: var(--accent-primary);
          color: white;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .welcome-button.primary:hover {
          background: var(--accent-secondary);
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
        }

        .welcome-button.secondary {
          background: var(--bg-tertiary);
          color: var(--text-primary);
          border: 2px solid var(--border-color);
        }

        .welcome-button.secondary:hover {
          border-color: var(--accent-primary);
          background: var(--bg-primary);
        }

        .welcome-button:active {
          transform: translateY(0);
        }

        /* Mobile styles */
        @media (max-width: 768px) {
          .welcome-icon {
            font-size: 3rem;
          }

          .welcome-title {
            font-size: 1.8rem;
          }

          .welcome-subtitle {
            font-size: 1rem;
          }

          .welcome-content {
            grid-template-columns: 1fr;
            gap: 0.75rem;
          }

          .welcome-card {
            padding: 1.25rem;
          }

          .card-icon {
            font-size: 2rem;
          }

          .welcome-card h3 {
            font-size: 1rem;
          }

          .welcome-card p {
            font-size: 0.85rem;
          }

          .welcome-button {
            font-size: 1rem;
            padding: 0.875rem 1.5rem;
          }
        }

        /* Small mobile */
        @media (max-width: 480px) {
          .welcome-icon {
            font-size: 2.5rem;
          }

          .welcome-title {
            font-size: 1.5rem;
          }

          .welcome-subtitle {
            font-size: 0.95rem;
          }

          .welcome-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}
