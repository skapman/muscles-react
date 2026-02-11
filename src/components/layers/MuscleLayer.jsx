import React, { useState, useCallback } from 'react';
import { useResponsive } from '@hooks/useResponsive';
import { useMuscle } from '@hooks/useMuscle';
import { useApp } from '@context/AppContext';
import { SVGViewer } from '@components/svg/SVGViewer';
import { MuscleDetails } from '@components/details/MuscleDetails';
import { BottomSheet } from '@components/common/BottomSheet';
import { Sidebar } from '@components/layout/Sidebar';

/**
 * MuscleLayer Component
 * Main component for muscle visualization
 * Handles both desktop (dual view) and mobile (swipeable) layouts
 */
export function MuscleLayer() {
  console.log('🏗️ MuscleLayer render');

  const { isMobile } = useResponsive();
  const { selectMuscle, selectedMuscle, clearSelection } = useMuscle();
  const { selectEntity } = useApp();

  const [currentView, setCurrentView] = useState('front');

  const handleMuscleClick = useCallback((muscleId) => {
    selectMuscle(muscleId);
  }, [selectMuscle]);

  const handleMuscleHover = useCallback((muscleId, muscleData) => {
    // Just for tooltip - actual hover state managed in SVGViewer
  }, []);

  const handleCloseDetails = useCallback(() => {
    clearSelection();
  }, [clearSelection]);

  return (
    <div className="muscle-layer">
      {isMobile ? (
        <MobileView
          currentView={currentView}
          onViewChange={setCurrentView}
          onMuscleClick={handleMuscleClick}
          onMuscleHover={handleMuscleHover}
        />
      ) : (
        <DesktopView
          onMuscleClick={handleMuscleClick}
          onMuscleHover={handleMuscleHover}
        />
      )}

      {/* Desktop: Sidebar with details */}
      {!isMobile && (
        <Sidebar>
          <MuscleDetails muscle={selectedMuscle?.data} />
        </Sidebar>
      )}

      {/* Mobile: Bottom sheet with details */}
      {isMobile && (
        <BottomSheet
          isOpen={!!selectedMuscle}
          onClose={handleCloseDetails}
        >
          <MuscleDetails muscle={selectedMuscle?.data} />
        </BottomSheet>
      )}
    </div>
  );
}

/**
 * Desktop View - Dual SVG (front + back)
 */
function DesktopView({ onMuscleClick, onMuscleHover }) {
  console.log('🖥️ DesktopView render');
  return (
    <div className="dual-view-container">
      <div className="view-panel">
        <h3 className="view-title">Вид спереди</h3>
        <SVGViewer
          view="front"
          onMuscleClick={onMuscleClick}
          onMuscleHover={onMuscleHover}
        />
      </div>
      <div className="view-panel">
        <h3 className="view-title">Вид сзади</h3>
        <SVGViewer
          view="back"
          onMuscleClick={onMuscleClick}
          onMuscleHover={onMuscleHover}
        />
      </div>
    </div>
  );
}

/**
 * Mobile View - Swipeable single SVG
 */
function MobileView({ currentView, onViewChange, onMuscleClick, onMuscleHover }) {
  console.log('📱 MobileView render', { currentView });
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    // Swipe works in both directions - toggles between front and back
    if (isLeftSwipe || isRightSwipe) {
      // Start transition animation
      setIsTransitioning(true);

      // Change view after brief fade
      setTimeout(() => {
        if (isLeftSwipe) {
          onViewChange(currentView === 'front' ? 'back' : 'front');
        } else {
          onViewChange(currentView === 'back' ? 'front' : 'back');
        }

        // End transition
        setTimeout(() => setIsTransitioning(false), 50);
      }, 150);
    }

    // Reset
    setTouchStart(0);
    setTouchEnd(0);
  };

  return (
    <div
      className="mobile-view-container"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* View indicators (dots) */}
      <div className="view-indicators">
        <div
          className={`view-indicator ${currentView === 'front' ? 'active' : ''}`}
          onClick={() => onViewChange('front')}
          aria-label="Front view"
        />
        <div
          className={`view-indicator ${currentView === 'back' ? 'active' : ''}`}
          onClick={() => onViewChange('back')}
          aria-label="Back view"
        />
      </div>

      {/* SVG Viewer */}
      <div className={`mobile-view-wrapper ${isTransitioning ? 'transitioning' : ''}`}>
        <SVGViewer
          view={currentView}
          onMuscleClick={onMuscleClick}
          onMuscleHover={onMuscleHover}
        />
      </div>
    </div>
  );
}
