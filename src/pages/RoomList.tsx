import { lazy, Suspense, useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Fix Leaflet default marker icon issue
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import axios from 'axios';

// Lazy load components
const ZoomToMarker = lazy(() => import('../components/ZoomToMarker'));
const CreateRoomModal = lazy(() => import('../components/CreateRoomModal'));

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
    lat: number;
    ing: number;
}

interface Comment {
    id: number;
    content: string;
    createdAt: string;
}

interface AppUser {
    id: string;
    displayName: string;
    number: string;
    email: string | null;
    avatar: string | null;
    isDisable: boolean;
    location?: UserLocation;
}

interface Room {
    id: number;
    address: string;
    description: string;
    area: number;
    absoluteLocation: AbsoluteLocation;
    houseImages: string[] | null;
    comments: Comment[];
    appUser: AppUser;
}

interface UserLocation {
    id?: number;
    lat: number;
    ing: number;
    userId?: string;
}

const RoomList = () => {
    const [activeFilter, setActiveFilter] = useState('tất cả');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
    const [rooms, setRooms] = useState<Room[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
    const navigate = useNavigate();
    const { user } = useAuth();

    const fetchUserInfo = async () => {
        try {
            const response = await axios.get('https://localhost:7135/api/User/UserDetail', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                }
            });
            if (response.data && response.data.userLocation) {
                setUserLocation({
                    id: response.data.userLocation.id,
                    lat: response.data.userLocation.lat,
                    ing: response.data.userLocation.ing
                });
            }
        } catch (err) {
            console.error('Failed to fetch user info:', err);
        }
    };

    useEffect(() => {
        if (user) {
            fetchUserInfo();
        }
    }, [user]);

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

    useEffect(() => {
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

    // Calculate center position based on user location or room locations
    const center = userLocation ? 
        { lat: userLocation.lat, lng: userLocation.ing, count: 1 } :
        rooms.reduce(
            (acc, room) => {
                if (room.appUser?.location && 
                    typeof room.appUser.location.lat === 'number' && 
                    !isNaN(room.appUser.location.lat) &&
                    typeof room.appUser.location.ing === 'number' && 
                    !isNaN(room.appUser.location.ing)) {
                    acc.lat += room.appUser.location.lat;
                    acc.lng += room.appUser.location.ing;
                    acc.count++;
                }
                return acc;
            },
            { lat: 0, lng: 0, count: 0 }
        );

    // Default to Da Nang coordinates if no valid coordinates found
    const defaultCenter: [number, number] = [16.047079, 108.206230];

    // Calculate average only if we have valid coordinates
    const mapCenter: [number, number] = center.count > 0
        ? [center.lat / center.count, center.lng / center.count]
        : defaultCenter;

    // Validate the calculated center
    const finalCenter: [number, number] = [
        isNaN(mapCenter[0]) ? defaultCenter[0] : mapCenter[0],
        isNaN(mapCenter[1]) ? defaultCenter[1] : mapCenter[1]
    ];

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
                height: '600px',
                width: '100%',
                marginBottom: '2rem',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                borderRadius: '8px',
                overflow: 'hidden'
            }}>
                <MapContainer
                    center={finalCenter}
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
                    {/* Đoạn code này map qua mảng rooms để hiển thị marker cho mỗi phòng trọ trên bản đồ */}
                    {rooms.map((room) => (
                        /* Kiểm tra điều kiện để đảm bảo phòng có vị trí hợp lệ:
                           1. Phải có absoluteLocation
                           2. Latitude phải là số và không phải NaN  
                           3. Longitude phải là số và không phải NaN
                           
                           Nếu thiếu các điều kiện này, marker sẽ không hiển thị được
                           Cần đảm bảo dữ liệu room.absoluteLocation được set đúng từ API
                        */
                        room.absoluteLocation &&
                        typeof room.absoluteLocation.lat === 'number' && 
                        !isNaN(room.absoluteLocation.lat) &&
                        typeof room.absoluteLocation.ing === 'number' && 
                        !isNaN(room.absoluteLocation.ing) && (
                            <React.Fragment key={room.id}>
                                {/* Marker đánh dấu vị trí phòng trên bản đồ */}
                                <Marker
                                    position={[room.absoluteLocation.lat, room.absoluteLocation.ing]}
                                    eventHandlers={{
                                        click: () => handleRoomClick(room),
                                    }}
                                >
                                    {/* Tooltip hiển thị thông tin khi hover vào marker */}
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
                                            }}>{room.address}</span>
                                            <span style={{
                                                ...tooltipStyle.price,
                                                color: selectedRoom?.id === room.id ? '#ffffff' : '#3498db',
                                                fontWeight: selectedRoom?.id === room.id ? '600' : 'bold',
                                                fontSize: '11px'
                                            }}>
                                                {room.area?.toLocaleString() || '0'}m²
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
                                            }}>{room.address}</h5>
                                            <p style={{
                                                fontSize: '14px',
                                                color: '#7f8c8d',
                                                marginBottom: '5px'
                                            }}>{room.description}</p>
                                            <p style={{
                                                fontSize: '15px',
                                                fontWeight: 'bold',
                                                color: '#3498db',
                                                marginBottom: '0'
                                            }}>Diện tích: {room.area?.toLocaleString() || '0'}m²</p>
                                            <div style={{
                                                marginTop: '8px',
                                                padding: '5px 0',
                                                borderTop: '1px solid #eee',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                fontSize: '12px',
                                                color: '#95a5a6'
                                            }}>
                                                <span><i className="bi bi-people me-1"></i>{room.appUser?.displayName || '-'}</span>
                                            </div>
                                        </div>
                                    </Popup>
                                </Marker>
                                {room.absoluteLocation && 
                                 typeof room.absoluteLocation.lat === 'number' && 
                                 !isNaN(room.absoluteLocation.lat) &&
                                 typeof room.absoluteLocation.ing === 'number' && 
                                 !isNaN(room.absoluteLocation.ing) && (
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
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h2 className="mb-0">GẦN BẠN</h2>
                        <p className="text-muted mb-0">Những căn phòng gần vị trí của bạn nhất</p>
                    </div>
                    <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
                        <i className="bi bi-plus-circle me-2"></i>
                        Tạo trọ mới
                    </button>
                </div>

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
                                        src={room.houseImages && room.houseImages.length > 0 ? room.houseImages[0] : './img/imgLandingPage.png'} 
                                        className="card-img-top" 
                                        alt={room.address} 
                                        style={{ height: '200px', objectFit: 'cover' }} 
                                    />
                                    <div className="card-body">
                                        <div className="d-flex justify-content-between align-items-start mb-2">
                                            <h5 className="card-title mb-0">{room.address}</h5>
                                            <span className="badge bg-primary">{room.area.toLocaleString()}m²</span>
                                        </div>
                                        <p className="card-text text-muted small mb-3">{room.description}</p>
                                        <div className="d-flex justify-content-between text-muted small">
                                            <span><i className="bi bi-people me-1"></i>{room.appUser?.displayName || '-'}</span>
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

            <Suspense fallback={null}>
                <CreateRoomModal 
                    show={showCreateModal}
                    onHide={() => setShowCreateModal(false)}
                    onSubmit={(roomData) => {
                        console.log(roomData);
                        setShowCreateModal(false);
                        fetchRooms(); // Refresh the room list after creating a new room
                    }}
                    fetchRooms={fetchRooms}
                />
            </Suspense>
        </div>
    );
};

export default RoomList;