export interface ScanResult {
  id: string;
  imageUri: string;
  analysis: string;
  preset: string;
  timestamp: number;
  confidence?: number;
}

export interface AppSettings {
  selectedPreset: string;
  customPrompt?: string;
  theme: 'light' | 'dark' | 'auto';
  saveHistory: boolean;
  autoScan: boolean;
}

export interface OpenAIResponse {
  analysis: string;
  confidence?: number;
  error?: string;
}