
import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import * as turf from '@turf/turf';
import 'maplibre-gl/dist/maplibre-gl.css';

interface MapComponentProps {
    onMapReady?: (map: maplibregl.Map) => void;
}

interface ParcelInfo {
    soto: string;
    sothua: string;
    diachi: string;
    lat: number;
    lng: number;
}

interface LandUseItem {
    chucnang: string;
    dientich: number;
    rgbcolor: string;
}

export default function MapComponent({ onMapReady }: MapComponentProps) {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<maplibregl.Map | null>(null);
    const popup = useRef<maplibregl.Popup | null>(null);
    const marker = useRef<maplibregl.Marker | null>(null);
    const isMapLoaded = useRef(false); // ← Prevents layer query errors

    const [parcelInfo, setParcelInfo] = useState<ParcelInfo | null>(null);
    const [landUseList, setLandUseList] = useState<LandUseItem[]>([]);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Cookie helpers
    const setCookie = (name: string, value: string, months = 12) => {
        const expires = new Date();
        expires.setTime(expires.getTime() + months * 30 * 24 * 60 * 60 * 1000);
        document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
    };

    const getCookie = (name: string): string | null => {
        const nameEQ = name + '=';
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length);
        }
        return null;
    };

    useEffect(() => {
        if (!mapContainer.current) return;

        const initialLngLat: [number, number] = getCookie('lngLat')
            ? JSON.parse(getCookie('lngLat')!)
            : [106.702103, 10.775496];

        const mapStyle: maplibregl.StyleSpecification = {
            version: 8,
            name: 'HCM city parcel land',
            glyphs: 'https://maps.ankapong.com/fonts/{fontstack}/{range}.pbf',
            sources: {
                openmaptiles: { type: 'vector', url: '/map/data/v3.json' },
                main: { type: 'vector', url: '/map/data/main.json', promoteId: 'id' },
                extra: { type: 'vector', url: '/map/data/extra.json' },
                clickSource: { type: 'geojson', data: { type: 'FeatureCollection', features: [] } },
                hoverSource: { type: 'geojson', data: { type: 'FeatureCollection', features: [] } },
                infoLengthFeatures: { type: 'geojson', data: { type: 'FeatureCollection', features: [] } },
                infoAreaFeatures: { type: 'geojson', data: { type: 'FeatureCollection', features: [] } },
                pointLocation: { type: 'geojson', data: { type: 'FeatureCollection', features: [] } },
            },

            layers: [
                {
                    id: 'lo_gioi_senior',
                    type: 'line',
                    source: 'main',
                    'source-layer': 'logioi',
                    minzoom: 12,
                    maxzoom: 16,
                    filter: ['==', 'class', 'senior'],
                    paint: {
                        'line-color': 'green',
                        'line-width': { base: 1, stops: [[17, 1], [22, 2]] },
                    },
                },
                {
                    id: 'lo_gioi_junior',
                    type: 'line',
                    source: 'main',
                    'source-layer': 'logioi',
                    minzoom: 12,
                    filter: ['==', 'class', 'junior'],
                    paint: {
                        'line-color': 'blue',
                        'line-width': { base: 0.2, stops: [[17, 0.2], [22, 0.8]] },
                    },
                },
                {
                    id: 'long-duong-qh',
                    type: 'line',
                    source: 'main',
                    'source-layer': 'longduong',
                    minzoom: 10,
                    maxzoom: 15,
                    paint: { 'line-color': '#f58742', 'line-width': 1 },
                },
                {
                    id: 'h-honhop',
                    type: 'fill',
                    source: 'main',
                    'source-layer': 'landuse',
                    minzoom: 10,
                    maxzoom: 17,
                    filter: ['==', 'landuse', 'honhop'],
                    paint: {
                        'fill-color': '#ffb908',
                        'fill-opacity': { base: 1, stops: [[10, 1], [20, 0]] },
                    },
                },
                {
                    id: 'h-public',
                    type: 'fill',
                    source: 'main',
                    'source-layer': 'landuse',
                    minzoom: 10,
                    maxzoom: 17,
                    filter: ['==', 'landuse', 'public'],
                    paint: {
                        'fill-color': 'red',
                        'fill-opacity': { base: 1, stops: [[10, 1], [20, 0]] },
                    },
                },
                {
                    id: 'h-military',
                    type: 'fill',
                    source: 'main',
                    'source-layer': 'landuse',
                    minzoom: 10,
                    maxzoom: 17,
                    filter: ['==', 'landuse', 'military'],
                    paint: {
                        'fill-color': 'blue',
                        'fill-opacity': { base: 1, stops: [[10, 1], [20, 0]] },
                    },
                },
                {
                    id: 'h-medic',
                    type: 'fill',
                    source: 'main',
                    'source-layer': 'landuse',
                    minzoom: 10,
                    maxzoom: 17,
                    filter: ['==', 'landuse', 'medic'],
                    paint: {
                        'fill-color': 'pink',
                        'fill-opacity': { base: 1, stops: [[10, 1], [20, 0]] },
                    },
                },
                {
                    id: 'h-podium',
                    type: 'fill',
                    source: 'main',
                    'source-layer': 'landuse',
                    minzoom: 10,
                    maxzoom: 17,
                    filter: ['==', 'landuse', 'podium'],
                    paint: {
                        'fill-color': 'gray',
                        'fill-opacity': { base: 1, stops: [[10, 1], [20, 0]] },
                    },
                },
                {
                    id: 'h-commer',
                    type: 'fill',
                    source: 'main',
                    'source-layer': 'landuse',
                    minzoom: 10,
                    maxzoom: 17,
                    filter: ['==', 'landuse', 'commer'],
                    paint: {
                        'fill-color': '#ec42f5',
                        'fill-opacity': { base: 1, stops: [[10, 1], [17, 0]] },
                    },
                },
                {
                    id: 'h-hotel',
                    type: 'fill',
                    source: 'main',
                    'source-layer': 'landuse',
                    minzoom: 10,
                    maxzoom: 17,
                    filter: ['==', 'landuse', 'hotel'],
                    paint: {
                        'fill-color': '#ec42f5',
                        'fill-opacity': { base: 1, stops: [[10, 1], [17, 0]] },
                    },
                },
                {
                    id: 'h-nghiatrang',
                    type: 'fill',
                    source: 'main',
                    'source-layer': 'landuse',
                    minzoom: 10,
                    maxzoom: 17,
                    filter: ['==', 'landuse', 'nghiatrang'],
                    paint: {
                        'fill-color': '#000',
                        'fill-opacity': { base: 1, stops: [[10, 1], [20, 0]] },
                    },
                },
                {
                    id: 'h-tongiao',
                    type: 'fill',
                    source: 'main',
                    'source-layer': 'landuse',
                    minzoom: 10,
                    maxzoom: 17,
                    filter: ['==', 'landuse', 'tongiao'],
                    paint: {
                        'fill-color': 'black',
                        'fill-opacity': { base: 1, stops: [[10, 1], [20, 0]] },
                    },
                },
                {
                    id: 'h-coquan',
                    type: 'fill',
                    source: 'main',
                    'source-layer': 'landuse',
                    minzoom: 10,
                    maxzoom: 17,
                    filter: ['==', 'landuse', 'coquan'],
                    paint: {
                        'fill-color': 'red',
                        'fill-opacity': { base: 1, stops: [[10, 1], [20, 0]] },
                    },
                },
                {
                    id: 'h-culture',
                    type: 'fill',
                    source: 'main',
                    'source-layer': 'landuse',
                    minzoom: 10,
                    maxzoom: 17,
                    filter: ['==', 'landuse', 'culture'],
                    paint: {
                        'fill-color': 'yellow',
                        'fill-opacity': { base: 1, stops: [[10, 1], [20, 0]] },
                    },
                },
                {
                    id: 'h-edu',
                    type: 'fill',
                    source: 'main',
                    'source-layer': 'landuse',
                    minzoom: 10,
                    maxzoom: 17,
                    filter: ['==', 'landuse', 'edu'],
                    paint: {
                        'fill-color': 'cyan',
                        'fill-opacity': { base: 1, stops: [[10, 1], [20, 0]] },
                    },
                },
                {
                    id: 'h-metro',
                    type: 'fill',
                    source: 'main',
                    'source-layer': 'landuse',
                    minzoom: 10,
                    maxzoom: 17,
                    filter: ['==', 'landuse', 'metro'],
                    paint: {
                        'fill-color': '#424ef5',
                        'fill-opacity': { base: 1, stops: [[10, 1], [20, 0]] },
                    },
                },
                {
                    id: 'h-parkinglot',
                    type: 'fill',
                    source: 'main',
                    'source-layer': 'landuse',
                    minzoom: 10,
                    maxzoom: 17,
                    filter: ['==', 'landuse', 'parkinglot'],
                    paint: {
                        'fill-color': 'gray',
                        'fill-opacity': { base: 1, stops: [[10, 1], [20, 0]] },
                    },
                },
                {
                    id: 'h-grass',
                    type: 'fill',
                    source: 'main',
                    'source-layer': 'landuse',
                    minzoom: 10,
                    maxzoom: 17,
                    filter: ['==', 'landuse', 'green'],
                    paint: { 'fill-color': 'green', 'fill-opacity': 0.45 },
                },
                {
                    id: 'thua-dat',
                    type: 'fill',
                    source: 'extra',
                    'source-layer': 'parcels',
                    minzoom: 17,
                    paint: {
                        'fill-color': ['case', ['boolean', ['feature-state', 'hover'], false], 'green', '#d6d6d6'],
                        'fill-opacity': ['interpolate', ['linear'], ['zoom'], 18, 0, 20, 0.8],
                    },
                },
                {
                    id: 'subparcels-outline',
                    type: 'line',
                    source: 'extra',
                    'source-layer': 'subparcels',
                    minzoom: 17,
                    paint: {
                        'line-color': 'black',
                        'line-width': { base: 0.5, stops: [[17, 0.5], [20, 1]] },
                    },
                },
                {
                    id: 'subparcels',
                    type: 'fill',
                    source: 'extra',
                    'source-layer': 'subparcels',
                    minzoom: 17,
                    paint: {
                        'fill-color': [
                            'match',
                            ['get', 'rgbcolor'],
                            '165,124,0', 'rgb(255,236,158)',
                            '127,63,0', 'rgb(255,255,255)',
                            ['concat', 'rgb(', ['get', 'rgbcolor'], ')']
                        ],
                        'fill-opacity': 0.25,
                    },
                },
                {
                    id: 'contructions',
                    type: 'line',
                    source: 'main',
                    'source-layer': 'constructions',
                    minzoom: 19,
                    paint: {
                        'line-color': 'magenta',
                        'line-opacity': 0.3,
                        'line-width': { base: 0.5, stops: [[17, 0.5], [20, 1]] },
                    },
                },
                {
                    id: 'diachi',
                    type: 'symbol',
                    source: 'main',
                    'source-layer': 'addresses',
                    minzoom: 17,
                    layout: {
                        'text-field': ['get', 'housenumber'],
                        'text-font': ['Noto Sans Regular'],
                        'text-size': 11,
                        'text-anchor': 'bottom',
                    },
                    paint: { 'text-color': 'blue' },
                },
                {
                    id: 'text-ranhqh',
                    type: 'symbol',
                    source: 'main',
                    'source-layer': 'logioi',
                    minzoom: 20,
                    layout: {
                        'text-field': 'ranh quy hoạch',
                        'text-font': ['Noto Sans Regular'],
                        'text-size': 11,
                        'symbol-placement': 'line',
                    },
                    paint: { 'text-color': 'green' },
                },
                {
                    id: 'text-longduong',
                    type: 'symbol',
                    source: 'main',
                    'source-layer': 'longduong',
                    minzoom: 20,
                    layout: {
                        'text-field': 'lòng đường quy hoạch',
                        'text-font': ['Noto Sans Regular'],
                        'text-size': 11,
                        'symbol-placement': 'line',
                    },
                    paint: { 'text-color': '#f58742' },
                },

                // === LAYER2 – Nền openmaptiles ===
                {
                    id: 'landcover_grass',
                    type: 'fill',
                    source: 'openmaptiles',
                    'source-layer': 'landcover',
                    minzoom: 10,
                    maxzoom: 14,
                    filter: ['==', 'class', 'grass'],
                    paint: { 'fill-color': 'green', 'fill-opacity': 0.45 },
                },
                {
                    id: 'road_trunk_primary',
                    type: 'line',
                    source: 'openmaptiles',
                    'source-layer': 'transportation',
                    minzoom: 10,
                    maxzoom: 15,
                    filter: ['all', ['==', '$type', 'LineString'], ['in', 'class', 'trunk', 'primary']],
                    layout: { 'line-cap': 'round', 'line-join': 'round' },
                    paint: {
                        'line-color': '#f58742',
                        'line-opacity': 0.8,
                        'line-width': { base: 1.4, stops: [[6, 0.5], [20, 20]] },
                    },
                },
                {
                    id: 'road_secondary_tertiary',
                    type: 'line',
                    source: 'openmaptiles',
                    'source-layer': 'transportation',
                    minzoom: 13,
                    maxzoom: 15,
                    filter: ['all', ['==', '$type', 'LineString'], ['in', 'class', 'secondary', 'tertiary', 'primary', 'trunk', 'motorway', 'path', 'track', 'raceway']],
                    layout: { 'line-cap': 'round', 'line-join': 'round' },
                    paint: {
                        'line-color': 'gray',
                        'line-opacity': 1,
                        'line-width': { base: 1, stops: [[6, 0.5], [20, 0.5]] },
                    },
                },
                {
                    id: 'road-osm-name',
                    type: 'symbol',
                    source: 'openmaptiles',
                    'source-layer': 'transportation_name',
                    minzoom: 10,
                    layout: {
                        'symbol-placement': 'line',
                        'text-field': '{name}',
                        'text-font': ['Noto Sans Regular'],
                        'text-size': { base: 1.5, stops: [[10, 8], [22, 30]] },
                        'text-transform': 'uppercase',
                    },
                    paint: { 'text-color': 'green' },
                },
                {
                    id: 'water',
                    type: 'fill',
                    source: 'openmaptiles',
                    'source-layer': 'water',
                    minzoom: 10,
                    filter: ['all', ['==', '$type', 'Polygon'], ['!=', 'intermittent', 1]],
                    paint: { 'fill-color': 'hsl(205, 56%, 73%)' },
                },
                {
                    id: 'water_intermittent',
                    type: 'fill',
                    source: 'openmaptiles',
                    'source-layer': 'water',
                    filter: ['all', ['==', '$type', 'Polygon'], ['==', 'intermittent', 1]],
                    paint: { 'fill-color': 'hsl(205, 56%, 73%)', 'fill-opacity': 0.7 },
                },
                {
                    id: 'admin_sub',
                    type: 'line',
                    source: 'openmaptiles',
                    'source-layer': 'boundary',
                    filter: ['in', 'admin_level', 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
                    paint: { 'line-color': 'red', 'line-width': 2, 'line-dasharray': [2, 1] },
                },
                {
                    id: 'admin_country',
                    type: 'line',
                    source: 'openmaptiles',
                    'source-layer': 'boundary',
                    filter: ['all', ['<=', 'admin_level', 2], ['==', '$type', 'LineString']],
                    layout: { 'line-cap': 'round', 'line-join': 'round' },
                    paint: {
                        'line-color': 'hsl(0, 0%, 60%)',
                        'line-width': { base: 1.3, stops: [[3, 0.5], [22, 15]] },
                    },
                },
                {
                    id: 'road_bridge_area',
                    type: 'fill',
                    source: 'openmaptiles',
                    'source-layer': 'transportation',
                    filter: ['all', ['==', '$type', 'Polygon'], ['in', 'brunnel', 'bridge']],
                    paint: { 'fill-color': 'hsl(47, 26%, 88%)', 'fill-opacity': 0.5 },
                },
                {
                    id: 'road_path',
                    type: 'line',
                    source: 'openmaptiles',
                    'source-layer': 'transportation',
                    filter: ['all', ['==', '$type', 'LineString'], ['in', 'class', 'path', 'track']],
                    layout: { 'line-cap': 'square', 'line-join': 'bevel' },
                    paint: {
                        'line-color': 'hsl(0, 0%, 97%)',
                        'line-dasharray': [1, 1],
                        'line-width': { base: 1.55, stops: [[4, 0.25], [20, 10]] },
                    },
                },
                {
                    id: 'road_minor',
                    type: 'line',
                    source: 'openmaptiles',
                    'source-layer': 'transportation',
                    minzoom: 13,
                    maxzoom: 15,
                    filter: ['all', ['==', '$type', 'LineString'], ['in', 'class', 'minor', 'service']],
                    layout: { 'line-cap': 'round', 'line-join': 'round' },
                    paint: { 'line-color': 'black', 'line-width': 0.1 },
                },
                {
                    id: 'poi_label',
                    type: 'symbol',
                    source: 'openmaptiles',
                    'source-layer': 'poi',
                    minzoom: 14,
                    filter: ['all', ['==', '$type', 'Point'], ['==', 'rank', 1]],
                    layout: {
                        'text-field': '{name}',
                        'text-font': ['Noto Sans Regular'],
                        'text-size': 11,
                        'text-anchor': 'top',
                        'text-offset': [0, 0.5],
                        'text-max-width': 8,
                    },
                    paint: {
                        'text-color': '#666',
                        'text-halo-color': 'rgba(255,255,255,0.75)',
                        'text-halo-width': 1,
                        'text-halo-blur': 1,
                    },
                },
                {
                    id: 'place_label_other',
                    type: 'symbol',
                    source: 'openmaptiles',
                    'source-layer': 'place',
                    minzoom: 10,
                    filter: ['all', ['==', '$type', 'Point'], ['!in', 'class', 'district', 'city']],
                    layout: {
                        'text-field': '{name}',
                        'text-font': ['Noto Sans Regular'],
                        'text-size': { stops: [[10, 12], [14, 17]] },
                        'text-anchor': 'center',
                        'text-max-width': 6,
                    },
                    paint: {
                        'text-color': 'blue',
                        'text-halo-color': 'hsl(0, 0%, 100%)',
                        'text-halo-width': 2,
                    },
                },
                {
                    id: 'place_label_city',
                    type: 'symbol',
                    source: 'openmaptiles',
                    'source-layer': 'place',
                    maxzoom: 16,
                    filter: ['all', ['==', '$type', 'Point'], ['==', 'class', 'city']],
                    layout: {
                        'text-field': '{name}',
                        'text-font': ['Noto Sans Regular'],
                        'text-size': { stops: [[3, 12], [8, 16]] },
                        'text-max-width': 10,
                    },
                    paint: {
                        'text-color': 'hsl(0, 0%, 0%)',
                        'text-halo-color': 'hsla(0, 0%, 100%, 0.75)',
                        'text-halo-width': 2,
                    },
                },

                // === LAYER3 – Hover, click, length, area, location ===
                { id: 'hoverLayer', type: 'fill', source: 'hoverSource', paint: { 'fill-color': 'blue', 'fill-opacity': 0.1 } },
                { id: 'hoverLayerOutline', type: 'line', source: 'hoverSource', paint: { 'line-color': 'black', 'line-width': 2 } },
                { id: 'clickLayer', type: 'fill', source: 'clickSource', paint: { 'fill-color': 'blue', 'fill-opacity': 0.02 } },
                { id: 'clickLayerOutline', type: 'line', source: 'clickSource', paint: { 'line-color': 'blue', 'line-width': 1.5 } },
                {
                    id: 'lenghtFeature',
                    type: 'symbol',
                    source: 'infoLengthFeatures',
                    layout: {
                        'text-field': ['get', 'length'],
                        'text-font': ['Noto Sans Regular'],
                        'text-size': 11,
                        'text-offset': [0, 0],
                        'text-rotation-alignment': 'viewport',
                        'text-rotate': ['get', 'angle'],
                        'text-anchor': 'center',
                    },
                    paint: { 'text-color': '#000', 'text-halo-color': '#fff', 'text-halo-width': 14 },
                },
                {
                    id: 'areaFeature',
                    type: 'symbol',
                    source: 'infoAreaFeatures',
                    layout: {
                        'text-field': ['concat', ['get', 'dientich'], ' m²'],
                        'text-font': ['Noto Sans Regular'],
                        'text-size': 11,
                        'text-anchor': 'center',
                    },
                    paint: { 'text-color': '#000' },
                },
                { id: 'pointsLocation', type: 'symbol', minzoom: 15, source: 'pointLocation', layout: { 'icon-image': 'pulsing-dot' } },
            ],
        };

        map.current = new maplibregl.Map({
            container: mapContainer.current,
            style: mapStyle,
            center: initialLngLat,
            zoom: 13,
            attributionControl: false,
        });

        popup.current = new maplibregl.Popup({
            closeButton: false,
            closeOnClick: false,
            className: 'custom-popup',
            offset: [2, -2],
        });

        marker.current = new maplibregl.Marker({ color: 'red', draggable: true })
            .setLngLat(initialLngLat)
            .addTo(map.current);

        // Helper functions
        const getParcels = (gid: any) =>
            map.current!.querySourceFeatures('extra', { sourceLayer: 'parcels', filter: ['in', '$id', gid] });

        const getFeaturesAll = (gid: any) => {
            if (!isMapLoaded.current) return [];
            const features = map.current!.queryRenderedFeatures({ layers: ['subparcels'], filter: ['==', ['get', 'gid'], gid] });
            const unique = features.reduce((acc: any[], f) => (acc.find((x: any) => x.id === f.id) ? acc : [...acc, f]), []);
            return unique;
        };

        const getLengthFeatures = (featuresAll: any[]) => {
            const lengths: any[] = [];
            featuresAll.forEach((f: any) => {
                const coords = f.geometry.coordinates[0];
                for (let i = 0; i < coords.length - 1; i++) {
                    const p1 = turf.point(coords[i]);
                    const p2 = turf.point(coords[i + 1]);
                    const len = turf.distance(p1, p2, { units: 'meters' });
                    const mid = turf.midpoint(p1, p2).geometry.coordinates;
                    const bearing = turf.bearing(p1, p2);
                    let angle = bearing - 90;
                    if (angle < -90 || angle > 90) angle -= 180;
                    lengths.push({ type: 'Feature', geometry: { type: 'Point', coordinates: mid }, properties: { length: len.toFixed(2), angle } });
                }
            });
            return lengths;
        };

        const getAreaFeatures = (featuresAll: any[]) =>
            featuresAll.map((f: any) => ({
                type: 'Feature',
                geometry: turf.centerOfMass(f).geometry,
                properties: { dientich: f.properties.dientich.toFixed(2) },
            }));

        const getAddress = (parcel: any, addressFeatures: any[] = []) => {
            const hn = addressFeatures[0]?.properties?.housenumber ? addressFeatures[0].properties.housenumber + ', ' : '';
            const sn = parcel.properties.sonha !== 'None' ? parcel.properties.sonha + ', ' : '';
            const td = parcel.properties.tenduong !== 'None' ? parcel.properties.tenduong + ', ' : '';
            const px = parcel.properties.tenphuongxa !== 'None' ? parcel.properties.tenphuongxa + ', ' : '';
            const qh = parcel.properties.tenquanhuyen || '';
            return `${hn || sn}${td}${px}${qh}`;
        };

        const updateSidebar = (parcel: any, featuresAll: any[], address: string, lngLat: maplibregl.LngLat) => {
            setParcelInfo({
                soto: parcel.properties.soto || '',
                sothua: parcel.properties.sothua || '',
                diachi: address,
                lat: lngLat.lat,
                lng: lngLat.lng,
            });
            setLandUseList(featuresAll.map((f: any) => ({
                chucnang: f.properties.chucnangsdd || 'Không xác định',
                dientich: parseFloat(f.properties.dientich.toFixed(2)),
                rgbcolor: f.properties.rgbcolor || '0,0,0',
            })));
            setSidebarOpen(true);
        };

        const handleMouseMove = (e: maplibregl.MapMouseEvent) => {
            if (!isMapLoaded.current) return;

            const features = map.current!.queryRenderedFeatures(e.point, { layers: ['subparcels'] });
            if (!features.length) {
                (map.current!.getSource('hoverSource') as maplibregl.GeoJSONSource)?.setData({ type: 'FeatureCollection', features: [] });
                popup.current?.remove();
                map.current!.getCanvas().style.cursor = 'pointer';
                return;
            }

            const feature = features[0];
            const gid = feature.properties.gid;
            const parcels = getParcels(gid);
            if (!parcels.length) return;

            const rgb = feature.properties.rgbcolor || '0,0,255';
            (map.current!.getSource('hoverSource') as maplibregl.GeoJSONSource).setData({ type: 'FeatureCollection', features: parcels as any });
            map.current!.setPaintProperty('hoverLayer', 'fill-color', `rgb(${rgb})`);
            map.current!.setPaintProperty('hoverLayer', 'fill-opacity', 0.4);

            const addrFeatures = map.current!.queryRenderedFeatures(e.point, { layers: ['diachi'] });
            const address = getAddress(parcels[0], addrFeatures);

            popup.current!
                .setLngLat(e.lngLat)
                .setHTML(`
          <div class="popup-content">
            <span class="popup-icon" style="background-color: rgb(${rgb});"></span>
            <strong>${feature.properties.chucnangsdd || 'Không xác định'}</strong>
          </div>
          <div class="popup-details">
            <p><strong>Số tờ:</strong> ${parcels[0].properties.soto || ''}, <strong>Số thửa:</strong> ${parcels[0].properties.sothua || ''}</p>
            <p><strong>Địa chỉ:</strong> ${address}</p>
          </div>
        `)
                .addTo(map.current!);
        };

        const handleClick = (e: maplibregl.MapMouseEvent) => {
            if (!isMapLoaded.current) return;

            const features = map.current!.queryRenderedFeatures(e.point, { layers: ['subparcels'] });
            if (!features.length) {
                setSidebarOpen(false);
                ['clickSource', 'infoLengthFeatures', 'infoAreaFeatures'].forEach(src =>
                    (map.current!.getSource(src) as maplibregl.GeoJSONSource)?.setData({ type: 'FeatureCollection', features: [] })
                );
                return;
            }

            const feature = features[0];
            const gid = feature.properties.gid;
            const parcels = getParcels(gid);
            if (!parcels.length) return;

            const rgb = feature.properties.rgbcolor || '0,0,255';
            map.current!.setPaintProperty('clickLayer', 'fill-color', `rgb(${rgb})`);

            const featuresAll = getFeaturesAll(gid);
            const lengths = getLengthFeatures(featuresAll);
            const areas = getAreaFeatures(featuresAll);

            (map.current!.getSource('clickSource') as maplibregl.GeoJSONSource).setData({ type: 'FeatureCollection', features: parcels as any });
            (map.current!.getSource('infoLengthFeatures') as maplibregl.GeoJSONSource).setData({ type: 'FeatureCollection', features: lengths });
            (map.current!.getSource('infoAreaFeatures') as maplibregl.GeoJSONSource).setData({ type: 'FeatureCollection', features: areas });

            const addrFeatures = map.current!.queryRenderedFeatures(e.point, { layers: ['diachi'] });
            const address = getAddress(parcels[0], addrFeatures);
            updateSidebar(parcels[0], featuresAll, address, e.lngLat);

            marker.current!.setLngLat(e.lngLat);
            setCookie('lngLat', JSON.stringify([e.lngLat.lng, e.lngLat.lat]));
        };

        // === EVENT LISTENERS ===
        map.current.on('load', () => {
            isMapLoaded.current = true;
            if (onMapReady) {
                onMapReady(map.current!);
            }

            // Add pulsing dot
            const size = 120;
            const pulsingDot: any = {
                width: size,
                height: size,
                data: new Uint8Array(size * size * 4),
                onAdd: function () {
                    const canvas = document.createElement('canvas');
                    canvas.width = this.width;
                    canvas.height = this.height;
                    (this as any).context = canvas.getContext('2d');
                },
                render: function () {
                    const duration = 1000;
                    const t = (performance.now() % duration) / duration;
                    const radius = (size / 2) * 0.3;
                    const outerRadius = (size / 2) * 0.7 * t + radius;
                    const ctx = (this as any).context;

                    ctx.clearRect(0, 0, this.width, this.height);
                    ctx.beginPath(); ctx.arc(this.width / 2, this.height / 2, outerRadius, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(255, 200, 200, ${1 - t})`; ctx.fill();

                    ctx.beginPath(); ctx.arc(this.width / 2, this.height / 2, radius, 0, Math.PI * 2);
                    ctx.fillStyle = 'rgba(255, 10, 10, 1)'; ctx.strokeStyle = 'white'; ctx.lineWidth = 3 + 4 * (1 - t);
                    ctx.fill(); ctx.stroke();

                    this.data = ctx.getImageData(0, 0, this.width, this.height).data;
                    map.current!.triggerRepaint();
                    return true;
                },
            };
            map.current!.addImage('pulsing-dot', pulsingDot, { pixelRatio: 2 });

            // Current location marker
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((pos) => {
                    const coords = [pos.coords.longitude, pos.coords.latitude];
                    (map.current!.getSource('pointLocation') as maplibregl.GeoJSONSource).setData({
                        type: 'FeatureCollection',
                        features: [{ type: 'Feature', geometry: { type: 'Point', coordinates: coords } }],
                    });
                });
            }
        });

        map.current.on('mousemove', handleMouseMove);
        map.current.on('click', handleClick);

        marker.current!.on('dragend', () => {
            const lngLat = marker.current!.getLngLat();
            const simulatedEvent = { lngLat, point: map.current!.project(lngLat) } as maplibregl.MapMouseEvent;
            handleClick(simulatedEvent);
            map.current!.panTo(lngLat);
        });

        return () => map.current?.remove();
    }, [onMapReady]);

    return (
        <>
            <div ref={mapContainer} className="map-container" />

            {sidebarOpen && parcelInfo && (
                <div id="sidebar" className="active">
                    <div className="header">
                        <h2>Thông tin thửa đất</h2>
                        <div className="GroupButton">
                            <div id="markerButton" className="Thumbtack ButtonTooltip">
                                <i className="fas fa-thumbtack"></i>
                                <span className="tooltip">Ghim vị trí đánh dấu</span>
                            </div>
                            <div className="close" onClick={() => setSidebarOpen(false)}>
                                <i className="fa fa-times"></i>
                            </div>
                        </div>
                    </div>
                    <div className="content">
                        <div className="infoContainer">
                            <p><strong>Số tờ:</strong> <span>{parcelInfo.soto}</span></p>
                            <p><strong>Số thửa:</strong> <span>{parcelInfo.sothua}</span></p>
                            <p><strong>Địa chỉ:</strong> <span>{parcelInfo.diachi}</span></p>
                            <p><strong>Toạ độ:</strong> <span>{parcelInfo.lat.toFixed(6)}</span>, <span>{parcelInfo.lng.toFixed(6)}</span></p>
                        </div>
                        <h3>Quy hoạch sử dụng đất</h3>
                        <ul id="landuse">
                            {landUseList.map((item, i) => (
                                <li key={i}>
                                    <span className="icon" style={{ backgroundColor: `rgb(${item.rgbcolor})` }}></span>
                                    {item.chucnang} ({item.dientich} m²)
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </>
    );
}