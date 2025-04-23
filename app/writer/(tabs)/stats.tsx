import { StyleSheet, ScrollView } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { StatsCard } from '@/components/StatsCard';
import { auth, db } from '@/firebase';
import { collection, query, where, getDocs } from '@firebase/firestore';
import { useEffect, useState } from 'react';

interface Stats {
  totalSnippets: number;
  shortlistedSnippets: number;
  activeGreenlights: number;
}

export default function StatsScreen() {
  const [stats, setStats] = useState<Stats>({
    totalSnippets: 0,
    shortlistedSnippets: 0,
    activeGreenlights: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      // Fetch total snippets
      const snippetsQuery = query(
        collection(db, 'snippets'),
        where('writerId', '==', user.uid)
      );
      const snippetsSnapshot = await getDocs(snippetsQuery);
      const totalSnippets = snippetsSnapshot.size;

      // Fetch shortlisted snippets
      const shortlistedQuery = query(
        collection(db, 'snippets'),
        where('writerId', '==', user.uid),
        where('isShortlisted', '==', true)
      );
      const shortlistedSnapshot = await getDocs(shortlistedQuery);
      const shortlistedSnippets = shortlistedSnapshot.size;

      // Fetch active greenlights
      const greenlightsQuery = query(
        collection(db, 'greenlights'),
        where('writerId', '==', user.uid),
        where('isActive', '==', true)
      );
      const greenlightsSnapshot = await getDocs(greenlightsQuery);
      const activeGreenlights = greenlightsSnapshot.size;

      setStats({
        totalSnippets,
        shortlistedSnippets,
        activeGreenlights,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.header}>Your Stats</ThemedText>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <StatsCard 
          title="Total Snippets" 
          value={stats.totalSnippets.toString()} 
          icon="📝" 
        />
        <StatsCard 
          title="Shortlisted Snippets" 
          value={stats.shortlistedSnippets.toString()} 
          icon="⭐" 
        />
        <StatsCard 
          title="Active Greenlights" 
          value={stats.activeGreenlights.toString()} 
          icon="💚" 
        />
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    fontSize: 24,
    fontFamily: 'CourierPrime',
    color: '#000000',
    marginTop: 20,
    marginLeft: 20,
    marginBottom: 10,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    alignItems: 'center',
    paddingBottom: 20,
  },
}); 