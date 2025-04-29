import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';

export default function Step1Welcome() {
  return (
    <View style={styles.container}>
      <Text style={styles.headline}>
        Discover your next great script — from voices you've never heard.
      </Text>
      <Text style={styles.subtext}>
        A simple opening message establishing the purpose.
      </Text>
      <Pressable 
        style={styles.button} 
        onPress={() => router.push('/producer/onboarding/Step2RespectTheWork')}
      >
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
