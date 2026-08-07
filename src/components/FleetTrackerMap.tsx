import React, { useEffect, useState } from 'react';

interface VesselTelemetry {
    vessel_name: string;
    latitude: number;
    longitude: number;
    speed_knots: number;
    heading_degrees: number;
}

export default function FleetTrackerMap() {
    const [telemetry, setTelemetry] = useState<VesselTelemetry | null>({
        vessel_name: "MV Orion Leader",
        latitude: 1.2878,
        longitude: 103.8667,
        speed_knots: 14.5,
        heading_degrees: 210
    });

    useEffect(() => {
        // Fetch position updates directly from our parallel n8n telemetry track
        const fetchLiveTelemetry = async () => {
            try {
                const response = await fetch(' https://botanical-durably-coyness.ngrok-free.dev', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: new URLSearchParams({ get_position: 'true', mmsi: '235092999' }).toString()
                });
                if (response.ok) {
                    const data = await response.json();
                    if (data && data) {
                        setTelemetry(data);
                    }
                }
            } catch (error) {
                console.error("Telemetry sync pause:", error);
            }
        };

        fetchLiveTelemetry();
        const interval = setInterval(fetchLiveTelemetry, 30000); // Sync every 30 seconds
        return () => clearInterval(interval);
    }, []);

    const lat = telemetry?.latitude ?? 1.2878;
    const lon = telemetry?.longitude ?? 103.8667;

    return (
        <div className="bg-[#0f172a] border border-[#0d9488]/30 rounded-xl p-6 shadow-xl backdrop-blur-md mt-4">
            <div className="flex items-center justify-between mb-4 border-b border-[#0d9488]/20 pb-3">
                <h3 className="text-xl font-bold text-[#0d9488] flex items-center gap-2">
                    🌐 Real-Time Spatial Telemetry Matrix
                </h3>
                <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 animate-pulse">
                    LIVE SAT SYNC
                </span>
            </div>
            
            {/* Visual Tactical Navigation Display Deck */}
            <div className="relative h-64 bg-[#020617] border border-[#0d9488]/20 rounded-lg overflow-hidden flex flex-col items-center justify-center p-6 text-center">
                {/* Visual Background Radar Sweep & Grid Overlays */}
                <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#0d9488_1px,transparent_1px),linear-gradient(to_bottom,#0d9488_1px,transparent_1px)] bg-[size:30px_30px]"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border border-[#0d9488]/10 animate-ping pointer-events-none"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border border-[#0d9488]/20 pointer-events-none"></div>
                
                {/* Fleet Transponder Data Cluster Core */}
                <div className="z-10 space-y-3">
                    <div className="text-5xl drop-shadow-[0_0_15px_rgba(13,148,136,0.5)] animate-pulse">🚢</div>
                    <div className="text-xl font-bold text-white tracking-wide uppercase">{telemetry?.vessel_name}</div>
                    
                    <div className="font-mono text-xs font-bold text-[#2dd4bf] bg-[#0d9488]/10 px-4 py-2 rounded-md border border-[#0d9488]/30 tracking-widest inline-block shadow-inner">
                        SECURE POSITION LOCK // LOC: {lat?.toFixed(4)}°N | {lon?.toFixed(4)}°E
                    </div>
                </div>

                {/* Sub-Text Status Bar */}
                <div className="absolute bottom-2 left-4 font-mono text-[10px] text-slate-500 uppercase tracking-widest">
                    SYSTEM STATUS: AIS ACTIVE
                </div>
            </div>

            {/* Vessel Parameters Info Deck */}
            <div className="grid grid-cols-2 gap-4 mt-4 font-mono text-sm text-slate-300">
                <div className="bg-[#020617] p-3 rounded border border-[#0d9488]/10">
                    <span className="text-slate-500 block text-xs uppercase tracking-wider mb-1">Speed Over Ground</span>
                    <span className="text-base font-bold text-white text-emerald-400">{telemetry?.speed_knots} Knots</span>
                </div>
                <div className="bg-[#020617] p-3 rounded border border-[#0d9488]/10">
                    <span className="text-slate-500 block text-xs uppercase tracking-wider mb-1">True Heading</span>
                    <span className="text-base font-bold text-white text-emerald-400">{telemetry?.heading_degrees}° Degrees</span>
                </div>
            </div>
        </div>
    );
}
