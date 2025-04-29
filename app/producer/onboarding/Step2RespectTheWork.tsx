import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';

export default function Step2RespectTheWork() {
  return (
    <View style={styles.container}>
      <Text style={styles.headline}>
        Every snippet is original and timestamped. These are protected works — please read with integrity.
      </Text>
      <Pressable style={styles.button} onPress={() => router.push('/producer/onboarding/Step3VerificationPrompt')}>
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
    fontSize: 20,
    fontWeight: 'bold',
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
