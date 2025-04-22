import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    CourierPrime: require('../assets/fonts/CourierPrime-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
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
            headerBackTitle: 'Back',
            headerBackVisible: true,
          }} 
        />
        <Stack.Screen 
          name="producer" 
          options={{ 
            title: 'Producer Dashboard',
            headerBackTitle: 'Back',
            headerBackVisible: true,
          }} 
        />
      </Stack>
      <StatusBar style="dark" />
    </>
  );
}
