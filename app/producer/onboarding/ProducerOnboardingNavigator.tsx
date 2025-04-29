import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Step1Welcome from './Step1Welcome';
import Step2RespectTheWork from './Step2RespectTheWork';
import Step3VerificationPrompt from './Step3VerificationPrompt';
import Step4InteractWithSnippets from './Step4InteractWithSnippets';
import FinalStep from './FinalStep';

const Stack = createNativeStackNavigator();

export default function ProducerOnboardingNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Step1Welcome" component={Step1Welcome} />
      <Stack.Screen name="Step2RespectTheWork" component={Step2RespectTheWork} />
      <Stack.Screen name="Step3VerificationPrompt" component={Step3VerificationPrompt} />
      <Stack.Screen name="Step4InteractWithSnippets" component={Step4InteractWithSnippets} />
      <Stack.Screen name="FinalStep" component={FinalStep} />
    </Stack.Navigator>
  );
}
