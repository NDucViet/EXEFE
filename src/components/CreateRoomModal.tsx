import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';

interface RoomFormData {
    name: string;
    address: string;
    price: number;
    area: number;
    decription: string;
    images: string[]; // Will store image URLs
}

interface CreateRoomModalProps {
    show: boolean;
    onHide: () => void;
    onSubmit: (roomData: RoomFormData) => void;
    fetchRooms: () => void; // Add new prop for fetching rooms
}

const CreateRoomModal: React.FC<CreateRoomModalProps> = ({ show, onHide, onSubmit, fetchRooms }) => {
    const [formData, setFormData] = useState<RoomFormData>({
        name: '',
        address: '',
        price: 0,
        area: 0,
        decription: '',
        images: []
    });

    const [priceText, setPriceText] = useState('');
    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const [dragActive, setDragActive] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const convertTextToNumber = (text: string): number => {
        // Convert to lowercase and remove spaces
        const cleanText = text.toLowerCase().replace(/\s+/g, '');
        
        // Check for "triệu" or "trieu"
        if (cleanText.includes('triệu')) {
            const number = parseFloat(cleanText.replace('triệu', ''));
            if (!isNaN(number)) {
                return number * 1000000;
            }
        }
        
        // Check for "nghìn" or "ngan"
        if (cleanText.includes('ngàn') || cleanText.includes('nghìn')) {
            const number = parseFloat(cleanText.replace(/ngàn|nghìn/g, ''));
            if (!isNaN(number)) {
                return number * 1000;
            }
        }
        
        // If no keywords found, try to parse as number
        const number = parseFloat(cleanText);
        return isNaN(number) ? 0 : number;
    };

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setPriceText(value);
        
        // Convert text to number
        const numericValue = convertTextToNumber(value);
        
        // Update formData
        setFormData(prev => ({
            ...prev,
            price: numericValue
        }));
    };

    const handlePriceClick = () => {
        // Fill the number directly into input
        setPriceText(formData.price.toString());
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'price' || name === 'area' ? Number(value) : value
        }));
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFiles(e.dataTransfer.files);
        }
    };

    const handleFiles = (files: FileList) => {
        const newFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
        setSelectedImages(prev => [...prev, ...newFiles]);
        
        // Create preview URLs for new files
        const newUrls = newFiles.map(file => URL.createObjectURL(file));
        setPreviewUrls(prev => [...prev, ...newUrls]);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            handleFiles(e.target.files);
        }
    };

    const removeImage = (index: number) => {
        setSelectedImages(prev => prev.filter((_, i) => i !== index));
        setPreviewUrls(prev => {
            const newUrls = [...prev];
            URL.revokeObjectURL(newUrls[index]); // Clean up the URL
            return newUrls.filter((_, i) => i !== index);
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);
        
        try {
            const accessToken = localStorage.getItem('accessToken');
            console.log(accessToken);
            if (!accessToken) {
                throw new Error('Vui lòng đăng nhập để tạo bài đăng');
            }

            // Generate URLs for images (you can modify this based on your needs)
            const imageUrls = selectedImages.map((file, index) => {
                // Example URL format: /images/room-{timestamp}-{index}.jpg
                const timestamp = new Date().getTime();
                return `/images/room-${timestamp}-${index}.jpg`;
            });

            const submitData = {
                ...formData,
                images: imageUrls
            };

            // Call API to create house with Bearer token
            const response = await axios.post('https://localhost:7135/api/House/CreateHouse', submitData, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.data) {
                onSubmit(submitData);
                onHide();
            } else {
                throw new Error('Failed to create house');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi tạo bài đăng');
            console.error('Error creating house:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal show={show} onHide={onHide} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>Tạo bài đăng nhà trọ mới</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && (
                    <div className="alert alert-danger" role="alert">
                        {error}
                    </div>
                )}
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Tên nhà trọ</Form.Label>
                        <Form.Control
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Địa chỉ</Form.Label>
                        <Form.Control
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            required
                        />
                    </Form.Group>

                    <div className="row">
                        <div className="col-md-6">
                            <Form.Group className="mb-3">
                                <Form.Label>Giá phòng (VND/tháng)</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="price"
                                    value={priceText}
                                    onChange={handlePriceChange}
                                    required
                                    placeholder="Ví dụ: 1 triệu hoặc 1.5 triệu"
                                />
                                {formData.price > 0 && (
                                    <div 
                                        className="mt-2 p-2 border rounded"
                                        style={{ 
                                            cursor: 'pointer',
                                            backgroundColor: '#f8f9fa',
                                            transition: 'all 0.2s ease',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between'
                                        }}
                                        onClick={handlePriceClick}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.backgroundColor = '#e9ecef';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.backgroundColor = '#f8f9fa';
                                        }}
                                    >
                                        <div>
                                            <span style={{ 
                                                fontSize: '1.1rem',
                                                fontWeight: '500',
                                                color: '#2c3e50'
                                            }}>
                                                {formData.price.toLocaleString()}
                                            </span>
                                            <span style={{ 
                                                color: '#6c757d',
                                                marginLeft: '4px'
                                            }}>
                                                VND
                                            </span>
                                        </div>
                                        <div className="d-flex align-items-center">
                                            <i className="bi bi-pencil-square text-primary me-1"></i>
                                            <small className="text-primary">
                                                Click để sửa
                                            </small>
                                        </div>
                                    </div>
                                )}
                            </Form.Group>
                        </div>
                        <div className="col-md-6">
                            <Form.Group className="mb-3">
                                <Form.Label>Diện tích (m²)</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="area"
                                    value={formData.area}
                                    onChange={handleInputChange}
                                    required
                                    min="0"
                                />
                            </Form.Group>
                        </div>
                    </div>

                    <Form.Group className="mb-3">
                        <Form.Label>Mô tả</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            name="decription"
                            value={formData.decription}
                            onChange={handleInputChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Hình ảnh</Form.Label>
                        <div
                            className={`border rounded p-4 text-center ${dragActive ? 'border-primary bg-light' : ''}`}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                            style={{
                                border: '2px dashed #ccc',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleImageChange}
                                style={{ display: 'none' }}
                                id="image-upload"
                            />
                            <label htmlFor="image-upload" style={{ cursor: 'pointer', width: '100%' }}>
                                <div className="text-center">
                                    <i className="bi bi-cloud-upload fs-1 text-primary"></i>
                                    <p className="mt-2 mb-0">Kéo thả ảnh vào đây hoặc click để chọn</p>
                                    <small className="text-muted">Chấp nhận nhiều ảnh</small>
                                </div>
                            </label>
                        </div>

                        {previewUrls.length > 0 && (
                            <div className="mt-3">
                                <h6 className="mb-2">Ảnh đã chọn ({previewUrls.length})</h6>
                                <div className="d-flex gap-2 flex-wrap">
                                    {previewUrls.map((url, index) => (
                                        <div key={index} className="position-relative" style={{ width: '100px' }}>
                                            <img
                                                src={url}
                                                alt={`Preview ${index + 1}`}
                                                style={{
                                                    width: '100px',
                                                    height: '100px',
                                                    objectFit: 'cover',
                                                    borderRadius: '4px'
                                                }}
                                            />
                                            <button
                                                type="button"
                                                className="btn btn-danger btn-sm position-absolute"
                                                style={{
                                                    top: '-8px',
                                                    right: '-8px',
                                                    padding: '0.25rem 0.5rem',
                                                    borderRadius: '50%'
                                                }}
                                                onClick={() => removeImage(index)}
                                            >
                                                <i className="bi bi-x"></i>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide} disabled={isSubmitting}>
                    Hủy
                </Button>
                <Button 
                    variant="primary" 
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Đang tạo bài đăng...
                        </>
                    ) : (
                        'Tạo bài đăng'
                    )}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default CreateRoomModal; 