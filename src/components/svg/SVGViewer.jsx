import React, { useEffect, useState } from 'react';
import { useSVG } from '@hooks/useSVG';
import { useResponsive } from '@hooks/useResponsive';
import { useMuscle } from '@hooks/useMuscle';
import { Tooltip } from '@components/common/Tooltip';
import * as svgUtils from '@utils/svg';

/**
 * SVGViewer Component
 * Displays and manages interactive SVG with muscle highlighting
 */
export function SVGViewer({ view = 'front', onMuscleClick, onMuscleHover }) {
  const svgUrl = `/img/body-${view}.svg`;
  const { loading, error, svgElement, containerRef } = useSVG(svgUrl);
  const { isMobile } = useResponsive();
  const { setHoveredMuscle, getMuscle } = useMuscle();

  const [tooltip, setTooltip] = useState({
    visible: false,
    content: null,
    position: { x: 0, y: 0 }
  });

  // Add interactivity to SVG elements
  useEffect(() => {
    if (!svgElement || !containerRef.current) return;

    const svg = containerRef.current.querySelector('svg');
    if (!svg) return;

    const muscles = svgUtils.getMuscleElements(svg);

    // Click handler
    const handleClick = (e) => {
      const muscleId = svgUtils.getMuscleId(e.currentTarget);
      if (muscleId && onMuscleClick) {
        onMuscleClick(muscleId);
      }
    };

    // Hover handlers (desktop only)
    const handleMouseEnter = (e) => {
      const element = e.currentTarget;
      const muscleId = svgUtils.getMuscleId(element);

      if (!muscleId) return;

      // Add hover class
      svgUtils.hoverMuscle(element, true);

      // Update hover state
      setHoveredMuscle(muscleId);

      // Get muscle data
      const muscleData = getMuscle(muscleId);

      if (muscleData && onMuscleHover) {
        onMuscleHover(muscleId, muscleData);
      }

      // Show tooltip (desktop only)
      if (!isMobile && muscleData) {
        setTooltip({
          visible: true,
          content: {
            name: muscleData.name,
            function: muscleData.function
          },
          position: {
            x: e.clientX + 10,
            y: e.clientY + 10
          }
        });
      }
    };

    const handleMouseMove = (e) => {
      if (!isMobile && tooltip.visible) {
        setTooltip(prev => ({
          ...prev,
          position: {
            x: e.clientX + 10,
            y: e.clientY + 10
          }
        }));
      }
    };

    const handleMouseLeave = (e) => {
      const element = e.currentTarget;

      // Remove hover class
      svgUtils.hoverMuscle(element, false);

      // Clear hover state
      setHoveredMuscle(null);

      // Hide tooltip
      setTooltip({
        visible: false,
        content: null,
        position: { x: 0, y: 0 }
      });
    };

    // Add event listeners to all muscles
    muscles.forEach(muscle => {
      muscle.addEventListener('click', handleClick);

      if (!isMobile) {
        muscle.addEventListener('mouseenter', handleMouseEnter);
        muscle.addEventListener('mousemove', handleMouseMove);
        muscle.addEventListener('mouseleave', handleMouseLeave);
      }

      // Add pointer cursor
      muscle.style.cursor = 'pointer';
    });

    // Cleanup
    return () => {
      muscles.forEach(muscle => {
        muscle.removeEventListener('click', handleClick);
        muscle.removeEventListener('mouseenter', handleMouseEnter);
        muscle.removeEventListener('mousemove', handleMouseMove);
        muscle.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, [svgElement, isMobile, onMuscleClick, onMuscleHover, getMuscle, setHoveredMuscle, tooltip.visible]);

  if (loading) {
    return (
      <div className="svg-loading">
        <div className="loading-spinner"></div>
        <p>Загрузка...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="svg-error">
        <p>❌ Ошибка загрузки SVG</p>
        <p className="error-details">{error.message}</p>
      </div>
    );
  }

  return (
    <>
      <div ref={containerRef} className="svg-wrapper" />
      <Tooltip {...tooltip} />
    </>
  );
}
