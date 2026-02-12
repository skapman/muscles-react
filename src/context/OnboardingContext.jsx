import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';

const OnboardingContext = createContext(null);

const STORAGE_KEY = 'muscles_onboarding_completed';

/**
 * OnboardingProvider Component
 * Manages onboarding flow state and persistence
 */
export function OnboardingProvider({ children }) {
  // Check if onboarding was completed before
  const [isCompleted, setIsCompleted] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored === 'true';
    } catch (error) {
      console.error('Failed to read onboarding state:', error);
      return false;
    }
  });

  // Current step in onboarding flow (0-3)
  const [currentStep, setCurrentStep] = useState(0);

  // Show/hide onboarding modal
  const [showOnboarding, setShowOnboarding] = useState(!isCompleted);

  // Disclaimer acceptance state
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);

  // "Don't show again" checkbox state
  const [dontShowAgain, setDontShowAgain] = useState(false);

  // Persist completion state to localStorage
  const completeOnboarding = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, 'true');
      setIsCompleted(true);
      setShowOnboarding(false);
    } catch (error) {
      console.error('Failed to save onboarding state:', error);
    }
  }, []);

  // Reset onboarding (for testing or settings)
  const resetOnboarding = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      setIsCompleted(false);
      setCurrentStep(0);
      setDisclaimerAccepted(false);
      setDontShowAgain(false);
      setShowOnboarding(true);
    } catch (error) {
      console.error('Failed to reset onboarding state:', error);
    }
  }, []);

  // Navigate to next step
  const nextStep = useCallback(() => {
    setCurrentStep(prev => Math.min(prev + 1, 3));
  }, []);

  // Navigate to previous step
  const prevStep = useCallback(() => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  }, []);

  // Skip onboarding (close without completing)
  const skipOnboarding = useCallback(() => {
    if (dontShowAgain) {
      completeOnboarding();
    } else {
      setShowOnboarding(false);
    }
  }, [dontShowAgain, completeOnboarding]);

  // Accept disclaimer and move to next step
  const acceptDisclaimer = useCallback(() => {
    setDisclaimerAccepted(true);
    nextStep();
  }, [nextStep]);

  // Finish onboarding flow
  const finishOnboarding = useCallback(() => {
    completeOnboarding();
  }, [completeOnboarding]);

  // Memoized context value
  const value = useMemo(() => ({
    // State
    isCompleted,
    currentStep,
    showOnboarding,
    disclaimerAccepted,
    dontShowAgain,

    // Actions
    setDontShowAgain,
    nextStep,
    prevStep,
    skipOnboarding,
    acceptDisclaimer,
    finishOnboarding,
    resetOnboarding,
    completeOnboarding,
  }), [
    isCompleted,
    currentStep,
    showOnboarding,
    disclaimerAccepted,
    dontShowAgain,
    nextStep,
    prevStep,
    skipOnboarding,
    acceptDisclaimer,
    finishOnboarding,
    resetOnboarding,
    completeOnboarding,
  ]);

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
}

/**
 * useOnboarding hook
 * Access onboarding context
 */
export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within OnboardingProvider');
  }
  return context;
}
