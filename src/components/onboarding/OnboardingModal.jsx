import React from 'react';
import { useOnboarding } from '@context/OnboardingContext';
import { DisclaimerScreen } from './DisclaimerScreen';
import { WelcomeScreen } from './WelcomeScreen';
import { FeaturesScreen } from './FeaturesScreen';
import { TipsScreen } from './TipsScreen';

/**
 * OnboardingModal Component
 * Main onboarding flow with 4 screens
 */
export function OnboardingModal() {
  const { showOnboarding, currentStep, skipOnboarding } = useOnboarding();

  if (!showOnboarding) {
    return null;
  }

  // Render current step
  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <DisclaimerScreen />;
      case 1:
        return <WelcomeScreen />;
      case 2:
        return <FeaturesScreen />;
      case 3:
        return <TipsScreen />;
      default:
        return <DisclaimerScreen />;
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div className="onboarding-backdrop" onClick={skipOnboarding} />

      {/* Modal */}
      <div className="onboarding-modal">
        {/* Close button */}
        <button
          className="onboarding-close"
          onClick={skipOnboarding}
          aria-label="Закрыть"
        >
          ✕
        </button>

        {/* Progress indicator */}
        <div className="onboarding-progress">
          {[0, 1, 2, 3].map((step) => (
            <div
              key={step}
              className={`progress-dot ${currentStep >= step ? 'active' : ''}`}
            />
          ))}
        </div>

        {/* Current step content */}
        <div className="onboarding-content">
          {renderStep()}
        </div>
      </div>

      <style>{`
        /* Backdrop */
        .onboarding-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(4px);
          z-index: 9998;
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        /* Modal */
        .onboarding-modal {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 90%;
          max-width: 600px;
          max-height: 90vh;
          background: var(--bg-secondary);
          border: 2px solid var(--border-color);
          border-radius: 20px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          z-index: 9999;
          overflow: hidden;
          animation: slideUp 0.4s ease;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translate(-50%, -40%);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%);
          }
        }

        /* Close button */
        .onboarding-close {
          position: absolute;
          top: 20px;
          right: 20px;
          width: 36px;
          height: 36px;
          background: var(--bg-tertiary);
          border: 2px solid var(--border-color);
          border-radius: 50%;
          color: var(--text-primary);
          font-size: 20px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          z-index: 10;
        }

        .onboarding-close:hover {
          background: var(--accent-primary);
          color: white;
          transform: rotate(90deg);
        }

        /* Progress indicator */
        .onboarding-progress {
          display: flex;
          justify-content: center;
          gap: 8px;
          padding: 20px;
          background: var(--bg-primary);
        }

        .progress-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: var(--border-color);
          transition: all 0.3s ease;
        }

        .progress-dot.active {
          background: var(--accent-primary);
          transform: scale(1.2);
        }

        /* Content area */
        .onboarding-content {
          padding: 2rem;
          overflow-y: auto;
          max-height: calc(90vh - 80px);
        }

        /* Scrollbar styling */
        .onboarding-content::-webkit-scrollbar {
          width: 8px;
        }

        .onboarding-content::-webkit-scrollbar-track {
          background: var(--bg-primary);
        }

        .onboarding-content::-webkit-scrollbar-thumb {
          background: var(--border-color);
          border-radius: 4px;
        }

        .onboarding-content::-webkit-scrollbar-thumb:hover {
          background: var(--text-secondary);
        }

        /* Mobile styles */
        @media (max-width: 768px) {
          .onboarding-modal {
            width: 95%;
            max-height: 95vh;
            border-radius: 16px;
          }

          .onboarding-close {
            top: 12px;
            right: 12px;
            width: 32px;
            height: 32px;
            font-size: 18px;
          }

          .onboarding-progress {
            padding: 16px;
          }

          .onboarding-content {
            padding: 1.5rem;
            max-height: calc(95vh - 70px);
          }
        }

        /* Small mobile */
        @media (max-width: 480px) {
          .onboarding-content {
            padding: 1rem;
          }
        }
      `}</style>
    </>
  );
}
