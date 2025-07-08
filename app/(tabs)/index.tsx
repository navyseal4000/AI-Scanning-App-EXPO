import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, ScrollView, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CameraView } from '../../components/camera/CameraView';
import { PresetSelector } from '../../components/scanning/PresetSelector';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { GlassCard } from '../../components/ui/GlassCard';
import { analyzeImage } from '../../services/openai';
import { saveScanResult, getAppSettings, saveAppSettings } from '../../services/storage';
import { SCANNING_PRESETS } from '../../config/scanningConfig';
import { ScanResult } from '../../types';
import { Colors, gradients } from '../../styles/colors';
import { Typography } from '../../styles/typography';

export default function ScanScreen() {
  const [selectedPreset, setSelectedPreset] = useState('general');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [showCamera, setShowCamera] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const settings = await getAppSettings();
      setSelectedPreset(settings.selectedPreset);
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  const handlePresetChange = async (presetId: string) => {
    setSelectedPreset(presetId);
    const settings = await getAppSettings();
    await saveAppSettings({ ...settings, selectedPreset: presetId });
  };

  const handleCapture = async (imageUri: string) => {
    setIsProcessing(true);
    setShowCamera(false);
    
    try {
      const preset = SCANNING_PRESETS[selectedPreset];
      const prompt = preset?.prompt || 'Analyze this image and provide detailed information.';
      
      const response = await analyzeImage(imageUri, prompt);
      
      if (response.error) {
        Alert.alert('Analysis Error', response.error);
        setShowCamera(true);
        return;
      }

      const scanResult: ScanResult = {
        id: Date.now().toString(),
        imageUri,
        analysis: response.analysis,
        preset: selectedPreset,
        timestamp: Date.now(),
        confidence: response.confidence,
      };

      await saveScanResult(scanResult);
      setResult(scanResult);
    } catch (error) {
      console.error('Scan failed:', error);
      Alert.alert('Error', 'Failed to analyze image. Please try again.');
      setShowCamera(true);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleNewScan = () => {
    setResult(null);
    setShowCamera(true);
  };

  if (isProcessing) {
    return (
      <LinearGradient colors={gradients.primary} style={styles.container}>
        <View style={styles.processingContainer}>
          <LoadingSpinner size={64} color="white" />
          <Text style={styles.processingText}>Analyzing image...</Text>
          <Text style={styles.processingSubtext}>
            Using {SCANNING_PRESETS[selectedPreset]?.name || 'AI'} analysis
          </Text>
        </View>
      </LinearGradient>
    );
  }

  if (result) {
    return (
      <LinearGradient colors={gradients.ocean} style={styles.container}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <GlassCard style={styles.resultCard}>
            <Text style={styles.resultTitle}>Scan Complete</Text>
            <Text style={styles.resultAnalysis}>{result.analysis}</Text>
            {result.confidence && (
              <View style={styles.confidenceContainer}>
                <Text style={styles.confidenceText}>
                  Confidence: {Math.round(result.confidence * 100)}%
                </Text>
              </View>
            )}
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.newScanButton} onPress={handleNewScan}>
                <Text style={styles.buttonText}>New Scan</Text>
              </TouchableOpacity>
            </View>
          </GlassCard>
        </ScrollView>
      </LinearGradient>
    );
  }

  return (
    <View style={styles.container}>
      {showCamera ? (
        <>
          <CameraView onCapture={handleCapture} isProcessing={isProcessing} />
          <PresetSelector
            selectedPreset={selectedPreset}
            onPresetChange={handlePresetChange}
          />
        </>
      ) : (
        <LinearGradient colors={gradients.primary} style={styles.container}>
          <View style={styles.processingContainer}>
            <LoadingSpinner size={64} color="white" />
            <Text style={styles.processingText}>Processing...</Text>
          </View>
        </LinearGradient>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral[50],
  },
  scrollView: {
    flex: 1,
  },
  processingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  processingText: {
    fontSize: Typography.fontSize.xl,
    fontFamily: Typography.fontFamily.bold,
    color: 'white',
    marginTop: 24,
    textAlign: 'center',
  },
  processingSubtext: {
    fontSize: Typography.fontSize.base,
    fontFamily: Typography.fontFamily.regular,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 8,
    textAlign: 'center',
  },
  resultCard: {
    margin: 20,
    padding: 24,
  },
  resultTitle: {
    fontSize: Typography.fontSize['2xl'],
    fontFamily: Typography.fontFamily.bold,
    color: Colors.neutral[900],
    marginBottom: 16,
    textAlign: 'center',
  },
  resultAnalysis: {
    fontSize: Typography.fontSize.base,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.neutral[700],
    lineHeight: Typography.lineHeight.relaxed,
    marginBottom: 16,
  },
  confidenceContainer: {
    alignSelf: 'center',
    backgroundColor: Colors.primary[50],
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 24,
  },
  confidenceText: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.semibold,
    color: Colors.primary[700],
  },
  buttonContainer: {
    alignItems: 'center',
  },
  newScanButton: {
    backgroundColor: Colors.primary[500],
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: Colors.primary[500],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonText: {
    fontSize: Typography.fontSize.base,
    fontFamily: Typography.fontFamily.semibold,
    color: 'white',
  },
});