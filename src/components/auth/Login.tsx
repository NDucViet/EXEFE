import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import type { CredentialResponse } from '@react-oauth/google';
import { useAuth } from '../../contexts/AuthContext';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            const response = await fetch('http://localhost:3000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Login successful:', result);
                const { accessToken, user } = result;
                login(user, accessToken);
                navigate('/');
            } else {
                const errorData = await response.json();
                console.error('Login failed:', errorData);
                setError(errorData.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại email và mật khẩu.');
            }
        } catch (error) {
            console.error('Error during login:', error);
            setError('Đã xảy ra lỗi khi kết nối đến máy chủ. Vui lòng thử lại.');
        }
    };

    const handleGoogleLogin = async (credentialResponse: CredentialResponse) => {
        if (!credentialResponse.credential) {
            console.error('No credential received');
            return;
        }

        const idtoken = credentialResponse.credential;
        try {
            const response = await axios.post('https://localhost:7135/api/Auth/Sign-in-google', { idtoken });
            const { accessToken, user } = response.data;
            login(user, accessToken);
            navigate('/tim-tro');
        } catch (error) {
            console.error('Google login failed:', error);
            // Handle error (show message to user)
        }
    };

    return (
        <div className="login-page min-vh-100 d-flex align-items-center"
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
                                    <h2 className="h4 mb-1">Đăng nhập</h2>
                                    <p className="text-muted small">Chào mừng bạn trở lại</p>
                                </div>

                                {error && (
                                    <div className="alert alert-danger" role="alert">
                                        {error}
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

                                    <div className="mb-4">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <label htmlFor="password" className="form-label small">Mật khẩu</label>
                                            <Link to="/quen-mat-khau" className="text-primary text-decoration-none small">
                                                Quên mật khẩu?
                                            </Link>
                                        </div>
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

                                    <div className="d-grid">
                                        <button type="submit" className="btn btn-primary">
                                            Đăng nhập
                                        </button>
                                    </div>
                                </form>

                                <div className="text-center mt-4">
                                    <GoogleOAuthProvider clientId="104873536196-65tbscmmi8qvsgm1ttm3uq5npl33944i.apps.googleusercontent.com">
                                        <GoogleLogin
                                            onSuccess={handleGoogleLogin}
                                            onError={() => console.log('Login Failed')}
                                        />
                                    </GoogleOAuthProvider>
                                </div>

                                <div className="text-center mt-3">
                                    <p className="mb-0">
                                        Chưa có tài khoản? <Link to="/dang-ky">Đăng ký ngay</Link>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login; 