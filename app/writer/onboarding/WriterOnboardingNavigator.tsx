import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Step1Welcome from './Step1Welcome';
import Step2SnippetIntro from './Step2SnippetIntro';
import Step3UploadSnippet from './Step3UploadSnippet';
import Step4SharingPrefs from './Step4SharingPrefs';
import FinalStep from './FinalStep';

const Stack = createNativeStackNavigator();

export default function WriterOnboardingNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Step1Welcome" component={Step1Welcome} />
      <Stack.Screen name="Step2SnippetIntro" component={Step2SnippetIntro} />
      <Stack.Screen name="Step3UploadSnippet" component={Step3UploadSnippet} />
      <Stack.Screen name="Step4SharingPrefs" component={Step4SharingPrefs} />
      <Stack.Screen name="FinalStep" component={FinalStep} />
    </Stack.Navigator>
  );
}
