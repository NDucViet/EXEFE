import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface Post {
    id: string;
    author: {
        name: string;
        avatar: string;
        isVerified: boolean;
    };
    content: string;
    images?: string[];
    likes: number;
    comments: number;
    shares: number;
    timestamp: string;
    tags: string[];
}

const Community: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'trending' | 'latest' | 'following'>('trending');
    const [showCreatePost, setShowCreatePost] = useState(false);

    // Mock data for posts
    const posts: Post[] = [
        {
            id: '1',
            author: {
                name: 'Nguyễn Văn A',
                avatar: './img/avatar1.jpg',
                isVerified: true
            },
            content: 'Chia sẻ kinh nghiệm tìm phòng trọ ở Đà Nẵng. Các bạn nên chú ý những điểm sau:\n1. Khảo sát khu vực trước khi thuê\n2. Kiểm tra cơ sở vật chất kỹ lưỡng\n3. Đọc kỹ hợp đồng thuê nhà\n4. Xem xét các chi phí phát sinh',
            images: ['./img/room1.jpg', './img/room2.jpg'],
            likes: 156,
            comments: 23,
            shares: 12,
            timestamp: '2 giờ trước',
            tags: ['#PhongTro', '#DaNang', '#KinhNghiem']
        },
        {
            id: '2',
            author: {
                name: 'Trần Thị B',
                avatar: './img/avatar2.jpg',
                isVerified: false
            },
            content: 'Review phòng trọ khu vực Hải Châu: Mình vừa dọn đến đây được 1 tháng. Khu vực khá sạch sẽ, an ninh tốt. Chủ nhà dễ tính. Giá cả hợp lý.',
            images: ['./img/room3.jpg'],
            likes: 89,
            comments: 15,
            shares: 5,
            timestamp: '5 giờ trước',
            tags: ['#Review', '#HaiChau', '#DaNang']
        }
    ];

    return (
        <div className="community-page bg-light" style={{ paddingTop: '80px', minHeight: '100vh' }}>
            <div className="container py-4">
                {/* Header Section */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="mb-0">Cộng đồng ROOMNEAR</h2>
                    <button 
                        className="btn btn-primary"
                        onClick={() => setShowCreatePost(true)}
                    >
                        <i className="bi bi-plus-lg me-2"></i>
                        Đăng bài
                    </button>
                </div>

                {/* Navigation Tabs */}
                <div className="bg-white rounded-3 shadow-sm p-3 mb-4">
                    <ul className="nav nav-pills nav-fill">
                        <li className="nav-item">
                            <button 
                                className={`nav-link ${activeTab === 'trending' ? 'active' : ''}`}
                                onClick={() => setActiveTab('trending')}
                            >
                                <i className="bi bi-fire me-2"></i>
                                Thịnh hành
                            </button>
                        </li>
                        <li className="nav-item">
                            <button 
                                className={`nav-link ${activeTab === 'latest' ? 'active' : ''}`}
                                onClick={() => setActiveTab('latest')}
                            >
                                <i className="bi bi-clock-history me-2"></i>
                                Mới nhất
                            </button>
                        </li>
                        <li className="nav-item">
                            <button 
                                className={`nav-link ${activeTab === 'following' ? 'active' : ''}`}
                                onClick={() => setActiveTab('following')}
                            >
                                <i className="bi bi-people me-2"></i>
                                Đang theo dõi
                            </button>
                        </li>
                    </ul>
                </div>

                {/* Create Post Modal */}
                {showCreatePost && (
                    <div className="modal fade show" style={{ display: 'block' }} tabIndex={-1}>
                        <div className="modal-dialog modal-lg">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Tạo bài viết mới</h5>
                                    <button 
                                        type="button" 
                                        className="btn-close"
                                        onClick={() => setShowCreatePost(false)}
                                    ></button>
                                </div>
                                <div className="modal-body">
                                    <textarea 
                                        className="form-control border-0"
                                        rows={5}
                                        placeholder="Chia sẻ kinh nghiệm của bạn..."
                                    ></textarea>
                                    <div className="border-top pt-3 mt-3">
                                        <button className="btn btn-outline-primary me-2">
                                            <i className="bi bi-image me-2"></i>
                                            Thêm ảnh
                                        </button>
                                        <button className="btn btn-outline-primary">
                                            <i className="bi bi-tag me-2"></i>
                                            Thêm tag
                                        </button>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button 
                                        type="button" 
                                        className="btn btn-secondary"
                                        onClick={() => setShowCreatePost(false)}
                                    >
                                        Hủy
                                    </button>
                                    <button type="button" className="btn btn-primary">
                                        Đăng bài
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Posts List */}
                <div className="posts-container">
                    {posts.map(post => (
                        <div key={post.id} className="card shadow-sm mb-4">
                            {/* Post Header */}
                            <div className="card-header bg-white border-0 pt-3">
                                <div className="d-flex align-items-center">
                                    <img 
                                        src={post.author.avatar} 
                                        alt={post.author.name}
                                        className="rounded-circle me-2"
                                        width="40"
                                        height="40"
                                    />
                                    <div>
                                        <div className="d-flex align-items-center">
                                            <h6 className="mb-0 me-2">{post.author.name}</h6>
                                            {post.author.isVerified && (
                                                <i className="bi bi-patch-check-fill text-primary"></i>
                                            )}
                                        </div>
                                        <small className="text-muted">{post.timestamp}</small>
                                    </div>
                                </div>
                            </div>

                            {/* Post Content */}
                            <div className="card-body">
                                <p className="card-text" style={{ whiteSpace: 'pre-line' }}>
                                    {post.content}
                                </p>
                                {post.tags.map((tag, index) => (
                                    <Link 
                                        key={index}
                                        to={`/tag/${tag.slice(1)}`}
                                        className="text-decoration-none me-2"
                                    >
                                        <span className="text-primary">{tag}</span>
                                    </Link>
                                ))}
                                {post.images && post.images.length > 0 && (
                                    <div className="mt-3">
                                        <div className="row g-2">
                                            {post.images.map((image, index) => (
                                                <div 
                                                    key={index} 
                                                    className={`col-${post.images!.length === 1 ? '12' : '6'}`}
                                                >
                                                    <img 
                                                        src={image} 
                                                        alt={`Post image ${index + 1}`}
                                                        className="img-fluid rounded"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Post Actions */}
                            <div className="card-footer bg-white border-top-0 pb-3">
                                <div className="d-flex justify-content-between align-items-center">
                                    <button className="btn btn-light">
                                        <i className="bi bi-heart me-2"></i>
                                        {post.likes}
                                    </button>
                                    <button className="btn btn-light">
                                        <i className="bi bi-chat me-2"></i>
                                        {post.comments}
                                    </button>
                                    <button className="btn btn-light">
                                        <i className="bi bi-share me-2"></i>
                                        {post.shares}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Community;