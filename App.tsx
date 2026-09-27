import React, { useState } from 'react';
import { StatusBar } from 'react-native';
import { demoMatches } from './src/data/demoMatches';
import type { SportMatch } from './src/domain/matches';
import LiveSportsScreen from './src/screens/LiveSportsScreen';
import MatchOverlayScreen from './src/screens/MatchOverlayScreen';

export default function App() {
  const [watching, setWatching] = useState<SportMatch | null>(null);

  return (
    <>
      <StatusBar backgroundColor="#07111F" barStyle="light-content" />
      {watching ? (
        <MatchOverlayScreen
          match={watching}
          onBack={() => setWatching(null)}
        />
      ) : (
        <LiveSportsScreen matches={demoMatches} onWatch={setWatching} />
      )}
    </>
  );
}
