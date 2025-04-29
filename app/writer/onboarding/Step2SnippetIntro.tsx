import React, { useEffect } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router'; // Use router from expo-router
import { auth } from '../../../firebase'; // Import auth from your firebase configuration

export default function Step2SnippetIntro() {
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      router.replace('/');
    }
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.headline}>Snippet Details</Text>
      <View style={styles.bulletPoints}>
        <Text style={styles.bullet}>• Title</Text>
        <Text style={styles.bullet}>• Hook (your opening pages)</Text>
        <Text style={styles.bullet}>• Best Scene (1–2 standout scenes)</Text>
        <Text style={styles.bullet}>• Synopsis (tight or loose — your call)</Text>
      </View>
      <Text style={styles.lockText}>🔒 Every snippet you upload is time-stamped and logged for your peace of mind.</Text>
      <Text style={styles.linkText}>Learn how this protects your work.</Text>
      <Pressable style={styles.button} onPress={() => router.push('/writer/onboarding/Step3UploadSnippet')}>
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
  bulletPoints: {
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  bullet: {
    fontSize: 16,
    marginBottom: 10,
    color: '#000000',
  },
  lockText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 10,
    color: '#000000',
  },
  linkText: {
    fontSize: 14,
    textAlign: 'center',
    color: '#007AFF',
    marginBottom: 40,
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
