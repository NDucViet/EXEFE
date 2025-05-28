import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet default marker icon issue
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import axios from 'axios';

const DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface AbsoluteLocation {
    id: number;
    latitude: number;
    longitude: number;
}

interface AppUser {
    id: string;
    displayName: string;
    number: string;
    email: string | null;
    avatar: string | null;
    isDisable: boolean;
}

// Thêm interface cho houseImages
interface HouseImage {
    id: number;
    imageUrl: string;
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
    images?: string[];
    houseImages: HouseImage[];
    appUser: AppUser;
}

const RoomDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [room, setRoom] = useState<Room | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Default center coordinates (Da Nang)
    const defaultCenter: [number, number] = [16.047079, 108.206230];

    // Get valid map center coordinates
    const getMapCenter = (room: Room | null): [number, number] => {
        if (!room?.absoluteLocation) return defaultCenter;
        
        const { latitude, longitude } = room.absoluteLocation;
        
        if (typeof latitude === 'number' && !isNaN(latitude) &&
            typeof longitude === 'number' && !isNaN(longitude)) {
            return [latitude, longitude];
        }
        
        return defaultCenter;
    };

    useEffect(() => {
        const fetchRoomDetail = async () => {
            try {
                const response = await axios.get(`https://localhost:7135/api/House/GetHouseById?id=${id}`);
                if (!response.data) {
                    throw new Error('No data received from server');
                }
                setRoom(response.data);
                console.log(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching room details:', error);
                setError(error instanceof Error ? error.message : 'Failed to load room details');
                setLoading(false);
            }
        };

        if (id) {
            fetchRoomDetail();
        }
    }, [id]);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Đang tải...</span>
                </div>
            </div>
        );
    }

    if (error || !room) {
        return (
            <div className="alert alert-danger m-3" role="alert">
                {error || 'Room not found'}
            </div>
        );
    }

    const mapCenter = getMapCenter(room);

    // Lấy danh sách url ảnh từ houseImages
    const imageUrls = room.houseImages?.map((img: { imageUrl: string }) => img.imageUrl) || [];
    const defaultImage = '/img/imgLandingPage.png';
    const mainImage = imageUrls.length > 0 ? imageUrls[0] : defaultImage;
    const additionalImages = imageUrls.length > 1 ? imageUrls.slice(1, 4).map(url => url) : [];

    return (
        <div 
            className="room-detail-container min-vh-100"
            style={{
                backgroundImage: 'url("/img/backgroundRoomDetail.jpg")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backgroundColor: 'rgba(241, 245, 249, 0.9)',
                backgroundBlendMode: 'overlay',
                paddingTop: '80px'
            }}
        >
            <div className="position-relative" style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
                {/* Thư viện ảnh chính */}
                <div className="position-relative mb-3">
                    {/* Nhãn giá */}
                    <div className="position-absolute start-0 top-0 m-3 z-1">
                        <div className="bg-white rounded-pill d-flex align-items-center p-2" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                            <div className="bg-primary rounded-circle p-2 me-2 d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}>
                                <i className="bi bi-camera-video fs-6 text-white"></i>
                            </div>
                            <div>
                                <div className="text-primary small" style={{ fontSize: '12px' }}>Còn trống {room.numberOfPeople || 0} người</div>
                                <div className="fw-bold" style={{ fontSize: '14px', color: '#2F80ED' }}>
                                    {room.price ? room.price.toLocaleString() : '0'} VNĐ<span style={{ fontSize: '12px' }}>/tháng</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Thư viện ảnh */}
                    <div className="container-fluid px-0">
                        <div className="row g-2">
                            <div className="col-12 col-md-8">
                                <img
                                    src={mainImage}
                                    alt="Ảnh chính"
                                    className="w-100"
                                    style={{ height: '350px', objectFit: 'cover', borderRadius: '8px' }}
                                />
                            </div>
                            <div className="col-md-4 d-none d-md-block">
                                <div className="row g-2">
                                    {additionalImages.map((url, index) => (
                                        <div key={index} className="col-12">
                                            <img
                                                src={url}
                                                alt={`Ảnh phòng ${index + 2}`}
                                                className="w-100"
                                                style={{ height: '114px', objectFit: 'cover', borderRadius: '8px' }}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Thông tin phòng */}
                    <div className="position-absolute bottom-0 start-0 m-3">
                        <div className="bg-white rounded-3 p-2" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                            <div className="d-flex align-items-center">
                                <div className="bg-primary rounded-circle p-2 me-2 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                                    <i className="bi bi-house-door fs-5 text-white"></i>
                                </div>
                                <div>
                                    <h5 className="mb-1 fw-bold text-primary" style={{ fontSize: '16px' }}>{room.name}</h5>
                                    <p className="mb-0 text-muted" style={{ fontSize: '14px' }}>{room.address}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row g-3">
                    <div className="col-md-8">
                        {/* Bản đồ và nút hành động */}
                        <div className="position-relative">
                            <div style={{ height: '300px', borderRadius: '12px', overflow: 'hidden' }}>
                                <MapContainer
                                    center={mapCenter}
                                    zoom={15}
                                    style={{ height: '100%', width: '100%' }}
                                >
                                    <TileLayer
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    />
                                    {room.absoluteLocation && 
                                     typeof room.absoluteLocation.latitude === 'number' && 
                                     !isNaN(room.absoluteLocation.latitude) &&
                                     typeof room.absoluteLocation.longitude === 'number' && 
                                     !isNaN(room.absoluteLocation.longitude) && (
                                        <Marker position={[room.absoluteLocation.latitude, room.absoluteLocation.longitude]}>
                                            <Popup>{room.address}</Popup>
                                        </Marker>
                                    )}
                                </MapContainer>
                            </div>
                            <div className="position-absolute bottom-0 start-0 w-100 p-2 d-flex justify-content-between">
                                <button className="btn btn-primary px-3 py-1 fw-bold" style={{ fontSize: '14px' }}>
                                    THUÊ NGAY
                                    <i className="bi bi-arrow-right ms-2"></i>
                                </button>
                                <button className="btn btn-light px-3 py-1 fw-bold" style={{ fontSize: '14px' }}>
                                    BẢN ĐỒ
                                    <i className="bi bi-arrow-right ms-2"></i>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4">
                        {/* Mô tả */}
                        <div className="bg-primary rounded-3 p-3 mb-3 text-white">
                            <div className="d-flex align-items-center mb-2">
                                <div className="bg-white rounded-circle p-2 me-2 d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}>
                                    <i className="bi bi-file-text text-primary fs-6"></i>
                                </div>
                                <h6 className="mb-0 fw-bold">MÔ TẢ CHUNG</h6>
                            </div>
                            <p className="mb-0" style={{ fontSize: '14px', lineHeight: '1.6' }}>{room.description}</p>
                        </div>

                        {/* Liên hệ */}
                        <div className="bg-white rounded-3 p-3" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                            <div className="d-flex align-items-center mb-3">
                                <img
                                    src={'/img/imgLandingPage.png'}
                                    alt={'cc'}
                                    className="rounded-circle me-2"
                                    width="48"
                                    height="48"
                                    style={{ objectFit: 'cover' }}
                                />
                                <div>
                                    <h6 className="mb-1 fw-bold">{room.name}</h6>
                                    <div className="text-warning" style={{ fontSize: '12px' }}>
                                        {[...Array(5)].map((_, index) => (
                                            <i
                                                key={index}
                                                className={`bi bi-star${index < (room.rate || 0) ? '-fill' : ''} me-1`}
                                            ></i>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="mb-3">
                                <div className="d-flex align-items-center">
                                    <h6 className="mb-0 me-2 fw-bold" style={{ fontSize: '14px' }}>SĐT:</h6>
                                    <span className="text-primary fw-bold" style={{ fontSize: '14px' }}>
                                        {room.appUser?.number || 'Chưa cập nhật'}
                                    </span>
                                </div>
                            </div>
                            <div className="d-grid gap-2">
                                <button className="btn btn-outline-primary py-2 fw-bold" style={{ fontSize: '14px' }}>
                                    <i className="bi bi-chat-dots me-2"></i>
                                    NHẮN TIN
                                </button>
                                <button className="btn btn-primary py-2 fw-bold" style={{ fontSize: '14px' }}>
                                    <i className="bi bi-telephone me-2"></i>
                                    GỌI NGAY
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RoomDetail;