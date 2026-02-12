import React from 'react';
import { useNavigation } from '@context/NavigationContext';

/**
 * BurgerIcon Component
 * Animated hamburger menu icon
 * Positioned at top-left corner
 */
export function BurgerIcon() {
  const { menuOpen, toggleMenu } = useNavigation();

  return (
    <>
      <button
        className={`burger-icon ${menuOpen ? 'open' : ''}`}
        onClick={toggleMenu}
        aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'}
        aria-expanded={menuOpen}
      >
        <span className="burger-line line-1"></span>
        <span className="burger-line line-2"></span>
        <span className="burger-line line-3"></span>
      </button>

      <style>{`
        .burger-icon {
          position: fixed;
          top: 18px;
          left: 18px;
          width: 40px;
          height: 40px;
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 10px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 4px;
          cursor: pointer;
          z-index: 1001;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }

        .burger-icon:hover {
          background: var(--bg-tertiary);
          border-color: var(--accent-primary);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
          transform: translateY(-1px);
        }

        .burger-icon:active {
          transform: scale(0.96) translateY(0);
        }

        .burger-line {
          width: 20px;
          height: 2px;
          background: var(--text-primary);
          border-radius: 1px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          transform-origin: center;
        }

        /* Animated hamburger to X transformation */
        .burger-icon.open .line-1 {
          transform: translateY(6px) rotate(45deg);
        }

        .burger-icon.open .line-2 {
          opacity: 0;
          transform: scaleX(0);
        }

        .burger-icon.open .line-3 {
          transform: translateY(-6px) rotate(-45deg);
        }

        /* Mobile optimizations */
        @media (max-width: 768px) {
          .burger-icon {
            top: 16px;
            left: 16px;
            width: 44px;
            height: 44px;
            gap: 5px;
          }

          .burger-line {
            width: 22px;
            height: 2.5px;
          }

          .burger-icon.open .line-1 {
            transform: translateY(7.5px) rotate(45deg);
          }

          .burger-icon.open .line-3 {
            transform: translateY(-7.5px) rotate(-45deg);
          }
        }

        /* Accessibility: Focus styles */
        .burger-icon:focus {
          outline: 2px solid var(--accent-primary);
          outline-offset: 2px;
        }

        .burger-icon:focus:not(:focus-visible) {
          outline: none;
        }
      `}</style>
    </>
  );
}
