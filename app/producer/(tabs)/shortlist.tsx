import { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, Pressable } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { FontAwesome } from '@expo/vector-icons';

interface Snippet {
  id: string;
  title: string;
  genre: string;
  synopsis: string;
}

export default function ShortlistScreen() {
  const [shortlistedSnippets, setShortlistedSnippets] = useState<Snippet[]>([]);

  // Load shortlisted snippets from storage when component mounts
  useEffect(() => {
    // TODO: Load from actual storage
    const savedSnippets: Snippet[] = [
      {
        id: '1',
        title: 'The Midnight Train',
        genre: 'Thriller',
        synopsis: 'A mysterious train ride that changes everything. When a group of strangers find themselves on a train with no memory of how they got there, they must work together to uncover the truth before their time runs out.',
      },
      {
        id: '2',
        title: 'Summer of 99',
        genre: 'Drama',
        synopsis: 'A coming-of-age story set in a small coastal town. As the last summer of the millennium approaches, a group of teenagers discover love, loss, and the meaning of friendship.',
      },
    ];
    setShortlistedSnippets(savedSnippets);
  }, []);

  const handleRemoveSnippet = (id: string) => {
    setShortlistedSnippets(shortlistedSnippets.filter(snippet => snippet.id !== id));
    // TODO: Save to storage
  };

  return (
    <ScrollView style={styles.container}>
      <ThemedText style={styles.title}>Shortlisted Snippets</ThemedText>
      {shortlistedSnippets.length === 0 ? (
        <ThemedView style={styles.emptyState}>
          <ThemedText style={styles.emptyStateText}>No snippets in your shortlist yet</ThemedText>
        </ThemedView>
      ) : (
        shortlistedSnippets.map((snippet) => (
          <ThemedView key={snippet.id} style={styles.snippetCard}>
            <ThemedView style={styles.cardHeader}>
              <ThemedView style={styles.titleContainer}>
                <ThemedText style={styles.snippetTitle}>{snippet.title}</ThemedText>
                <ThemedView style={styles.genreContainer}>
                  <ThemedText style={styles.genre}>{snippet.genre}</ThemedText>
                </ThemedView>
              </ThemedView>
              <Pressable 
                style={styles.removeButton}
                onPress={() => handleRemoveSnippet(snippet.id)}
              >
                <FontAwesome name="trash" size={20} color="#000000" />
              </Pressable>
            </ThemedView>
            <ThemedText style={styles.synopsis}>{snippet.synopsis}</ThemedText>
          </ThemedView>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 24,
    fontFamily: 'CourierPrime',
    color: '#000000',
    fontWeight: 'bold',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyStateText: {
    fontSize: 16,
    fontFamily: 'CourierPrime',
    color: '#666666',
    textAlign: 'center',
  },
  snippetCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    margin: 16,
    marginTop: 0,
    borderWidth: 1,
    borderColor: '#000000',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleContainer: {
    flex: 1,
    marginRight: 16,
  },
  snippetTitle: {
    fontSize: 20,
    fontFamily: 'CourierPrime',
    color: '#000000',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  genreContainer: {
    backgroundColor: '#F5F5DC',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#000000',
    alignSelf: 'flex-start',
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
  },
  removeButton: {
    padding: 8,
  },
}); 