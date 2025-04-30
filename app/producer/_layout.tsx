import React from 'react';
import { Stack } from 'expo-router';

export default function ProducerLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen name="messages/[id]" />
      {/* Explicitly define onboarding screens without nesting */}
      <Stack.Screen 
        name="onboarding/Step1Welcome" 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="onboarding/Step2RespectTheWork" 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="onboarding/Step3VerificationPrompt" 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="onboarding/Step4InteractWithSnippets" 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="onboarding/FinalStep" 
        options={{ headerShown: false }}
      />
    </Stack>
  );
}