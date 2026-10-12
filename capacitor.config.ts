import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.zen.gr8ful',
  appName: 'Gr8ful',
  webDir: 'dist',
  plugins: {
    // Icono monocromo del ∞ (android/.../drawable/ic_stat_gr8ful.xml) y su color de acento
    LocalNotifications: {
      smallIcon: "ic_stat_gr8ful",
      iconColor: "#5602D3",
    },
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"],
    },
  },
};

export default config;
