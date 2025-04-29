import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router'; // Use router from expo-router
import { auth } from '../../../firebase'; // Import auth from your firebase configuration

export default function Step3UploadSnippet() {
  const [title, setTitle] = useState('');
  const [hook, setHook] = useState('');
  const [bestScene, setBestScene] = useState('');
  const [synopsis, setSynopsis] = useState('');

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      router.replace('/');
    }
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.headline}>Upload Your Snippet</Text>
      <TextInput style={styles.input} placeholder="Title" value={title} onChangeText={setTitle} />
      <TextInput style={styles.input} placeholder="Hook" value={hook} onChangeText={setHook} />
      <TextInput style={styles.input} placeholder="Best Scene" value={bestScene} onChangeText={setBestScene} />
      <TextInput style={styles.input} placeholder="Synopsis" value={synopsis} onChangeText={setSynopsis} multiline />
      <Text style={styles.note}>One snippet upload allowed every 24 hours.</Text>
      <Pressable style={styles.button} onPress={() => router.push('/writer/onboarding/Step4SharingPrefs')}>
        <Text style={styles.buttonText}>Next</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
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
  input: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    marginBottom: 15,
    fontFamily: 'Courier',
    color: '#000000',
  },
  note: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    color: '#000000',
  },
  button: {
    backgroundColor: '#000000',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
