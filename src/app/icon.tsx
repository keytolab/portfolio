import { ImageResponse } from "next/og";
import { IconArt } from "@/components/brand/icon-art";

// Browser tab icon, generated as a PNG at build time (works in every browser, including Safari).
export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(<IconArt size={size.width} radius={14} />, { ...size });
}
