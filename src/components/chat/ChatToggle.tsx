import { useState } from 'react';
import ChatBox from './ChatBox';

const ChatToggle = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Ví dụ giả định currentUserId và chatPartnerId
  const currentUserId = 'user1';
  const chatPartnerId = 'user2';

  const toggleChat = () => {
    setIsOpen(prev => !prev);
  };

  return (
    <>
      {/* Biểu tượng chat ở góc phải màn hình */}
      <button
        onClick={toggleChat}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          backgroundColor: '#0d6efd',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          fontSize: '24px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        }}
        aria-label="Toggle Chat"
      >
        {isOpen ? '×' : '💬'}
      </button>

      {/* Hiện hoặc ẩn ChatBox */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '80px',
            right: '20px',
            zIndex: 1000,
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
          }}
        >
          <ChatBox currentUserId={currentUserId} chatPartnerId={chatPartnerId} />
        </div>
      )}
    </>
  );
};

export default ChatToggle;
