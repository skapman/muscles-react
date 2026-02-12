import React from 'react';
import { useOnboarding } from '@context/OnboardingContext';

/**
 * DisclaimerScreen Component
 * First onboarding screen with legal disclaimer
 */
export function DisclaimerScreen() {
  const { acceptDisclaimer, dontShowAgain, setDontShowAgain } = useOnboarding();

  return (
    <div className="disclaimer-screen">
      <div className="disclaimer-icon">⚠️</div>

      <h1 className="disclaimer-title">Важная информация</h1>

      <div className="disclaimer-content">
        <p className="disclaimer-intro">
          Этот сервис предназначен <strong>исключительно для образовательных целей</strong>.
        </p>

        <ul className="disclaimer-list">
          <li>• Не является медицинской консультацией</li>
          <li>• Не заменяет профессиональную помощь</li>
          <li>• Перед началом тренировок проконсультируйтесь с врачом</li>
          <li>• При болях или дискомфорте обратитесь к специалисту</li>
          <li>• Автор не несёт ответственности за последствия использования информации</li>
        </ul>

        <p className="disclaimer-note">
          Информация на сайте носит справочный характер и не может быть использована
          для самодиагностики или самолечения. Всегда консультируйтесь с квалифицированным
          специалистом перед началом любой программы тренировок или изменением образа жизни.
        </p>

        <div className="disclaimer-warning">
          <strong>Внимание:</strong> Неправильное выполнение упражнений может привести к травмам.
          Изучайте технику под руководством опытного тренера.
        </div>
      </div>

      {/* Don't show again checkbox */}
      <label className="disclaimer-checkbox">
        <input
          type="checkbox"
          checked={dontShowAgain}
          onChange={(e) => setDontShowAgain(e.target.checked)}
        />
        <span>Больше не показывать это сообщение</span>
      </label>

      {/* Accept button */}
      <button
        className="disclaimer-button"
        onClick={acceptDisclaimer}
      >
        Я понимаю и принимаю условия
      </button>

      <style>{`
        .disclaimer-screen {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .disclaimer-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }

        .disclaimer-title {
          font-size: 2rem;
          color: var(--text-primary);
          margin-bottom: 1.5rem;
          font-weight: 700;
        }

        .disclaimer-content {
          text-align: left;
          width: 100%;
          margin-bottom: 2rem;
        }

        .disclaimer-intro {
          font-size: 1.1rem;
          color: var(--text-primary);
          margin-bottom: 1.5rem;
          line-height: 1.6;
        }

        .disclaimer-list {
          list-style: none;
          padding: 0;
          margin: 1.5rem 0;
          background: var(--bg-primary);
          padding: 1.5rem;
          border-radius: 12px;
          border-left: 4px solid var(--accent-primary);
        }

        .disclaimer-list li {
          color: var(--text-primary);
          padding: 0.5rem 0;
          line-height: 1.5;
          font-size: 1rem;
        }

        .disclaimer-note {
          font-size: 0.95rem;
          color: var(--text-secondary);
          line-height: 1.6;
          margin: 1.5rem 0;
          padding: 1rem;
          background: var(--bg-primary);
          border-radius: 8px;
        }

        .disclaimer-warning {
          background: rgba(255, 152, 0, 0.1);
          border: 2px solid rgba(255, 152, 0, 0.3);
          border-radius: 8px;
          padding: 1rem;
          color: var(--text-primary);
          font-size: 0.95rem;
          line-height: 1.5;
          margin-top: 1rem;
        }

        .disclaimer-warning strong {
          color: #ff9800;
        }

        /* Checkbox */
        .disclaimer-checkbox {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin: 1.5rem 0;
          cursor: pointer;
          user-select: none;
          font-size: 0.95rem;
          color: var(--text-primary);
        }

        .disclaimer-checkbox input[type="checkbox"] {
          width: 20px;
          height: 20px;
          cursor: pointer;
          accent-color: var(--accent-primary);
        }

        /* Accept button */
        .disclaimer-button {
          width: 100%;
          padding: 1rem 2rem;
          background: var(--accent-primary);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .disclaimer-button:hover {
          background: var(--accent-secondary);
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
        }

        .disclaimer-button:active {
          transform: translateY(0);
        }

        /* Mobile styles */
        @media (max-width: 768px) {
          .disclaimer-icon {
            font-size: 3rem;
          }

          .disclaimer-title {
            font-size: 1.5rem;
          }

          .disclaimer-intro {
            font-size: 1rem;
          }

          .disclaimer-list {
            padding: 1rem;
          }

          .disclaimer-list li {
            font-size: 0.95rem;
          }

          .disclaimer-note,
          .disclaimer-warning {
            font-size: 0.9rem;
          }

          .disclaimer-button {
            font-size: 1rem;
            padding: 0.875rem 1.5rem;
          }
        }

        /* Small mobile */
        @media (max-width: 480px) {
          .disclaimer-icon {
            font-size: 2.5rem;
          }

          .disclaimer-title {
            font-size: 1.3rem;
          }
        }
      `}</style>
    </div>
  );
}
