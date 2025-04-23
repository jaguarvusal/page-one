import React from 'react';
import { StyleSheet, Pressable } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { router } from 'expo-router';
import { auth } from '@/firebase';
import { onAuthStateChanged, User } from '@firebase/auth';
import { useEffect, useState } from 'react';

export default function HomeScreen() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  const handleWriterPress = () => {
    router.push('/auth?type=writer');
  };

  const handleProducerPress = () => {
    router.push('/auth?type=producer');
  };

  if (isLoading) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText style={styles.title}>Loading...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.contentContainer}>
        <ThemedView style={styles.titleContainer}>
          <ThemedText style={styles.title}>Welcome</ThemedText>
          <ThemedText style={styles.subtitle}>to</ThemedText>
          <ThemedText style={styles.title}>PAGE</ThemedText>
          <ThemedText style={styles.title}>ONE.</ThemedText>
        </ThemedView>
        <ThemedView style={styles.buttonContainer}>
          <Pressable 
            style={styles.button}
            onPress={handleWriterPress}
          >
            <ThemedText style={styles.buttonText}>Writer</ThemedText>
          </Pressable>
          <Pressable 
            style={styles.button}
            onPress={handleProducerPress}
          >
            <ThemedText style={styles.buttonText}>Producer</ThemedText>
          </Pressable>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontFamily: 'CourierPrime',
    color: '#000000',
  },
  subtitle: {
    fontSize: 24,
    fontFamily: 'CourierPrime',
    color: '#000000',
    marginVertical: 10,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#000000',
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'CourierPrime',
  },
});
