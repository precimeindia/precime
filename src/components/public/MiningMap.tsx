"use client";

import React, { useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup
} from "react-simple-maps";
import { MINING_HUBS, MiningHub } from "@/lib/miningData";
import { MapPin, X } from "lucide-react";

// TopoJSON map of the world
const geoUrl = "https://unpkg.com/world-atlas@2.0.2/countries-110m.json";

export default function MiningMap() {
  const [activeHub, setActiveHub] = useState<MiningHub | null>(null);

  return (
    <div className="w-full bg-card/30 border border-border/50 rounded-2xl overflow-hidden relative group">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-[#d4af37]/5 rounded-full blur-[80px] pointer-events-none group-hover:bg-[#d4af37]/10 transition-all duration-700" />
      
      <div className="p-6 pb-2 border-b border-border/50 relative z-10 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[#d4af37]" />
            Global Mining Hubs
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Click a golden marker to explore physical supply zones. Map can be clicked and dragged.
          </p>
        </div>
      </div>

      <div className="relative w-full h-[400px] sm:h-[500px] z-10 bg-[#0a0a0b]">
        {/* Map Rendering Container */}
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{ scale: 130 }}
          width={800}
          height={400}
          style={{ width: "100%", height: "100%" }}
        >
          <ZoomableGroup zoom={1} minZoom={1} maxZoom={4} center={[0, 20]}>
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill="#1a1a1c"
                    stroke="rgba(255,255,255,0.05)"
                    strokeWidth={0.5}
                    style={{
                      default: { outline: "none" },
                      hover: { fill: "#232326", outline: "none" },
                      pressed: { fill: "#2a2a2e", outline: "none" },
                    }}
                  />
                ))
              }
            </Geographies>

            {/* Glowing Markers */}
            {MINING_HUBS.map((hub) => (
              <Marker 
                key={hub.id} 
                coordinates={hub.coordinates}
                onClick={() => setActiveHub(hub)}
                className="cursor-pointer"
              >
                {/* Glow ring */}
                <circle 
                  r={8} 
                  fill="rgba(212, 175, 55, 0.2)" 
                  className={activeHub?.id === hub.id ? "animate-ping" : ""}
                />
                {/* Core pin */}
                <circle 
                  r={4} 
                  fill="#d4af37" 
                  stroke="#fff" 
                  strokeWidth={1} 
                  className="transition-transform hover:scale-150 duration-200"
                />
                <text
                  textAnchor="middle"
                  y={16}
                  style={{ 
                    fontFamily: "system-ui", 
                    fontSize: "8px",
                    fill: "rgba(255,255,255,0.5)",
                    pointerEvents: "none"
                  }}
                >
                  {hub.country}
                </text>
              </Marker>
            ))}
          </ZoomableGroup>
        </ComposableMap>

        {/* Info Sidebar Overlay */}
        <div 
          className={`absolute top-0 right-0 h-full w-full sm:w-80 bg-background/95 backdrop-blur-xl border-l border-border/50 shadow-[0_0_30px_rgba(0,0,0,0.5)] transition-transform duration-300 ease-in-out p-6 overflow-y-auto ${
            activeHub ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {activeHub && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gold-gradient">{activeHub.country}</h3>
                <button 
                  onClick={() => setActiveHub(null)}
                  className="p-1.5 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-6">
                {activeHub.metals.map((metal, idx) => (
                  <div key={idx} className="bg-card/40 border border-border/30 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded bg-[#d4af37]/10 text-[#d4af37] flex items-center justify-center text-xs font-bold border border-[#d4af37]/30">
                          {metal.symbol}
                        </span>
                        <span className="font-semibold text-foreground">{metal.name}</span>
                      </div>
                      <span className="text-xs font-bold bg-muted/50 px-2 py-0.5 rounded text-muted-foreground border border-border/50">
                        {metal.globalShare}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed mt-3">
                      {metal.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
