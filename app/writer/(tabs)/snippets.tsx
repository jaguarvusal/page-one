import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, TextInput, ScrollView, Pressable, Alert, Keyboard, TouchableWithoutFeedback, KeyboardAvoidingView, Platform, Animated } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { auth, db } from '@/firebase';
import { collection, addDoc, query, where, getDocs, deleteDoc, doc, updateDoc } from '@firebase/firestore';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';

interface Snippet {
  id: string;
  title: string;
  synopsis: string;
  genre: string;
  hook: string;
  plotSummary: string;
  bestScene: string;
  writerId: string;
  createdAt: any;
}

export default function SnippetsScreen() {
  const [title, setTitle] = useState('');
  const [synopsis, setSynopsis] = useState('');
  const [genre, setGenre] = useState('');
  const [hook, setHook] = useState('');
  const [plotSummary, setPlotSummary] = useState('');
  const [bestScene, setBestScene] = useState('');
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingSnippet, setEditingSnippet] = useState<Snippet | null>(null);
  const keyboardHeight = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const keyboardWillShowListener = Keyboard.addListener(
      'keyboardWillShow',
      (event) => {
        Animated.timing(keyboardHeight, {
          toValue: event.endCoordinates.height,
          duration: 250,
          useNativeDriver: false,
        }).start();
      }
    );

    const keyboardWillHideListener = Keyboard.addListener(
      'keyboardWillHide',
      () => {
        Animated.timing(keyboardHeight, {
          toValue: 0,
          duration: 250,
          useNativeDriver: false,
        }).start();
      }
    );

    return () => {
      keyboardWillShowListener.remove();
      keyboardWillHideListener.remove();
    };
  }, []);

  useEffect(() => {
    fetchSnippets();
  }, []);

  const fetchSnippets = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const snippetsQuery = query(
        collection(db, 'snippets'),
        where('writerId', '==', user.uid)
      );

      const querySnapshot = await getDocs(snippetsQuery);
      const fetchedSnippets = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Snippet[];

      // Sort snippets by createdAt in memory
      fetchedSnippets.sort((a, b) => {
        const dateA = a.createdAt?.toDate?.() || new Date(0);
        const dateB = b.createdAt?.toDate?.() || new Date(0);
        return dateB.getTime() - dateA.getTime();
      });

      setSnippets(fetchedSnippets);
    } catch (error) {
      console.error('Error fetching snippets:', error);
      setSnippets([]);
    }
  };

  const handleEdit = (snippet: Snippet) => {
    setEditingSnippet(snippet);
    setTitle(snippet.title);
    setGenre(snippet.genre);
    setSynopsis(snippet.synopsis);
    setHook(snippet.hook);
    setPlotSummary(snippet.plotSummary);
    setBestScene(snippet.bestScene);
    setIsFormVisible(true);
  };

  const handleDelete = async (snippetId: string) => {
    Alert.alert(
      'Delete Snippet',
      'Are you sure you want to delete this snippet?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'snippets', snippetId));
              await fetchSnippets();
              
              // Refresh stats
              router.push({
                pathname: '/writer/(tabs)/stats',
                params: { refresh: Date.now() }
              });
              
              Alert.alert('Success', 'Snippet deleted successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete snippet');
            }
          },
        },
      ]
    );
  };

  const handleSubmit = async () => {
    if (!title || !synopsis || !genre || !hook || !plotSummary || !bestScene) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('User not authenticated');

      if (editingSnippet) {
        // Update existing snippet
        await updateDoc(doc(db, 'snippets', editingSnippet.id), {
          title,
          synopsis,
          genre,
          hook,
          plotSummary,
          bestScene,
        });
      } else {
        // Create new snippet
        await addDoc(collection(db, 'snippets'), {
          title,
          synopsis,
          genre,
          hook,
          plotSummary,
          bestScene,
          writerId: user.uid,
          createdAt: new Date(),
        });
      }

      // Clear form
      setTitle('');
      setSynopsis('');
      setGenre('');
      setHook('');
      setPlotSummary('');
      setBestScene('');
      setEditingSnippet(null);
      setIsFormVisible(false);

      // Refresh snippets list
      await fetchSnippets();

      // Refresh stats
      router.push({
        pathname: '/writer/(tabs)/stats',
        params: { refresh: Date.now() }
      });

      Alert.alert('Success', `Snippet ${editingSnippet ? 'updated' : 'created'} successfully`);
    } catch (error) {
      Alert.alert('Error', `Failed to ${editingSnippet ? 'update' : 'create'} snippet`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView 
          style={styles.container}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          contentContainerStyle={styles.scrollContent}
        >
          {!isFormVisible ? (
            <ThemedView style={styles.emptyStateContainer}>
              {snippets.length === 0 ? (
                <>
                  <ThemedText style={styles.emptyStateText}>
                    You haven't created any snippets yet
                  </ThemedText>
                  <Pressable 
                    style={styles.newSnippetButton}
                    onPress={() => setIsFormVisible(true)}
                  >
                    <ThemedText style={styles.newSnippetButtonText}>
                      + New Snippet
                    </ThemedText>
                  </Pressable>
                </>
              ) : (
                <>
                  <ThemedView style={styles.snippetsContainer}>
                    {snippets.map(snippet => (
                      <ThemedView key={snippet.id} style={styles.snippetCard}>
                        <ThemedText style={styles.snippetTitle}>{snippet.title}</ThemedText>
                        <ThemedText style={styles.snippetGenre}>{snippet.genre}</ThemedText>
                        <ThemedText style={styles.snippetSynopsis}>{snippet.synopsis}</ThemedText>
                        <ThemedView style={styles.snippetActions}>
                          <Pressable 
                            style={styles.actionButton}
                            onPress={() => handleEdit(snippet)}
                          >
                            <FontAwesome name="edit" size={20} color="#000000" />
                          </Pressable>
                          <Pressable 
                            style={styles.actionButton}
                            onPress={() => handleDelete(snippet.id)}
                          >
                            <FontAwesome name="trash" size={20} color="#000000" />
                          </Pressable>
                        </ThemedView>
                      </ThemedView>
                    ))}
                  </ThemedView>
                  <Pressable 
                    style={styles.newSnippetButton}
                    onPress={() => setIsFormVisible(true)}
                  >
                    <ThemedText style={styles.newSnippetButtonText}>
                      + New Snippet
                    </ThemedText>
                  </Pressable>
                </>
              )}
            </ThemedView>
          ) : (
            <ThemedView style={styles.formContainer}>
              <ThemedText style={styles.title}>
                {editingSnippet ? 'Edit Snippet' : 'New Snippet'}
              </ThemedText>
              
              <ThemedText style={styles.label}>Title</ThemedText>
              <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
                selectionColor="#000000"
                blurOnSubmit={false}
                returnKeyType="next"
                keyboardType="default"
                textContentType="none"
                autoCapitalize="none"
                autoCorrect={false}
              />
              
              <ThemedText style={styles.label}>Genre</ThemedText>
              <TextInput
                style={styles.input}
                value={genre}
                onChangeText={setGenre}
                selectionColor="#000000"
                blurOnSubmit={false}
                returnKeyType="next"
                keyboardType="default"
                textContentType="none"
                autoCapitalize="none"
                autoCorrect={false}
              />
              
              <ThemedText style={styles.label}>Synopsis</ThemedText>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={synopsis}
                onChangeText={setSynopsis}
                multiline
                numberOfLines={4}
                selectionColor="#000000"
                blurOnSubmit={false}
                returnKeyType="next"
                keyboardType="default"
                textContentType="none"
                autoCapitalize="none"
                autoCorrect={false}
              />
              
              <ThemedText style={styles.label}>Hook</ThemedText>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={hook}
                onChangeText={setHook}
                multiline
                numberOfLines={4}
                selectionColor="#000000"
                blurOnSubmit={false}
                returnKeyType="next"
                keyboardType="default"
                textContentType="none"
                autoCapitalize="none"
                autoCorrect={false}
              />
              
              <ThemedText style={styles.label}>Plot Summary</ThemedText>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={plotSummary}
                onChangeText={setPlotSummary}
                multiline
                numberOfLines={4}
                selectionColor="#000000"
                blurOnSubmit={false}
                returnKeyType="next"
                keyboardType="default"
                textContentType="none"
                autoCapitalize="none"
                autoCorrect={false}
              />
              
              <ThemedText style={styles.label}>Best Scene</ThemedText>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={bestScene}
                onChangeText={setBestScene}
                multiline
                numberOfLines={4}
                selectionColor="#000000"
                blurOnSubmit={false}
                returnKeyType="done"
                keyboardType="default"
                textContentType="none"
                autoCapitalize="none"
                autoCorrect={false}
              />

              <Pressable 
                style={styles.submitButton}
                onPress={handleSubmit}
                disabled={isLoading}
              >
                <ThemedText style={styles.submitButtonText}>
                  {isLoading ? 'Saving...' : (editingSnippet ? 'Update Snippet' : 'Create Snippet')}
                </ThemedText>
              </Pressable>

              <Pressable 
                style={styles.cancelButton}
                onPress={() => {
                  setEditingSnippet(null);
                  setIsFormVisible(false);
                  setTitle('');
                  setSynopsis('');
                  setGenre('');
                  setHook('');
                  setPlotSummary('');
                  setBestScene('');
                  Keyboard.dismiss();
                }}
              >
                <ThemedText style={styles.cancelButtonText}>Cancel</ThemedText>
              </Pressable>
            </ThemedView>
          )}
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: Platform.OS === 'ios' ? 40 : 0,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 20,
  },
  emptyStateContainer: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateText: {
    fontSize: 18,
    fontFamily: 'CourierPrime',
    color: '#666666',
    textAlign: 'center',
    marginBottom: 20,
  },
  newSnippetButton: {
    backgroundColor: '#000000',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  newSnippetButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'CourierPrime',
  },
  formContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: 'CourierPrime',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontFamily: 'CourierPrime',
    marginBottom: 8,
    color: '#000000',
  },
  input: {
    backgroundColor: '#F5F5DC',
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontFamily: 'CourierPrime',
    fontSize: 16,
    color: '#000000',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#000000',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'CourierPrime',
  },
  cancelButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#000000',
  },
  cancelButtonText: {
    color: '#000000',
    fontSize: 16,
    fontFamily: 'CourierPrime',
  },
  snippetsContainer: {
    width: '100%',
    marginBottom: 20,
  },
  snippetCard: {
    backgroundColor: '#F5F5DC',
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  snippetTitle: {
    fontSize: 18,
    fontFamily: 'CourierPrime',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  snippetGenre: {
    fontSize: 14,
    fontFamily: 'CourierPrime',
    color: '#666666',
    marginBottom: 8,
  },
  snippetSynopsis: {
    fontSize: 14,
    fontFamily: 'CourierPrime',
    marginBottom: 16,
  },
  snippetActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 16,
  },
  actionButton: {
    padding: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#000000',
  },
}); 