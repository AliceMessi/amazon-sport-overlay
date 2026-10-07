import React, { useMemo, useReducer } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { Sport, SportFilter, SportMatch } from '../domain/matches';
import {
  createDashboardState,
  dashboardReducer,
  filterMatches,
} from '../state/sportsDashboard';

type LiveSportsScreenProps = {
  matches: readonly SportMatch[];
  onWatch?: (match: SportMatch) => void;
};

type SportFilterOption = {
  id: SportFilter;
  label: string;
  accessibilityLabel: string;
};

const sportFilters: readonly SportFilterOption[] = [
  { id: 'all', label: 'Tutti', accessibilityLabel: 'Filtra Tutti' },
  { id: 'football', label: 'Calcio', accessibilityLabel: 'Filtra Calcio' },
  { id: 'basketball', label: 'Basket', accessibilityLabel: 'Filtra Basket' },
  { id: 'formula1', label: 'Formula 1', accessibilityLabel: 'Filtra Formula 1' },
];

const sportLabels: Record<Sport, string> = {
  football: 'Calcio',
  basketball: 'Basket',
  formula1: 'Formula 1',
};

const statusLabels: Record<SportMatch['status'], string> = {
  live: 'LIVE',
  upcoming: 'INIZIA',
  finished: 'TERMINATA',
};

