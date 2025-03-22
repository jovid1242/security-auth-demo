const authService = require("../../services/auth/authService"); 

class AuthController {
  async registration(req, res) {
    try {
      const user = await authService.register(req.body);
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async login(req, res) {
    try {
      const { accessToken, refreshToken, user } = await authService.login(req.body);
      res.json({ accessToken, refreshToken, user });
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  } 

  async refresh(req, res) {
    try {
      const { refreshToken } = req.body;
      const tokens = await authService.refresh(refreshToken);
      res.json(tokens);
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
    }

  async me(req, res) {
    try {
      const user = await authService.me(req.user.id);
      res.json(user);
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  }

  async loginVulnerable(req, res) {
    try {
      const { email, password } = req.body;
      const user = await authService.loginVulnerable(email, password);  
      res.json(user);
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  }

  async checkEmail(req, res, next) {
    try {
      const { email } = req.body;
      const available = await authService.checkEmailAvailability(email);
      return res.json({ available });
    } catch (e) {
      next(e);
    }
  }

  async checkUsername(req, res, next) {
    try {
      const { username } = req.body;
      const available = await authService.checkUsernameAvailability(username);
      return res.json({ available });
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new AuthController();
