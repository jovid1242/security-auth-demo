const IP = require("../models").IP;
const axios = require("axios");

const ipFilter = async (req, res, next) => {
    try {
        const clientIP = req.ip.replace("::ffff:", "");

        const blockedIP = await IP.findOne({ where: { ip_address: clientIP, is_blocked: true } });
        if (blockedIP) {
            return res.status(403).json({ message: "доступ запрещен: ваш IP заблокирован" });
        }

        try {
            const response = await axios.get(`http://ip-api.com/json/${clientIP}`);
            const country = response.data.countryCode;

            if (country) {
                const blockedCountry = await IP.findOne({ where: { country, is_blocked: true } });
                if (blockedCountry) {
                    return res.status(403).json({ message: `доступ запрещен: ваша страна (${country}) заблокирована` });
                }
            }
        } catch (error) {
            console.error("IP-API request error:", error); 
        }

        next();
    } catch (error) {
        console.error("IP filter error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = ipFilter;
