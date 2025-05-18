import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import type { CredentialResponse } from '@react-oauth/google';
import { useNavigate} from 'react-router-dom';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle login logic here
        console.log('Form submitted:', formData);
    };

    const  handleGoogleLogin = async (credentialResponse: CredentialResponse) => {
        if (!credentialResponse.credential) {
      console.error('No credential received');
      return;
    }

    const idtoken = credentialResponse.credential;
    try {
      const res = await axios.post('https://localhost:7135/api/Auth/Sign-in-google', {idtoken});
      const { accessToken} = res.data;
    localStorage.setItem('accessToken', accessToken);
     navigate('/tim-tro')
    } catch (error) {
      console.log(error)
    }

    };

    const handleFacebookLogin = () => {
        // Handle Facebook login here
        console.log('Facebook login clicked');
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

                                    <button type="submit" className="btn btn-primary w-100 mb-3">
                                        Đăng nhập
                                    </button>

                                    <div className="text-center mb-3">
                                        <p className="text-muted small mb-0">Hoặc đăng nhập với</p>
                                    </div>

                                    <div className="d-flex gap-2 mb-3">
                                        
                                        <GoogleOAuthProvider clientId="104873536196-65tbscmmi8qvsgm1ttm3uq5npl33944i.apps.googleusercontent.com">
                                              <div className="App">
                                                <GoogleLogin
                                                  onSuccess={handleGoogleLogin}
                                                  onError={() => console.error('Login Failed')}
                                                />
                                              </div>
                                            </GoogleOAuthProvider>
                                        <button
                                            type="button"
                                            className="btn btn-social btn-facebook w-50 d-flex align-items-center justify-content-center gap-2"
                                            onClick={handleFacebookLogin}
                                        >
                                            <img
                                                src="/img/facebook.svg"
                                                alt="Facebook"
                                                style={{ width: '18px', height: '18px' }}
                                            />
                                            Facebook
                                        </button>
                                    </div>

                                    <p className="text-center text-muted small">
                                        Chưa có tài khoản? <Link to="/dang-ky" className="text-primary text-decoration-none">Đăng ký</Link>
                                    </p>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login; 