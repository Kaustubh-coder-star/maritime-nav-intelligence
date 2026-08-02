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

    // Dynamically calculate the static map image placeholder using open-source OpenStreetMap geometry
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
            
            {/* Visual Geospatial Map Display Container */}
            <div className="relative h-72 bg-[#020617] border border-[#0d9488]/10 rounded-lg overflow-hidden grid grid-cols-1 md:grid-cols-3">
                
                {/* Left Column: Live Interactive Tracking Frame */}
                <div className="md:col-span-2 relative h-full w-full min-h-[240px]">
                    <iframe 
                        title="Vessel Fleet Map"
                        className="w-full h-full border-0"
                        src={`https://openstreetmap.org{lon-0.08}%2C${lat-0.04}%2C${lon+0.08}%2C${lat+0.04}&layer=mapnik&marker=${lat}%2C${lon}`}
                    ></iframe>
                    {/* Visual Radar Ring Overlay Effect */}
                    <div className="absolute inset-0 pointer-events-none border-2 border-[#0d9488]/5 rounded-lg animate-pulse bg-[radial-gradient(circle_at_center,transparent_40%,#020617_95%)]"></div>
                </div>

                {/* Right Column: Dynamic Data Transponder Panel */}
                <div className="bg-[#020617] p-4 flex flex-col justify-center space-y-4 border-t md:border-t-0 md:border-l border-[#0d9488]/20 font-mono text-xs">
                    <div>
                        <span className="text-slate-500 block uppercase tracking-wider text-[10px] mb-0.5">Active Target</span>
                        <span className="text-sm font-bold text-white flex items-center gap-1.5">🚢 {telemetry?.vessel_name}</span>
                    </div>
                    <div>
                        <span className="text-slate-500 block uppercase tracking-wider text-[10px] mb-0.5">Geospatial Coordinates</span>
                        <span className="text-[#0d9488] font-bold text-xs bg-[#0d9488]/5 px-2 py-1 rounded border border-[#0d9488]/10 block mt-1">
                            {lat?.toFixed(4)}°N | {lon?.toFixed(4)}°E
                        </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <div className="bg-[#0f172a]/50 p-2 rounded border border-[#0d9488]/10">
                            <span className="text-slate-500 block text-[9px] uppercase tracking-wider mb-0.5">SOG</span>
                            <span className="text-xs font-bold text-white">{telemetry?.speed_knots} Kts</span>
                        </div>
                        <div className="bg-[#0f172a]/50 p-2 rounded border border-[#0d9488]/10">
                            <span className="text-slate-500 block text-[9px] uppercase tracking-wider mb-0.5">Heading</span>
                            <span className="text-xs font-bold text-white">{telemetry?.heading_degrees}°</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
