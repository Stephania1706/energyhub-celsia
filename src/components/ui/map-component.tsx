"use client";

import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { AlertType } from '@/types/map';

export interface MapComponentRef {
  getMap: () => L.Map | null;
}

export interface MapMarker {
  position: [number, number];
  popup?: string;
  type?: AlertType;
}

export interface MapComponentProps {
  center: [number, number];
  zoom?: number;
  markers?: MapMarker[];
  onMapClick?: (latlng: { lat: number; lng: number }) => void;
  className?: string;
}

const MapComponent = forwardRef<MapComponentRef, MapComponentProps>((props, ref) => {
  const {
    center,
    zoom = 13,
    markers = [],
    onMapClick,
    className = ''
  } = props;
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.Marker[]>([]);

  // Initialize map
  useEffect(() => {
    if (mapRef.current || !mapContainerRef.current) return;

    // Initialize map
    mapRef.current = L.map(mapContainerRef.current, {
      center,
      zoom,
      zoomControl: false,
    });

    // Add tile layer (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(mapRef.current);

    // Add click handler
    if (onMapClick) {
      mapRef.current.on('click', (e) => {
        onMapClick(e.latlng);
      });
    }

    // Add zoom control
    L.control.zoom({
      position: 'bottomright'
    }).addTo(mapRef.current);

    // Cleanup
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Update map center and zoom
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setView(center, zoom);
    }
  }, [center, zoom]);

  // Update markers
  useEffect(() => {
    if (!mapRef.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => {
      marker.remove();
    });
    markersRef.current = [];

    // Add new markers
    markers.forEach(({ position, popup, type }) => {
      let iconHtml = '';
      
      if (!type || type === 'alert') {
        // Default/alert marker
        iconHtml = `
          <div class="relative flex items-center justify-center">
            <div class="absolute w-6 h-6 bg-blue-500 rounded-full opacity-75 animate-pulse"></div>
            <div class="relative z-10 w-4 h-4 bg-blue-600 rounded-full border-2 border-white"></div>
          </div>
        `;
      } else if (type === 'outage') {
        iconHtml = `
          <div class="relative flex items-center justify-center">
            <div class="absolute w-6 h-6 bg-red-500 rounded-full animate-ping"></div>
            <div class="relative z-10 w-4 h-4 bg-red-600 rounded-full border-2 border-white"></div>
          </div>
        `;
      } else if (type === 'maintenance') {
        iconHtml = `
          <div class="relative flex items-center justify-center">
            <div class="absolute w-6 h-6 bg-yellow-500 rounded-full animate-pulse"></div>
            <div class="relative z-10 w-4 h-4 bg-yellow-400 rounded-full border-2 border-white"></div>
          </div>
        `;
      } else if (type === 'construction') {
        iconHtml = `
          <div class="relative flex items-center justify-center">
            <div class="absolute w-6 h-6 bg-orange-500 rounded-full"></div>
            <div class="relative z-10 w-4 h-4 bg-orange-600 rounded-full border-2 border-white"></div>
          </div>
        `;
      } else if (type === 'cleaning') {
        iconHtml = `
          <div class="relative flex items-center justify-center">
            <div class="absolute w-6 h-6 bg-green-500 rounded-full animate-pulse"></div>
            <div class="relative z-10 w-4 h-4 bg-green-600 rounded-full border-2 border-white"></div>
          </div>
        `;
      } else if (type === 'protection') {
        iconHtml = `
          <div class="relative flex items-center justify-center">
            <div class="absolute w-6 h-6 bg-purple-500 rounded-full"></div>
            <div class="relative z-10 w-4 h-4 bg-purple-600 rounded-full border-2 border-white"></div>
          </div>
        `;
      } else if (type === 'incident') {
        iconHtml = `
          <div class="relative flex items-center justify-center">
            <div class="absolute w-6 h-6 bg-pink-500 rounded-full animate-pulse"></div>
            <div class="relative z-10 w-4 h-4 bg-pink-600 rounded-full border-2 border-white"></div>
          </div>
        `;
      } else if (type === 'scheduled') {
        iconHtml = `
          <div class="relative flex items-center justify-center">
            <div class="absolute w-6 h-6 bg-indigo-500 rounded-full"></div>
            <div class="relative z-10 w-4 h-4 bg-indigo-600 rounded-full border-2 border-white"></div>
          </div>
        `;
      } else if (type === 'emergency') {
        iconHtml = `
          <div class="relative flex items-center justify-center">
            <div class="absolute w-6 h-6 bg-red-700 rounded-full animate-ping"></div>
            <div class="relative z-10 w-4 h-4 bg-red-800 rounded-full border-2 border-white"></div>
          </div>
        `;
      }

      const icon = L.divIcon({
        html: iconHtml,
        className: 'bg-transparent border-none',
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      const marker = L.marker([position[0], position[1]], { icon });
      
      if (popup) {
        marker.bindPopup(popup);
      }
      
      marker.addTo(mapRef.current!);
      markersRef.current.push(marker);
    });
  }, [markers]);

  useImperativeHandle(ref, () => ({
    getMap: () => mapRef.current,
  }));

  return <div ref={mapContainerRef} className={`h-full w-full ${className}`} />;
});

MapComponent.displayName = 'MapComponent';

export default MapComponent;
