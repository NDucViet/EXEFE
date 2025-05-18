import { useState, useRef, useEffect } from 'react';
import { HubConnectionBuilder, HubConnection, HubConnectionState } from '@microsoft/signalr';
import axios from 'axios';

interface Message {
    id: string;
    text: string;
    senderId: string;
    timestamp: Date;
}

interface ChatBoxProps {
    currentUserId: string;
    chatPartnerId: string;
}

const ChatBox = ({ currentUserId, chatPartnerId }: ChatBoxProps) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    
    const connectionRef = useRef<HubConnection | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const connection = new HubConnectionBuilder()
            .withUrl(`https://localhost:7135/chatHub?userId=${currentUserId}`)
            .withAutomaticReconnect()
            .build();

        // Hàm khởi động kết nối, await để đảm bảo kết nối thành công trước khi dùng
        async function start() {
            try {
                await connection.start();
                console.log('SignalR Connected');
            } catch (err) {
                console.error('Connection failed: ', err);
            }
        }

        // Bắt sự kiện nhận message
        connection.on('ReceiveMessage', (fromUserId: string, message: string) => {
            const newMessage: Message = {
                id: Date.now().toString(),
                text: message,
                senderId: fromUserId,
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, newMessage]);
        });

        // Thông báo trạng thái reconnecting
        connection.onreconnecting(error => {
            console.warn('SignalR reconnecting', error);
        });

        // Thông báo trạng thái reconnected
        connection.onreconnected(connectionId => {
            console.log('SignalR reconnected', connectionId);
        });

        connectionRef.current = connection;
        start();

        // Cleanup khi component unmount
        return () => {
            connection.stop();
        };
    }, [currentUserId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = async () => {
        const accesstoken = localStorage.getItem('accessToken')
        chatPartnerId = '123123123123'
        console.log(chatPartnerId)
        if (!input.trim()) return;
        try {
            await axios.post('https://localhost:7135/api/Chat/SendMessage', {
                message: input,
                reciverID: chatPartnerId
            }, {
                headers: {
                    'Content-Type': 'application/json',
                     Authorization: `Bearer ${accesstoken}`
                }
            });

            // Tin nhắn sẽ được nhận lại qua SignalR
            setInput('');
        } catch (error) {
            console.error('Send message error:', error);
        }
    };
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        sendMessage();
    };

    return (
         <div className="chat-container" style={{ width: '350px', border: '1px solid #ccc', borderRadius: '8px' }}>
            <div className="chat-messages" style={{ height: '400px', overflowY: 'auto', padding: '1rem' }}>
                {messages.map(msg => (
                    <div
                        key={msg.id}
                        style={{
                            textAlign: msg.senderId === currentUserId ? 'right' : 'left',
                            marginBottom: '0.5rem',
                        }}
                    >
                        <div
                            style={{
                                display: 'inline-block',
                                backgroundColor: msg.senderId === currentUserId ? '#0d6efd' : '#e5e5ea',
                                color: msg.senderId === currentUserId ? 'white' : 'black',
                                borderRadius: '12px',
                                padding: '0.5rem 1rem',
                                maxWidth: '80%',
                            }}
                        >
                            {msg.text}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', padding: '1rem', gap: '0.5rem' }}>
                <input
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="Nhập tin nhắn..."
                    style={{ flexGrow: 1, borderRadius: '20px', padding: '0.5rem 1rem', border: '1px solid #ccc' }}
                />
                <button type="submit" disabled={!input.trim()} style={{ borderRadius: '50%', width: '40px', height: '40px' }}>
                    ➤
                </button>
            </form>
        </div>
    );
};

export default ChatBox;
