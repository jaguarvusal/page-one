import React, { useEffect, useState } from 'react';
import { Stack, router, useSegments } from 'expo-router';
import { auth, db } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { View, ActivityIndicator, Alert } from 'react-native';

export default function ProducerLayout() {
  const [isLoading, setIsLoading] = useState(true);
  const [onboardingComplete, setOnboardingComplete] = useState<boolean | null>(null);
  const segments = useSegments();

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        const currentUser = auth.currentUser;
        if (!currentUser) {
          router.replace('/auth?type=producer');
          return;
        }

        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          const onboardingComplete = userDoc.data()?.onboardingComplete === true; // Explicitly check for true
          setOnboardingComplete(onboardingComplete);

          console.log("Producer onboarding status:", { 
            onboardingComplete, 
            segments: segments.join('/') 
          }); // Debug log

          // If onboarding is not complete and we're not already in the onboarding flow,
          // immediately redirect to onboarding
          if (!onboardingComplete && !segments.join('/').includes('onboarding')) {
            console.log("Redirecting to producer onboarding Step1"); // Debug log
            router.replace('/producer/onboarding/Step1Welcome');
            return;
          }
        } else {
          Alert.alert('Error', 'User data not found. Please log in again.');
          router.replace('/auth?type=producer');
        }
      } catch (error) {
        console.error('Error checking onboarding status:', error);
        Alert.alert('Error', 'Failed to check onboarding status. Please try again.');
        router.replace('/auth?type=producer');
      } finally {
        setIsLoading(false);
      }
    };

    checkOnboardingStatus();
  }, [segments]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#000000" />
      </View>
    );
  }

  return (
    <Stack>
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="onboarding"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}