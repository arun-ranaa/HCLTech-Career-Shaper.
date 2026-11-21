const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

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

const datastorePath = path.join(__dirname, '..', 'database', 'gms_datastore.json');
const datastore = JSON.parse(fs.readFileSync(datastorePath, 'utf8'));

const MYSQL_BIN = process.env.MYSQL_BIN || 'C:\\Program Files\\MySQL\\MySQL Server 8.0\\bin\\mysql.exe';
const MYSQL_PASS = process.env.MYSQL_PASSWORD || '';
const passArg = MYSQL_PASS ? `-p${MYSQL_PASS}` : '';

for (const app of datastore.applications) {
  if (!app.projectTitle && !app.requestedAmount) continue;
  
  const appNum = (app.applicationNumber || 'APP-' + Date.now()).replace(/'/g, "''");
  const title = (app.projectTitle || 'Grant Project').replace(/'/g, "''");
  const applicantName = (app.applicant?.fullName || 'Applicant').replace(/'/g, "''");
  const email = (app.applicant?.email || 'applicant@grants.gov.in').replace(/'/g, "''");
  const orgName = (app.applicant?.organizationName || app.organizationType || 'Public Participant').replace(/'/g, "''");
  const orgType = (app.organizationType || 'Startup').replace(/'/g, "''");
  const requestedAmt = Number(app.requestedAmount || 100000);
  const approvedAmt = app.approvedAmount ? Number(app.approvedAmount) : 'NULL';
  const duration = Number(app.projectDurationMonths || 12);
  const eligStatus = (app.eligibilityStatus || 'AUTO_ELIGIBLE').replace(/'/g, "''");
  const status = (app.status || 'SUBMITTED').replace(/'/g, "''");
  const subDate = (app.submissionDate || new Date().toISOString().substring(0, 10)).replace(/'/g, "''");

  const sql = `USE grants_management; INSERT INTO applications (application_number, project_title, applicant_name, applicant_email, organization_name, organization_type, requested_amount, approved_amount, project_duration_months, eligibility_status, status, submission_date) VALUES ('${appNum}', '${title}', '${applicantName}', '${email}', '${orgName}', '${orgType}', ${requestedAmt}, ${approvedAmt}, ${duration}, '${eligStatus}', '${status}', '${subDate}') ON DUPLICATE KEY UPDATE status = VALUES(status), approved_amount = VALUES(approved_amount), eligibility_status = VALUES(eligibility_status);`;

  try {
    execSync(`"${MYSQL_BIN}" -u root ${passArg} -e "${sql}"`);
    console.log(`Synced to MySQL: [${appNum}] ${title} (${status})`);
  } catch (err) {
    console.error(`Failed to sync: ${appNum}`, err.message);
  }
}
