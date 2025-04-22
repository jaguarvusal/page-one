import { StyleSheet, Pressable } from 'react-native';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';

interface MessageCardProps {
  senderName: string;
  preview: string;
  timestamp: string;
  onPress: () => void;
}

export function MessageCard({ senderName, preview, timestamp, onPress }: MessageCardProps) {
  return (
    <Pressable onPress={onPress}>
      <ThemedView style={styles.card}>
        <ThemedView style={styles.header}>
          <ThemedText style={styles.senderName}>{senderName}</ThemedText>
          <ThemedText style={styles.timestamp}>{timestamp}</ThemedText>
        </ThemedView>
        <ThemedText style={styles.preview} numberOfLines={2}>
          {preview}
        </ThemedText>
      </ThemedView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  senderName: {
    fontSize: 18,
    fontFamily: 'CourierPrime',
    color: '#000000',
    fontWeight: 'bold',
  },
  timestamp: {
    fontSize: 14,
    fontFamily: 'CourierPrime',
    color: '#666666',
  },
  preview: {
    fontSize: 16,
    fontFamily: 'CourierPrime',
    color: '#000000',
    lineHeight: 24,
  },
}); 