import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow Hot Module Replacement from phone/Tailscale in development
  allowedDevOrigins: [
    '192.168.0.252',  // your iPhone IP
    '192.168.0.196',  // phone local WiFi IP
    '100.117.15.61',  // Mac Tailscale IP
    
  ],
}

export default nextConfig;