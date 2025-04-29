import React, { useState, useEffect } from 'react';
import { StyleSheet, FlatList, Pressable, ActivityIndicator, Alert, SafeAreaView } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { router, useLocalSearchParams } from 'expo-router';
import { db, auth } from '@/firebase';
import { collection, query, where, getDocs, deleteDoc, doc, getDoc } from 'firebase/firestore';
import { FontAwesome } from '@expo/vector-icons';

interface Thread {
  id: string;
  producerId: string;
  lastMessageAt: any;
  producerEmail?: string;
  lastMessage?: string;
}

export default function MessagesScreen() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);
  const { refresh } = useLocalSearchParams();

  const fetchThreads = async () => {
    try {
      setLoading(true);
      const currentUser = auth.currentUser;
      if (!currentUser) {
        Alert.alert('Error', 'You must be logged in to view messages');
        setLoading(false); // Ensure loading state is updated
        return;
      }

      const threadsQuery = query(
        collection(db, 'messageThreads'),
        where('writerId', '==', currentUser.uid)
      );
      const threadsSnapshot = await getDocs(threadsQuery);

      const threadsData = await Promise.all(
        threadsSnapshot.docs.map(async (threadDoc) => {
          const threadData = threadDoc.data() as {
            producerId: string;
            lastMessageAt: any;
          }; // Explicitly type the thread data

          // Fetch producer's email
          let producerEmail = 'Unknown';
          try {
            const producerRef = doc(db, 'users', threadData.producerId);
            const producerDoc = await getDoc(producerRef);
            if (producerDoc.exists()) {
              producerEmail = producerDoc.data().email || 'Unknown';
            }
          } catch (error) {
            console.error('Error fetching producer email:', error);
          }

          // Fetch last message
          let lastMessage = 'No messages yet';
          try {
            const messagesQuery = query(
              collection(db, 'messages'),
              where('threadId', '==', threadDoc.id)
            );
            const messagesSnapshot = await getDocs(messagesQuery);
            if (!messagesSnapshot.empty) {
              // Sort messages in memory
              const messages = messagesSnapshot.docs.map(doc => ({
                id: doc.id,
                ...(doc.data() as { text: string; timestamp: any }), // Explicitly type message data
              }));
              messages.sort((a, b) => {
                const timeA = a.timestamp?.toDate?.() || new Date(0);
                const timeB = b.timestamp?.toDate?.() || new Date(0);
                return timeB.getTime() - timeA.getTime();
              });
              lastMessage = messages[0].text || 'No messages yet';
            }
          } catch (error) {
            console.error('Error fetching last message:', error);
          }

          return {
            id: threadDoc.id,
            producerId: threadData.producerId,
            lastMessageAt: threadData.lastMessageAt,
            producerEmail,
            lastMessage,
          };
        })
      );

      // Sort threads by lastMessageAt in descending order
      threadsData.sort((a, b) => {
        const dateA = a.lastMessageAt?.toDate?.() || new Date(0);
        const dateB = b.lastMessageAt?.toDate?.() || new Date(0);
        return dateB.getTime() - dateA.getTime();
      });

      setThreads(threadsData);
    } catch (error) {
      console.error('Error fetching threads:', error);
      Alert.alert('Error', 'Failed to load messages. Please try again.');
    } finally {
      setLoading(false); // Ensure loading state is updated
    }
  };

  useEffect(() => {
    fetchThreads();
  }, [refresh]);

  const handleDeleteThread = async (threadId: string) => {
    Alert.alert(
      'Delete Chat',
      'Are you sure you want to delete this chat?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
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

              // Refresh the threads list
              fetchThreads();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete the chat. Please try again.');
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <ActivityIndicator size="large" color="#000000" />
      </ThemedView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ThemedView style={styles.container}>
        <FlatList
          data={threads}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Pressable
              style={styles.threadItem}
              onPress={() => router.push(`/writer/messages/${item.id}`)}
            >
              <ThemedView style={styles.threadContent}>
                <ThemedText style={styles.threadTitle}>
                  {item.producerEmail}
                </ThemedText>
                <ThemedText style={styles.threadPreview}>
                  {item.lastMessage}
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
          ListEmptyComponent={
            <ThemedView style={styles.emptyContainer}>
              <ThemedText style={styles.emptyText}>No messages yet</ThemedText>
            </ThemedView>
          }
        />
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  threadItem: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    alignItems: 'center',
  },
  threadContent: {
    flex: 1,
  },
  threadTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  threadPreview: {
    fontSize: 14,
    color: '#666666',
  },
  deleteButton: {
    padding: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666666',
  },
});