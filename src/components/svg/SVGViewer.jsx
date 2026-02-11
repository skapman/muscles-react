import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useSVG } from '@hooks/useSVG';
import { useResponsive } from '@hooks/useResponsive';
import { useMuscle } from '@hooks/useMuscle';
import { Tooltip } from '@components/common/Tooltip';
import * as svgUtils from '@utils/svg';
import { muscleIdMap } from '@data/muscleIdMap';

/**
 * SVGViewer Component
 * Displays and manages interactive SVG with muscle highlighting
 */
export function SVGViewer({
  view = 'front',
  svgUrl = null,
  hasInteractivity = true,
  onMuscleClick,
  onMuscleHover
}) {
  console.log('🔄 SVGViewer render', { view, svgUrl, hasInteractivity });

  // Use provided svgUrl or construct from view
  const finalSvgUrl = svgUrl || `/img/body-${view}.svg`;
  const { loading, error, svgElement, containerRef } = useSVG(finalSvgUrl);
  const { isMobile } = useResponsive();
  const { setHoveredMuscle, getMuscle, selectedMuscle } = useMuscle();

  const [tooltip, setTooltip] = useState({
    visible: false,
    content: null,
    position: { x: 0, y: 0 }
  });
  const tooltipRef = useRef(tooltip);
  tooltipRef.current = tooltip;

  // Memoize handlers to prevent re-renders
  const handleClick = useCallback((e) => {
    const muscleId = svgUtils.getMuscleId(e.currentTarget);
    if (muscleId && onMuscleClick) {
      onMuscleClick(muscleId);
    }
  }, [onMuscleClick]);

  const handleMouseEnter = useCallback((e) => {
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
  }, [isMobile, setHoveredMuscle, getMuscle, onMuscleHover]);

  const handleMouseMove = useCallback((e) => {
    if (!isMobile && tooltipRef.current.visible) {
      setTooltip(prev => ({
        ...prev,
        position: {
          x: e.clientX + 10,
          y: e.clientY + 10
        }
      }));
    }
  }, [isMobile]);

  const handleMouseLeave = useCallback((e) => {
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
  }, [setHoveredMuscle]);

  // Add interactivity to SVG elements (only if hasInteractivity is true)
  useEffect(() => {
    if (!hasInteractivity) {
      console.log('⏭️ Skipping interactivity (hasInteractivity=false)');
      return;
    }

    console.log('🎯 useEffect: Add interactivity', {
      hasSvgElement: !!svgElement,
      hasContainer: !!containerRef.current
    });

    if (!svgElement || !containerRef.current) return;

    const svg = containerRef.current.querySelector('svg');
    if (!svg) {
      console.log('⚠️ No SVG found in container');
      return;
    }

    // Find all elements with IDs that are in muscleIdMap
    const allElements = svg.querySelectorAll('[id]');
    const muscles = [];

    console.log(`🔍 Found ${allElements.length} elements with IDs in ${view} view`);

    allElements.forEach(element => {
      const elementId = element.id;
      const muscleKey = muscleIdMap[elementId];

      if (muscleKey) {
        // Add data-muscle-id attribute
        element.setAttribute('data-muscle-id', muscleKey);
        element.classList.add('muscle-interactive');
        muscles.push(element);
        console.log(`✅ Mapped: ${elementId} → ${muscleKey}`);
      }
    });

    console.log(`💪 Initialized ${muscles.length} interactive muscles in ${view} view`);

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
  }, [hasInteractivity, svgElement, isMobile, view, handleClick, handleMouseEnter, handleMouseMove, handleMouseLeave]);

  // Handle selected muscle highlighting (only if hasInteractivity is true)
  useEffect(() => {
    if (!hasInteractivity || !containerRef.current) return;

    const svg = containerRef.current.querySelector('svg');
    if (!svg) return;

    const muscles = svgUtils.getMuscleElements(svg);
    const selectedId = selectedMuscle?.id;

    muscles.forEach(muscle => {
      const muscleId = svgUtils.getMuscleId(muscle);
      const shouldBeSelected = muscleId === selectedId;
      const isSelected = muscle.classList.contains('selected');

      // Only update if state changed
      if (shouldBeSelected && !isSelected) {
        muscle.classList.add('selected');
      } else if (!shouldBeSelected && isSelected) {
        muscle.classList.remove('selected');
      }
    });
  }, [hasInteractivity, selectedMuscle]);

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
