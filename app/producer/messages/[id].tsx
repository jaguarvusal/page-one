import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TextInput, Pressable, ActivityIndicator, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { auth, db } from '@/firebase';
import { collection, query, where, getDocs, addDoc, serverTimestamp, onSnapshot, deleteDoc, doc, getDoc } from 'firebase/firestore';
import { router, useLocalSearchParams, Stack } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

interface Message {
  id: string;
  text: string;
  senderId: string;
  timestamp: any;
}

export default function MessageThreadScreen() {
  const { id } = useLocalSearchParams<{ id: string }>(); // Ensure `id` is typed correctly
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [snippetTitle, setSnippetTitle] = useState('');

  useEffect(() => {
    const fetchThreadData = async () => {
      try {
        if (!id) {
          Alert.alert('Error', 'Invalid thread ID');
          router.back();
          return;
        }

        const threadDoc = await getDoc(doc(db, 'messageThreads', id));
        if (threadDoc.exists()) {
          const threadData = threadDoc.data();
          if (threadData.snippetId) {
            const snippetDoc = await getDoc(doc(db, 'snippets', threadData.snippetId));
            if (snippetDoc.exists()) {
              setSnippetTitle(snippetDoc.data().title || 'Untitled');
            }
          }
        } else {
          Alert.alert('Error', 'Thread not found');
          router.back();
        }
      } catch (error) {
        console.error('Error fetching thread data:', error);
        Alert.alert('Error', 'Failed to load thread data');
        router.back();
      }
    };

    fetchThreadData();

    if (!id) return; // Ensure `id` is valid before querying messages

    const messagesRef = collection(db, 'messages');
    const messagesQuery = query(
      messagesRef,
      where('threadId', '==', id)
    );

    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const fetchedMessages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Message[];

      // Filter out empty messages and sort by timestamp
      const filteredMessages = fetchedMessages.filter(msg => msg.text && msg.text.trim() !== '');
      filteredMessages.sort((a, b) => {
        const timeA = a.timestamp?.toDate?.() || new Date(0);
        const timeB = b.timestamp?.toDate?.() || new Date(0);
        return timeA.getTime() - timeB.getTime();
      });

      setMessages(filteredMessages);
      setIsLoading(false);
    }, (error) => {
      console.error('Error setting up messages:', error);
      Alert.alert('Error', 'Failed to load messages');
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [id]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        Alert.alert('Error', 'You must be logged in to send messages');
        return;
      }

      const messagesRef = collection(db, 'messages');
      await addDoc(messagesRef, {
        threadId: id,
        text: newMessage.trim(),
        senderId: currentUser.uid,
        timestamp: serverTimestamp()
      });

      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert('Error', 'Failed to send message. Please try again.');
    }
  };

  const handleDeleteThread = async () => {
    if (!id) return; // Ensure `id` is valid before attempting to delete

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
              await deleteDoc(doc(db, 'messageThreads', id));

              // Delete all messages in the thread
              const messagesQuery = query(
                collection(db, 'messages'),
                where('threadId', '==', id)
              );
              const messagesSnapshot = await getDocs(messagesQuery);
              const deletePromises = messagesSnapshot.docs.map(doc => deleteDoc(doc.ref));
              await Promise.all(deletePromises);

              // Navigate back to messages tab and force a refresh
              router.back();
              router.push({
                pathname: '/producer/(tabs)/messages',
                params: { refresh: Date.now() }
              });
            } catch (error) {
              Alert.alert('Error', 'Failed to delete the chat. Please try again.');
            }
          }
        }
      ]
    );
  };

  if (isLoading) {
    return (
      <ThemedView style={styles.container}>
        <ActivityIndicator size="large" color="#000000" />
      </ThemedView>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()}>
            <FontAwesome name="arrow-left" size={24} color="#000000" />
          </Pressable>
          <ThemedText style={styles.title}>{snippetTitle}</ThemedText>
          <Pressable onPress={handleDeleteThread}>
            <FontAwesome name="times" size={24} color="#FF4444" />
          </Pressable>
        </View>
      </View>
      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <View style={styles.contentContainer}>
          <FlatList
            data={messages}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <View style={[
                styles.messageContainer,
                item.senderId === auth.currentUser?.uid ? styles.sentMessage : styles.receivedMessage
              ]}>
                <ThemedText style={[
                  styles.messageText,
                  item.senderId === auth.currentUser?.uid ? styles.sentMessageText : styles.receivedMessageText
                ]}>{item.text}</ThemedText>
              </View>
            )}
            contentContainerStyle={styles.messagesList}
            keyboardShouldPersistTaps="handled"
          />
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={newMessage}
              onChangeText={setNewMessage}
              placeholder="Type a message..."
              multiline
            />
            <Pressable style={styles.sendButton} onPress={handleSendMessage}>
              <FontAwesome name="send" size={20} color="#FFFFFF" />
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  headerContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    marginTop: Platform.OS === 'ios' ? 40 : 0,
  },
  title: {
    fontSize: 16,
    fontFamily: 'CourierPrime',
    color: '#000000',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
  },
  messagesList: {
    flexGrow: 1,
    padding: 16,
    paddingBottom: 80,
  },
  messageContainer: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    marginBottom: 8,
  },
  sentMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#007AFF',
  },
  receivedMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#E0E0E0',
  },
  messageText: {
    fontSize: 16,
  },
  sentMessageText: {
    color: '#FFFFFF',
  },
  receivedMessageText: {
    color: '#000000',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  input: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#007AFF',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});