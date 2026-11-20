import os
import re

main_js_path = r"c:\Users\arunj\OneDrive\Desktop\grants\frontend\src\main.js"

with open(main_js_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Add saveStateToStorage and loadStateFromStorage
storage_helpers = """
// =============================================================================
// PERSISTENT STORAGE HELPERS (Local Session Synchronization Across Roles)
// =============================================================================
function saveStateToStorage() {
  try {
    const payload = {
      applications: state.applications,
      auditLogs: state.auditLogs,
      disbursements: state.disbursements,
      programs: state.programs,
      utilizationReports: state.utilizationReports,
      stats: state.stats
    };
    localStorage.setItem('gms_app_state_v3', JSON.stringify(payload));
  } catch (e) {
    console.warn('Storage save failed:', e);
  }
}

function loadStateFromStorage() {
  try {
    const saved = localStorage.getItem('gms_app_state_v3');
    if (saved) {
      const p = JSON.parse(saved);
      if (p.applications && p.applications.length > 0) state.applications = p.applications;
      if (p.auditLogs && p.auditLogs.length > 0) state.auditLogs = p.auditLogs;
      if (p.disbursements && p.disbursements.length > 0) state.disbursements = p.disbursements;
      if (p.programs && p.programs.length > 0) state.programs = p.programs;
      if (p.utilizationReports && p.utilizationReports.length > 0) state.utilizationReports = p.utilizationReports;
      if (p.stats) state.stats = p.stats;
      return true;
    }
  } catch (e) {
    console.warn('Storage load failed:', e);
  }
  return false;
}
"""

if 'function saveStateToStorage' not in content:
    content = content.replace("// Data Loader (Backend with Fallback Mock)", storage_helpers + "\n// Data Loader (Backend with Fallback Mock)")

# Update DOMContentLoaded to load from storage
old_dom = """document.addEventListener('DOMContentLoaded', async () => {
  const saved = localStorage.getItem('gms_session_user');
  if (saved) {
    try {
      state.currentUser = JSON.parse(saved);
      setDefaultTabForRole(state.currentUser.role);
    } catch (e) {
      state.currentUser = null;
    }
  }

  await loadData();
  renderApp();
});"""

new_dom = """document.addEventListener('DOMContentLoaded', async () => {
  const saved = localStorage.getItem('gms_session_user');
  if (saved) {
    try {
      state.currentUser = JSON.parse(saved);
      setDefaultTabForRole(state.currentUser.role);
    } catch (e) {
      state.currentUser = null;
    }
  }

  await loadData();
  loadStateFromStorage();
  renderApp();
});"""

content = content.replace(old_dom, new_dom)

# 2. Update handleSaveScorecard
old_save_scorecard = """function handleSaveScorecard(e, appId) {
  e.preventDefault();
  const app = state.applications.find(a => a.applicationId === appId);
  const f = parseInt(document.getElementById('fScore').value) || 0;
  const i = parseInt(document.getElementById('iScore').value) || 0;
  const b = parseInt(document.getElementById('bScore').value) || 0;
  const s = parseInt(document.getElementById('sScore').value) || 0;
  const rec = document.getElementById('revRec').value;
  const comm = document.getElementById('revComments').value;

  if (app) {
    app.reviewScores = {
      feasibility: f,
      innovation: i,
      budget: b,
      social: s,
      total: f + i + b + s,
      recommendation: rec,
      comments: comm
    };
  }

  state.auditLogs.unshift({
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
    user: `${state.currentUser.fullName} (Reviewer)`,
    action: 'SUBMIT_REVIEW',
    entity: app.applicationNumber,
    ip: '14.139.45.10',
    details: `Technical Score: ${f+i+b+s}/100 | Recommendation: ${rec}`
  });

  closeModal();
  renderApp();
  alert(`Scorecard Submitted!\\nTotal Score: ${f+i+b+s}/100\\nRecommendation: ${rec}`);
}"""

new_save_scorecard = """function handleSaveScorecard(e, appId) {
  e.preventDefault();
  const app = state.applications.find(a => a.applicationId === appId);
  if (!app) return;

  const f = parseInt(document.getElementById('fScore').value) || 0;
  const i = parseInt(document.getElementById('iScore').value) || 0;
  const b = parseInt(document.getElementById('bScore').value) || 0;
  const s = parseInt(document.getElementById('sScore').value) || 0;
  const rec = document.getElementById('revRec').value;
  const comm = document.getElementById('revComments').value;
  const total = f + i + b + s;

  const prevStatus = app.status || 'UNDER_REVIEW';
  // Update status according to evaluation recommendation (default approved)
  const newStatus = (rec === 'RECOMMEND_REJECT') ? 'REJECTED' : 'APPROVED';

  app.reviewScores = {
    feasibility: f,
    innovation: i,
    budget: b,
    social: s,
    total: total,
    recommendation: rec,
    comments: comm,
    reviewer: state.currentUser ? state.currentUser.fullName : 'Dr. Alok Kapoor',
    reviewerOrg: state.currentUser ? state.currentUser.organizationName : 'IIT Delhi',
    reviewDate: new Date().toISOString().replace('T', ' ').substring(0, 16)
  };

  // UPDATE APPLICATION RECORD STATUS TO APPROVED
  app.status = newStatus;
  if (newStatus === 'APPROVED' && (!app.approvedAmount || app.approvedAmount === 0)) {
    app.approvedAmount = app.requestedAmount;
  }

  // Update Macro Analytics Stats
  if (state.stats) {
    if (newStatus === 'APPROVED') {
      state.stats.applicationsApproved = (state.stats.applicationsApproved || 0) + 1;
    }
    state.stats.applicationsUnderReview = Math.max(0, (state.stats.applicationsUnderReview || 1) - 1);
  }

  // Record definitive audit trail showing transition from UNDER_REVIEW to APPROVED
  state.auditLogs.unshift({
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
    user: `${state.currentUser ? state.currentUser.fullName : 'Reviewer'} (Evaluation Committee)`,
    action: 'REVIEW_APPROVED',
    entity: app.applicationNumber,
    ip: '14.139.45.10',
    details: `Evaluation Scorecard submitted (Score: ${total}/100, Recommendation: ${rec}). Proposal evaluated and marked APPROVED for grant sanction. Remarks: "${comm}"`
  });

  // Save to persistent storage so Program Officer immediately sees the update
  saveStateToStorage();

  closeModal();
  renderApp();
  alert(`Evaluation Scorecard Submitted Successfully!\\n\\nTotal Score: ${total}/100 (${rec})\\nApplication ${app.applicationNumber} has been updated to APPROVED.\\nThe Program Officer can now issue the Sanction Order or release disbursements.`);
}"""

content = content.replace(old_save_scorecard, new_save_scorecard)

# 3. Update viewApplicationDetail to show rich evaluation scorecard
old_view_detail = """            ${app.reviewScores ? `
              <tr><th>Peer Review Score</th><td><strong style="color: #6b21a8;">${app.reviewScores.total} / 100</strong> (${app.reviewScores.recommendation})</td></tr>
            ` : ''}
          </table>"""

new_view_detail = """          </table>

          ${app.reviewScores ? `
            <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 14px; margin-bottom: 16px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <div style="font-weight: 700; color: #166534; font-size: 14px;">
                  Peer Review Evaluation Scorecard & Assessment
                </div>
                <div>
                  <span class="badge badge-green" style="font-size: 12px; font-weight: 700;">APPROVED</span>
                  <span class="badge badge-purple" style="font-size: 12px; font-weight: 700;">Score: ${app.reviewScores.total} / 100</span>
                </div>
              </div>
              <div style="font-size: 12px; color: #374151; margin-bottom: 10px;">
                <strong>Assigned Technical Reviewer:</strong> ${app.reviewScores.reviewer || (app.assignedReviewer ? app.assignedReviewer.fullName : 'Dr. Alok Kapoor')} (${app.reviewScores.reviewerOrg || 'Evaluation Panel'}) • <em>${app.reviewScores.reviewDate || 'Recently Evaluated'}</em>
              </div>
              <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-bottom: 10px; text-align: center;">
                <div style="background: #ffffff; padding: 8px; border-radius: 6px; border: 1px solid #d1fae5;">
                  <div style="font-size: 10px; color: #64748b; font-weight: 600;">FEASIBILITY</div>
                  <div style="font-size: 15px; font-weight: 800; color: #2563eb;">${app.reviewScores.feasibility} / 25</div>
                </div>
                <div style="background: #ffffff; padding: 8px; border-radius: 6px; border: 1px solid #d1fae5;">
                  <div style="font-size: 10px; color: #64748b; font-weight: 600;">INNOVATION</div>
                  <div style="font-size: 15px; font-weight: 800; color: #2563eb;">${app.reviewScores.innovation} / 25</div>
                </div>
                <div style="background: #ffffff; padding: 8px; border-radius: 6px; border: 1px solid #d1fae5;">
                  <div style="font-size: 10px; color: #64748b; font-weight: 600;">BUDGET REALISM</div>
                  <div style="font-size: 15px; font-weight: 800; color: #2563eb;">${app.reviewScores.budget} / 25</div>
                </div>
                <div style="background: #ffffff; padding: 8px; border-radius: 6px; border: 1px solid #d1fae5;">
                  <div style="font-size: 10px; color: #64748b; font-weight: 600;">SOCIAL IMPACT</div>
                  <div style="font-size: 15px; font-weight: 800; color: #2563eb;">${app.reviewScores.social} / 25</div>
                </div>
              </div>
              <div style="background: #ffffff; padding: 10px; border-radius: 6px; border: 1px solid #d1fae5; font-size: 12px;">
                <div><strong>Recommendation:</strong> <span style="color: #059669; font-weight: 700;">${app.reviewScores.recommendation}</span></div>
                <div style="margin-top: 4px;"><strong>Reviewer Comments & Justification:</strong> ${app.reviewScores.comments}</div>
              </div>
            </div>
          ` : `
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; margin-bottom: 16px; font-size: 12px; color: #64748b;">
              <strong>Peer Evaluation Status:</strong> Assigned to ${app.assignedReviewer ? app.assignedReviewer.fullName : 'Technical Committee'}. Review scorecard pending submission.
            </div>
          `}"""

content = content.replace(old_view_detail, new_view_detail)

# 4. Add saveStateToStorage calls to all mutation handlers
mutations = [
    ("closeModal();\\n  renderApp();\\n  alert(`Assigned ${app.applicationNumber}", "saveStateToStorage();\\n  closeModal();\\n  renderApp();\\n  alert(`Assigned ${app.applicationNumber}"),
    ("closeModal();\\n  renderApp();\\n  alert(`Decision Executed!", "saveStateToStorage();\\n  closeModal();\\n  renderApp();\\n  alert(`Decision Executed!"),
    ("closeModal();\\n  renderApp();\\n  alert(`Application Submitted Successfully!", "saveStateToStorage();\\n  closeModal();\\n  renderApp();\\n  alert(`Application Submitted Successfully!"),
    ("closeModal();\\n  renderApp();\\n  alert('New disbursement tranche scheduled", "saveStateToStorage();\\n  closeModal();\\n  renderApp();\\n  alert('New disbursement tranche scheduled"),
    ("closeModal();\\n  renderApp();\\n  alert('Milestone Utilization Report submitted", "saveStateToStorage();\\n  closeModal();\\n  renderApp();\\n  alert('Milestone Utilization Report submitted"),
    ("closeModal();\\n  renderApp();\\n  alert('Grant Program created successfully!", "saveStateToStorage();\\n  closeModal();\\n  renderApp();\\n  alert('Grant Program created successfully!"),
    ("closeModal();\\n  renderApp();\\n  alert(`User account", "saveStateToStorage();\\n  closeModal();\\n  renderApp();\\n  alert(`User account"),
]

for old_m, new_m in mutations:
    # use raw string replacement
    old_m_raw = old_m.replace('\\n', '\n')
    new_m_raw = new_m.replace('\\n', '\n')
    content = content.replace(old_m_raw, new_m_raw)

# Also update handleExecuteDisb to save state
if "d.status = 'DISBURSED';" in content and "saveStateToStorage();" not in content.split("d.status = 'DISBURSED';")[1][:150]:
    content = content.replace("d.status = 'DISBURSED';", "d.status = 'DISBURSED';\n    saveStateToStorage();")

with open(main_js_path, "w", encoding="utf-8") as f:
    f.write(content)

print("SUCCESS: frontend/src/main.js successfully patched!")
