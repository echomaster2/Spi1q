import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.spimaster.app',
  appName: 'SPI Master',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
