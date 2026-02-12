import React from 'react';
import { useOnboarding } from '@context/OnboardingContext';

/**
 * TipsScreen Component
 * Fourth and final onboarding screen with navigation tips
 */
export function TipsScreen() {
  const { finishOnboarding, prevStep } = useOnboarding();

  return (
    <div className="tips-screen">
      <div className="tips-icon">🚀</div>

      <h1 className="tips-title">Готовы начать?</h1>

      <p className="tips-subtitle">
        Несколько советов для эффективного использования
      </p>

      <div className="tips-list">
        <div className="tip-item">
          <div className="tip-emoji">☰</div>
          <div className="tip-content">
            <h3>Бургер-меню</h3>
            <p>
              Нажмите на иконку <strong>☰</strong> в левом верхнем углу для доступа
              ко всем разделам приложения.
            </p>
          </div>
        </div>

        <div className="tip-item">
          <div className="tip-emoji">🔄</div>
          <div className="tip-content">
            <h3>Переключение слоёв</h3>
            <p>
              На главной странице используйте слайдер внизу для переключения между
              различными системами организма.
            </p>
          </div>
        </div>

        <div className="tip-item">
          <div className="tip-emoji">👆</div>
          <div className="tip-content">
            <h3>Интерактивность</h3>
            <p>
              Кликайте на мышцы и точки боли для получения детальной информации
              в боковой панели.
            </p>
          </div>
        </div>

        <div className="tip-item">
          <div className="tip-emoji">📊</div>
          <div className="tip-content">
            <h3>Граф связей</h3>
            <p>
              Исследуйте взаимосвязи в разделе "Граф связей". Используйте жесты
              для масштабирования и перемещения.
            </p>
          </div>
        </div>

        <div className="tip-item">
          <div className="tip-emoji">🌓</div>
          <div className="tip-content">
            <h3>Тема оформления</h3>
            <p>
              Переключайте между тёмной и светлой темой в бургер-меню
              или используйте кнопку в правом верхнем углу.
            </p>
          </div>
        </div>

        <div className="tip-item">
          <div className="tip-emoji">⭐</div>
          <div className="tip-content">
            <h3>Избранное</h3>
            <p>
              Сохраняйте интересные мышцы и упражнения в избранное
              для быстрого доступа.
            </p>
          </div>
        </div>
      </div>

      <div className="tips-note">
        <p>
          💡 <strong>Совет:</strong> Вы всегда можете вернуться к этой информации
          в разделе "О проекте" через бургер-меню.
        </p>
      </div>

      <div className="tips-actions">
        <button
          className="tips-button secondary"
          onClick={prevStep}
        >
          Назад
        </button>
        <button
          className="tips-button primary"
          onClick={finishOnboarding}
        >
          Начать использование! 🎉
        </button>
      </div>

      <style>{`
        .tips-screen {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .tips-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
          animation: launch 2s ease-in-out infinite;
        }

        @keyframes launch {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        .tips-title {
          font-size: 2.5rem;
          color: var(--text-primary);
          margin-bottom: 0.5rem;
          font-weight: 700;
        }

        .tips-subtitle {
          font-size: 1.2rem;
          color: var(--text-secondary);
          margin-bottom: 2rem;
          line-height: 1.5;
        }

        .tips-list {
          width: 100%;
          margin-bottom: 1.5rem;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }

        .tip-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          background: var(--bg-primary);
          padding: 1.25rem;
          border-radius: 12px;
          border: 2px solid var(--border-color);
          transition: all 0.3s ease;
        }

        .tip-item:hover {
          border-color: var(--accent-primary);
          transform: translateY(-4px);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
        }

        .tip-emoji {
          font-size: 2.5rem;
          margin-bottom: 0.75rem;
        }

        .tip-content h3 {
          font-size: 1rem;
          color: var(--text-primary);
          margin-bottom: 0.5rem;
          font-weight: 600;
        }

        .tip-content p {
          font-size: 0.9rem;
          color: var(--text-secondary);
          line-height: 1.5;
          margin: 0;
        }

        .tips-note {
          width: 100%;
          background: rgba(255, 193, 7, 0.1);
          border: 2px solid rgba(255, 193, 7, 0.3);
          border-radius: 12px;
          padding: 1rem;
          margin-bottom: 1.5rem;
        }

        .tips-note p {
          font-size: 0.95rem;
          color: var(--text-primary);
          line-height: 1.6;
          margin: 0;
        }

        .tips-actions {
          display: flex;
          gap: 1rem;
          width: 100%;
        }

        .tips-button {
          flex: 1;
          padding: 1rem 2rem;
          border: none;
          border-radius: 12px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .tips-button.primary {
          background: var(--accent-primary);
          color: white;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .tips-button.primary:hover {
          background: var(--accent-secondary);
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
        }

        .tips-button.secondary {
          background: var(--bg-tertiary);
          color: var(--text-primary);
          border: 2px solid var(--border-color);
        }

        .tips-button.secondary:hover {
          border-color: var(--accent-primary);
          background: var(--bg-primary);
        }

        .tips-button:active {
          transform: translateY(0);
        }

        /* Mobile styles */
        @media (max-width: 768px) {
          .tips-icon {
            font-size: 3rem;
          }

          .tips-title {
            font-size: 1.8rem;
          }

          .tips-subtitle {
            font-size: 1rem;
          }

          .tips-list {
            grid-template-columns: 1fr;
            gap: 0.75rem;
          }

          .tip-item {
            padding: 1rem;
          }

          .tip-emoji {
            font-size: 2rem;
          }

          .tip-content h3 {
            font-size: 0.95rem;
          }

          .tip-content p {
            font-size: 0.85rem;
          }

          .tips-note p {
            font-size: 0.9rem;
          }

          .tips-button {
            font-size: 1rem;
            padding: 0.875rem 1.5rem;
          }
        }

        /* Small mobile */
        @media (max-width: 480px) {
          .tips-icon {
            font-size: 2.5rem;
          }

          .tips-title {
            font-size: 1.5rem;
          }

          .tips-subtitle {
            font-size: 0.95rem;
          }

          .tips-actions {
            flex-direction: column;
          }

          .tips-button.primary {
            font-size: 0.95rem;
          }
        }
      `}</style>
    </div>
  );
}
