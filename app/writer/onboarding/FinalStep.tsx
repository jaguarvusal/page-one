import React, { useEffect } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { auth } from '@/firebase'; // Corrected the import path

export default function FinalStep() {
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      router.replace('/');
    }
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.headline}>Every great story starts on Page One.</Text>
      <Text style={styles.subtext}>
        You’re here because you believe in great storytelling. So do we.
      </Text>
      <Pressable style={styles.button} onPress={() => router.push('/writer/(tabs)/stats')}>
        <Text style={styles.buttonText}>Enter Page One</Text>
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
