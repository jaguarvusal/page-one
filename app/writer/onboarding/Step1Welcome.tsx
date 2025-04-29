import React, { useEffect } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { auth } from '@/firebase';

export default function Step1Welcome() {
  useEffect(() => {
    // Redirect if the user is not authenticated or not a writer
    const user = auth.currentUser;
    if (!user) {
      router.replace('/');
    }
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.headline}>Your words come first.</Text>
      <Text style={styles.subtext}>Page One is designed with writers at the center.</Text>
      <Pressable style={styles.button} onPress={() => router.push('/writer/onboarding/Step2SnippetIntro')}>
        <Text style={styles.buttonText}>Next</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  headline: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#000000',
  },
  subtext: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
    color: '#000000',
  },
  button: {
    backgroundColor: '#000000',
    padding: 15,
    borderRadius: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
