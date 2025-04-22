import { useState } from 'react';
import { StyleSheet, ScrollView, Pressable } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { SnippetCard } from '@/components/SnippetCard';
import { SnippetForm } from '@/components/SnippetForm';

interface Snippet {
  id: string;
  title: string;
  genre: string;
  synopsis: string;
}

export default function SnippetsScreen() {
  const [snippets, setSnippets] = useState<Snippet[]>([
    {
      id: '1',
      title: 'The Midnight Train',
      genre: 'Thriller',
      synopsis: 'A mysterious train ride that changes everything...',
    },
    {
      id: '2',
      title: 'Summer of 99',
      genre: 'Drama',
      synopsis: 'A coming-of-age story set in a small coastal town...',
    },
  ]);

  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingSnippet, setEditingSnippet] = useState<Snippet | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    genre: '',
    synopsis: '',
  });

  const handleAddSnippet = () => {
    setIsFormVisible(true);
    setEditingSnippet(null);
    setFormData({ title: '', genre: '', synopsis: '' });
  };

  const handleEditSnippet = (snippet: Snippet) => {
    setIsFormVisible(true);
    setEditingSnippet(snippet);
    setFormData({
      title: snippet.title,
      genre: snippet.genre,
      synopsis: snippet.synopsis,
    });
  };

  const handleDeleteSnippet = (id: string) => {
    setSnippets(snippets.filter(snippet => snippet.id !== id));
  };

  const handleSubmit = () => {
    if (editingSnippet) {
      setSnippets(snippets.map(snippet =>
        snippet.id === editingSnippet.id
          ? { ...snippet, ...formData }
          : snippet
      ));
    } else {
      setSnippets([
        ...snippets,
        {
          id: Date.now().toString(),
          ...formData,
        },
      ]);
    }
    setIsFormVisible(false);
    setEditingSnippet(null);
    setFormData({ title: '', genre: '', synopsis: '' });
  };

  const handleCancel = () => {
    setIsFormVisible(false);
    setEditingSnippet(null);
    setFormData({ title: '', genre: '', synopsis: '' });
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText style={styles.title}>Your Snippets</ThemedText>
        <Pressable style={styles.addButton} onPress={handleAddSnippet}>
          <ThemedText style={styles.addButtonText}>+ New Snippet</ThemedText>
        </Pressable>
      </ThemedView>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {isFormVisible && (
          <SnippetForm
            title={formData.title}
            genre={formData.genre}
            synopsis={formData.synopsis}
            onTitleChange={(text) => setFormData({ ...formData, title: text })}
            onGenreChange={(text) => setFormData({ ...formData, genre: text })}
            onSynopsisChange={(text) => setFormData({ ...formData, synopsis: text })}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isEditing={!!editingSnippet}
          />
        )}

        {snippets.map(snippet => (
          <SnippetCard
            key={snippet.id}
            title={snippet.title}
            genre={snippet.genre}
            synopsis={snippet.synopsis}
            onEdit={() => handleEditSnippet(snippet)}
            onDelete={() => handleDeleteSnippet(snippet.id)}
          />
        ))}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontFamily: 'CourierPrime',
    color: '#000000',
  },
  addButton: {
    backgroundColor: '#000000',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'CourierPrime',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    alignItems: 'center',
    paddingBottom: 20,
  },
}); 