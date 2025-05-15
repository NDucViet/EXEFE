import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet default marker icon issue
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface Room {
    id: string;
    title: string;
    price: number;
    address: string;
    images: string[];
    rooms: number;
    description: string;
    contact: {
        name: string;
        phone: string;
        rating: number;
        avatar: string;
    };
    location: {
        lat: number;
        lng: number;
    };
}

const RoomDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [room, setRoom] = useState<Room | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const fetchRoomDetails = () => {
            const mockRoom: Room = {
                id: '1',
                title: 'LAM HOME',
                price: 2000000,
                address: '21 Thái tự, Đà Nẵng',
                images: [
                    '../img/imgLandingPage.png',
                    '../img/imgLandingPage.png',
                    '../img/imgLandingPage.png',
                    '../img/imgLandingPage.png'
                ],
                rooms: 3,
                description: 'Cho thuê phòng trọ giá từ 2 triệu, 2.2 triệu. Nhiều diện tích lựa chọn 10m2, 12m2, 18m2. => Phù hợp cho công nhân, Sinh Viên - Nhà trọ mặt tiền số 1 đường Cầu Xéo phường Tân Sơn Nhì quận Tân Phú. Thuận tiện đi lại. - Phòng sạch sẽ, toilet trong phòng. Có gác lửng. Giá giặt đồ tại tự do. Không chung chủ. - Nhà trọ nằm trong công viên thoáng mát. Bên cạnh trụ sở khu phố an ninh. - Cách AEON 1.5km. Khu nhiều nhà hàng quán ăn kinh doanh sầm uất. - Kế bên trường Cao Đẳng Công Thương. - Gần trường Công Nghệ Thực Phẩm, trường Giao Thông Vận Tải Trung Ương 3. Cao đẳng Lý',
                contact: {
                    name: 'Thành Lâm',
                    phone: '09004500XXX',
                    rating: 4,
                    avatar: '../img/avatar.jpg'
                },
                location: {
                    lat: 16.064167,
                    lng: 108.245809
                }
            };

            setRoom(mockRoom);
            setLoading(false);
        };

        fetchRoomDetails();
    }, [id]);

    const nextImage = () => {
        if (room) {
            setCurrentImageIndex((prev) => (prev + 1) % room.images.length);
        }
    };

    const prevImage = () => {
        if (room) {
            setCurrentImageIndex((prev) => (prev - 1 + room.images.length) % room.images.length);
        }
    };

    if (loading || !room) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Đang tải...</span>
                </div>
            </div>
        );
    }

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
                                <div className="text-primary small" style={{ fontSize: '12px' }}>Còn trống {room.rooms} phòng</div>
                                <div className="fw-bold" style={{ fontSize: '14px', color: '#2F80ED' }}>2.000.000 VNĐ<span style={{ fontSize: '12px' }}>/tháng</span></div>
                            </div>
                        </div>
                    </div>

                    {/* Thư viện ảnh */}
                    <div className="container-fluid px-0">
                        <div className="row g-2">
                            <div className="col-12 col-md-8">
                                <img src={room.images[0]} alt="Ảnh chính" className="w-100" style={{ height: '350px', objectFit: 'cover', borderRadius: '8px' }} />
                            </div>
                            <div className="col-md-4 d-none d-md-block">
                                <div className="row g-2">
                                    {room.images.slice(1, 4).map((image, index) => (
                                        <div key={index} className="col-12">
                                            <img src={image} alt={`Ảnh phòng ${index + 2}`} className="w-100" style={{ height: '114px', objectFit: 'cover', borderRadius: '8px' }} />
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
                                    <h5 className="mb-1 fw-bold text-primary" style={{ fontSize: '16px' }}>LAM HOME</h5>
                                    <p className="mb-0 text-muted" style={{ fontSize: '14px' }}>21 Thái tự, Đà Nẵng</p>
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
                                    center={[room.location.lat, room.location.lng]}
                                    zoom={15}
                                    style={{ height: '100%', width: '100%' }}
                                >
                                    <TileLayer
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    />
                                    <Marker position={[room.location.lat, room.location.lng]}>
                                        <Popup>21 Thái tự, Đà Nẵng</Popup>
                                    </Marker>
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
                                    src={room.contact.avatar}
                                    alt="Thành Lâm"
                                    className="rounded-circle me-2"
                                    width="48"
                                    height="48"
                                    style={{ objectFit: 'cover' }}
                                />
                                <div>
                                    <h6 className="mb-1 fw-bold">Thành Lâm</h6>
                                    <div className="text-warning" style={{ fontSize: '12px' }}>
                                        {[...Array(5)].map((_, index) => (
                                            <i
                                                key={index}
                                                className={`bi bi-star${index < 4 ? '-fill' : ''} me-1`}
                                            ></i>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="mb-3">
                                <div className="d-flex align-items-center">
                                    <h6 className="mb-0 me-2 fw-bold" style={{ fontSize: '14px' }}>SĐT:</h6>
                                    <span className="text-primary fw-bold" style={{ fontSize: '14px' }}>09004500XXX</span>
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