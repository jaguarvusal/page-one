import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { auth, db } from '@/firebase';
import { doc, updateDoc } from 'firebase/firestore';

export default function FinalStep() {
  const handleCompleteOnboarding = async () => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      // Mark onboarding as complete
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, { onboardingComplete: true });

      // Navigate to explore page
      router.replace('/producer/(tabs)/explore');
    } catch (error) {
      console.error('Error completing onboarding:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headline}>Every great story starts on Page One.</Text>
      <Text style={styles.subtext}>
        You're here because you believe in great storytelling. So do we.
      </Text>
      <Pressable style={styles.button} onPress={handleCompleteOnboarding}>
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
