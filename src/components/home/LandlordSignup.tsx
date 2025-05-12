import { useState } from 'react';

const LandlordSignup = () => {
    const [email, setEmail] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle signup logic here
        console.log('Signup with email:', email);
    };

    return (
        <section className="landlord-signup py-5" style={{ background: 'var(--light-blue)' }}>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-8 col-lg-6 text-center">
                        <h2 className="text-primary mb-2">ĐĂNG KÝ CHỦ HỘ</h2>
                        <h3 className="h4 mb-4">Bạn là người cho thuê</h3>
                        <p className="text-muted small mb-4">Đăng ký và bắt đầu cho thuê ngay hôm nay</p>

                        <form onSubmit={handleSubmit} className="signup-form">
                            <div className="input-group mb-3">
                                <input
                                    type="email"
                                    className="form-control form-control-lg"
                                    placeholder="Nhập email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                <button className="btn btn-primary px-4" type="submit">
                                    NHẬP
                                </button>
                            </div>
                        </form>

                        <p className="text-muted small mt-3">
                            Đọc và đồng ý với các nội dung điều khoản
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default LandlordSignup; 