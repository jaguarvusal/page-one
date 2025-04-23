import React, { useState } from 'react';
import { StyleSheet, TextInput, Pressable, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { router, useLocalSearchParams } from 'expo-router';
import { auth } from '@/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from '@firebase/auth';
import { doc, setDoc, getDoc } from '@firebase/firestore';
import { db } from '@/firebase';
import { FontAwesome } from '@expo/vector-icons';

export default function AuthScreen() {
  const { type } = useLocalSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAuth = async (isSignUp: boolean) => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      if (isSignUp) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Create user document in Firestore
        await setDoc(doc(db, 'users', user.uid), {
          email: user.email,
          type: type,
          createdAt: new Date().toISOString(),
        });

        // Redirect based on user type
        if (type === 'writer') {
          router.replace('/writer/(tabs)/stats');
        } else {
          router.replace('/producer/(tabs)/explore');
        }
      } else {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Get user type from Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const userType = userDoc.data()?.type;
        
        // Redirect based on user type
        if (userType === 'writer') {
          router.replace('/writer/(tabs)/stats');
        } else {
          router.replace('/producer/(tabs)/explore');
        }
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ThemedView style={styles.innerContainer}>
          <Pressable 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <FontAwesome name="arrow-left" size={24} color="#000000" />
          </Pressable>
          
          <ThemedText style={styles.title}>
            {type === 'writer' ? 'Writer' : 'Producer'} {isLoading ? 'Loading...' : ''}
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
            />
            
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#666"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            
            {error ? <ThemedText style={styles.error}>{error}</ThemedText> : null}
            
            <Pressable
              style={styles.button}
              onPress={() => handleAuth(true)}
              disabled={isLoading}
            >
              <ThemedText style={styles.buttonText}>Sign Up</ThemedText>
            </Pressable>
            
            <Pressable
              style={[styles.button, styles.loginButton]}
              onPress={() => handleAuth(false)}
              disabled={isLoading}
            >
              <ThemedText style={styles.buttonText}>Login</ThemedText>
            </Pressable>
          </ThemedView>
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 1,
  },
  title: {
    fontSize: 32,
    fontFamily: 'CourierPrime',
    marginBottom: 40,
    textAlign: 'center',
    color: '#000000',
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    padding: 20,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
    fontFamily: 'CourierPrime',
    backgroundColor: '#FFFFFF',
  },
  button: {
    backgroundColor: '#000000',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  loginButton: {
    backgroundColor: '#333333',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'CourierPrime',
  },
  error: {
    color: '#FF0000',
    marginBottom: 16,
    textAlign: 'center',
  },
}); 