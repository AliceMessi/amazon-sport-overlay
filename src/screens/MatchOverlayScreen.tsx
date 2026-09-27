import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';
import { WebView } from 'react-native-webview';
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

function Mp4Background({ uri }: { uri: string }) {
  const player = useVideoPlayer(uri, (instance) => {
    instance.loop = true;
    instance.play();
  });
  return (
    <VideoView
      player={player}
      style={styles.video}
      contentFit="cover"
      nativeControls={false}
    />
  );
}

export default function MatchOverlayScreen({
  match,
  source = { type: 'youtube', videoId: YOUTUBE_DEMO_ID },
  onBack,
}: MatchOverlayScreenProps) {
  const [overlayVisible, setOverlayVisible] = useState(true);

  return (
    <View style={styles.screen}>
      {source.type === 'youtube' ? (
        <WebView
          testID="youtube-webview"
          source={{ uri: youtubeEmbedUrl(source.videoId) }}
          style={styles.video}
          allowsFullscreenVideo
          javaScriptEnabled
          domStorageEnabled
          mediaPlaybackRequiresUserAction={false}
        />
      ) : (
        <Mp4Background uri={source.uri} />
      )}

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
          accessibilityLabel={
            overlayVisible ? 'Nascondi overlay' : 'Mostra overlay'
          }
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
  video: {
    ...StyleSheet.absoluteFill,
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
