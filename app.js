import React from 'react';
import { Text, View } from 'react-native';
import { app } from './firebase'; // Import your firebase.js

export default function App() {
  console.log("Firebase initialized:", app); // Ensure Firebase is initialized correctly

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Welcome to PageOne!</Text>
    </View>
  );
}
