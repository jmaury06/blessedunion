"use client"

import { useEffect, useRef } from "react"
import "@google/model-viewer"

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": any
    }
  }
}

export default function iPhone3DViewer() {
  const viewerRef = useRef<any>(null)

  useEffect(() => {
    // El model-viewer se carga automáticamente
  }, [])

  return (
    <model-viewer
      ref={viewerRef}
      src="/img/iphone_13_pro_concept.glb"
      alt="iPhone 13 de 128GB"
      auto-rotate
      camera-controls
      rotation-per-second="30deg"
      style={{
        width: "100%",
        height: "400px",
        maxWidth: "500px",
        margin: "0 auto",
      }}
      loading="eager"
      reveal="auto"
      shadow-intensity="1"
      exposure="1"
    />
  )
}
