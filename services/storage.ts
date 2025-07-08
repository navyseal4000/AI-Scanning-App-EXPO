import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScanResult, AppSettings } from '../types';
import { DEFAULT_PRESET_ID } from '../config/scanningConfig';

const STORAGE_KEYS = {
  SCAN_HISTORY: 'scan_history',
  APP_SETTINGS: 'app_settings',
};

export async function saveScanResult(result: ScanResult): Promise<void> {
  try {
    const history = await getScanHistory();
    const updatedHistory = [result, ...history].slice(0, 100); // Keep last 100 scans
    await AsyncStorage.setItem(STORAGE_KEYS.SCAN_HISTORY, JSON.stringify(updatedHistory));
  } catch (error) {
    console.error('Failed to save scan result:', error);
  }
}

export async function getScanHistory(): Promise<ScanResult[]> {
  try {
    const history = await AsyncStorage.getItem(STORAGE_KEYS.SCAN_HISTORY);
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error('Failed to get scan history:', error);
    return [];
  }
}

export async function deleteScanResult(id: string): Promise<void> {
  try {
    const history = await getScanHistory();
    const updatedHistory = history.filter(result => result.id !== id);
    await AsyncStorage.setItem(STORAGE_KEYS.SCAN_HISTORY, JSON.stringify(updatedHistory));
  } catch (error) {
    console.error('Failed to delete scan result:', error);
  }
}

export async function clearScanHistory(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.SCAN_HISTORY);
  } catch (error) {
    console.error('Failed to clear scan history:', error);
  }
}

export async function getAppSettings(): Promise<AppSettings> {
  try {
    const settings = await AsyncStorage.getItem(STORAGE_KEYS.APP_SETTINGS);
    return settings ? JSON.parse(settings) : getDefaultSettings();
  } catch (error) {
    console.error('Failed to get app settings:', error);
    return getDefaultSettings();
  }
}

export async function saveAppSettings(settings: AppSettings): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.APP_SETTINGS, JSON.stringify(settings));
  } catch (error) {
    console.error('Failed to save app settings:', error);
  }
}

function getDefaultSettings(): AppSettings {
  return {
    selectedPreset: DEFAULT_PRESET_ID,
    theme: 'auto',
    saveHistory: true,
    autoScan: false,
  };
}