import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../utils/axios';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [form] = Form.useForm();

    const onFinish = async (values) => {
        try {
            const response = await axios.post('/api/auth/login', values);
            const { accessToken, refreshToken, user } = response.data;
            
            login(user, { accessToken, refreshToken });
            message.success('Вход выполнен успешно!');

            if (user.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/posts');
            }
        } catch (error) {
            message.error(error.response?.data?.message || 'Ошибка при входе');
        }
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            background: '#F5F5F5',
            width: '100vw'
        }}>
            <div style={{
                background: 'white',
                padding: '32px',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                width: '100%',
                maxWidth: '360px'
            }}>
                <h1 style={{ 
                    fontSize: '24px',
                    fontWeight: '600',
                    color: '#1A1A1A',
                    marginBottom: '24px'
                }}>
                    Вход
                </h1>

                <Form
                    form={form}
                    name="login"
                    onFinish={onFinish}
                    layout="vertical"
                    style={{ width: '100%' }}
                >
                    <Form.Item
                        name="email"
                        style={{ marginBottom: '16px' }}
                        rules={[
                            { required: true, message: 'Введите email' },
                            { type: 'email', message: 'Введите корректный email' }
                        ]}
                    >
                        <Input
                            size="large"
                            placeholder="Email"
                            style={{ borderRadius: '8px' }}
                        />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        style={{ marginBottom: '24px' }}
                        rules={[{ required: true, message: 'Введите пароль' }]}
                    >
                        <Input.Password
                            size="large"
                            placeholder="Пароль"
                            style={{ borderRadius: '8px' }}
                        />
                    </Form.Item>

                    <Form.Item style={{ marginBottom: '16px' }}>
                        <Button 
                            type="primary" 
                            htmlType="submit" 
                            size="large"
                            block
                            style={{ 
                                height: '48px',
                                borderRadius: '8px',
                                fontSize: '16px',
                                fontWeight: '500',
                                background: '#1677FF'
                            }}
                        >
                            Войти
                        </Button>
                    </Form.Item>

                    <div style={{ 
                        textAlign: 'center',
                        fontSize: '14px',
                        color: '#666'
                    }}>
                        Нет аккаунта? {' '}
                        <Link 
                            to="/register"
                            style={{ 
                                color: '#1677FF',
                                textDecoration: 'none'
                            }}
                        >
                            Зарегистрироваться
                        </Link>
                    </div>
                </Form>
            </div>
        </div>
    );
};

export default Login;