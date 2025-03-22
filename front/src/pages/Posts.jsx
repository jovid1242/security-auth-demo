import { useEffect, useState } from 'react';
import { Card, Button, message } from 'antd';
import { useAuth } from '../context/AuthContext';
import axios from '../utils/axios';

const Posts = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user, logout } = useAuth();

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const response = await axios.get('/posts');
            setPosts(response.data);
        } catch (error) {
            message.error('Ошибка при загрузке постов');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
    };

    return (
        <div style={{ padding: '24px' }}>
            <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '24px'
            }}>
                <h1>Посты</h1>
                <div>
                    <span style={{ marginRight: '16px' }}>
                        Привет, {user.name}!
                    </span>
                    <Button type="primary" danger onClick={handleLogout}>
                        Выйти
                    </Button>
                </div>
            </div>

            <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
                {posts.map((post) => (
                    <Card
                        key={post.id}
                        title={post.title}
                        loading={loading}
                    >
                        <p>{post.content}</p>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default Posts;
