import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { SportMatch } from '../domain/matches';
import {
  YOUTUBE_DEMO_ID,
  youtubeEmbedUrl,
  scoreLine,
  type VideoSource,
} from './videoSource';

type MatchOverlayScreenProps = {
  match: SportMatch;
  source?: VideoSource;
  onBack: () => void;
};

// Web build: react-native-webview has no web implementation, so embed the
// YouTube player with a plain fullscreen iframe. Overlay stays identical.
export default function MatchOverlayScreen({
  match,
  source = { type: 'youtube', videoId: YOUTUBE_DEMO_ID },
  onBack,
}: MatchOverlayScreenProps) {
  const [overlayVisible, setOverlayVisible] = useState(true);
  const videoUri =
    source.type === 'youtube' ? youtubeEmbedUrl(source.videoId) : source.uri;

  return (
    <View style={styles.screen}>
      {React.createElement('iframe', {
        src: videoUri,
        style: { position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 },
        allow: 'autoplay; encrypted-media; fullscreen; picture-in-picture',
        allowFullScreen: true,
        title: `${match.homeTeam.name} vs ${match.awayTeam.name}`,
        testID: 'youtube-iframe',
      })}

      {overlayVisible ? (
        <View style={styles.overlay} pointerEvents="box-none">
          <View style={styles.scoreBug} testID="overlay-score-bug" pointerEvents="none">
            {match.status === 'live' ? <View style={styles.liveDot} /> : null}
            <Text style={styles.scoreBugText}>
              {scoreLine(match)}
              {match.period ? `  ·  ${match.period}` : ''}
            </Text>
          </View>

          <View style={styles.bottomBar} pointerEvents="none">
            <Text style={styles.headline} testID="overlay-headline">
              {match.headline ?? match.competition}
            </Text>
            <Text style={styles.meta}>
              {[match.competition, match.venue].filter(Boolean).join('  ·  ')}
            </Text>
          </View>
        </View>
      ) : null}

      <View style={styles.controls}>
        <Pressable
          accessibilityLabel={overlayVisible ? 'Nascondi overlay' : 'Mostra overlay'}
          accessibilityRole="button"
          focusable
          onPress={() => setOverlayVisible((visible) => !visible)}
          style={styles.controlButton}
          testID="overlay-toggle"
        >
          <Text style={styles.controlText}>
            {overlayVisible ? 'Hide info' : 'Show info'}
          </Text>
        </Pressable>
        <Pressable
          accessibilityLabel="Torna alla lista"
          accessibilityRole="button"
          focusable
          onPress={onBack}
          style={styles.controlButton}
          testID="overlay-back"
        >
          <Text style={styles.controlText}>Back</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#000000',
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'space-between',
    padding: 32,
  },
  scoreBug: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(7, 17, 31, 0.85)',
    borderColor: '#55E6C1',
    borderRadius: 12,
    borderWidth: 2,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  liveDot: {
    backgroundColor: '#FF4D6D',
    borderRadius: 5,
    height: 10,
    marginRight: 10,
    width: 10,
  },
  scoreBugText: {
    color: '#F7FAFC',
    fontSize: 22,
    fontWeight: '800',
  },
  bottomBar: {
    backgroundColor: 'rgba(7, 17, 31, 0.85)',
    borderRadius: 14,
    padding: 18,
  },
  headline: {
    color: '#F7FAFC',
    fontSize: 22,
    fontWeight: '700',
  },
  meta: {
    color: '#8EA4B8',
    fontSize: 16,
    marginTop: 4,
  },
  controls: {
    top: 32,
    flexDirection: 'row',
    gap: 12,
    position: 'absolute',
    right: 32,
  },
  controlButton: {
    backgroundColor: '#10243A',
    borderColor: '#29445D',
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: 'center',
    minHeight: 52,
    paddingHorizontal: 22,
    paddingVertical: 14,
  },
  controlText: {
    color: '#B8C7D9',
    fontSize: 16,
    fontWeight: '700',
  },
});
