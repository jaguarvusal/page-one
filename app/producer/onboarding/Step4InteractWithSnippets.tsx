import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';

export default function Step4InteractWithSnippets() {
  return (
    <View style={styles.container}>
      <Text style={styles.headline}>Snippet Actions</Text>
      <Text style={styles.subtext}>
        🔥 Burn — not a fit{'\n'}
        ⭐ Shortlist — maybe{'\n'}
        ✅ Greenlight — want to connect
      </Text>
      <Text style={styles.note}>
        The more a snippet gets shortlisted or greenlit, the more it's seen — quality rises to the top.
      </Text>
      <Text style={styles.limit}>Limit: 5 greenlights per day</Text>
      <Pressable style={styles.button} onPress={() => router.push('/producer/onboarding/FinalStep')}>
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
    marginBottom: 20,
    color: '#000000',
  },
  subtext: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#000000',
  },
  note: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666666',
  },
  limit: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 40,
    color: '#FF0000',
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
