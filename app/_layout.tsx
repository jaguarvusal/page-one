import { useFonts } from 'expo-font';
import { Stack, useSegments, router } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { View, ActivityIndicator, Alert } from 'react-native';
import 'react-native-reanimated';
import { auth, db } from '@/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, enableNetwork } from 'firebase/firestore';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

function LoadingScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#000000" />
    </View>
  );
}

export default function RootLayout() {
  const [loaded] = useFonts({
    CourierPrime: require('../assets/fonts/CourierPrime-Regular.ttf'),
  });

  const [isLoading, setIsLoading] = useState(true);
  const [userType, setUserType] = useState<string | null>(null);
  const [onboardingComplete, setOnboardingComplete] = useState<boolean | null>(null);
  const segments = useSegments();

  const checkUserType = async (user: any) => {
    try {
      await enableNetwork(db); // Ensure Firestore network is enabled
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const userType = userDoc.data()?.type;
        const onboardingComplete = userDoc.data()?.onboardingComplete || false;

        setUserType(userType);
        setOnboardingComplete(onboardingComplete);
      } else {
        await signOut(auth);
        setUserType(null);
        setOnboardingComplete(null);
      }
    } catch (error) {
      console.error('Error checking user type:', error);
      Alert.alert('Error', 'Failed to determine user type. Please try again.');
      await signOut(auth);
      setUserType(null);
      setOnboardingComplete(null);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await checkUserType(user);
      } else {
        setUserType(null);
        setOnboardingComplete(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!isLoading && userType && onboardingComplete !== null) {
      if (userType === 'producer' && !onboardingComplete && !segments.includes('producer/onboarding')) {
        router.replace('/producer/onboarding/Step1Welcome'); // Redirect producer to onboarding
      } else if (userType === 'writer' && !onboardingComplete && !segments.includes('writer/onboarding')) {
        router.replace('/writer/onboarding/Step1Welcome'); // Redirect writer to onboarding
      }
    }
  }, [isLoading, userType, onboardingComplete, segments]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded || isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen 
        name="writer" 
        options={{ 
          title: 'Writer Dashboard',
          headerBackVisible: false,
          headerLeft: () => null,
        }} 
      />
      <Stack.Screen 
        name="producer" 
        options={{ 
          title: 'Producer Dashboard',
          headerBackVisible: false,
          headerLeft: () => null,
        }} 
      />
      <Stack.Screen 
        name="auth" 
        options={{ 
          title: 'Authentication',
          headerShown: false,
        }} 
      />
    </Stack>
  );
}
