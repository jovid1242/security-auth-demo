import { useEffect, useState } from 'react';
import { Table, Button, message, Modal, Form, Input, Space } from 'antd';
import { useAuth } from '../context/AuthContext';
import axios from '../utils/axios';

const Admin = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const { user, logout } = useAuth();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('/admin/users');
            setUsers(response.data);
        } catch (error) {
            message.error('Ошибка при загрузке пользователей');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Имя',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Роль',
            dataIndex: 'role',
            key: 'role',
        },
        {
            title: 'Действия',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Button type="link" onClick={() => handleEdit(record)}>
                        Редактировать
                    </Button>
                    <Button type="link" danger onClick={() => handleDelete(record.id)}>
                        Удалить
                    </Button>
                </Space>
            ),
        },
    ];

    const handleEdit = (user) => {
        form.setFieldsValue(user);
        setIsModalVisible(true);
    };

    const handleDelete = async (userId) => {
        try {
            await axios.delete(`/admin/users/${userId}`);
            message.success('Пользователь удален');
            fetchUsers();
        } catch (error) {
            message.error('Ошибка при удалении пользователя');
        }
    };

    const handleModalOk = async () => {
        try {
            const values = await form.validateFields();
            await axios.put(`/admin/users/${values.id}`, values);
            message.success('Пользователь обновлен');
            setIsModalVisible(false);
            form.resetFields();
            fetchUsers();
        } catch (error) {
            message.error('Ошибка при обновлении пользователя');
        }
    };

    return (
        <div style={{ padding: '24px' }}>
            <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '24px'
            }}>
                <h1>Панель администратора</h1>
                <div>
                    <span style={{ marginRight: '16px' }}>
                        Администратор: {user.name}
                    </span>
                    <Button type="primary" danger onClick={handleLogout}>
                        Выйти
                    </Button>
                </div>
            </div>

            <Table
                columns={columns}
                dataSource={users}
                rowKey="id"
                loading={loading}
            />

            <Modal
                title="Редактировать пользователя"
                open={isModalVisible}
                onOk={handleModalOk}
                onCancel={() => {
                    setIsModalVisible(false);
                    form.resetFields();
                }}
            >
                <Form
                    form={form}
                    layout="vertical"
                >
                    <Form.Item
                        name="id"
                        hidden
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="name"
                        label="Имя"
                        rules={[{ required: true, message: 'Введите имя' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                            { required: true, message: 'Введите email' },
                            { type: 'email', message: 'Введите корректный email' }
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="role"
                        label="Роль"
                        rules={[{ required: true, message: 'Введите роль' }]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default Admin; 