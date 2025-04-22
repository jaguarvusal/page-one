import { useState } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { MessageCard } from '@/components/MessageCard';
import ChatScreen from '@/components/ChatScreen';

interface Message {
  id: string;
  senderName: string;
  preview: string;
  timestamp: string;
}

export default function MessagesScreen() {
  const [selectedChat, setSelectedChat] = useState<Message | null>(null);
  const [messages] = useState<Message[]>([
    {
      id: '1',
      senderName: 'Emma Writer',
      preview: 'Thank you for your interest in "The Midnight Train"...',
      timestamp: '10:30 AM',
    },
    {
      id: '2',
      senderName: 'David Screenwriter',
      preview: 'I would love to discuss your feedback on my latest script...',
      timestamp: 'Yesterday',
    },
    {
      id: '3',
      senderName: 'Sophia Author',
      preview: 'Here are the revisions you requested for "Summer of 99"...',
      timestamp: '2 days ago',
    },
  ]);

  if (selectedChat) {
    return (
      <ChatScreen
        senderName={selectedChat.senderName}
        onBack={() => setSelectedChat(null)}
        userType="producer"
      />
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>Messages</ThemedText>
      <ScrollView style={styles.messagesList}>
        {messages.map((message) => (
          <MessageCard
            key={message.id}
            senderName={message.senderName}
            preview={message.preview}
            timestamp={message.timestamp}
            onPress={() => setSelectedChat(message)}
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
  title: {
    fontSize: 24,
    fontFamily: 'CourierPrime',
    color: '#000000',
    fontWeight: 'bold',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
  },
  messagesList: {
    flex: 1,
  },
}); 