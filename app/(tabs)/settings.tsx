import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Save, Info, ExternalLink } from 'lucide-react-native';
import { Switch } from 'react-native';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { getAppSettings, saveAppSettings } from '../../services/storage';
import { SCANNING_PRESETS } from '../../config/scanningConfig';
import { AppSettings } from '../../types';
import { Colors, gradients } from '../../styles/colors';
import { Typography } from '../../styles/typography';

export default function SettingsScreen() {
  const [settings, setSettings] = useState<AppSettings>({
    selectedPreset: 'general',
    theme: 'auto',
    saveHistory: true,
    autoScan: false,
  });
  const [customPrompt, setCustomPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const appSettings = await getAppSettings();
      setSettings(appSettings);
      setCustomPrompt(appSettings.customPrompt || '');
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    try {
      const updatedSettings = {
        ...settings,
        customPrompt: customPrompt.trim() || undefined,
      };
      await saveAppSettings(updatedSettings);
      Alert.alert('Success', 'Settings saved successfully');
    } catch (error) {
      console.error('Failed to save settings:', error);
      Alert.alert('Error', 'Failed to save settings');
    }
  };

  const handlePresetChange = (presetId: string) => {
    setSettings(prev => ({ ...prev, selectedPreset: presetId }));
  };

  const handleToggle = (key: keyof AppSettings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const showInfo = (title: string, message: string) => {
    Alert.alert(title, message);
  };

  if (isLoading) {
    return (
      <LinearGradient colors={gradients.primary} style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading settings...</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={gradients.forest} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={handleSaveSettings}
        >
          <Save size={20} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Scanning Presets */}
        <GlassCard style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Default Scanning Mode</Text>
            <TouchableOpacity
              onPress={() => showInfo('Scanning Mode', 'Choose the default mode for analyzing images')}
            >
              <Info size={16} color={Colors.neutral[500]} />
            </TouchableOpacity>
          </View>
          {Object.values(SCANNING_PRESETS).map(preset => (
            <TouchableOpacity
              key={preset.id}
              style={[
                styles.presetOption,
                settings.selectedPreset === preset.id && styles.selectedPresetOption
              ]}
              onPress={() => handlePresetChange(preset.id)}
            >
              <View style={styles.presetInfo}>
                <Text style={styles.presetName}>{preset.name}</Text>
                <Text style={styles.presetDescription}>{preset.description}</Text>
              </View>
              <View style={[
                styles.radioButton,
                settings.selectedPreset === preset.id && styles.radioButtonSelected
              ]} />
            </TouchableOpacity>
          ))}
        </GlassCard>

        {/* Custom Prompt */}
        <GlassCard style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Custom Prompt</Text>
            <TouchableOpacity
              onPress={() => showInfo('Custom Prompt', 'Override the default prompt with your own custom instructions for AI analysis')}
            >
              <Info size={16} color={Colors.neutral[500]} />
            </TouchableOpacity>
          </View>
          <TextInput
            style={styles.textInput}
            placeholder="Enter custom prompt (optional)"
            value={customPrompt}
            onChangeText={setCustomPrompt}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </GlassCard>

        {/* App Settings */}
        <GlassCard style={styles.card}>
          <Text style={styles.cardTitle}>App Settings</Text>
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingName}>Save History</Text>
              <Text style={styles.settingDescription}>
                Save scan results to history
              </Text>
            </View>
            <Switch
              value={settings.saveHistory}
              onValueChange={() => handleToggle('saveHistory')}
              trackColor={{ false: Colors.neutral[300], true: Colors.primary[500] }}
              thumbColor={settings.saveHistory ? Colors.primary[100] : Colors.neutral[100]}
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingName}>Auto Scan</Text>
              <Text style={styles.settingDescription}>
                Automatically scan when camera detects objects
              </Text>
            </View>
            <Switch
              value={settings.autoScan}
              onValueChange={() => handleToggle('autoScan')}
              trackColor={{ false: Colors.neutral[300], true: Colors.primary[500] }}
              thumbColor={settings.autoScan ? Colors.primary[100] : Colors.neutral[100]}
            />
          </View>
        </GlassCard>

        {/* API Configuration */}
        <GlassCard style={styles.card}>
          <Text style={styles.cardTitle}>API Configuration</Text>
          <View style={styles.apiInfo}>
            <Text style={styles.apiText}>
              OpenAI API Key: {process.env.EXPO_PUBLIC_OPENAI_API_KEY ? 'Configured' : 'Not Set'}
            </Text>
            <Text style={styles.apiDescription}>
              Configure your OpenAI API key in the .env file
            </Text>
          </View>
        </GlassCard>

        {/* About */}
        <GlassCard style={styles.card}>
          <Text style={styles.cardTitle}>About</Text>
          <View style={styles.aboutInfo}>
            <Text style={styles.aboutText}>
              AI Scanner v1.0.0
            </Text>
            <Text style={styles.aboutDescription}>
              Built with Expo and OpenAI Vision API
            </Text>
            <TouchableOpacity
              style={styles.linkButton}
              onPress={() => Alert.alert('GitHub', 'Visit our GitHub repository for more information')}
            >
              <ExternalLink size={16} color={Colors.primary[500]} />
              <Text style={styles.linkText}>View on GitHub</Text>
            </TouchableOpacity>
          </View>
        </GlassCard>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: Typography.fontSize['3xl'],
    fontFamily: Typography.fontFamily.bold,
    color: 'white',
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  loadingText: {
    fontSize: Typography.fontSize.base,
    fontFamily: Typography.fontFamily.medium,
    color: 'white',
  },
  card: {
    margin: 20,
    marginBottom: 0,
    padding: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: Typography.fontSize.lg,
    fontFamily: Typography.fontFamily.bold,
    color: Colors.neutral[900],
  },
  presetOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedPresetOption: {
    backgroundColor: Colors.primary[50],
  },
  presetInfo: {
    flex: 1,
  },
  presetName: {
    fontSize: Typography.fontSize.base,
    fontFamily: Typography.fontFamily.semibold,
    color: Colors.neutral[900],
    marginBottom: 2,
  },
  presetDescription: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.neutral[600],
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.neutral[300],
  },
  radioButtonSelected: {
    backgroundColor: Colors.primary[500],
    borderColor: Colors.primary[500],
  },
  textInput: {
    borderWidth: 1,
    borderColor: Colors.neutral[300],
    borderRadius: 8,
    padding: 12,
    fontSize: Typography.fontSize.base,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.neutral[900],
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingInfo: {
    flex: 1,
  },
  settingName: {
    fontSize: Typography.fontSize.base,
    fontFamily: Typography.fontFamily.semibold,
    color: Colors.neutral[900],
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.neutral[600],
  },
  apiInfo: {
    padding: 12,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderRadius: 8,
  },
  apiText: {
    fontSize: Typography.fontSize.base,
    fontFamily: Typography.fontFamily.semibold,
    color: Colors.neutral[900],
    marginBottom: 4,
  },
  apiDescription: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.neutral[600],
  },
  aboutInfo: {
    alignItems: 'center',
  },
  aboutText: {
    fontSize: Typography.fontSize.base,
    fontFamily: Typography.fontFamily.semibold,
    color: Colors.neutral[900],
    marginBottom: 4,
  },
  aboutDescription: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.neutral[600],
    marginBottom: 16,
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  linkText: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.medium,
    color: Colors.primary[500],
    marginLeft: 4,
  },
  bottomSpacer: {
    height: 20,
  },
});