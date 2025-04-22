import React from 'react';
import { StyleSheet, Pressable } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { router } from 'expo-router';

export default function HomeScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText style={styles.title}>PAGE</ThemedText>
        <ThemedText style={styles.title}>ONE.</ThemedText>
      </ThemedView>
      <Pressable 
        style={styles.button}
        onPress={() => router.push('/writer')}
      >
        <ThemedText style={styles.buttonText}>Writer</ThemedText>
      </Pressable>
      <Pressable 
        style={styles.button}
        onPress={() => router.push('/producer')}
      >
        <ThemedText style={styles.buttonText}>Producer</ThemedText>
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 40,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 32,
    fontFamily: 'CourierPrime',
    color: '#000000',
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
