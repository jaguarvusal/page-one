import { useState, useEffect } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ProducerSnippetCard } from '@/components/ProducerSnippetCard';
import { router } from 'expo-router';
import { db } from '@/firebase';
import { collection, getDocs, query, where, updateDoc, doc } from 'firebase/firestore';

interface Snippet {
  id: string;
  title: string;
  genre: string;
  synopsis: string;
  writerId: string;
  status: 'available' | 'burned' | 'shortlisted' | 'greenlit';
}

export default function ExploreScreen() {
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [currentSnippet, setCurrentSnippet] = useState<Snippet | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAvailableSnippets();
  }, []);

  const fetchAvailableSnippets = async () => {
    try {
      const snippetsQuery = query(
        collection(db, 'snippets'),
        where('status', '==', 'available')
      );
      const querySnapshot = await getDocs(snippetsQuery);
      const availableSnippets = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Snippet[];
      
      setSnippets(availableSnippets);
      if (availableSnippets.length > 0) {
        setCurrentSnippet(availableSnippets[Math.floor(Math.random() * availableSnippets.length)]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch snippets. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getRandomSnippet = () => {
    if (snippets.length === 0) return null;
    return snippets[Math.floor(Math.random() * snippets.length)];
  };

  const handleAction = async (action: 'burn' | 'shortlist' | 'greenlight') => {
    if (!currentSnippet) return;

    try {
      const snippetRef = doc(db, 'snippets', currentSnippet.id);
      let newStatus: Snippet['status'] = 'available';

      switch (action) {
        case 'burn':
          newStatus = 'burned';
          break;
        case 'shortlist':
          newStatus = 'shortlisted';
          break;
        case 'greenlight':
          newStatus = 'greenlit';
          break;
      }

      await updateDoc(snippetRef, { status: newStatus });
      
      // Remove the current snippet from the available snippets
      setSnippets(prev => prev.filter(s => s.id !== currentSnippet.id));
      
      // Get a new random snippet
      const nextSnippet = getRandomSnippet();
      setCurrentSnippet(nextSnippet);

      if (action === 'greenlight') {
        router.push('/producer/messages');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update snippet status. Please try again.');
    }
  };

  const handleBurn = () => handleAction('burn');
  const handleShortlist = () => handleAction('shortlist');
  const handleGreenlight = () => handleAction('greenlight');

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ThemedText style={styles.title}>Loading...</ThemedText>
      </View>
    );
  }

  if (!currentSnippet) {
    return (
      <View style={styles.container}>
        <ThemedText style={styles.title}>No snippets available</ThemedText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ThemedText style={styles.title}>Explore Snippets</ThemedText>
      <View style={styles.cardContainer}>
        <ProducerSnippetCard
          key={currentSnippet.id}
          title={currentSnippet.title}
          genre={currentSnippet.genre}
          synopsis={currentSnippet.synopsis}
          onBurn={handleBurn}
          onShortlist={handleShortlist}
          onGreenlight={handleGreenlight}
        />
      </View>
    </View>
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
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
}); 