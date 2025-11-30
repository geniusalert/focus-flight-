# Focus Flight App

A cross-platform application with both mobile (React Native/Expo) and web (React Router) versions.

## Project Structure

```
focus flight app/
├── mobile/          # React Native/Expo mobile app
└── web/             # React Router web app
```

## Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn
- For mobile development:
  - Expo CLI (`npm install -g expo-cli`)
  - iOS Simulator (Mac only) or Android Emulator
  - Expo Go app on your physical device (optional)

## Getting Started

### Mobile App

1. Navigate to the mobile directory:
   ```bash
   cd mobile
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Expo development server:
   ```bash
   npx expo start
   ```

4. Run on your preferred platform:
   - Press `i` for iOS Simulator
   - Press `a` for Android Emulator
   - Press `w` for web browser
   - Scan QR code with Expo Go app on your phone

### Web App

1. Navigate to the web directory:
   ```bash
   cd web
   ```

2. Install dependencies:
   ```bash
   npm install
   ```
   
   Or if you have Bun installed:
   ```bash
   bun install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to the URL shown in the terminal (typically `http://localhost:5173`)

## Available Scripts

### Mobile

| Command | Description |
|---------|-------------|
| `npx expo start` | Start the Expo development server |
| `npx expo start --ios` | Start and open iOS simulator |
| `npx expo start --android` | Start and open Android emulator |
| `npx expo start --web` | Start and open in web browser |

### Web

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the development server |
| `npm run typecheck` | Run TypeScript type checking |

## Tech Stack

### Mobile
- React Native 0.79.3
- Expo SDK 53
- React Navigation
- React Native Reanimated
- Zustand (state management)
- TanStack React Query

### Web
- React 18
- React Router 7
- Vite
- Tailwind CSS
- Chakra UI
- TanStack React Query
- Zustand (state management)

## Troubleshooting

### Mobile Issues

- **Metro bundler issues**: Try clearing the cache with `npx expo start -c`
- **Dependency issues**: Delete `node_modules` and `package-lock.json`, then run `npm install`

### Web Issues

- **Port already in use**: The dev server will automatically try another port, or you can specify one with `npm run dev -- --port 3000`
- **Build errors**: Run `npm run typecheck` to identify TypeScript issues

## License

Private project - All rights reserved.
