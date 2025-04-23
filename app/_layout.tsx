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
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF' }}>
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
      console.error('Error checking user type:', error);
      
      if (error.code === 'failed-precondition' || error.code === 'unavailable') {
        if (retryCount < 3) {
          // Retry after a delay
          setTimeout(() => {
            setRetryCount(prev => prev + 1);
            checkUserType(user);
          }, 1000 * (retryCount + 1));
        } else {
          // After 3 retries, show error and sign out
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
        // For other errors, just sign out
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
        console.error('Error in auth state change:', error);
        setInitialRoute('/(tabs)');
      } finally {
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, [retryCount]);

  useEffect(() => {
    if (loaded && !isLoading && initialRoute) {
      const timer = setTimeout(() => {
        router.navigate(initialRoute);
      }, 0);
      return () => clearTimeout(timer);
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
    <>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
          headerTintColor: '#000000',
          headerTitleStyle: {
            fontFamily: 'CourierPrime',
            fontWeight: 'bold',
          },
        }}>
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
      <StatusBar style="dark" />
    </>
  );
}
