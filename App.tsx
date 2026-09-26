import React from 'react';
import { StatusBar } from 'react-native';
import { demoMatches } from './src/data/demoMatches';
import LiveSportsScreen from './src/screens/LiveSportsScreen';

export default function App() {
  return (
    <>
      <StatusBar backgroundColor="#07111F" barStyle="light-content" />
      <LiveSportsScreen matches={demoMatches} />
    </>
  );
}
