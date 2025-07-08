# AI Scanner App (OpenAI Vision)

A customizable AI-powered scanning app built with Expo and OpenAI Vision API. This app serves as a base template that can be easily modified for various scanning purposes like bird identification, plant detection, sign reading, and more.

## Features

- 📸 Camera integration with real-time scanning
- 🤖 OpenAI Vision API integration
- ⚙️ Configurable scanning prompts
- 📱 Beautiful, modern UI with glassmorphism design
- 📊 Scan history and results management
- 🎨 Customizable themes and settings
- 📤 Export and share functionality

## Setup

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up your OpenAI API key in `.env`:
   ```
   EXPO_PUBLIC_OPENAI_API_KEY=your_openai_api_key_here
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Customization

### Changing the Scanning Purpose

You can easily customize this app for different scanning purposes by modifying the prompts in `config/scanningConfig.ts`:

```typescript
export const SCANNING_PRESETS = {
  birds: {
    name: 'Bird Identification',
    prompt: 'Identify the bird species in this image...',
    // ... other config
  },
  plants: {
    name: 'Plant Detection',
    prompt: 'Identify the plant species in this image...',
    // ... other config
  },
  // Add your own presets here
};
```

### Adding New Features

- **Camera Features**: Modify `components/Camera/CameraView.tsx`
- **AI Analysis**: Update `services/openai.ts`
- **UI Styling**: Customize `styles/` directory
- **Configuration**: Edit `config/` files

## Environment Variables

- `EXPO_PUBLIC_OPENAI_API_KEY`: Your OpenAI API key
- `EXPO_PUBLIC_APP_NAME`: App display name
- `EXPO_PUBLIC_DEFAULT_PROMPT`: Default AI prompt

## Contributing

Feel free to fork this repository and create your own version! Some viral ideas:
- Medical scanning app
- Food identification
- Document reader
- Art analyzer
- Wildlife tracker
- Parking sign reading
- Food calorie counter

## License

MIT License - feel free to use this for any purpose
