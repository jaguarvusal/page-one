import { useFonts } from 'expo-font';
import { Stack, useSegments, router } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { View, ActivityIndicator, Alert } from 'react-native';
import 'react-native-reanimated';
import { auth, db } from '@/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, enableNetwork, disableNetwork } from 'firebase/firestore';

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

  const segments = useSegments();
  const [isLoading, setIsLoading] = useState(true);
  const [initialRoute, setInitialRoute] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const checkUserType = async (user: any) => {
    try {
      // Enable network first
      await enableNetwork(db);
      
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (userDoc.exists()) {
        const userType = userDoc.data()?.type;
        
        if (userType === 'writer') {
          setInitialRoute('/writer/(tabs)/stats');
        } else {
          setInitialRoute('/producer/(tabs)/explore');
        }
      } else {
        await signOut(auth);
        setInitialRoute('/(tabs)');
      }
    } catch (error: any) {
      if (error.code === 'failed-precondition' || error.code === 'unavailable') {
        if (retryCount < 3) {
          setTimeout(() => {
            setRetryCount(prev => prev + 1);
            checkUserType(user);
          }, 1000 * (retryCount + 1));
        } else {
          Alert.alert(
            'Connection Error',
            'Unable to connect to the server. Please check your internet connection and try again.',
            [
              {
                text: 'OK',
                onPress: async () => {
                  await signOut(auth);
                  setInitialRoute('/(tabs)');
                }
              }
            ]
          );
        }
      } else {
        await signOut(auth);
        setInitialRoute('/(tabs)');
      }
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          await checkUserType(user);
        } else {
          setInitialRoute('/(tabs)');
        }
      } catch (error) {
        setInitialRoute('/(tabs)');
      } finally {
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, [retryCount]);

  useEffect(() => {
    if (loaded && !isLoading && initialRoute) {
      router.replace(initialRoute);
    }
  }, [loaded, isLoading, initialRoute]);

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
        gestureEnabled: false,
        gestureHandlerEnabled: false,
        animationEnabled: false,
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false, gestureEnabled: false }} />
      <Stack.Screen 
        name="writer" 
        options={{ 
          title: 'Writer Dashboard',
          headerBackVisible: false,
          headerLeft: () => null,
          gestureEnabled: false,
        }} 
      />
      <Stack.Screen 
        name="producer" 
        options={{ 
          title: 'Producer Dashboard',
          headerBackVisible: false,
          headerLeft: () => null,
          gestureEnabled: false,
        }} 
      />
      <Stack.Screen 
        name="auth" 
        options={{ 
          title: 'Authentication',
          headerShown: false,
          gestureEnabled: false,
        }} 
      />
    </Stack>
  );
}
