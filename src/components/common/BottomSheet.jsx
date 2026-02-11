import React, { useState, useRef, useEffect } from 'react';

/**
 * BottomSheet Component
 * Mobile bottom sheet for displaying details
 * Supports swipe to close gesture
 */
export function BottomSheet({ isOpen, onClose, children }) {
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startY = useRef(0);
  const sheetRef = useRef(null);

  // Handle touch start
  const handleTouchStart = (e) => {
    startY.current = e.touches[0].clientY;
    setIsDragging(true);
  };

  // Handle touch move
  const handleTouchMove = (e) => {
    if (!isDragging) return;

    const currentY = e.touches[0].clientY;
    const diff = currentY - startY.current;

    // Only allow dragging down
    if (diff > 0) {
      setDragY(diff);
    }
  };

  // Handle touch end
  const handleTouchEnd = () => {
    setIsDragging(false);

    // Close if dragged more than 100px
    if (dragY > 100) {
      onClose();
    }

    // Reset drag position
    setDragY(0);
  };

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="bottom-sheet-backdrop"
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        ref={sheetRef}
        className={`bottom-sheet ${isOpen ? 'active' : ''}`}
        style={{
          transform: `translateY(${dragY}px)`,
          transition: isDragging ? 'none' : 'transform 0.3s ease-out'
        }}
      >
        {/* Handle */}
        <div
          className="sheet-handle"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="sheet-handle-bar" />
        </div>

        {/* Content */}
        <div className="sheet-content">
          {children}
        </div>
      </div>

      <style>{`
        .bottom-sheet-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 999;
          animation: fadeIn 0.3s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .bottom-sheet {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: var(--color-bg-secondary);
          border-top-left-radius: 20px;
          border-top-right-radius: 20px;
          max-height: 80vh;
          z-index: 1000;
          box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.3);
          transform: translateY(100%);
          transition: transform 0.3s ease-out;
        }

        .bottom-sheet.active {
          transform: translateY(0);
        }

        .sheet-handle {
          padding: 12px;
          cursor: grab;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .sheet-handle:active {
          cursor: grabbing;
        }

        .sheet-handle-bar {
          width: 40px;
          height: 4px;
          background: var(--color-border);
          border-radius: 2px;
        }

        .sheet-content {
          padding: 0 1.5rem 1.5rem;
          overflow-y: auto;
          max-height: calc(80vh - 40px);
        }
      `}</style>
    </>
  );
}
