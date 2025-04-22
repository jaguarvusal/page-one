import { StyleSheet, Pressable } from 'react-native';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';

interface SnippetCardProps {
  title: string;
  genre: string;
  synopsis: string;
  onEdit: () => void;
  onDelete: () => void;
}

export function SnippetCard({ title, genre, synopsis, onEdit, onDelete }: SnippetCardProps) {
  return (
    <ThemedView style={styles.card}>
      <ThemedView style={styles.header}>
        <ThemedText style={styles.title}>{title}</ThemedText>
        <ThemedView style={styles.actions}>
          <Pressable onPress={onEdit} style={styles.button}>
            <ThemedText style={styles.buttonText}>✏️</ThemedText>
          </Pressable>
          <Pressable onPress={onDelete} style={styles.button}>
            <ThemedText style={styles.buttonText}>🗑️</ThemedText>
          </Pressable>
        </ThemedView>
      </ThemedView>
      <ThemedText style={styles.genre}>{genre}</ThemedText>
      <ThemedText style={styles.synopsis}>{synopsis}</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginVertical: 10,
    width: '90%',
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
  title: {
    fontSize: 20,
    fontFamily: 'CourierPrime',
    color: '#000000',
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
  },
  button: {
    marginLeft: 10,
  },
  buttonText: {
    fontSize: 20,
  },
  genre: {
    fontSize: 14,
    fontFamily: 'CourierPrime',
    color: '#666666',
    marginBottom: 8,
  },
  synopsis: {
    fontSize: 16,
    fontFamily: 'CourierPrime',
    color: '#000000',
  },
}); 