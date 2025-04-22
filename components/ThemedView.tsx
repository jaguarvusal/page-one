import { View, ViewProps } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

export function ThemedView({ style, ...props }: ViewProps) {
  const colorScheme = useColorScheme();

  return (
    <View
      style={[
        {
          backgroundColor: Colors[colorScheme].background,
        },
        style,
      ]}
      {...props}
    />
  );
} 