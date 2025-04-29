import React, { useState } from 'react';
import { StyleSheet, TextInput, Pressable, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, ActivityIndicator, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { router, useLocalSearchParams } from 'expo-router';
import { auth, db } from '@/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from '@firebase/auth';
import { doc, setDoc, getDoc } from '@firebase/firestore';
import { FontAwesome } from '@expo/vector-icons';

export default function AuthScreen() {
  const { type } = useLocalSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSignUpLoading, setIsSignUpLoading] = useState(false);
  const [isLoginLoading, setIsLoginLoading] = useState(false);

  const handleAuth = async (isSignUp: boolean) => {
    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields');
      return;
    }

    if (isSignUp) {
      setIsSignUpLoading(true);
    } else {
      setIsLoginLoading(true);
    }
    setError('');

    try {
      let userCredential;
      if (isSignUp) {
        console.log("Signing up as:", type); // Debug logging
        userCredential = await createUserWithEmailAndPassword(auth, email, password);

        // Create user document in Firestore with explicit onboardingComplete: false
        const userRef = doc(db, 'users', userCredential.user.uid);
        await setDoc(userRef, {
          email: userCredential.user.email,
          type: type,
          createdAt: new Date().toISOString(),
          onboardingComplete: false,
        });

        console.log("User created, redirecting to onboarding"); // Debug logging

        // Force immediate redirection before any other code can execute
        if (type === 'writer') {
          setIsSignUpLoading(false);
          setTimeout(() => {
            router.push('/writer/onboarding/Step1Welcome');
          }, 100);
          return;
        } else if (type === 'producer') {
          setIsSignUpLoading(false);
          setTimeout(() => {
            router.push('/producer/onboarding/Step1Welcome');
          }, 100);
          return;
        }
      } else {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      }

      // Verify user document exists
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      if (!userDoc.exists()) {
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          email: userCredential.user.email,
          type: type,
          createdAt: new Date().toISOString(),
          onboardingComplete: false,
        });
      }

      const userType = userDoc.data()?.type || type;
      const onboardingComplete = userDoc.data()?.onboardingComplete || false;

      if (userType === 'writer') {
        router.replace(onboardingComplete ? '/writer/(tabs)/stats' : '/writer/onboarding/Step1Welcome');
      } else {
        router.replace(onboardingComplete ? '/producer/(tabs)/explore' : '/producer/onboarding/Step1Welcome');
      }
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        setError('Email already in use. Please try logging in instead.');
      } else if (error.code === 'auth/invalid-email') {
        setError('Invalid email address.');
      } else if (error.code === 'auth/weak-password') {
        setError('Password should be at least 6 characters.');
      } else if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        setError('Invalid email or password.');
      } else {
        setError(error.message);
      }
    } finally {
      if (isSignUp) {
        setIsSignUpLoading(false);
      } else {
        setIsLoginLoading(false);
      }
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ThemedView style={styles.innerContainer}>
          <ThemedText style={styles.title}>
            {type === 'writer' ? 'Writer' : 'Producer'}
          </ThemedText>
          
          <ThemedView style={styles.formContainer}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#666"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              editable={!isSignUpLoading && !isLoginLoading}
            />
            
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#666"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              editable={!isSignUpLoading && !isLoginLoading}
            />
            
            {error ? <ThemedText style={styles.error}>{error}</ThemedText> : null}
            
            <Pressable
              style={[styles.button, (isSignUpLoading || isLoginLoading) && styles.disabledButton]}
              onPress={() => handleAuth(true)}
              disabled={isSignUpLoading || isLoginLoading}
            >
              {isSignUpLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <ThemedText style={styles.buttonText}>Sign Up</ThemedText>
              )}
            </Pressable>
            
            <Pressable
              style={[styles.button, styles.loginButton, (isSignUpLoading || isLoginLoading) && styles.disabledButton]}
              onPress={() => handleAuth(false)}
              disabled={isSignUpLoading || isLoginLoading}
            >
              {isLoginLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <ThemedText style={styles.buttonText}>Login</ThemedText>
              )}
            </Pressable>
          </ThemedView>

          <Pressable 
            style={styles.backButton} // Moved back button to the bottom
            onPress={() => router.back()}
          >
            <FontAwesome name="arrow-left" size={24} color="#000000" />
          </Pressable>
        </ThemedView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  innerContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center', // Center the form vertically
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  formContainer: {
    gap: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#000000',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  loginButton: {
    backgroundColor: '#333333',
  },
  disabledButton: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  error: {
    color: '#FF0000',
    textAlign: 'center',
    marginBottom: 10,
  },
  backButton: {
    position: 'absolute', // Position the back button at the bottom
    bottom: 30,
    left: 20,
  },
});