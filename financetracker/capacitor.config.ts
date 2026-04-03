import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.mybill.app",
  appName: "My Bill",
  webDir: "out",
  server: {
    androidScheme: "https",
  },
};

export default config;
