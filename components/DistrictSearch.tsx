// src/components/DistrictSearch.tsx
import { useState, useEffect, useRef } from 'react';
import { districts } from '../data/districts';
import maplibregl from 'maplibre-gl';

interface DistrictSearchProps {
    map: maplibregl.Map | null;
}

export default function DistrictSearch({ map }: DistrictSearchProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [showCoordInput, setShowCoordInput] = useState(false);
    const [coordInput, setCoordInput] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [selectedWard, setSelectedWard] = useState('');

    const searchBoxRef = useRef<HTMLDivElement>(null);

    // Đóng dropdown khi click ngoài
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchBoxRef.current && !searchBoxRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setShowCoordInput(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const flyTo = (lngLat: [number, number], zoom: number = 14) => {
        if (map) {
            map.flyTo({ center: lngLat, zoom, essential: true });
        }
    };

    const handleDistrictClick = (district: typeof districts[0]) => {
        flyTo(district.latlng, 14);
        setSelectedDistrict(district.name);
        setSelectedWard('');
        setIsOpen(false);
    };

    const handleWardClick = (ward: typeof districts[0]['wards'][0], districtName: string) => {
        flyTo(ward.latlng, 17);
        setSelectedDistrict(districtName);
        setSelectedWard(ward.name);
        setIsOpen(false);
    };

    const handleCoordSearch = () => {
        const trimmed = coordInput.trim();
        const match = trimmed.match(/^(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)$/);
        if (match && map) {
            const lat = parseFloat(match[1]);
            const lng = parseFloat(match[2]);
            if (lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
                flyTo([lng, lat], 18);
                setCoordInput('');
                setShowCoordInput(false);
            } else {
                alert('Tọa độ không hợp lệ!');
            }
        } else {
            alert('Vui lòng nhập đúng định dạng: lat, lng (vd: 10.7769, 106.7009)');
        }
    };

    return (
        <div className="GroupSearch" ref={searchBoxRef}>
            <i className="fas fa-caret-down" onClick={() => setIsOpen(!isOpen)} style={{ cursor: 'pointer' }}></i>

            <div className="FilterText">
                <span className="FilterText-Default" style={{ display: selectedDistrict ? 'none' : 'inline' }}>
                    Khu vực
                </span>
                {selectedDistrict && (
                    <>
                        <span className="FilterText-Title">{selectedDistrict}</span>
                        {selectedWard && <span className="FilterText-Sub">{selectedWard}</span>}
                    </>
                )}
            </div>

            {/* Dropdown danh sách quận/phường */}
            <div className="FilterItems" style={{ display: isOpen ? 'block' : 'none' }}>
                <ul>
                    {districts.map((district) => (
                        <li className="filter-item" key={district.name}>
                            <a
                                href="javascript:void(0)"
                                onClick={() => handleDistrictClick(district)}
                                className="jGetLatLng"
                            >
                                {district.name} <i className="fa fa-chevron-right"></i>
                            </a>
                            {district.wards && district.wards.length > 0 && (
                                <ul>
                                    {district.wards.map((ward) => (
                                        <li key={ward.name}>
                                            <a
                                                href="javascript:void(0)"
                                                onClick={() => handleWardClick(ward, district.name)}
                                                className="jGetLatLng"
                                            >
                                                {ward.name}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Các nút chức năng */}
            <div className="GroupButton">
                <div
                    className="ButtonZone Search jSearch"
                    onClick={() => setShowCoordInput(!showCoordInput)}
                    title="Tìm theo tọa độ"
                >
                    <i className="fa fa-search"></i>
                </div>

                <div className="ButtonZone ButtonTooltip Location" title="Vị trí hiện tại của bạn">
                    <i className="fa fa-location-arrow"></i>
                </div>
            </div>

            {/* Ô nhập tọa độ */}
            <div className={`FrmItems jFrmInput SearchBox jGetSearchBox ${showCoordInput ? 'active' : ''}`}>
                <input
                    type="text"
                    placeholder="Nhập tọa độ (vd: 10.7769, 106.7009)"
                    value={coordInput}
                    onChange={(e) => setCoordInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleCoordSearch()}
                    className="FrmInput jEle"
                />
                <div className="fIconLeft">
                    <i className="fa fa-search"></i>
                </div>
            </div>
        </div>
    );
}