const Testimonials = () => {
    return (
        <section className="testimonials py-5">
            <div className="container">
                <div className="row">
                    <div className="col-12 text-center mb-5">
                        <h2 className="fw-bold">ĐÁNH GIÁ CỦA NGƯỜI CHO THUÊ</h2>
                        <p className="text-muted">Xem những người cho thuê đã nói gì về ứng dụng của chúng tôi</p>
                    </div>
                </div>

                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        <div className="testimonial-card text-center p-4 mb-4">
                            <div className="testimonial-content mb-4">
                                <p className="lead fst-italic mb-0">
                                    "Từ khi sử dụng nền tảng này, việc cho thuê trọ của tôi trở nên dễ dàng và hiệu quả hơn nhiều.
                                    Quản lý thực sự quan tâm, sử dụng giúp tôi đăng tin nhanh chóng, tiện lợi và không lo lắng về thủ tục.
                                    Đây thực sự là một công cụ hỗ trợ tốt cho những người cho thuê như tôi!"
                                </p>
                            </div>
                            <div className="testimonial-author">
                                <div className="avatar-group d-flex justify-content-center gap-2 mb-3">
                                    <img src="/avatars/avatar1.jpg" alt="Avatar" className="rounded-circle" width="40" height="40" />
                                    <img src="/avatars/avatar2.jpg" alt="Avatar" className="rounded-circle" width="40" height="40" />
                                    <img src="/avatars/avatar3.jpg" alt="Avatar" className="rounded-circle" width="40" height="40" />
                                </div>
                                <p className="text-muted mb-0">Chị Hằng, Gò Vấp</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Testimonials; 