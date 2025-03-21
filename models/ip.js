module.exports = (sequelize, DataTypes) => {
    const IP = sequelize.define("IP", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        ip_address: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        country: {
            type: DataTypes.STRING,
            allowNull: true
        },
        is_blocked: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    });

    return IP;
};