function formatTime(value: string): string {
  return new Intl.DateTimeFormat('it-IT', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}

function formatScore(match: SportMatch): string {
  if (match.homeTeam.score === null || match.awayTeam.score === null) {
    return formatTime(match.startsAt);
  }
  return `${match.homeTeam.score} — ${match.awayTeam.score}`;
}

function MatchCard({
  match,
  selected,
  onSelect,
}: {
  match: SportMatch;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <Pressable
      accessibilityLabel={`Apri ${match.homeTeam.name} contro ${match.awayTeam.name}`}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      focusable
      onFocus={onSelect}
      onPress={onSelect}
      style={[styles.matchCard, selected && styles.selectedCard]}
      testID={`match-card-${match.id}`}
    >
      <View style={styles.cardTopline}>
        <Text style={styles.competition}>{match.competition}</Text>
        <Text style={[styles.status, match.status === 'live' && styles.liveStatus]}>
          {statusLabels[match.status]}
        </Text>
      </View>
      <View style={styles.teamRow}>
        <Text numberOfLines={1} style={styles.teamName}>
          {match.homeTeam.name}
        </Text>
        <Text style={styles.score}>{formatScore(match)}</Text>
      </View>
      <View style={styles.teamRow}>
        <Text numberOfLines={1} style={styles.teamName}>
          {match.awayTeam.name}
        </Text>
        <Text style={styles.period}>{match.period ?? sportLabels[match.sport]}</Text>
      </View>
    </Pressable>
  );
}

function ContentWrapper({
  compact,
  children,
}: {
  compact: boolean;
  children: React.ReactNode;
}) {
  if (compact) {
    return (
      <ScrollView
        style={styles.contentWrap}
        contentContainerStyle={styles.contentCompact}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    );
  }
  return <View style={styles.content}>{children}</View>;
}

export default function LiveSportsScreen({ matches, onWatch }: LiveSportsScreenProps) {
  const [state, dispatch] = useReducer(
    (currentState: ReturnType<typeof createDashboardState>, action: Parameters<typeof dashboardReducer>[1]) =>
      dashboardReducer(currentState, action, matches),
    matches,
    createDashboardState,
  );
  const visibleMatches = useMemo(
    () => filterMatches(matches, state.sport),
    [matches, state.sport],
  );
  const selectedMatch = matches.find((match) => match.id === state.selectedMatchId);
  // TV gets the 10-foot row layout; every touch device (phone, tablet,
  // desktop web) gets the single-scroll column so nothing ends up off-screen.
  const compact = !Platform.isTV;

  return (
    <View style={[styles.screen, compact && styles.screenCompact]}>
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>SPORT COMPANION</Text>
          <Text style={[styles.title, compact && styles.titleCompact]}>Tutto il tuo sport, in un colpo d’occhio</Text>
        </View>
        <View style={styles.demoBadge}>
          <View style={styles.liveDot} />
          <Text style={styles.demoText}>DEMO FEED</Text>
        </View>
      </View>

      <ContentWrapper compact={compact}>
        <View style={compact ? styles.feedColumnCompact : styles.feedColumn}>
          <ScrollView
            contentContainerStyle={styles.filters}
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            {sportFilters.map((filter) => {
              const active = state.sport === filter.id;
              return (
                <Pressable
                  accessibilityLabel={filter.accessibilityLabel}
                  accessibilityRole="button"
                  accessibilityState={{ selected: active }}
                  focusable
                  key={filter.id}
                  onFocus={() => dispatch({ type: 'sportSelected', sport: filter.id })}
                  onPress={() => dispatch({ type: 'sportSelected', sport: filter.id })}
                  style={[styles.filter, active && styles.activeFilter]}
                >
                  <Text style={[styles.filterText, active && styles.activeFilterText]}>
                    {filter.label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Diretta e prossimi eventi</Text>
            <Text style={styles.eventCount}>{visibleMatches.length} EVENTI</Text>
          </View>

          {compact ? (
            <View style={styles.matchList}>
              {visibleMatches.map((match) => (
                <MatchCard
                  key={match.id}
                  match={match}
                  onSelect={() =>
                    dispatch({ type: 'matchSelected', matchId: match.id })
                  }
                  selected={state.selectedMatchId === match.id}
                />
              ))}
            </View>
          ) : (
            <ScrollView
              contentContainerStyle={styles.matchList}
              showsVerticalScrollIndicator={false}
            >
              {visibleMatches.map((match) => (
                <MatchCard
                  key={match.id}
                  match={match}
                  onSelect={() =>
                    dispatch({ type: 'matchSelected', matchId: match.id })
                  }
                  selected={state.selectedMatchId === match.id}
                />
              ))}
            </ScrollView>
          )}
        </View>

        <ScrollView
          style={compact ? styles.detailPanelCompact : styles.detailPanel}
          showsVerticalScrollIndicator={false}
        >
          {selectedMatch ? (
            <>
              <View style={styles.detailTopline}>
                <Text style={styles.detailCompetition}>
                  {selectedMatch.competition} · {sportLabels[selectedMatch.sport]}
                </Text>
                <Text
                  style={[
                    styles.status,
                    selectedMatch.status === 'live' && styles.liveStatus,
                  ]}
                >
                  {statusLabels[selectedMatch.status]}
                </Text>
              </View>
              <Text style={styles.detailEyebrow}>PARTITA SELEZIONATA</Text>
              <Text testID="selected-match-title" style={[styles.detailTitle, compact && styles.detailTitleCompact]}>
                {`${selectedMatch.homeTeam.name} vs ${selectedMatch.awayTeam.name}`}
              </Text>
              <Text style={[styles.detailScore, compact && styles.detailScoreCompact]}>{formatScore(selectedMatch)}</Text>
              <View style={styles.detailDivider} />
              <Text style={styles.detailHeadline}>
                {selectedMatch.headline ?? 'Appuntamento in programma'}
              </Text>
              <Text style={styles.detailMeta}>
                {selectedMatch.period ?? `Inizia alle ${formatTime(selectedMatch.startsAt)}`}
              </Text>
              {onWatch ? (
                <Pressable
                  accessibilityLabel={`Guarda ${selectedMatch.homeTeam.name} contro ${selectedMatch.awayTeam.name} con overlay`}
                  accessibilityRole="button"
                  focusable
                  onPress={() => onWatch(selectedMatch)}
                  style={[styles.watchButton, compact && styles.watchButtonCompact]}
                  testID="watch-overlay-button"
                >
                  <Text style={styles.watchButtonText}>Watch with overlay</Text>
                </Pressable>
              ) : null}
              <View style={styles.remoteHint}>
                <Text style={styles.remoteHintTitle}>Comandi telecomando</Text>
                <Text style={styles.remoteHintText}>
                  Usa le frecce per spostarti e OK per selezionare.
                </Text>
              </View>
            </>
          ) : (
            <Text style={styles.emptyText}>Nessun evento per questo sport.</Text>
          )}
        </ScrollView>
        {compact ? (
          <Text style={styles.versionFooter}>Sport Overlay v0.3 · phone layout</Text>
        ) : null}
      </ContentWrapper>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#07111F',
    paddingHorizontal: 48,
    paddingTop: 32,
    paddingBottom: 28,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  eyebrow: {
    color: '#55E6C1',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 2.4,
    marginBottom: 6,
  },
  title: {
    color: '#F7FAFC',
    fontSize: 30,
    fontWeight: '700',
  },
  titleCompact: {
    fontSize: 24,
  },
  demoBadge: {
    alignItems: 'center',
    backgroundColor: '#10243A',
    borderColor: '#1C3A55',
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: 'row',
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  liveDot: {
    backgroundColor: '#FF4D6D',
    borderRadius: 5,
    height: 8,
    marginRight: 8,
    width: 8,
  },
  demoText: {
    color: '#B8C7D9',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
  },
  contentWrap: {
    flex: 1,
  },
  contentCompact: {
    // Standalone (NOT merged with `content`): atomic-CSS order can let base
    // `flex:1` win over compact overrides, pinning the container to viewport
    // height. This object carries every property it needs on its own.
    flexDirection: 'column',
    flexGrow: 1,
    flexShrink: 0,
    width: '100%',
    maxWidth: 1000,
    alignSelf: 'center',
    paddingBottom: 28,
  },
  screenCompact: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  feedColumn: {
    flex: 1.35,
    marginRight: 28,
  },
  feedColumnCompact: {
    // Standalone: see contentCompact note. Plain block, full width.
    width: '100%',
  },
  matchList: {
    gap: 12,
    paddingBottom: 16,
  },
  versionFooter: {
    color: '#71869B',
    fontSize: 12,
    marginTop: 16,
    textAlign: 'center',
  },
  detailPanelCompact: {
    // Standalone: see contentCompact note. Full visual copy, stacked below.
    backgroundColor: '#0D1D2F',
    borderColor: '#203B55',
    borderRadius: 22,
    borderWidth: 1,
    marginTop: 20,
    padding: 20,
  },
  detailTitleCompact: {
    fontSize: 24,
    lineHeight: 30,
  },
  detailScoreCompact: {
    fontSize: 40,
  },
  filters: {
    gap: 10,
    paddingBottom: 18,
  },
  filter: {
    backgroundColor: '#10243A',
    borderColor: '#29445D',
    borderRadius: 12,
    borderWidth: 2,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  activeFilter: {
    backgroundColor: '#55E6C1',
    borderColor: '#F7FAFC',
  },
  filterText: {
    color: '#B8C7D9',
    fontSize: 16,
    fontWeight: '700',
  },
  activeFilterText: {
    color: '#07111F',
  },
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    color: '#F7FAFC',
    fontSize: 20,
    fontWeight: '700',
  },
  eventCount: {
    color: '#71869B',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.1,
  },
  matchCard: {
    backgroundColor: '#0D1D2F',
    borderColor: '#203B55',
    borderRadius: 16,
    borderWidth: 2,
    padding: 16,
  },
  selectedCard: {
    backgroundColor: '#122A40',
    borderColor: '#55E6C1',
  },
  cardTopline: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  competition: {
    color: '#8EA4B8',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  status: {
    color: '#A6B5C5',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
  },
  liveStatus: {
    color: '#FF6B86',
  },
  teamRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  teamName: {
    color: '#F7FAFC',
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    marginRight: 16,
  },
  score: {
    color: '#F7FAFC',
    fontSize: 18,
    fontWeight: '800',
  },
  period: {
    color: '#8EA4B8',
    fontSize: 13,
    fontWeight: '600',
  },
  detailPanel: {
    backgroundColor: '#0D1D2F',
    borderColor: '#203B55',
    borderRadius: 22,
    borderWidth: 1,
    flex: 0.85,
    padding: 28,
  },
  detailTopline: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailCompetition: {
    color: '#8EA4B8',
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
  },
  detailEyebrow: {
    color: '#55E6C1',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginTop: 26,
  },
  detailTitle: {
    color: '#F7FAFC',
    fontSize: 27,
    fontWeight: '700',
    lineHeight: 34,
    marginTop: 8,
  },
  detailScore: {
    color: '#F7FAFC',
    fontSize: 48,
    fontWeight: '800',
    marginTop: 18,
  },
  detailDivider: {
    backgroundColor: '#203B55',
    height: 1,
    marginVertical: 22,
  },
  detailHeadline: {
    color: '#E7EEF5',
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 26,
  },
  detailMeta: {
    color: '#8EA4B8',
    fontSize: 14,
    marginTop: 8,
  },
  remoteHint: {
    backgroundColor: '#10243A',
    borderRadius: 14,
    marginTop: 'auto',
    padding: 16,
  },
  remoteHintTitle: {
    color: '#55E6C1',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  remoteHintText: {
    color: '#B8C7D9',
    fontSize: 14,
    lineHeight: 20,
    marginTop: 5,
  },
  watchButton: {
    backgroundColor: '#55E6C1',
    borderColor: '#F7FAFC',
    borderRadius: 14,
    borderWidth: 2,
    marginTop: 14,
    padding: 16,
  },
  watchButtonCompact: {
    minHeight: 56,
    justifyContent: 'center',
  },
  watchButtonText: {
    color: '#07111F',
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'center',
  },
  emptyText: {
    color: '#B8C7D9',
    fontSize: 20,
  },
});
