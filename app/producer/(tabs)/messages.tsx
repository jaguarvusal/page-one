import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Pressable, ActivityIndicator, Alert, RefreshControl } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { auth, db } from '@/firebase';
import { collection, query, where, getDocs, deleteDoc, doc, orderBy } from 'firebase/firestore';
import { router, useLocalSearchParams } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

interface MessageThread {
  id: string;
  snippetPreview: {
    title: string;
    genre: string;
    synopsis: string;
  };
  lastMessageAt: any;
  writerId: string;
}

export default function MessagesScreen() {
  const { refresh } = useLocalSearchParams();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [threads, setThreads] = useState<MessageThread[]>([]);

  const fetchMessageThreads = async () => {
    try {
      const threadsQuery = query(
        collection(db, 'messageThreads'),
        where('producerId', '==', auth.currentUser?.uid)
      );
      const querySnapshot = await getDocs(threadsQuery);
      const fetchedThreads = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as MessageThread[];
      
      // Sort threads by lastMessageAt
      fetchedThreads.sort((a, b) => {
        const dateA = a.lastMessageAt?.toDate() || new Date(0);
        const dateB = b.lastMessageAt?.toDate() || new Date(0);
        return dateB.getTime() - dateA.getTime();
      });
      
      setThreads(fetchedThreads);
    } catch (error) {
      console.error('Error fetching message threads:', error);
      Alert.alert('Error', 'Failed to load messages. Please try again.');
    } finally {
      setIsRefreshing(false);
    }
  };

  const onRefresh = React.useCallback(() => {
    setIsRefreshing(true);
    fetchMessageThreads();
  }, []);

  useEffect(() => {
    fetchMessageThreads();
  }, [refresh]);

  const handleDeleteThread = async (threadId: string) => {
    try {
      // Delete the message thread
      await deleteDoc(doc(db, 'messageThreads', threadId));
      
      // Delete all messages in the thread
      const messagesQuery = query(
        collection(db, 'messages'),
        where('threadId', '==', threadId)
      );
      const messagesSnapshot = await getDocs(messagesQuery);
      const deletePromises = messagesSnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);

      // Refresh the list
      await fetchMessageThreads();
      
      // Navigate back to messages list
      router.push('/producer/(tabs)/messages?refresh=' + Date.now());
    } catch (error) {
      console.error('Error deleting thread:', error);
      Alert.alert('Error', 'Failed to delete the chat. Please try again.');
    }
  };

  if (threads.length === 0) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText style={styles.emptyMessage}>No messages yet.</ThemedText>
      </ThemedView>
    );
  }

  return (
    <FlatList
      style={styles.container}
      data={threads}
      keyExtractor={item => item.id}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={onRefresh}
          tintColor="#000000"
        />
      }
      renderItem={({ item }) => (
        <Pressable
          style={styles.threadContainer}
          onPress={() => router.push(`/producer/messages/${item.id}`)}
        >
          <ThemedView style={styles.threadContent}>
            <ThemedText style={styles.snippetTitle}>{item.snippetPreview.title}</ThemedText>
            <ThemedText style={styles.genre}>Genre: {item.snippetPreview.genre}</ThemedText>
            <ThemedText style={styles.synopsis} numberOfLines={2}>
              {item.snippetPreview.synopsis}
            </ThemedText>
          </ThemedView>
          <Pressable
            style={styles.deleteButton}
            onPress={() => handleDeleteThread(item.id)}
          >
            <FontAwesome name="times" size={20} color="#FF0000" />
          </Pressable>
        </Pressable>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  threadContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginBottom: 1,
  },
  threadContent: {
    flex: 1,
    marginRight: 16,
  },
  snippetTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#000000',
  },
  genre: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  },
  synopsis: {
    fontSize: 14,
    color: '#333333',
    lineHeight: 20,
  },
  deleteButton: {
    padding: 8,
  },
  emptyMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 40,
    color: '#666666',
  },
}); 