const Router = require("express").Router;
const { body } = require("express-validator");
const router = new Router();
const authController = require("../controllers/auth/authController");
const { authenticate } = require("../middlewares/authMiddleware");
const ipFilter = require("../middlewares/ipFilterMiddeware");

const validateRegistration = [
    body("username")
        .isString().withMessage("Имя пользователя должно быть строкой")
        .notEmpty().withMessage("Имя пользователя обязательно")
        .matches(/^[^\d]*$/).withMessage("Имя пользователя не должно содержать цифр"),

    body("email")
        .isEmail().withMessage("Неверный формат email"),

    body("password")
        .isLength({ min: 8 }).withMessage("Пароль должен быть не менее 8 символов")
        .matches(/(.*[A-Z].*)/).withMessage("Пароль должен содержать хотя бы одну заглавную букву")
        .matches(/(.*[!@#$%^&*()_+].*){2,}/).withMessage("Пароль должен содержать хотя бы 2 специальных символа")
        .not().matches(/(.)\1{2,}/).withMessage("Избегайте повторяющихся символов (например, aaa, 111)")
        .matches(/January|February|March|April|May|June|July|August|September|October|November|December/).withMessage("Пароль должен содержать текущее название месяца"),

    body("phone")
        .matches(/^\+?\d{10,15}$/).withMessage("Неверный формат номера телефона"),

    body("dob")
        .isISO8601().withMessage("Неверный формат даты (должен быть YYYY-MM-DD)")
        .custom(value => {
            const birthDate = new Date(value);
            const today = new Date();
            const age = today.getFullYear() - birthDate.getFullYear();
            if (age > 111 || birthDate > today) {
                throw new Error("Неверная дата рождения");
            }
            return true;
        }),

    body("gender")
        .isIn(["M", "Ж", "Мужчина", "Женщина", "мальчик", "девочка"])
        .withMessage("Неверное значение пола"),

    body("avatar")
        .optional()
        .custom((value, { req }) => {
            if (!req.file) return true;  
            const allowedExtensions = ["jpg", "jpeg", "png"];
            const fileExt = req.file.originalname.split(".").pop();
            if (!allowedExtensions.includes(fileExt)) {
                throw new Error("Неверный формат изображения (разрешенные форматы: jpg, png)");
            }
            if (req.file.size > 2 * 1024 * 1024) {
                throw new Error("Размер изображения превышает 2MB");
            }
            return true;
        })
];
 
const validateLogin = [
    body("email")
        .isEmail().withMessage("Invalid email format"),

    body("password")
        .notEmpty().withMessage("Password is required")
];

router.post("/register", ipFilter, validateRegistration, authController.registration);
router.post("/login", ipFilter, validateLogin, authController.login); 
router.post("/login-vulnerable", ipFilter, authController.loginVulnerable);
router.get("/refresh", ipFilter, authController.refresh);
router.get("/me", ipFilter, authenticate, authController.me);

module.exports = router;
