import * as React from 'react';

export const useUserOnboardingStatus = () => {
  const [isNewUser, setIsNewUser] = React.useState<boolean | null>(true);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        // Check if user has completed onboarding
        const hasCompletedOnboarding = localStorage.getItem('onboardingCompleted');

        // // Simulate network delay
        // await new Promise((resolve) => setTimeout(resolve, 1000));

        setIsNewUser(!hasCompletedOnboarding);
      } catch (error) {
        console.error('Error checking onboarding status:', error);
        setIsNewUser(true);
      } finally {
        setIsLoading(false);
      }
    };

    checkOnboardingStatus();
  }, []);

  const completeOnboarding = () => {
    localStorage.setItem('onboardingCompleted', 'true');
    setIsNewUser(false);
  };

  return { isNewUser, isLoading, completeOnboarding };
};
