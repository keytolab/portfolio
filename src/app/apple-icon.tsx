import { ImageResponse } from "next/og";
import { IconArt } from "@/components/brand/icon-art";

// Home-screen icon for iPhone/iPad. iOS rounds the corners itself, so the art is square.
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(<IconArt size={size.width} radius={0} />, { ...size });
}
