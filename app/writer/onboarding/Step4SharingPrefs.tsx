import React, { useState, useEffect } from 'react';
import { View, Text, Switch, Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router'; // Use router from expo-router
import { auth } from '../../../firebase'; // Import auth from your firebase configuration

export default function Step4SharingPrefs() {
  const [allowPings, setAllowPings] = useState(false);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      router.replace('/');
    }
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.headline}>Sharing Preferences</Text>
      <View style={styles.toggleContainer}>
        <Text style={styles.toggleLabel}>
          Allow hopeful pings from producers (even if not shortlisted or greenlit)
        </Text>
        <Switch value={allowPings} onValueChange={setAllowPings} />
      </View>
      <Text style={styles.note}>
        You control what you share — and when. Add more pages only if and when you want.
      </Text>
      <Pressable style={styles.button} onPress={() => router.push('/writer/onboarding/FinalStep')}>
        <Text style={styles.buttonText}>Continue</Text>
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
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  toggleLabel: {
    fontSize: 16,
    flex: 1,
    marginRight: 10,
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
