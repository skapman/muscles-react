import React from 'react';
import { useOnboarding } from '@context/OnboardingContext';

/**
 * FeaturesScreen Component
 * Third onboarding screen with key features
 */
export function FeaturesScreen() {
  const { nextStep, prevStep } = useOnboarding();

  return (
    <div className="features-screen">
      <div className="features-icon">✨</div>

      <h1 className="features-title">Ключевые возможности</h1>

      <p className="features-subtitle">
        Всё, что нужно для изучения анатомии и фитнеса
      </p>

      <div className="features-list">
        <div className="feature-item">
          <div className="feature-number">1</div>
          <div className="feature-content">
            <h3>Интерактивная анатомия</h3>
            <p>
              6 слоёв визуализации: мышцы, скелет, нервная система, кровеносная система,
              дыхательная система и точки боли. Кликайте на мышцы для детальной информации.
            </p>
          </div>
        </div>

        <div className="feature-item">
          <div className="feature-number">2</div>
          <div className="feature-content">
            <h3>База упражнений</h3>
            <p>
              Подробные описания техники выполнения, работающие мышечные группы,
              рекомендации по безопасности и вариации упражнений.
            </p>
          </div>
        </div>

        <div className="feature-item">
          <div className="feature-number">3</div>
          <div className="feature-content">
            <h3>Граф связей</h3>
            <p>
              Визуализация взаимосвязей между мышцами, упражнениями и целями.
              Интерактивный граф помогает понять, как всё работает вместе.
            </p>
          </div>
        </div>

        <div className="feature-item">
          <div className="feature-number">4</div>
          <div className="feature-content">
            <h3>Персонализация</h3>
            <p>
              Избранное, история просмотров, тёмная/светлая тема,
              настройки отображения и многое другое.
            </p>
          </div>
        </div>

        <div className="feature-item">
          <div className="feature-number">5</div>
          <div className="feature-content">
            <h3>Мобильная версия</h3>
            <p>
              Адаптивный дизайн работает на всех устройствах.
              Изучайте анатомию где угодно и когда угодно.
            </p>
          </div>
        </div>
      </div>

      <div className="features-actions">
        <button
          className="features-button secondary"
          onClick={prevStep}
        >
          Назад
        </button>
        <button
          className="features-button primary"
          onClick={nextStep}
        >
          Далее
        </button>
      </div>

      <style>{`
        .features-screen {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .features-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
          animation: sparkle 2s ease-in-out infinite;
        }

        @keyframes sparkle {
          0%, 100% { transform: scale(1) rotate(0deg); }
          50% { transform: scale(1.1) rotate(10deg); }
        }

        .features-title {
          font-size: 2.5rem;
          color: var(--text-primary);
          margin-bottom: 0.5rem;
          font-weight: 700;
        }

        .features-subtitle {
          font-size: 1.2rem;
          color: var(--text-secondary);
          margin-bottom: 2rem;
          line-height: 1.5;
        }

        .features-list {
          width: 100%;
          margin-bottom: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .feature-item {
          display: flex;
          gap: 1rem;
          text-align: left;
          background: var(--bg-primary);
          padding: 1.25rem;
          border-radius: 12px;
          border: 2px solid var(--border-color);
          transition: all 0.3s ease;
        }

        .feature-item:hover {
          border-color: var(--accent-primary);
          transform: translateX(4px);
        }

        .feature-number {
          flex-shrink: 0;
          width: 40px;
          height: 40px;
          background: var(--accent-primary);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.25rem;
          font-weight: 700;
        }

        .feature-content {
          flex: 1;
        }

        .feature-content h3 {
          font-size: 1.1rem;
          color: var(--text-primary);
          margin-bottom: 0.5rem;
          font-weight: 600;
        }

        .feature-content p {
          font-size: 0.95rem;
          color: var(--text-secondary);
          line-height: 1.6;
          margin: 0;
        }

        .features-actions {
          display: flex;
          gap: 1rem;
          width: 100%;
        }

        .features-button {
          flex: 1;
          padding: 1rem 2rem;
          border: none;
          border-radius: 12px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .features-button.primary {
          background: var(--accent-primary);
          color: white;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .features-button.primary:hover {
          background: var(--accent-secondary);
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
        }

        .features-button.secondary {
          background: var(--bg-tertiary);
          color: var(--text-primary);
          border: 2px solid var(--border-color);
        }

        .features-button.secondary:hover {
          border-color: var(--accent-primary);
          background: var(--bg-primary);
        }

        .features-button:active {
          transform: translateY(0);
        }

        /* Mobile styles */
        @media (max-width: 768px) {
          .features-icon {
            font-size: 3rem;
          }

          .features-title {
            font-size: 1.8rem;
          }

          .features-subtitle {
            font-size: 1rem;
          }

          .feature-item {
            padding: 1rem;
          }

          .feature-number {
            width: 36px;
            height: 36px;
            font-size: 1.1rem;
          }

          .feature-content h3 {
            font-size: 1rem;
          }

          .feature-content p {
            font-size: 0.9rem;
          }

          .features-button {
            font-size: 1rem;
            padding: 0.875rem 1.5rem;
          }
        }

        /* Small mobile */
        @media (max-width: 480px) {
          .features-icon {
            font-size: 2.5rem;
          }

          .features-title {
            font-size: 1.5rem;
          }

          .features-subtitle {
            font-size: 0.95rem;
          }

          .feature-item {
            flex-direction: column;
            align-items: center;
            text-align: center;
          }

          .features-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}
