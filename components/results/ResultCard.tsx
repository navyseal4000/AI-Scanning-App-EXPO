import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Share2, Trash2, Clock } from 'lucide-react-native';
import { ScanResult } from '../../types';
import { SCANNING_PRESETS } from '../../config/scanningConfig';
import { Colors } from '../../styles/colors';
import { Typography } from '../../styles/typography';
import { GlassCard } from '../ui/GlassCard';
import * as Sharing from 'expo-sharing';

interface ResultCardProps {
  result: ScanResult;
  onDelete: (id: string) => void;
}

export function ResultCard({ result, onDelete }: ResultCardProps) {
  const preset = SCANNING_PRESETS[result.preset];
  const date = new Date(result.timestamp).toLocaleDateString();
  const time = new Date(result.timestamp).toLocaleTimeString();

  const handleShare = async () => {
    try {
      const shareContent = `AI Scan Result - ${preset?.name || 'Unknown'}\n\n${result.analysis}`;
      
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(result.imageUri, {
          mimeType: 'image/jpeg',
          dialogTitle: 'Share Scan Result',
        });
      } else {
        Alert.alert('Sharing not available', 'Sharing is not available on this device');
      }
    } catch (error) {
      console.error('Failed to share:', error);
      Alert.alert('Error', 'Failed to share result');
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Result',
      'Are you sure you want to delete this scan result?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => onDelete(result.id) },
      ]
    );
  };

  return (
    <GlassCard style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerInfo}>
          <Text style={styles.presetName}>{preset?.name || 'Unknown'}</Text>
          <View style={styles.timestamp}>
            <Clock size={12} color={Colors.neutral[500]} />
            <Text style={styles.timestampText}>{date} at {time}</Text>
          </View>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
            <Share2 size={16} color={Colors.primary[500]} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleDelete}>
            <Trash2 size={16} color={Colors.error[500]} />
          </TouchableOpacity>
        </View>
      </View>

      <Image source={{ uri: result.imageUri }} style={styles.image} />
      
      <View style={styles.content}>
        <Text style={styles.analysis}>{result.analysis}</Text>
        {result.confidence && (
          <View style={styles.confidence}>
            <Text style={styles.confidenceText}>
              Confidence: {Math.round(result.confidence * 100)}%
            </Text>
          </View>
        )}
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginVertical: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 16,
    paddingBottom: 12,
  },
  headerInfo: {
    flex: 1,
  },
  presetName: {
    fontSize: Typography.fontSize.base,
    fontFamily: Typography.fontFamily.semibold,
    color: Colors.neutral[900],
    marginBottom: 4,
  },
  timestamp: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timestampText: {
    fontSize: Typography.fontSize.xs,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.neutral[500],
    marginLeft: 4,
  },
  actions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  content: {
    padding: 16,
    paddingTop: 0,
  },
  analysis: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.neutral[700],
    lineHeight: Typography.lineHeight.relaxed,
    marginBottom: 12,
  },
  confidence: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.primary[50],
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  confidenceText: {
    fontSize: Typography.fontSize.xs,
    fontFamily: Typography.fontFamily.medium,
    color: Colors.primary[700],
  },
});