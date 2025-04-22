import { StyleSheet, Pressable } from 'react-native';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import { FontAwesome } from '@expo/vector-icons';

interface ProducerSnippetCardProps {
  title: string;
  genre: string;
  synopsis: string;
  onBurn: () => void;
  onShortlist: () => void;
  onGreenlight: () => void;
}

export function ProducerSnippetCard({
  title,
  genre,
  synopsis,
  onBurn,
  onShortlist,
  onGreenlight,
}: ProducerSnippetCardProps) {
  return (
    <ThemedView style={styles.card}>
      <ThemedView style={styles.header}>
        <ThemedText style={styles.title}>{title}</ThemedText>
        <ThemedView style={styles.genreContainer}>
          <ThemedText style={styles.genre}>{genre}</ThemedText>
        </ThemedView>
      </ThemedView>

      <ThemedText style={styles.synopsis}>{synopsis}</ThemedText>

      <ThemedView style={styles.actions}>
        <Pressable style={[styles.actionButton, styles.burnButton]} onPress={onBurn}>
          <FontAwesome name="fire" size={20} color="#000000" />
          <ThemedText style={styles.actionText}>Burn</ThemedText>
        </Pressable>
        <Pressable style={[styles.actionButton, styles.shortlistButton]} onPress={onShortlist}>
          <FontAwesome name="bookmark" size={20} color="#000000" />
          <ThemedText style={styles.actionText}>Shortlist</ThemedText>
        </Pressable>
        <Pressable style={[styles.actionButton, styles.greenlightButton]} onPress={onGreenlight}>
          <FontAwesome name="check-circle" size={20} color="#FFFFFF" />
          <ThemedText style={[styles.actionText, styles.greenlightText]}>Greenlight</ThemedText>
        </Pressable>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    margin: 16,
    borderWidth: 1,
    borderColor: '#000000',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontFamily: 'CourierPrime',
    color: '#000000',
    fontWeight: 'bold',
    flex: 1,
    marginRight: 12,
  },
  genreContainer: {
    backgroundColor: '#F5F5DC',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#000000',
  },
  genre: {
    fontSize: 14,
    fontFamily: 'CourierPrime',
    color: '#000000',
  },
  synopsis: {
    fontSize: 16,
    fontFamily: 'CourierPrime',
    color: '#000000',
    lineHeight: 24,
    marginBottom: 20,
  },
  actions: {
    marginTop: 16,
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#000000',
  },
  burnButton: {
    backgroundColor: '#FFFFFF',
  },
  shortlistButton: {
    backgroundColor: '#FFFFFF',
  },
  greenlightButton: {
    backgroundColor: '#000000',
  },
  actionText: {
    fontSize: 14,
    fontFamily: 'CourierPrime',
    color: '#000000',
    marginLeft: 8,
  },
  greenlightText: {
    color: '#FFFFFF',
  },
}); 