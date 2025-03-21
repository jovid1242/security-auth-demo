const { User, Contact } = require("../../models");

class UserService {
  async getProfile(userId) {
    return await User.findByPk(userId);
  }

  async updateProfile(userId, data) {
    const user = await User.findByPk(userId);
    if (!user) throw new Error("User not found");

    await user.update(data);
    return user;
  }

  async getContacts(userId) {
    return await Contact.findAll({ where: { user_id: userId }, include: [{ model: User, as: "contact" }] });
  }

  async addContact(userId, contactId) {
    return await Contact.create({ user_id: userId, contact_id: contactId });
  }

  async getRoomUsers({ toUserId, fromUserId }) {
    return await User.findAll({ where: { id: [toUserId, fromUserId] } });
  }

  async getUserStatus(userId) {
    const user = await User.findByPk(userId);
    if (!user) throw new Error("User not found");
    return { status: user.status || "offline" };
  }
}

module.exports = new UserService();
