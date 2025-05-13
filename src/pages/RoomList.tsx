import { useState, useEffect } from 'react';

declare global {
    interface Window {
        google: {
            maps: {
                Map: new (element: HTMLElement, options: {
                    center: { lat: number; lng: number };
                    zoom: number;
                    styles?: Array<{
                        featureType?: string;
                        elementType?: string;
                        stylers: Array<{ [key: string]: string | number }>;
                    }>;
                }) => google.maps.Map;
                Marker: new (options: {
                    position: { lat: number; lng: number };
                    map: google.maps.Map;
                    title?: string;
                    icon?: string;
                }) => google.maps.Marker;
            };
        };
    }
}

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

    
    const rooms: Room[] = [
        {
            id: '1',
            title: 'TRỌ CỦA LÂM',
            price: 5000000,
            address: 'Quận 1, TP.HCM',
            image: './img/room1.jpg',
            bedrooms: 2,
            bathrooms: 1,
            area: 50,
            location: {
                lat: 10.77282,
                lng: 106.68271
            }
        },
        {
            id: '2',
            title: 'LAM HOME',
            price: 2000000,
            address: 'Quận 2, TP.HCM',
            image: './img/room2.jpg',
            bedrooms: 2,
            bathrooms: 1,
            area: 35,
            location: {
                lat: 10.78282,
                lng: 106.69271
            }
        },
        {
            id: '3',
            title: 'LAM APARTMENT',
            price: 3000000,
            address: 'Quận Bình Thạnh, TP.HCM',
            image: './img/room3.jpg',
            bedrooms: 2,
            bathrooms: 1,
            area: 45,
            location: {
                lat: 10.79282,
                lng: 106.70271
            }
        },
    ];

    useEffect(() => {
        // Load Google Maps Script
        const googleMapScript = document.createElement('script');
        const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
        googleMapScript.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
        googleMapScript.async = true;
        googleMapScript.defer = true;
        window.document.body.appendChild(googleMapScript);

        googleMapScript.addEventListener('load', () => {
            // Initialize map
            const mapElement = document.getElementById('google-map');
            if (!mapElement) return;

            const map = new window.google.maps.Map(mapElement, {
                center: { lat: 10.77282, lng: 106.68271 }, // District 1, HCMC
                zoom: 13,
            });

            // Add markers for each room
            rooms.forEach(room => {
                if (room.location) {
                    new window.google.maps.Marker({
                        position: room.location,
                        map: map,
                        title: room.title
                    });
                }
            });
        });

        return () => {
            // Cleanup
            const scripts = document.getElementsByTagName('script');
            for (const script of scripts) {
                if (script.src.includes('maps.googleapis.com')) {
                    script.remove();
                }
            }
        };
    }, []);

    return (
        <div className="room-list-page">
            {/* Map Section */}
            <div className="map-section" style={{ height: '400px', background: '#f8f9fa' }}>
                <div id="google-map" style={{ height: '100%', width: '100%' }}></div>
            </div>

            {/* Content Section */}
            <div className="container py-5">
                <h2 className="text-center mb-4">GẦN BẠN</h2>
                <p className="text-center text-muted mb-5">Những căn phòng gần vị trí của bạn nhất</p>

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
                        <div key={room.id} className="col-md-6 col-lg-4">
                            <div className="card h-100 border-0 shadow-sm">
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