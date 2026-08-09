"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// Loaded after hydration so three.js never blocks the first paint.
const HeroScene3D = dynamic(() => import("./HeroScene3D"), { ssr: false });

/**
 * Mounts the WebGL hero scene only when the device can run it.
 * Until then (and wherever WebGL is unavailable) the CSS backdrop shows.
 */
export function HeroScene() {
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
      if (gl) setSupported(true);
    } catch {
      // WebGL unavailable: keep the static CSS backdrop.
    }
  }, []);

  if (!supported) return null;
  return <HeroScene3D />;
}
