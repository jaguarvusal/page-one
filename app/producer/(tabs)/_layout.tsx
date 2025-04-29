import { Tabs } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { auth, db } from '@/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';

export default function ProducerLayout() {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!auth.currentUser) return; // Ensure the user is authenticated

    const messagesQuery = query(
      collection(db, 'messages'),
      where('userId', '==', auth.currentUser.uid),
      where('read', '==', false)
    );

    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      setUnreadCount(snapshot.size);
    });

    return () => unsubscribe(); // Properly unsubscribe from the snapshot listener
  }, []);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#000000',
        tabBarInactiveTintColor: '#666666',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#E5E5E5',
        },
        headerStyle: {
          backgroundColor: '#FFFFFF',
        },
        headerTintColor: '#000000',
        headerTitleStyle: {
          fontFamily: 'CourierPrime',
          fontWeight: 'bold',
        },
      }}>
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => (
            <FontAwesome name="search" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="shortlist"
        options={{
          title: 'Shortlist',
          tabBarIcon: ({ color }) => (
            <FontAwesome name="bookmark" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: 'Messages',
          tabBarIcon: ({ color }) => (
            <FontAwesome name="envelope" size={24} color={color} />
          ),
          tabBarBadge: unreadCount > 0 ? unreadCount : undefined,
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: 'More',
          tabBarIcon: ({ color }) => (
            <FontAwesome name="ellipsis-h" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}