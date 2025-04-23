import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { auth, db } from '@/firebase';
import { collection, query, where, getDocs, addDoc, doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
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
}

export default function ExploreScreen() {
  const [currentSnippet, setCurrentSnippet] = useState<Snippet | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [noMoreSnippets, setNoMoreSnippets] = useState(false);

  const fetchRandomSnippet = async () => {
    try {
      setIsLoading(true);
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      // Get all snippets
      const snippetsRef = collection(db, 'snippets');
      const snippetsSnapshot = await getDocs(snippetsRef);
      
      // Get producer's previous interactions
      const interactionsRef = collection(db, 'producerInteractions');
      const interactionsQuery = query(
        interactionsRef,
        where('producerId', '==', currentUser.uid)
      );
      const interactionsSnapshot = await getDocs(interactionsQuery);
      
      // Get IDs of snippets the producer has already interacted with
      const interactedSnippetIds = interactionsSnapshot.docs.map(doc => doc.data().snippetId);
      
      // Filter out snippets created by the producer and already interacted with
      const availableSnippets = snippetsSnapshot.docs
        .filter(doc => {
          const data = doc.data();
          return data.writerId !== currentUser.uid && !interactedSnippetIds.includes(doc.id);
        })
        .map(doc => ({ id: doc.id, ...doc.data() } as Snippet));

      if (availableSnippets.length === 0) {
        setNoMoreSnippets(true);
        setCurrentSnippet(null);
        return;
      }

      // Select a random snippet
      const randomIndex = Math.floor(Math.random() * availableSnippets.length);
      setCurrentSnippet(availableSnippets[randomIndex]);
      setNoMoreSnippets(false);
    } catch (error) {
      console.error('Error fetching snippet:', error);
      Alert.alert('Error', 'Failed to fetch snippet. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleShortlist = async () => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser || !currentSnippet) return;

      // Save to shortlist
      await addDoc(collection(db, 'shortlists'), {
        producerId: currentUser.uid,
        snippetId: currentSnippet.id,
        timestamp: serverTimestamp(),
        snippetData: {
          title: currentSnippet.title,
          genre: currentSnippet.genre,
          synopsis: currentSnippet.synopsis,
          writerId: currentSnippet.writerId
        }
      });

      // Mark as viewed
      await addDoc(collection(db, 'producerInteractions'), {
        producerId: currentUser.uid,
        snippetId: currentSnippet.id,
        interactionType: 'viewed',
        timestamp: serverTimestamp()
      });

      // Show success message and fetch next snippet
      Alert.alert(
        'Success',
        'Snippet added to shortlist!',
        [
          {
            text: 'OK',
            onPress: () => {
              // Fetch next snippet
              fetchRandomSnippet();
              // Refresh shortlist in background
              router.push({
                pathname: '/producer/(tabs)/shortlist',
                params: { refresh: Date.now() }
              });
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error shortlisting snippet:', error);
      Alert.alert('Error', 'Failed to shortlist snippet. Please try again.');
    }
  };

  const handleBurn = async () => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser || !currentSnippet) return;

      // Mark as burnt
      await addDoc(collection(db, 'producerInteractions'), {
        producerId: currentUser.uid,
        snippetId: currentSnippet.id,
        interactionType: 'burnt',
        timestamp: serverTimestamp()
      });

      // Fetch new snippet
      await fetchRandomSnippet();
    } catch (error) {
      console.error('Error burning snippet:', error);
      Alert.alert('Error', 'Failed to burn snippet. Please try again.');
    }
  };

  const handleGreenlight = async () => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser || !currentSnippet) return;

      // Create message thread
      const threadRef = await addDoc(collection(db, 'messageThreads'), {
        producerId: currentUser.uid,
        writerId: currentSnippet.writerId,
        snippetId: currentSnippet.id,
        snippetPreview: {
          title: currentSnippet.title,
          genre: currentSnippet.genre,
          synopsis: currentSnippet.synopsis
        },
        createdAt: serverTimestamp(),
        lastMessageAt: serverTimestamp()
      });

      // Add to producer's messages
      await addDoc(collection(db, 'messages'), {
        threadId: threadRef.id,
        userId: currentUser.uid,
        type: 'producer',
        snippetId: currentSnippet.id,
        timestamp: serverTimestamp(),
        read: false
      });

      // Add to writer's messages
      await addDoc(collection(db, 'messages'), {
        threadId: threadRef.id,
        userId: currentSnippet.writerId,
        type: 'writer',
        snippetId: currentSnippet.id,
        timestamp: serverTimestamp(),
        read: false
      });

      // Mark as greenlit
      await addDoc(collection(db, 'producerInteractions'), {
        producerId: currentUser.uid,
        snippetId: currentSnippet.id,
        interactionType: 'greenlit',
        timestamp: serverTimestamp()
      });

      // Show success message and fetch next snippet
      Alert.alert(
        'Success',
        'Snippet greenlit! A new message thread has been created.',
        [
          {
            text: 'OK',
            onPress: () => {
              // Fetch next snippet and refresh messages stack
              fetchRandomSnippet();
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
    fetchRandomSnippet();
  }, []);

  if (isLoading) {
    return (
      <ThemedView style={styles.container}>
        <ActivityIndicator size="large" color="#000000" />
      </ThemedView>
    );
  }

  if (noMoreSnippets) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText style={styles.endMessage}>End of Reel. No more snippets.</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {currentSnippet && (
        <ThemedView style={styles.snippetContainer}>
          <ThemedText style={styles.title}>{currentSnippet.title}</ThemedText>
          <ThemedText style={styles.genre}>Genre: {currentSnippet.genre}</ThemedText>
          
          <ThemedText style={styles.sectionTitle}>Synopsis</ThemedText>
          <ThemedText style={styles.content}>{currentSnippet.synopsis}</ThemedText>
          
          <ThemedText style={styles.sectionTitle}>Hook</ThemedText>
          <ThemedText style={styles.content}>{currentSnippet.hook}</ThemedText>
          
          <ThemedText style={styles.sectionTitle}>Plot Summary</ThemedText>
          <ThemedText style={styles.content}>{currentSnippet.plotSummary}</ThemedText>
          
          <ThemedText style={styles.sectionTitle}>Best Scene</ThemedText>
          <ThemedText style={styles.content}>{currentSnippet.bestScene}</ThemedText>

          <View style={styles.buttonContainer}>
            <Pressable
              style={[styles.button, styles.burnButton]}
              onPress={handleBurn}
            >
              <FontAwesome name="fire" size={20} color="#FFFFFF" />
              <ThemedText style={[styles.buttonText, styles.burnButtonText]}>Burn</ThemedText>
            </Pressable>

            <Pressable
              style={[styles.button, styles.shortlistButton]}
              onPress={handleShortlist}
            >
              <FontAwesome name="bookmark" size={20} color="#000000" />
              <ThemedText style={[styles.buttonText, styles.shortlistButtonText]}>Shortlist</ThemedText>
            </Pressable>

            <Pressable
              style={[styles.button, styles.greenlightButton]}
              onPress={handleGreenlight}
            >
              <FontAwesome name="lightbulb-o" size={20} color="#FFFFFF" />
              <ThemedText style={[styles.buttonText, styles.greenlightButtonText]}>Greenlight</ThemedText>
            </Pressable>
          </View>
        </ThemedView>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 16,
  },
  snippetContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
    color: '#000000',
  },
  content: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
    color: '#333333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
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
  shortlistButton: {
    backgroundColor: '#FFB74D',
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
  shortlistButtonText: {
    color: '#000000',
  },
  greenlightButtonText: {
    color: '#FFFFFF',
  },
  endMessage: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 40,
    color: '#666666',
  },
}); 