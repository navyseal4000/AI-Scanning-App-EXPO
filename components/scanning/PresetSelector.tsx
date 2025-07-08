import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { SCANNING_PRESETS, ScanningPreset } from '../../config/scanningConfig';
import { Colors } from '../../styles/colors';
import { Typography } from '../../styles/typography';
import { GlassCard } from '../ui/GlassCard';

interface PresetSelectorProps {
  selectedPreset: string;
  onPresetChange: (presetId: string) => void;
}

export function PresetSelector({ selectedPreset, onPresetChange }: PresetSelectorProps) {
  return (
    <GlassCard style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Scanning Mode</Text>
        <Text style={styles.subtitle}>Choose what you want to analyze</Text>
      </View>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {Object.values(SCANNING_PRESETS).map((preset) => (
          <PresetCard
            key={preset.id}
            preset={preset}
            isSelected={selectedPreset === preset.id}
            onPress={() => onPresetChange(preset.id)}
          />
        ))}
      </ScrollView>
    </GlassCard>
  );
}

interface PresetCardProps {
  preset: ScanningPreset;
  isSelected: boolean;
  onPress: () => void;
}

function PresetCard({ preset, isSelected, onPress }: PresetCardProps) {
  return (
    <TouchableOpacity
      style={[
        styles.presetCard,
        isSelected && styles.selectedPreset,
        { borderColor: preset.color }
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={[styles.iconContainer, { backgroundColor: preset.color }]}>
        <Text style={styles.iconText}>{preset.icon}</Text>
      </View>
      <Text style={styles.presetName}>{preset.name}</Text>
      <Text style={styles.presetDescription}>{preset.description}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginVertical: 16,
  },
  header: {
    padding: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: Typography.fontSize.xl,
    fontFamily: Typography.fontFamily.bold,
    color: Colors.neutral[900],
    marginBottom: 4,
  },
  subtitle: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.neutral[600],
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  presetCard: {
    width: 140,
    marginRight: 12,
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.neutral[200],
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  selectedPreset: {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderWidth: 2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconText: {
    fontSize: 20,
    color: 'white',
  },
  presetName: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.semibold,
    color: Colors.neutral[900],
    marginBottom: 4,
  },
  presetDescription: {
    fontSize: Typography.fontSize.xs,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.neutral[600],
    lineHeight: Typography.lineHeight.tight,
  },
});