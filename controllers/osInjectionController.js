const { exec, spawn } = require("child_process");

const runCommandVulnerable = (req, res) => {
    const { command } = req.body;
 
    exec(command, (error, stdout, stderr) => {
        if (error) return res.status(500).json({ error: error.message });
        if (stderr) return res.status(400).json({ stderr });

        res.json({ output: stdout });
    });
};
 

const runCommandSecure = (req, res) => {
    const { command, args } = req.body;
 
    const allowedCommands = ["ping", "ls"];
    if (!allowedCommands.includes(command)) {
        return res.status(400).json({ message: "Command not allowed" });
    }
 
    if (args && args.some(arg => /[;&|]/.test(arg))) {
        return res.status(400).json({ message: "Invalid characters in arguments" });
    }

    const process = spawn(command, args || []);
    let output = "";

    process.stdout.on("data", (data) => (output += data));
    process.on("close", () => res.json({ output }));
};

module.exports = { runCommandVulnerable, runCommandSecure };
