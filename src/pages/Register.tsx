import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        phoneNumber: ''
    });
    const [cccdFrontImage, setCccdFrontImage] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, files } = e.target;
        if (name === 'cccdFrontImage' && files) {
            setCccdFrontImage(files[0]);
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);

        const data = new FormData();
        data.append('email', formData.email);
        data.append('password', formData.password);
        data.append('confirmPassword', formData.confirmPassword);
        data.append('phoneNumber', formData.phoneNumber);
        if (cccdFrontImage) {
            data.append('image', cccdFrontImage);
        }
        data.append('phone_number', formData.phoneNumber);
        try {
            const response = await fetch('http://localhost:3000/api/auth/register', {
                method: 'POST',
                body: data
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Registration successful', result);
                setSuccessMessage('Đăng ký thành công!'); // Set success message
                // Redirect to login page after a delay
                setTimeout(() => {
                    navigate('/dang-nhap');
                }, 2000); // Redirect after 2 seconds

            } else {
                const errorData = await response.json();
                console.error('Registration failed', errorData);
                // Assuming errorData has a message field, adjust if needed
                setError(errorData.message || 'Đăng ký thất bại. Vui lòng thử lại.'); // Set error state
            }
        } catch (error) {
            console.error('Error during registration', error);
            setError('Đã xảy ra lỗi khi kết nối đến máy chủ. Vui lòng thử lại.');
        }
    };

    return (
        <div className="register-page min-vh-100 d-flex align-items-center"
            style={{
                background: 'linear-gradient(180deg, rgba(13,110,253,0.2) 0%, rgba(255,255,255,1) 100%)',
                paddingTop: '76px', // Height of the header
                paddingBottom: '2rem'
            }}>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-6 col-lg-5">
                        <div className="text-center mb-4">
                            <Link to="/" className="text-decoration-none">
                                <h1 className="text-primary h3 mb-4">ROOMNEAR</h1>
                            </Link>
                        </div>

                        <div className="card border-0 shadow-sm">
                            <div className="card-body p-4">
                                <div className="text-center mb-4">
                                    <h2 className="h4 mb-1">Đăng ký</h2>
                                    <p className="text-muted small">Tạo một tài khoản mới</p>
                                </div>

                                {error && (
                                    <div className="alert alert-danger" role="alert">
                                        {error}
                                    </div>
                                )}

                                {successMessage && (
                                    <div className="alert alert-success" role="alert">
                                        {successMessage}
                                    </div>
                                )}

                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label htmlFor="email" className="form-label small">Email</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            id="email"
                                            name="email"
                                            placeholder="Nhập email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="phoneNumber" className="form-label small">Số điện thoại</label>
                                        <input
                                            type="tel"
                                            className="form-control"
                                            id="phoneNumber"
                                            name="phoneNumber"
                                            placeholder="Nhập số điện thoại"
                                            value={formData.phoneNumber}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="password" className="form-label small">Mật khẩu</label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            id="password"
                                            name="password"
                                            placeholder="Nhập mật khẩu"
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label htmlFor="confirmPassword" className="form-label small">Xác nhận mật khẩu</label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            placeholder="Nhập lại mật khẩu"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label htmlFor="cccdFrontImage" className="form-label small">Ảnh mặt trước CCCD</label>
                                        <input
                                            type="file"
                                            className="form-control"
                                            id="cccdFrontImage"
                                            name="cccdFrontImage"
                                            onChange={handleChange}
                                            accept="image/*"
                                            required
                                        />
                                    </div>

                                    <button type="submit" className="btn btn-primary w-100 mb-3">
                                        Đăng ký
                                    </button>

                                    <p className="text-muted text-center small mb-0">
                                        Đã có tài khoản? <Link to="/login" className="text-primary text-decoration-none">Đăng nhập</Link>
                                    </p>
                                </form>
                            </div>
                        </div>

                        <p className="text-muted text-center small mt-4">
                            Bằng việc đăng ký, bạn đã đồng ý với các <Link to="/terms" className="text-decoration-none">điều khoản sử dụng</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;