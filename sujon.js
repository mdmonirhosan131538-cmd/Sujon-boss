const { spawn } = require("child_process");
const axios = require("axios");
const logger = require("./utils/log");
const express = require("express");
const path = require("path");
const fs = require("fs");
const os = require("os");

const app = express();
const port = process.env.PORT || 8080;

// ======================================
// 🔥 LOAD API KEY FILE
// ======================================
global.apikey = {};
try {
  const keyPath = path.join(__dirname, "apikey.json");
  if (fs.existsSync(keyPath)) {
    global.apikey = JSON.parse(fs.readFileSync(keyPath, "utf8"));
    logger("apikey.json loaded successfully!", "[ APIKEY ]");
  } else {
    logger("apikey.json not found!", "[ APIKEY ERROR ]");
  }
} catch (e) {
  logger("Failed to load apikey.json: " + e.message, "[ APIKEY ERROR ]");
}

// ======================================
// EXPRESS SERVER WITH MORE FEATURES
// ======================================
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, "/index.html"));
});

// Bot status endpoint
app.get('/status', function (req, res) {
  const status = {
    status: 'running',
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    platform: os.platform(),
    restartCount: global.countRestart || 0,
    timestamp: new Date().toISOString()
  };
  res.json(status);
});

// Health check endpoint
app.get('/health', function (req, res) {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.listen(port, () => {
  logger("Server is running on port " + port + "...", "[ STARTING ]");
  logger(`Dashboard: http://localhost:${port}`, "[ DASHBOARD ]");
}).on("error", err => {
  if (err.code === "EACCES") {
    logger("Permission denied. Cannot bind to port " + port + '.', "[ Error ]");
  } else if (err.code === "EADDRINUSE") {
    logger("Port " + port + " is already in use.", "[ Error ]");
  } else {
    logger("Server error: " + err.message, "[ Error ]");
  }
});

// ======================================
// BOT RESTART HANDLER WITH IMPROVEMENTS
// ======================================
global.countRestart = global.countRestart || 0;
global.botStartTime = Date.now();

function startBot(msg) {
  if (msg) logger(msg, "[ STARTING ]");

  // Clear require cache for hot reload (optional)
  if (global.countRestart > 0) {
    Object.keys(require.cache).forEach(key => {
      if (!key.includes('node_modules')) {
        delete require.cache[key];
      }
    });
  }

  const child = spawn("node", ["--trace-warnings", "--async-stack-traces", "Main.js"], {
    cwd: __dirname,
    stdio: "inherit",
    shell: true,
    env: { ...process.env, CHILD_PROCESS: "true" }
  });

  child.on("close", (codeExit, signal) => {
    let restartDelay = 5000; // 5 seconds delay
    
    if (codeExit === 0) {
      logger("Bot stopped gracefully.", "[ STOPPED ]");
      return;
    }
    
    if (signal) {
      logger(`Bot killed with signal: ${signal}`, "[ STOPPED ]");
    } else {
      logger(`Bot exited with code ${codeExit}.`, "[ STOPPED ]");
    }

    if (global.countRestart < 10) { // Increased max restarts
      global.countRestart += 1;
      logger(`Restarting in ${restartDelay/1000} seconds... (${global.countRestart}/10)`, "[ RESTARTING ]");
      
      setTimeout(() => {
        startBot();
      }, restartDelay);
    } else {
      logger(`Bot stopped after ${global.countRestart} restarts.`, "[ STOPPED ]");
      logger("Please check for errors and restart manually.", "[ ERROR ]");
    }
  });

  child.on("error", err => {
    logger("An error occurred: " + JSON.stringify(err), "[ Error ]");
  });

  // Handle process signals
  process.on('SIGINT', () => {
    logger("Received SIGINT, shutting down...", "[ SHUTDOWN ]");
    child.kill('SIGINT');
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    logger("Received SIGTERM, shutting down...", "[ SHUTDOWN ]");
    child.kill('SIGTERM');
    process.exit(0);
  });
}

// ======================================
// SYSTEM MONITORING
// ======================================
function logSystemInfo() {
  const memoryUsage = process.memoryUsage();
  const totalMem = os.totalmem() / (1024 * 1024);
  const freeMem = os.freemem() / (1024 * 1024);
  const usedMem = totalMem - freeMem;
  
  logger(`Memory: ${Math.round(usedMem)}MB / ${Math.round(totalMem)}MB (${Math.round((usedMem/totalMem)*100)}%)`, "[ SYSTEM ]");
  logger(`Platform: ${os.platform()} | Arch: ${os.arch()}`, "[ SYSTEM ]");
  logger(`CPU: ${os.cpus()[0].model}`, "[ SYSTEM ]");
  logger(`Uptime: ${Math.round(process.uptime())}s`, "[ SYSTEM ]");
}

// Log system info every 30 minutes
setInterval(logSystemInfo, 30 * 60 * 1000);

// ======================================
// FETCH BOT META WITH FALLBACK
// ======================================
function fetchBotMeta() {
  const sources = [
    "https://raw.githubusercontent.com/Sujon-Boss/fb-bot/main/package.json",
    "https://raw.githubusercontent.com/Sujon-Boss/fb-bot/main/package.json"
  ];

  const tryFetch = (url) => {
    axios.get(url, { timeout: 10000 })
      .then(res => {
        if (res.data && res.data.name) {
          logger(res.data.name, "[ NAME ]");
          logger("Version: " + (res.data.version || "Unknown"), "[ VERSION ]");
          logger(res.data.description || "No description", "[ DESCRIPTION ]");
          return true;
        }
        return false;
      })
      .catch(() => false);
  };

  // Try each source until one works
  let currentSource = 0;
  const attemptFetch = () => {
    if (currentSource < sources.length) {
      if (tryFetch(sources[currentSource])) {
        return;
      }
      currentSource++;
      setTimeout(attemptFetch, 2000);
    } else {
      logger("Could not fetch update info from any source", "[ UPDATE INFO ]");
    }
  };

  attemptFetch();
}

// ======================================
// AUTO UPDATE CHECKER
// ======================================
function checkForUpdates() {
  try {
    const localPackage = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
    
    axios.get("https://raw.githubusercontent.com/Sujon-Boss/fb-bot/main/package.json", { timeout: 15000 })
      .then(res => {
        if (res.data && res.data.version && res.data.version !== localPackage.version) {
          logger(`New version available: ${res.data.version} (Current: ${localPackage.version})`, "[ UPDATE ]");
          logger("Run 'git pull' to update", "[ UPDATE ]");
        } else {
          logger("Bot is up to date!", "[ UPDATE ]");
        }
      })
      .catch(() => {
        logger("Could not check for updates", "[ UPDATE ]");
      });
  } catch (e) {
    logger("Failed to check updates: " + e.message, "[ UPDATE ]");
  }
}

// ======================================
// INITIALIZE AND START
// ======================================
logger("Initializing Sujon Boss Bot...", "[ INIT ]");
logSystemInfo();
fetchBotMeta();

// Check for updates after 1 minute
setTimeout(checkForUpdates, 60000);

// Start bot with a small delay
setTimeout(() => {
  startBot("🚀 Starting Sujon Boss Bot...");
}, 2000);