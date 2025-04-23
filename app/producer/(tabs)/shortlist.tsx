import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Pressable, ActivityIndicator, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { auth, db } from '@/firebase';
import { collection, query, where, getDocs, addDoc, serverTimestamp, doc, deleteDoc } from 'firebase/firestore';
import { router, useLocalSearchParams } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

interface ShortlistedSnippet {
  id: string;
  snippetId: string;
  snippetData: {
    title: string;
    genre: string;
    synopsis: string;
    writerId: string;
  };
  timestamp: any;
}

export default function ShortlistScreen() {
  const { refresh } = useLocalSearchParams();
  const [snippets, setSnippets] = useState<ShortlistedSnippet[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchShortlistedSnippets = async () => {
    try {
      setIsLoading(true);
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      const shortlistsRef = collection(db, 'shortlists');
      const shortlistsQuery = query(
        shortlistsRef,
        where('producerId', '==', currentUser.uid)
      );

      const querySnapshot = await getDocs(shortlistsQuery);
      const fetchedSnippets = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ShortlistedSnippet[];

      // Sort snippets by timestamp
      fetchedSnippets.sort((a, b) => {
        const dateA = a.timestamp?.toDate() || new Date(0);
        const dateB = b.timestamp?.toDate() || new Date(0);
        return dateB.getTime() - dateA.getTime();
      });

      setSnippets(fetchedSnippets);
    } catch (error) {
      console.error('Error fetching shortlisted snippets:', error);
      Alert.alert('Error', 'Failed to fetch shortlisted snippets. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBurn = async (snippet: ShortlistedSnippet) => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      // Mark as burnt
      await addDoc(collection(db, 'producerInteractions'), {
        producerId: currentUser.uid,
        snippetId: snippet.snippetId,
        interactionType: 'burnt',
        timestamp: serverTimestamp()
      });

      // Remove from shortlist
      const shortlistRef = doc(db, 'shortlists', snippet.id);
      await deleteDoc(shortlistRef);

      // Refresh the list
      fetchShortlistedSnippets();
    } catch (error) {
      console.error('Error burning snippet:', error);
      Alert.alert('Error', 'Failed to burn snippet. Please try again.');
    }
  };

  const handleGreenlight = async (snippet: ShortlistedSnippet) => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      // Create message thread
      const threadRef = await addDoc(collection(db, 'messageThreads'), {
        producerId: currentUser.uid,
        writerId: snippet.snippetData.writerId,
        snippetId: snippet.snippetId,
        snippetPreview: {
          title: snippet.snippetData.title,
          genre: snippet.snippetData.genre,
          synopsis: snippet.snippetData.synopsis
        },
        createdAt: serverTimestamp(),
        lastMessageAt: serverTimestamp()
      });

      // Add to producer's messages
      await addDoc(collection(db, 'messages'), {
        threadId: threadRef.id,
        userId: currentUser.uid,
        type: 'producer',
        snippetId: snippet.snippetId,
        timestamp: serverTimestamp(),
        read: false
      });

      // Add to writer's messages
      await addDoc(collection(db, 'messages'), {
        threadId: threadRef.id,
        userId: snippet.snippetData.writerId,
        type: 'writer',
        snippetId: snippet.snippetId,
        timestamp: serverTimestamp(),
        read: false
      });

      // Mark as greenlit
      await addDoc(collection(db, 'producerInteractions'), {
        producerId: currentUser.uid,
        snippetId: snippet.snippetId,
        interactionType: 'greenlit',
        timestamp: serverTimestamp()
      });

      // Remove from shortlist
      const shortlistQuery = query(
        collection(db, 'shortlists'),
        where('producerId', '==', currentUser.uid),
        where('snippetId', '==', snippet.snippetId)
      );
      const shortlistSnapshot = await getDocs(shortlistQuery);
      const deletePromises = shortlistSnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);

      // Show success message and refresh shortlist
      Alert.alert(
        'Success',
        'Snippet greenlit! A new message thread has been created.',
        [
          {
            text: 'OK',
            onPress: () => {
              // Refresh the shortlist and messages stack
              fetchShortlistedSnippets();
              // Refresh messages stack in background
              router.push({
                pathname: '/producer/(tabs)/messages',
                params: { refresh: Date.now() }
              });
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error greenlighting snippet:', error);
      Alert.alert('Error', 'Failed to greenlight snippet. Please try again.');
    }
  };

  useEffect(() => {
    fetchShortlistedSnippets();
  }, [refresh]);

  if (isLoading) {
    return (
      <ThemedView style={styles.container}>
        <ActivityIndicator size="large" color="#000000" />
      </ThemedView>
    );
  }

  if (snippets.length === 0) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText style={styles.emptyMessage}>No shortlisted snippets yet.</ThemedText>
      </ThemedView>
    );
  }

  return (
    <FlatList
      style={styles.container}
      data={snippets}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <ThemedView style={styles.snippetContainer}>
          <ThemedText style={styles.title}>{item.snippetData.title}</ThemedText>
          <ThemedText style={styles.genre}>Genre: {item.snippetData.genre}</ThemedText>
          <ThemedText style={styles.synopsis}>{item.snippetData.synopsis}</ThemedText>
          
          <View style={styles.buttonContainer}>
            <Pressable
              style={[styles.button, styles.burnButton]}
              onPress={() => handleBurn(item)}
            >
              <FontAwesome name="fire" size={20} color="#FFFFFF" />
              <ThemedText style={[styles.buttonText, styles.burnButtonText]}>Burn</ThemedText>
            </Pressable>

            <Pressable
              style={[styles.button, styles.greenlightButton]}
              onPress={() => handleGreenlight(item)}
            >
              <FontAwesome name="lightbulb-o" size={20} color="#FFFFFF" />
              <ThemedText style={[styles.buttonText, styles.greenlightButtonText]}>Greenlight</ThemedText>
            </Pressable>
          </View>
        </ThemedView>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  snippetContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#000000',
  },
  genre: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 16,
  },
  synopsis: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
    color: '#333333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    gap: 12,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    minHeight: 48,
  },
  burnButton: {
    backgroundColor: '#FF4444',
  },
  greenlightButton: {
    backgroundColor: '#4CAF50',
  },
  buttonText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
  },
  burnButtonText: {
    color: '#FFFFFF',
  },
  greenlightButtonText: {
    color: '#FFFFFF',
  },
  emptyMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 40,
    color: '#666666',
  },
}); 