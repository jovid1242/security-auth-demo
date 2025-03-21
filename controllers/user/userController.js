const userService = require("../../services/user/userService");

class UserController {
  async getProfile(req, res) {
    try {
      const user = await userService.getProfile(req.params.userId);
      res.json(user);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  async updateProfile(req, res) {
    try {
      const updatedUser = await userService.updateProfile(req.user.id, req.body);
      res.json({ message: "Profile updated successfully", updatedUser });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getContacts(req, res) {
    try {
      const contacts = await userService.getContacts(req.user.id);
      res.json(contacts);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async addContact(req, res) {
    try {
      await userService.addContact(req.user.id, req.body.contact_id);
      res.json({ message: "Contact added successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getRoomUsers({ toUserId, fromUserId }) {
    return await userService.getRoomUsers({ toUserId, fromUserId });
  }

  async getUserStatus(req, res) {
    try {
      const status = await userService.getUserStatus(req.params.userId);
      res.json(status);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }
}

module.exports = new UserController();
