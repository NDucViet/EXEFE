import { lazy, Suspense, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import React from 'react';

// Fix Leaflet default marker icon issue
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Lazy load components
const ZoomToMarker = lazy(() => import('../components/ZoomToMarker'));

const DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom styles for the tooltip
const tooltipStyle = {
    container: {
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        padding: '6px 10px',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        border: 'none',
        borderRadius: '8px',
        boxShadow: '0 3px 10px rgba(0, 0, 0, 0.15)',
        fontSize: '13px',
        fontWeight: '500',
        color: '#2c3e50',
        minWidth: '120px',
        textAlign: 'center' as const
    },
    price: {
        fontSize: '11px',
        color: '#3498db',
        fontWeight: 'bold',
        marginTop: '2px'
    }
};

interface Room {
    id: string;
    title: string;
    price: number;
    address: string;
    image: string;
    bedrooms: number;
    bathrooms: number;
    area: number;
    location?: {
        lat: number;
        lng: number;
    };
}

const RoomList = () => {
    const [activeFilter, setActiveFilter] = useState('tất cả');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);


    const rooms: Room[] = [
        {
            id: '1',
            title: 'HOMESTAY GẦN BIỂN MỸ KHÊ',
            price: 3500000,
            address: '15 Hoàng Sa, Phước Mỹ, Sơn Trà, Đà Nẵng',
            image: './img/room1.jpg',
            bedrooms: 2,
            bathrooms: 1,
            area: 45,
            location: {
                lat: 16.064167,
                lng: 108.245809
            }
        },
        {
            id: '2',
            title: 'PHÒNG TRỌ GẦN ĐH KINH TẾ',
            price: 2800000,
            address: '121 Ngô Sĩ Liên, Hòa Khánh Nam, Liên Chiểu, Đà Nẵng',
            image: './img/room2.jpg',
            bedrooms: 1,
            bathrooms: 1,
            area: 30,
            location: {
                lat: 16.079809,
                lng: 108.149869
            }
        },
        {
            id: '3',
            title: 'CCMN GẦN DRAGON BRIDGE',
            price: 4200000,
            address: '68 Bạch Đằng, Hải Châu, Đà Nẵng',
            image: './img/room3.jpg',
            bedrooms: 2,
            bathrooms: 1,
            area: 50,
            location: {
                lat: 16.072498,
                lng: 108.224907
            }
        },
        {
            id: '4',
            title: 'PHÒNG TRỌ CAO CẤP HÒA KHÁNH',
            price: 3000000,
            address: '55 Ngô Thì Nhậm, Hòa Khánh Bắc, Liên Chiểu, Đà Nẵng',
            image: './img/room1.jpg',
            bedrooms: 1,
            bathrooms: 1,
            area: 35,
            location: {
                lat: 16.085676,
                lng: 108.158669
            }
        },
        {
            id: '5',
            title: 'STUDIO GẦN CÔNG VIÊN APEC',
            price: 5000000,
            address: '25 Như Nguyệt, An Hải Bắc, Sơn Trà, Đà Nẵng',
            image: './img/room2.jpg',
            bedrooms: 1,
            bathrooms: 1,
            area: 40,
            location: {
                lat: 16.065836,
                lng: 108.232670
            }
        },
        {
            id: '6',
            title: 'PHÒNG TRỌ GẦN CHỢ HÀN',
            price: 3800000,
            address: '90 Hùng Vương, Hải Châu, Đà Nẵng',
            image: './img/room3.jpg',
            bedrooms: 2,
            bathrooms: 1,
            area: 45,
            location: {
                lat: 16.067789,
                lng: 108.221345
            }
        },
        {
            id: '7',
            title: 'PHÒNG TRỌ SINH VIÊN GẦN ĐH BÁCH KHOA',
            price: 2500000,
            address: '45 Ngô Văn Sở, Hòa Khánh Nam, Liên Chiểu, Đà Nẵng',
            image: './img/room1.jpg',
            bedrooms: 1,
            bathrooms: 1,
            area: 25,
            location: {
                lat: 16.075643,
                lng: 108.149098
            }
        },
        {
            id: '8',
            title: 'CCMN GẦN BÃI TẮM PHẠM VĂN ĐỒNG',
            price: 4500000,
            address: '168 Võ Nguyên Giáp, Phước Mỹ, Sơn Trà, Đà Nẵng',
            image: './img/room2.jpg',
            bedrooms: 2,
            bathrooms: 1,
            area: 55,
            location: {
                lat: 16.070123,
                lng: 108.245123
            }
        }
    ];

    const handleRoomClick = (room: Room, e?: React.MouseEvent) => {
        // Prevent event bubbling
        e?.stopPropagation();

        if (selectedRoom?.id === room.id) {
            setSelectedRoom(null);
        } else {
            setSelectedRoom(room);
        }
    };

    // Calculate center position based on all room locations
    const center = rooms.reduce(
        (acc, room) => {
            if (room.location) {
                acc.lat += room.location.lat;
                acc.lng += room.location.lng;
            }
            return acc;
        },
        { lat: 0, lng: 0 }
    );

    center.lat /= rooms.length;
    center.lng /= rooms.length;

    return (
        <div className="room-list-page">
            {/* Map Section - Increased height */}
            <div style={{
                height: '600px', // Increased from 400px to 600px
                width: '100%',
                marginBottom: '2rem', // Added margin for better spacing
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)', // Added subtle shadow
                borderRadius: '8px', // Added rounded corners
                overflow: 'hidden' // Ensure the border radius works with the map
            }}>
                <MapContainer
                    center={[center.lat, center.lng]}
                    zoom={12}
                    style={{ height: '100%', width: '100%' }}
                    scrollWheelZoom={true}
                    maxZoom={18}
                    minZoom={11}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {rooms.map((room) => (
                        room.location && (
                            <React.Fragment key={room.id}>
                                <Marker
                                    position={[room.location.lat, room.location.lng]}
                                    eventHandlers={{
                                        click: () => handleRoomClick(room),
                                    }}
                                >
                                    <Tooltip
                                        permanent
                                        direction="top"
                                        offset={[0, -20]}
                                        opacity={1}
                                        interactive={true}
                                    >
                                        <div
                                            onClick={(e) => handleRoomClick(room, e)}
                                            style={{
                                                ...tooltipStyle.container,
                                                cursor: 'pointer',
                                                transform: selectedRoom?.id === room.id ? 'scale(1.1)' : 'scale(1)',
                                                transition: 'all 0.2s ease',
                                                backgroundColor: selectedRoom?.id === room.id
                                                    ? 'rgba(52, 152, 219, 0.95)'
                                                    : 'rgba(255, 255, 255, 0.95)',
                                                color: selectedRoom?.id === room.id
                                                    ? '#ffffff'
                                                    : '#2c3e50',
                                                border: selectedRoom?.id === room.id
                                                    ? '2px solid #2980b9'
                                                    : 'none',
                                                boxShadow: selectedRoom?.id === room.id
                                                    ? '0 4px 15px rgba(52, 152, 219, 0.3)'
                                                    : '0 3px 10px rgba(0, 0, 0, 0.15)',
                                                fontSize: '12px',
                                                padding: '4px 8px',
                                                minWidth: '100px'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.transform = 'scale(1.05)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.transform = selectedRoom?.id === room.id ? 'scale(1.1)' : 'scale(1)';
                                            }}
                                        >
                                            <span style={{
                                                fontWeight: selectedRoom?.id === room.id ? '600' : '500',
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                maxWidth: '150px',
                                                display: 'block'
                                            }}>{room.title}</span>
                                            <span style={{
                                                ...tooltipStyle.price,
                                                color: selectedRoom?.id === room.id ? '#ffffff' : '#3498db',
                                                fontWeight: selectedRoom?.id === room.id ? '600' : 'bold',
                                                fontSize: '11px'
                                            }}>
                                                {room.price.toLocaleString()}đ
                                            </span>
                                        </div>
                                    </Tooltip>
                                    <Popup>
                                        <div style={{
                                            padding: '5px',
                                            minWidth: '200px'
                                        }}>
                                            <h5 style={{
                                                fontSize: '16px',
                                                fontWeight: 'bold',
                                                marginBottom: '8px',
                                                color: '#2c3e50'
                                            }}>{room.title}</h5>
                                            <p style={{
                                                fontSize: '14px',
                                                color: '#7f8c8d',
                                                marginBottom: '5px'
                                            }}>{room.address}</p>
                                            <p style={{
                                                fontSize: '15px',
                                                fontWeight: 'bold',
                                                color: '#3498db',
                                                marginBottom: '0'
                                            }}>Giá: {room.price.toLocaleString()}VND/tháng</p>
                                            <div style={{
                                                marginTop: '8px',
                                                padding: '5px 0',
                                                borderTop: '1px solid #eee',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                fontSize: '12px',
                                                color: '#95a5a6'
                                            }}>
                                                <span>{room.bedrooms} Phòng</span>
                                                <span>{room.bathrooms} Phòng tắm</span>
                                                <span>{room.area}m²</span>
                                            </div>
                                        </div>
                                    </Popup>
                                </Marker>
                                {room.location && (
                                    <Suspense fallback={null}>
                                        <ZoomToMarker
                                            position={[room.location.lat, room.location.lng]}
                                            isSelected={selectedRoom?.id === room.id}
                                        />
                                    </Suspense>
                                )}
                            </React.Fragment>
                        )
                    ))}
                </MapContainer>
            </div>

            {/* Content Section - Adjusted spacing */}
            <div className="container py-4"> {/* Reduced top padding due to increased map height */}
                <h2 className="text-center mb-3">GẦN BẠN</h2>
                <p className="text-center text-muted mb-4">Những căn phòng gần vị trí của bạn nhất</p>

                {/* Filters */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div className="filters">
                        <button
                            className={`btn btn-sm me-2 ${activeFilter === 'tất cả' ? 'btn-primary' : 'btn-outline-primary'}`}
                            onClick={() => setActiveFilter('tất cả')}
                        >
                            tất cả
                        </button>
                        <button
                            className={`btn btn-sm me-2 ${activeFilter === 'giá phòng' ? 'btn-primary' : 'btn-outline-primary'}`}
                            onClick={() => setActiveFilter('giá phòng')}
                        >
                            giá phòng
                        </button>
                        <button
                            className={`btn btn-sm ${activeFilter === 'gần đây' ? 'btn-primary' : 'btn-outline-primary'}`}
                            onClick={() => setActiveFilter('gần đây')}
                        >
                            gần đây
                        </button>
                    </div>
                    <div className="search-box">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* Room Grid */}
                <div className="row g-4">
                    {rooms.map(room => (
                        <div
                            key={room.id}
                            className="col-md-6 col-lg-4"
                            style={{ cursor: 'pointer' }}
                            onClick={() => {
                                handleRoomClick(room);
                                if (room.location) {
                                    setSelectedRoom(room);
                                    // Scroll to map when clicking a room card
                                    window.scrollTo({
                                        top: 0,
                                        behavior: 'smooth'
                                    });
                                }
                            }}
                        >
                            <div className={`card h-100 border-0 shadow-sm ${selectedRoom?.id === room.id ? 'border border-primary' : ''}`}>
                                <img src={room.image} className="card-img-top" alt={room.title} style={{ height: '200px', objectFit: 'cover' }} />
                                <div className="card-body">
                                    <div className="d-flex justify-content-between align-items-start mb-2">
                                        <h5 className="card-title mb-0">{room.title}</h5>
                                        <span className="badge bg-primary">{room.price.toLocaleString()}VND/tháng</span>
                                    </div>
                                    <p className="card-text text-muted small mb-3">{room.address}</p>
                                    <div className="d-flex justify-content-between text-muted small">
                                        <span><i className="bi bi-house-door me-1"></i>{room.bedrooms} Phòng</span>
                                        <span><i className="bi bi-droplet me-1"></i>{room.bathrooms} Phòng tắm</span>
                                        <span><i className="bi bi-arrows me-1"></i>{room.area}m²</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Load More Button */}
                <div className="text-center mt-5">
                    <button className="btn btn-primary px-4">
                        Xem thêm
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RoomList;