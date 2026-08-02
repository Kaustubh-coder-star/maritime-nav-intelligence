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
                const response = await fetch('https://ngrok-free.dev', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: new URLSearchParams({ get_position: 'true', mmsi: '235092999' }).toString()
                });
                if (response.ok) {
                    const data = await response.json();
                    if (data && data[0]) {
                        setTelemetry(data[0]);
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

    return (
        <div className="bg-[#0f172a] border border-[#0d9488]/30 rounded-xl p-6 shadow-xl backdrop-blur-md">
            <div className="flex items-center justify-between mb-4 border-b border-[#0d9488]/20 pb-3">
                <h3 className="text-xl font-bold text-[#0d9488] flex items-center gap-2">
                    🌐 Real-Time Spatial Telemetry Matrix
                </h3>
                <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 animate-pulse">
                    LIVE SAT SYNC
                </span>
            </div>
            
            {/* Visual Radar Grid Box */}
            <div className="relative h-64 bg-[#020617] border border-[#0d9488]/10 rounded-lg overflow-hidden flex flex-col items-center justify-center p-4">
                <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#0d9488_1px,transparent_1px),linear-gradient(to_bottom,#0d9488_1px,transparent_1px)] bg-[size:20px_20px] animate-pulse"></div>
                
                {/* Ship Geo-Location Display Core */}
                <div className="z-10 text-center space-y-2">
                    <div className="text-4xl animate-bounce">🚢</div>
                    <div className="text-lg font-bold text-white tracking-wide">{telemetry?.vessel_name}</div>
                    <div className="font-mono text-xs text-[#0d9488] bg-[#0d9488]/5 px-3 py-1.5 rounded border border-[#0d9488]/10 inline-block">
                        LAT: {telemetry?.latitude?.toFixed(4)}°N | LON: {telemetry?.longitude?.toFixed(4)}°E
                    </div>
                </div>
            </div>

            {/* Vessel Parameters Info Deck */}
            <div className="grid grid-cols-2 gap-4 mt-4 font-mono text-sm text-slate-300">
                <div className="bg-[#020617] p-3 rounded border border-[#0d9488]/10">
                    <span className="text-slate-500 block text-xs uppercase tracking-wider mb-1">Speed Over Ground</span>
                    <span className="text-base font-bold text-white">{telemetry?.speed_knots} Knots</span>
                </div>
                <div className="bg-[#020617] p-3 rounded border border-[#0d9488]/10">
                    <span className="text-slate-500 block text-xs uppercase tracking-wider mb-1">True Heading</span>
                    <span className="text-base font-bold text-white">{telemetry?.heading_degrees}° Degrees</span>
                </div>
            </div>
        </div>
    );
}
