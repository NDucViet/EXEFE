import { lazy, Suspense, useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Fix Leaflet default marker icon issue
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import axios from 'axios';

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

interface AbsoluteLocation {
    id: number;
    ing: number;
    lat: number;
    houseId: number;
}

interface Room {
    id: number;
    name: string;
    address: string;
    ownerId: string;
    price: number;
    status: number;
    numberOfPeople: number | null;
    area: number | null;
    description: string | null;
    createAt: string;
    rate: number | null;
    location: number;
    absoluteLocation: AbsoluteLocation;
    images: string[];
}

const RoomList = () => {
    const [activeFilter, setActiveFilter] = useState('tất cả');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
    const [rooms, setRooms] = useState<Room[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const response = await axios.post('https://localhost:7135/api/House/GetAllHouse');
                if (!response.data) {
                    throw new Error('Failed to fetch rooms');
                }
                const data = await response.data;
                setRooms(data);
                setLoading(false);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
                setLoading(false);
            }
        };

        fetchRooms();
    }, []);

    const handleViewDetail = (roomId: number, e: React.MouseEvent) => {
        e.stopPropagation();
        navigate(`/phong/${roomId}`);
    };

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
            if (room.absoluteLocation) {
                acc.lat += room.absoluteLocation.lat;
                acc.lng += room.absoluteLocation.ing;
            }
            return acc;
        },
        { lat: 16.047079, lng: 108.206230 } // Default center (Da Nang city)
    );

    if (rooms.length > 0) {
        center.lat /= rooms.length;
        center.lng /= rooms.length;
    }

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Đang tải...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert-danger m-3" role="alert">
                {error}
            </div>
        );
    }

    return (
        <div className="room-list-page" style={{ backgroundImage: 'url("./img/backgroundRoomList.jpg")', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', minHeight: '100vh', padding: '2rem' }}>
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
                        room.absoluteLocation && (
                            <React.Fragment key={room.id}>
                                <Marker
                                    position={[room.absoluteLocation.lat, room.absoluteLocation.ing]}
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
                                            }}>{room.name}</span>
                                            <span style={{
                                                ...tooltipStyle.price,
                                                color: selectedRoom?.id === room.id ? '#ffffff' : '#3498db',
                                                fontWeight: selectedRoom?.id === room.id ? '600' : 'bold',
                                                fontSize: '11px'
                                            }}>
                                                {room.price.toLocaleString()}đ
                                            </span>
                                            <Link 
                                                to={`/phong/${room.id}`}
                                                style={{
                                                    display: 'block',
                                                    textDecoration: 'none',
                                                    backgroundColor: selectedRoom?.id === room.id ? '#ffffff' : '#3498db',
                                                    color: selectedRoom?.id === room.id ? '#3498db' : '#ffffff',
                                                    padding: '2px 6px',
                                                    borderRadius: '4px',
                                                    marginTop: '4px',
                                                    fontSize: '11px',
                                                    textAlign: 'center',
                                                    transition: 'all 0.2s ease'
                                                }}
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                Xem chi tiết
                                            </Link>
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
                                            }}>{room.name}</h5>
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
                                                <span><i className="bi bi-people me-1"></i>{room.numberOfPeople || '-'} Người</span>
                                                <span><i className="bi bi-star me-1"></i>{room.rate || '-'}</span>
                                                <span><i className="bi bi-arrows me-1"></i>{room.area || '-'}m²</span>
                                            </div>
                                        </div>
                                    </Popup>
                                </Marker>
                                {room.absoluteLocation && (
                                    <Suspense fallback={null}>
                                        <ZoomToMarker
                                            position={[room.absoluteLocation.lat, room.absoluteLocation.ing]}
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
                    {rooms.length === 0 ? (
                        <div className="col-12 text-center">
                            <p>Không tìm thấy phòng nào.</p>
                        </div>
                    ) : (
                        rooms.map(room => (
                            <div
                                key={room.id}
                                className="col-md-6 col-lg-4"
                                style={{ cursor: 'pointer' }}
                                onClick={() => {
                                    handleRoomClick(room);
                                    setSelectedRoom(room);
                                    window.scrollTo({
                                        top: 0,
                                        behavior: 'smooth'
                                    });
                                }}
                            >
                                <div className={`card h-100 border-0 shadow-sm ${selectedRoom?.id === room.id ? 'border border-primary' : ''}`}>
                                    <img 
                                        src={room.images && room.images.length > 0 ? room.images[0] : './img/imgLandingPage.png'} 
                                        className="card-img-top" 
                                        alt={room.name} 
                                        style={{ height: '200px', objectFit: 'cover' }} 
                                    />
                                    <div className="card-body">
                                        <div className="d-flex justify-content-between align-items-start mb-2">
                                            <h5 className="card-title mb-0">{room.name}</h5>
                                            <span className="badge bg-primary">{room.price.toLocaleString()}VND/tháng</span>
                                        </div>
                                        <p className="card-text text-muted small mb-3">{room.address}</p>
                                        <div className="d-flex justify-content-between text-muted small">
                                            <span><i className="bi bi-people me-1"></i>{room.numberOfPeople || '-'} Người</span>
                                            <span><i className="bi bi-star me-1"></i>{room.rate || '-'}</span>
                                            <span><i className="bi bi-arrows me-1"></i>{room.area || '-'}m²</span>
                                        </div>
                                        <div className="mt-3 d-grid">
                                            <button
                                                className="btn btn-outline-primary"
                                                onClick={(e) => handleViewDetail(room.id, e)}
                                            >
                                                Xem chi tiết
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {rooms.length > 0 && (
                    <div className="text-center mt-5">
                        <button className="btn btn-primary px-4">
                            Xem thêm
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RoomList;