export interface ScanningPreset {
  id: string;
  name: string;
  prompt: string;
  description: string;
  icon: string;
  color: string;
}

export const SCANNING_PRESETS: Record<string, ScanningPreset> = {
  general: {
    id: 'general',
    name: 'General Analysis',
    prompt: 'Analyze this image and provide detailed information about what you see. Be specific and informative about objects, people, text, activities, and any other notable features.',
    description: 'General purpose image analysis',
    icon: 'eye',
    color: '#8B5CF6'
  },
  birds: {
    id: 'birds',
    name: 'Bird Identification',
    prompt: 'Identify the bird species in this image. Provide the scientific name, common name, key identifying features, habitat information, and any interesting facts about this bird species.',
    description: 'Identify bird species and characteristics',
    icon: 'bird',
    color: '#06B6D4'
  },
  plants: {
    id: 'plants',
    name: 'Plant Detection',
    prompt: 'Identify the plant species in this image. Provide the scientific name, common name, care instructions, growing conditions, and any notable characteristics or uses of this plant.',
    description: 'Identify plants and get care information',
    icon: 'leaf',
    color: '#10B981'
  },
  text: {
    id: 'text',
    name: 'Text Reader',
    prompt: 'Extract and transcribe all text visible in this image. Provide the text content in a clear, organized format. If the text is in a foreign language, also provide a translation.',
    description: 'Extract and translate text from images',
    icon: 'type',
    color: '#F59E0B'
  },
  food: {
    id: 'food',
    name: 'Food Analysis',
    prompt: 'Analyze this food image. Identify the dish, ingredients, estimated nutritional information, cuisine type, and any preparation methods visible. Also suggest similar dishes or variations.',
    description: 'Identify food and get nutritional info',
    icon: 'utensils',
    color: '#EF4444'
  },
  objects: {
    id: 'objects',
    name: 'Object Recognition',
    prompt: 'Identify and describe all objects in this image. Provide details about their purpose, materials, estimated value, and any brand or model information if visible.',
    description: 'Identify objects and get detailed info',
    icon: 'cube',
    color: '#8B5CF6'
  }
};

export const DEFAULT_PRESET_ID = 'general';