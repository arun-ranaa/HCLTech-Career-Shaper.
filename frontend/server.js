/**
 * Grants Management System (J18) - Resilient Full-Stack Server
 * Features:
 * 1. Persistent Disk Database (/api/v1/* backed by database/gms_datastore.json)
 * 2. Static Web Asset Serving on port 4200 (HTML, CSS, JS, Images, SPA fallback)
 * 3. Automatic Data Synchronization across sessions & restarts
 * 4. Error trapping and keep-alive heartbeats to prevent unexpected exits
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const PORT = 4200;
const PUBLIC_DIR = path.join(__dirname, 'src');
const DATA_DIR = path.join(__dirname, '..', 'database');
const DATA_FILE = path.join(DATA_DIR, 'gms_datastore.json');

// Load local environment variables from .env if present (excluded from Git)
try {
  const envPath = path.join(__dirname, '..', '.env');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const idx = trimmed.indexOf('=');
      if (idx !== -1) {
        const key = trimmed.substring(0, idx).trim();
        const val = trimmed.substring(idx + 1).trim().replace(/^['"]|['"]$/g, '');
        if (!process.env[key]) process.env[key] = val;
      }
    }
  }
} catch (e) {}

// MIME Type Map
const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

// Global exception handlers to prevent server crashes
process.on('uncaughtException', (err) => {
  console.error('[GMS Server] Caught exception:', err.message);
});

process.on('unhandledRejection', (reason) => {
  console.error('[GMS Server] Unhandled rejection:', reason);
});

// ---------------------------------------------------------------------------
// PERSISTENT DATASTORE MANAGEMENT
// ---------------------------------------------------------------------------
let dataStore = {
  users: {},
  programs: [],
  applications: [],
  disbursements: [],
  utilizationReports: [],
  auditLogs: [],
  stats: {}
};

function loadDataStore() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf8');
      dataStore = JSON.parse(raw);
      console.log(`[GMS Server] Persistent store loaded successfully: ${dataStore.applications?.length || 0} applications.`);
    } else {
      saveDataStore();
      console.log('[GMS Server] Initialized empty persistent store at', DATA_FILE);
    }
  } catch (err) {
    console.error('[GMS Server] Failed to load persistent data store:', err.message);
  }
}

function saveDataStore() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(dataStore, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('[GMS Server] Failed to save persistent data store:', err.message);
    return false;
  }
}

// Initial load
loadDataStore();

// ---------------------------------------------------------------------------
// ORACLE DATABASE XE LIVE BRIDGE
// ---------------------------------------------------------------------------
function syncToOracle(appData) {
  try {
    const id = 'app_' + Date.now();
    const appNum = (appData.applicationNumber || ('APP-' + Date.now())).replace(/'/g, "''");
    const progId = 'prog_community_2026';
    const progName = (appData.program?.title || 'Grant Program').replace(/'/g, "''");
    const applicantName = (appData.applicant?.fullName || 'Applicant').replace(/'/g, "''");
    const email = (appData.applicant?.email || 'applicant@grants.gov.in').replace(/'/g, "''");
    const orgName = (appData.applicant?.organizationName || appData.organizationType || 'Public Participant').replace(/'/g, "''");
    const orgType = (appData.organizationType || 'Startup').replace(/'/g, "''");
    const title = (appData.projectTitle || 'Grant Project').replace(/'/g, "''");
    const amount = Number(appData.requestedAmount || 100000);
    const status = (appData.status || 'SUBMITTED').replace(/'/g, "''");

    const sql = `
INSERT INTO GRANTS_ADMIN.APPLICATIONS (
    ID, APPLICATION_NUMBER, PROGRAM_ID, PROGRAM_NAME,
    APPLICANT_NAME, APPLICANT_EMAIL, ORGANIZATION_NAME, ORGANIZATION_TYPE,
    PROJECT_TITLE, REQUESTED_AMOUNT, STATUS, SUBMITTED_AT
) VALUES (
    '${id}', '${appNum}', '${progId}', '${progName}',
    '${applicantName}', '${email}', '${orgName}', '${orgType}',
    '${title}', ${amount}, '${status}', TO_CHAR(SYSDATE, 'YYYY-MM-DD HH24:MI:SS')
);
COMMIT;
EXIT;
`;

    const child = exec('sqlplus -S / as sysdba', (err, stdout) => {
      if (err) {
        console.warn('[Oracle Sync] Notice:', err.message);
      } else {
        console.log(`[Oracle Sync] Live synced to Oracle Database (GRANTS_ADMIN.APPLICATIONS): ${appNum}`);
      }
    });
    if (child.stdin) {
      child.stdin.write(sql);
      child.stdin.end();
    }
  } catch (e) {
    console.warn('[Oracle Sync] Bridge exception:', e.message);
  }
}

// ---------------------------------------------------------------------------
// MYSQL WORKBENCH LIVE BRIDGE
// ---------------------------------------------------------------------------
const MYSQL_BIN = process.env.MYSQL_BIN || 'C:\\Program Files\\MySQL\\MySQL Server 8.0\\bin\\mysql.exe';
const MYSQL_PASS = process.env.MYSQL_PASSWORD || '';

function syncToMySQL(appData) {
  try {
    if (!appData.projectTitle && !appData.requestedAmount) return;
    const appNum = (appData.applicationNumber || ('APP-' + Date.now())).replace(/'/g, "''");
    const title = (appData.projectTitle || 'Grant Project').replace(/'/g, "''");
    const applicantName = (appData.applicant?.fullName || 'Applicant').replace(/'/g, "''");
    const email = (appData.applicant?.email || 'applicant@grants.gov.in').replace(/'/g, "''");
    const orgName = (appData.applicant?.organizationName || appData.organizationType || 'Public Participant').replace(/'/g, "''");
    const orgType = (appData.organizationType || 'Startup').replace(/'/g, "''");
    const requestedAmt = Number(appData.requestedAmount || 100000);
    const approvedAmt = appData.approvedAmount ? Number(appData.approvedAmount) : 'NULL';
    const duration = Number(appData.projectDurationMonths || 12);
    const eligStatus = (appData.eligibilityStatus || 'AUTO_ELIGIBLE').replace(/'/g, "''");
    const status = (appData.status || 'SUBMITTED').replace(/'/g, "''");
    const subDate = (appData.submissionDate || new Date().toISOString().substring(0, 10)).replace(/'/g, "''");

    const sql = `USE grants_management; INSERT INTO applications (application_number, project_title, applicant_name, applicant_email, organization_name, organization_type, requested_amount, approved_amount, project_duration_months, eligibility_status, status, submission_date) VALUES ('${appNum}', '${title}', '${applicantName}', '${email}', '${orgName}', '${orgType}', ${requestedAmt}, ${approvedAmt}, ${duration}, '${eligStatus}', '${status}', '${subDate}') ON DUPLICATE KEY UPDATE status = VALUES(status), approved_amount = VALUES(approved_amount), eligibility_status = VALUES(eligibility_status);`;

    const passArg = MYSQL_PASS ? `-p${MYSQL_PASS}` : '';
    exec(`"${MYSQL_BIN}" -u root ${passArg} -e "${sql}"`, (err, stdout) => {
      if (err) {
        console.warn('[MySQL Sync] Notice:', err.message);
      } else {
        console.log(`[MySQL Sync] Live synced to MySQL Workbench (grants_management.applications): ${appNum}`);
      }
    });
  } catch (e) {
    console.warn('[MySQL Sync] Bridge error:', e.message);
  }
}

// ---------------------------------------------------------------------------
// HTTP REQUEST PARSING HELPER
// ---------------------------------------------------------------------------
function getRequestBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        resolve({});
      }
    });
  });
}

function sendJson(res, statusCode, data) {
  if (res.headersSent) return;
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': '*'
  });
  res.end(JSON.stringify(data));
}

// ---------------------------------------------------------------------------
// HTTP SERVER IMPLEMENTATION
// ---------------------------------------------------------------------------
const server = http.createServer(async (req, res) => {
  req.on('error', (err) => console.warn('[GMS Server] Request error:', err.message));
  res.on('error', (err) => console.warn('[GMS Server] Response error:', err.message));

  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = req.url.split('?')[0];
  const method = req.method.toUpperCase();

  // -------------------------------------------------------------------------
  // REST API ROUTER (/api/v1/*) - PERSISTENT IN database/gms_datastore.json
  // -------------------------------------------------------------------------
  if (parsedUrl.startsWith('/api/v1')) {
    const apiPath = parsedUrl.replace('/api/v1', '');

    // 1. Full State Snapshot & Client Sync
    if (apiPath === '/state' && method === 'GET') {
      return sendJson(res, 200, dataStore);
    }

    if (apiPath === '/sync' && method === 'POST') {
      const payload = await getRequestBody(req);
      if (payload.applications && Array.isArray(payload.applications)) {
        dataStore.applications = payload.applications;
        // Keep MySQL Workbench synchronized in real-time
        if (payload.applications.length > 0) {
          syncToMySQL(payload.applications[0]);
        }
      }
      if (payload.auditLogs && Array.isArray(payload.auditLogs)) {
        dataStore.auditLogs = payload.auditLogs;
      }
      if (payload.disbursements && Array.isArray(payload.disbursements)) {
        dataStore.disbursements = payload.disbursements;
      }
      if (payload.programs && Array.isArray(payload.programs)) {
        dataStore.programs = payload.programs;
      }
      if (payload.utilizationReports && Array.isArray(payload.utilizationReports)) {
        dataStore.utilizationReports = payload.utilizationReports;
      }
      if (payload.stats && typeof payload.stats === 'object') {
        dataStore.stats = payload.stats;
      }
      if (payload.users && typeof payload.users === 'object') {
        dataStore.users = { ...dataStore.users, ...payload.users };
      }
      saveDataStore();
      console.log(`[GMS Server] State synchronized to disk: ${dataStore.applications.length} applications stored.`);
      return sendJson(res, 200, { success: true, applicationsCount: dataStore.applications.length });
    }

    // 2. Applications API
    if (apiPath === '/applications' && method === 'GET') {
      return sendJson(res, 200, dataStore.applications || []);
    }

    if (apiPath === '/applications' && method === 'POST') {
      const appData = await getRequestBody(req);
      if (!appData.applicationId) {
        appData.applicationId = (dataStore.applications?.length || 0) + 1;
      }
      if (!appData.applicationNumber) {
        appData.applicationNumber = `APP-2025-${Math.floor(Math.random() * 90000) + 10000}`;
      }
      if (!appData.submissionDate) {
        appData.submissionDate = new Date().toISOString().substring(0, 10);
      }
      if (!appData.status) {
        appData.status = 'SUBMITTED';
      }

      dataStore.applications = dataStore.applications || [];
      dataStore.applications.unshift(appData);

      // Record audit log
      dataStore.auditLogs = dataStore.auditLogs || [];
      dataStore.auditLogs.unshift({
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
        user: `${appData.applicant?.fullName || 'Applicant'} (Applicant)`,
        action: 'SUBMIT',
        entity: appData.applicationNumber,
        ip: '127.0.0.1',
        details: `Application submitted. Eligibility Verdict: ${appData.eligibilityStatus || 'AUTO_ELIGIBLE'}.`
      });

      // Update statistics
      if (dataStore.stats) {
        dataStore.stats.totalApplications = (dataStore.stats.totalApplications || 0) + 1;
      }

      saveDataStore();
      console.log(`[GMS Server] New Application created & persisted to disk: ${appData.applicationNumber}`);
      
      // Live sync to Oracle Database 11g/21c XE
      syncToOracle(appData);

      // Live sync to MySQL Server 8.0 (MySQL Workbench)
      syncToMySQL(appData);

      return sendJson(res, 201, appData);
    }

    // 3. Grant Programs API
    if (apiPath === '/programs' && method === 'GET') {
      return sendJson(res, 200, dataStore.programs || []);
    }

    if (apiPath === '/programs' && method === 'POST') {
      const progData = await getRequestBody(req);
      if (!progData.programId) progData.programId = (dataStore.programs?.length || 0) + 1;
      dataStore.programs = dataStore.programs || [];
      dataStore.programs.unshift(progData);
      saveDataStore();
      return sendJson(res, 201, progData);
    }

    // 4. Disbursements API
    if (apiPath === '/disbursements' && method === 'GET') {
      return sendJson(res, 200, dataStore.disbursements || []);
    }

    if (apiPath === '/disbursements' && method === 'POST') {
      const disbData = await getRequestBody(req);
      if (!disbData.disbursementId) disbData.disbursementId = (dataStore.disbursements?.length || 0) + 1;
      dataStore.disbursements = dataStore.disbursements || [];
      dataStore.disbursements.unshift(disbData);
      saveDataStore();
      return sendJson(res, 201, disbData);
    }

    // 5. Utilization Reports API
    if (apiPath === '/utilization-reports' && method === 'GET') {
      return sendJson(res, 200, dataStore.utilizationReports || []);
    }

    if (apiPath === '/utilization-reports' && method === 'POST') {
      const repData = await getRequestBody(req);
      if (!repData.reportId) repData.reportId = (dataStore.utilizationReports?.length || 0) + 1;
      dataStore.utilizationReports = dataStore.utilizationReports || [];
      dataStore.utilizationReports.unshift(repData);
      saveDataStore();
      return sendJson(res, 201, repData);
    }

    // 6. Analytics Dashboard API
    if (apiPath === '/analytics/dashboard' && method === 'GET') {
      return sendJson(res, 200, dataStore.stats || {});
    }

    // 7. Audit Logs API
    if (apiPath === '/audit-logs' && method === 'GET') {
      return sendJson(res, 200, dataStore.auditLogs || []);
    }

    // 8. Users & Authentication API
    if (apiPath === '/users' && method === 'GET') {
      return sendJson(res, 200, dataStore.users || {});
    }

    if (apiPath === '/auth/register' && method === 'POST') {
      const user = await getRequestBody(req);
      dataStore.users = dataStore.users || {};
      dataStore.users[user.username] = {
        userId: Object.keys(dataStore.users).length + 10,
        username: user.username,
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        organizationName: user.organizationName,
        role: user.roleName || user.role || 'ROLE_APPLICANT'
      };
      saveDataStore();
      return sendJson(res, 201, { message: 'User registered successfully', user: dataStore.users[user.username] });
    }

    // Fallback for unmatched API routes
    return sendJson(res, 404, { error: 'API route not found', path: apiPath });
  }

  // -------------------------------------------------------------------------
  // STATIC ASSET SERVING WITH SPA FALLBACK
  // -------------------------------------------------------------------------
  let filePath = path.join(PUBLIC_DIR, parsedUrl === '/' ? 'index.html' : parsedUrl);

  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(PUBLIC_DIR, 'index.html'); // SPA fallback
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (!res.headersSent) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end(`Server Error: ${err.code}`);
      }
    } else {
      if (!res.headersSent) {
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content);
      }
    }
  });
});

server.on('error', (err) => {
  console.error('[GMS Server] Fatal Server Error:', err.message);
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`=================================================================`);
  console.log(`  Grants Management System (J18) - Resilient Full-Stack Server`);
  console.log(`  Running at: http://localhost:${PORT}`);
  console.log(`  Persistent DB: database/gms_datastore.json`);
  console.log(`=================================================================`);
});

// Keep process active indefinitely
if (process.stdin.isTTY) {
  process.stdin.resume();
}
setInterval(() => {}, 60000); // 1-minute event loop anchor
