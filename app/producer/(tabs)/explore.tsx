import { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ProducerSnippetCard } from '@/components/ProducerSnippetCard';
import { router } from 'expo-router';

interface Snippet {
  id: string;
  title: string;
  genre: string;
  synopsis: string;
}

export default function ExploreScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [snippets] = useState<Snippet[]>([
    {
      id: '1',
      title: 'The Midnight Train',
      genre: 'Thriller',
      synopsis: 'A mysterious train ride that changes everything. When a group of strangers find themselves on a train with no memory of how they got there, they must work together to uncover the truth before their time runs out.',
    },
    {
      id: '2',
      title: 'Summer of 99',
      genre: 'Drama',
      synopsis: 'A coming-of-age story set in a small coastal town. As the last summer of the millennium approaches, a group of teenagers discover love, loss, and the meaning of friendship.',
    },
    {
      id: '3',
      title: 'Echoes in the Dark',
      genre: 'Horror',
      synopsis: 'A paranormal investigator is called to a remote mansion where the walls seem to whisper secrets. As she delves deeper, she realizes the house is alive, and it wants her to stay forever.',
    },
  ]);

  const handleAction = () => {
    if (currentIndex < snippets.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Handle end of snippets
      setCurrentIndex(0);
    }
  };

  const handleBurn = () => {
    console.log('Burning snippet:', snippets[currentIndex].id);
    handleAction();
  };

  const handleShortlist = () => {
    // Save to shortlist
    const shortlistedSnippets = JSON.parse(localStorage.getItem('shortlistedSnippets') || '[]');
    shortlistedSnippets.push(snippets[currentIndex]);
    localStorage.setItem('shortlistedSnippets', JSON.stringify(shortlistedSnippets));
    handleAction();
  };

  const handleGreenlight = () => {
    console.log('Greenlighting snippet:', snippets[currentIndex].id);
    router.push('/producer/messages');
  };

  return (
    <View style={styles.container}>
      <ThemedText style={styles.title}>Explore Snippets</ThemedText>
      <View style={styles.cardContainer}>
        <ProducerSnippetCard
          key={snippets[currentIndex].id}
          title={snippets[currentIndex].title}
          genre={snippets[currentIndex].genre}
          synopsis={snippets[currentIndex].synopsis}
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