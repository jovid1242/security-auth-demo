const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const crypto = require('crypto');
const UserDto = require("../../dtos/userDto");
const { User, Role } = require("../../models");
const ApiError = require("../../exceptions/apiError");

const ENCRYPTION_ALGORITHM = 'aes-256-cbc';

const encryptPrivateKey = (privateKey) => {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(
        ENCRYPTION_ALGORITHM,
        Buffer.from(process.env.PRIVATE_KEY_SECRET, 'hex'),
        iv
    );
    let encrypted = cipher.update(privateKey, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
};

const decryptPrivateKey = (encryptedData) => {
    const [ivHex, encryptedKey] = encryptedData.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipheriv(
        ENCRYPTION_ALGORITHM,
        Buffer.from(process.env.PRIVATE_KEY_SECRET, 'hex'),
        iv
    );
    let decrypted = decipher.update(encryptedKey, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
};

const generateTokens = (user) => {
    const accessToken = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: "15m" }
    );
    const refreshToken = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: "7d" }
    );
    return { accessToken, refreshToken };
};

class AuthService {
    async register({ username, email, password, phone, gender, dob, roleName = "user" }) {
        if (!email || !phone || !password || !username || !gender || !dob) {
            throw ApiError.BadRequest("Все поля обязательны для заполнения");
        }

        const existingUser = await User.findOne({ where: { [Op.or]: [{ email }, { phone }] } });

        if (existingUser) {
            throw ApiError.BadRequest("Пользователь с таким email или номером телефона уже существует");
        }

        const role = await Role.findOne({ where: { name: roleName } });
        if (!role) {
            throw { status: 400, message: "Invalid role" };
        }

        const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
            modulusLength: 2048,
            publicKeyEncoding: {
                type: 'spki',
                format: 'pem'
            },
            privateKeyEncoding: {
                type: 'pkcs8',
                format: 'pem'
            }
        });

        const encryptedPrivateKey = encryptPrivateKey(privateKey);

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            username,
            email,
            password: hashedPassword,
            phone,
            public_key: publicKey,
            private_key: encryptedPrivateKey,
            roleId: role.id
        });
        const tokens = generateTokens(user);
        const userDto = new UserDto(user);
        return { ...tokens, user: userDto };
    }

    async login({ email, username, password }) {
        if (!password || (!email && !username)) {
            throw ApiError.BadRequest("Необходимо указать email/username и пароль");
        }

        const whereCondition = {};
        if (email) whereCondition.email = email;
        if (username) whereCondition.username = username;

        const user = await User.findOne({ where: whereCondition });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw ApiError.BadRequest("Неверные учетные данные");
        }
        const tokens = generateTokens(user);
        const userDto = new UserDto(user);
        return { ...tokens, user: userDto };
    }

    async refresh(refreshToken) {
        if (!refreshToken) {
            throw ApiError.BadRequest("Токен обновления обязателен");
        }

        try {
            const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
            const user = await User.findByPk(decoded.id);
            if (!user) {
                throw ApiError.BadRequest("Пользователь не найден");
            }
            const tokens = generateTokens(user);
            return { ...tokens, user };
        } catch (error) {
            throw ApiError.BadRequest("Невалидный токен обновления");
        }
    }

    async me(userId) {
        const user = await User.findByPk(userId);
        if (!user) {
            throw ApiError.BadRequest("Пользователь не найден");
        }
        const userDto = new UserDto(user);
        return userDto;
    }

    async loginVulnerable(email, password) {
        // const { email, password } = req.body;

        // {
        //     "email": "admin@example.com' --",
        //     "password": "123456"
        // }

        try { 
            const query = `SELECT * FROM Users WHERE email = '${email}' AND password = '${password}'`;
            const users = await sequelize.query(query, { type: Sequelize.QueryTypes.SELECT });

            if (users.length === 0) {
                return res.status(401).json({ message: "Invalid credentials" });
            }

            res.json({ message: `Welcome, ${users[0].username}!` });
        } catch (error) {
            res.status(500).json({ message: "Database error" });
        }
    };
}

module.exports = new AuthService();
