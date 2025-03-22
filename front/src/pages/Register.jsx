import { Form, Input, Button, message, Select, DatePicker } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../utils/axios';
import { useAuth } from '../context/AuthContext'; 
import 'dayjs/locale/ru';
import { 
    hasRepeatingCharacters,  
    hasSpecialCharacters, 
    hasRussianAndEnglish, 
    isValidDateOfBirth,
    formatGender,
    isValidUsername
} from '../utils/validation';
import { IMaskInput } from 'react-imask';

const Register = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [form] = Form.useForm();
 
    const checkEmailUnique = async (email) => {
        try {
            await axios.post('/auth/check-email', { email });
            return true;
        } catch (error) {
            return false;
        }
    };
 
    const checkUsernameUnique = async (username) => {
        try {
            await axios.post('/auth/check-username', { username });
            return true;
        } catch (error) {
            return false;
        }
    };

    const validatePassword = (_, value) => {
        if (!value) {
            return Promise.reject('Введите пароль');
        }
        if (value.length < 8) {
            return Promise.reject('Пароль должен быть не менее 8 символов');
        }
        if (hasRepeatingCharacters(value)) {
            return Promise.reject('Пароль содержит повторяющиеся символы');
        }
        if (!hasSpecialCharacters(value)) {
            return Promise.reject('Пароль должен содержать минимум 2 спецсимвола, не идущих подряд');
        }
        if (!hasRussianAndEnglish(value)) {
            return Promise.reject('Пароль должен содержать русские и английские буквы');
        }
        return Promise.resolve();
    };

    const validateUsername = async (_, value) => {
        if (!value) {
            return Promise.reject('Введите имя пользователя');
        }
        if (!isValidUsername(value)) {
            return Promise.reject('Имя пользователя не должно содержать цифр');
        }
        const isUnique = await checkUsernameUnique(value);
        if (!isUnique) {
            return Promise.reject('Это имя пользователя уже занято');
        }
        return Promise.resolve();
    };

    const validateEmail = async (_, value) => {
        if (!value) {
            return Promise.reject('Введите email');
        } 
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            return Promise.reject('Введите корректный email');
        }
        return Promise.resolve();
    };

    const validatePhone = (_, value) => {
        if (!value) {
            return Promise.reject('Введите номер телефона');
        }
         
        const cleanPhone = value.replace(/\D/g, '');
         
        if (cleanPhone.length !== 11 || !cleanPhone.startsWith('7')) {
            return Promise.reject('Номер телефона должен быть в формате +7 (XXX) XXX-XX-XX');
        }
        
        return Promise.resolve();
    };

    const validateDateOfBirth = (_, value) => {
        if (!value) {
            return Promise.reject('Выберите дату рождения');
        }
        if (!isValidDateOfBirth(value)) {
            return Promise.reject('Некорректная дата рождения');
        }
        return Promise.resolve();
    };

    const onFinish = async (values) => {
        try {
            const formData = {
                ...values,
                dob: values.dob.format('YYYY-MM-DD'),
                gender: formatGender(values.gender, values.dob),
                role: 'user'
            };

            const response = await axios.post('/auth/register', formData);
            const { accessToken, refreshToken, user } = response.data;
            
            login(user, { accessToken, refreshToken });
            message.success('Регистрация успешна!');

            if (user.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/posts');
            }
        } catch (error) {
            message.error(error.response?.data?.message || 'Ошибка при регистрации');
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
                    Регистрация
                </h1>

                <Form
                    form={form}
                    name="register"
                    onFinish={onFinish}
                    layout="vertical"
                    style={{ width: '100%' }}
                >
                    <Form.Item
                        name="username"
                        style={{ marginBottom: '16px' }}
                        rules={[{ validator: validateUsername }]}
                    >
                        <Input
                            prefix={<UserOutlined />}
                            size="large"
                            placeholder="Имя пользователя"
                            style={{ borderRadius: '8px' }}
                        />
                    </Form.Item>

                    <Form.Item
                        name="email"
                        style={{ marginBottom: '16px' }}
                        rules={[
                            { validator: validateEmail },
                            {
                                asyncValidator: async (_, value) => {
                                    if (value) {
                                        const isUnique = await checkEmailUnique(value);
                                        if (!isUnique) {
                                            throw new Error('Этот email уже зарегистрирован');
                                        }
                                    }
                                },
                                validateTrigger: 'onBlur' 
                            }
                        ]}
                    >
                        <Input
                            prefix={<MailOutlined />}
                            size="large"
                            placeholder="Email"
                            style={{ borderRadius: '8px' }}
                        />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        style={{ marginBottom: '16px' }}
                        rules={[{ validator: validatePassword }]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            size="large"
                            placeholder="Пароль"
                            style={{ borderRadius: '8px' }}
                        />
                    </Form.Item>

                    <Form.Item
                        name="phone"
                        style={{ marginBottom: '16px' }}
                        rules={[{ validator: validatePhone }]}
                    >
                        <IMaskInput
                            mask="+{7} (000) 000-00-00"
                            unmask={false}
                            lazy={false}
                            prepare={(str) => str.trim()}
                            component={Input}
                            prefix={<PhoneOutlined />}
                            size="large"
                            placeholder="+7 (999) 999-99-99"
                            style={{ borderRadius: '8px', height: '48px', border: '1px solid #D9D9D9', width: '98%' }}
                            onAccept={(value) => {
                                form.setFieldValue('phone', value);
                            }}
                        />
                    </Form.Item>

                    <Form.Item
                        name="gender"
                        style={{ marginBottom: '16px' }}
                        rules={[{ required: true, message: 'Выберите пол' }]}
                    >
                        <Select
                            size="large"
                            placeholder="Выберите пол"
                            style={{ borderRadius: '8px' }}
                        >
                            <Select.Option value="male">Мужской</Select.Option>
                            <Select.Option value="female">Женский</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="dob"
                        style={{ marginBottom: '24px' }}
                        rules={[{ validator: validateDateOfBirth }]}
                    >
                        <DatePicker
                            size="large"
                            style={{ width: '100%', borderRadius: '8px' }}
                            placeholder="Дата рождения"
                            format={['DD.MM.YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD']}
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
                            Зарегистрироваться
                        </Button>
                    </Form.Item>

                    <div style={{ 
                        textAlign: 'center',
                        fontSize: '14px',
                        color: '#666'
                    }}>
                        Уже есть аккаунт? {' '}
                        <Link 
                            to="/login"
                            style={{ 
                                color: '#1677FF',
                                textDecoration: 'none'
                            }}
                        >
                            Войти
                        </Link>
                    </div>
                </Form>
            </div>
        </div>
    );
};

export default Register;