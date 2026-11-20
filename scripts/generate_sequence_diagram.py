import os
from PIL import Image, ImageDraw, ImageFont

# Canvas Configuration
WIDTH = 2240
HEIGHT = 3200
BG_COLOR = "#ffffff"

img = Image.new("RGB", (WIDTH, HEIGHT), color=BG_COLOR)
draw = ImageDraw.Draw(img)

# Load System Fonts
def get_font(size, bold=False):
    font_name = "segoeuib.ttf" if bold else "segoeui.ttf"
    path = os.path.join(r"C:\Windows\Fonts", font_name)
    if not os.path.exists(path):
        font_name = "arialbd.ttf" if bold else "arial.ttf"
        path = os.path.join(r"C:\Windows\Fonts", font_name)
    return ImageFont.truetype(path, size)

font_title = get_font(30, bold=True)
font_subtitle = get_font(16, bold=False)
font_meta = get_font(13, bold=False)
font_header = get_font(15, bold=True)
font_subhdr = get_font(12, bold=False)
font_msg = get_font(14, bold=False)
font_msg_bold = get_font(14, bold=True)
font_tag = get_font(13, bold=True)
font_note = get_font(12, bold=False)

# Participants Definition (X positions)
participants = [
    {"name": "Grant Applicant", "sub": "Citizen / Startup / NGO", "x": 160, "color": "#d97706", "bg": "#fef3c7", "border": "#b45309"},
    {"name": "Angular 14 SPA", "sub": "Client UI / Presentation", "x": 480, "color": "#2563eb", "bg": "#dbeafe", "border": "#1d4ed8"},
    {"name": "Spring Controller", "sub": "REST API Layer (/api/v1)", "x": 810, "color": "#0284c7", "bg": "#e0f2fe", "border": "#0369a1"},
    {"name": "Eligibility & Service", "sub": "Engine & Workflow Tier", "x": 1160, "color": "#7c3aed", "bg": "#ede9fe", "border": "#6d28d9"},
    {"name": "Oracle 21c XE / JPA", "sub": "Database / 3NF Storage", "x": 1500, "color": "#059669", "bg": "#d1fae5", "border": "#047857"},
    {"name": "Committee Reviewer", "sub": "Technical Evaluator", "x": 1820, "color": "#0d9488", "bg": "#ccfbf1", "border": "#0f766e"},
    {"name": "PFMS Bank Gateway", "sub": "Electronic DBT / RTGS", "x": 2080, "color": "#e11d48", "bg": "#ffe4e6", "border": "#be123c"}
]

# Draw Top Header Banner
draw.rectangle([(0, 0), (WIDTH, 145)], fill="#0f172a")
draw.rectangle([(0, 140), (WIDTH, 145)], fill="#2563eb")

draw.text((WIDTH // 2, 38), "UML SEQUENCE DIAGRAM: GRANTS MANAGEMENT SYSTEM (GMS - J18)", fill="#ffffff", font=font_title, anchor="mm")
draw.text((WIDTH // 2, 80), "Chronological Message Flow: Proposal Submission, Algorithmic Eligibility Engine, Rubric Scoring & PFMS Disbursement", fill="#94a3b8", font=font_subtitle, anchor="mm")
draw.text((WIDTH // 2, 114), "ABES Engineering College, Ghaziabad | MCA 2026-2027 | Devansh Srivastava (Roll: 2500320140048) | Guide: Ms. Charshini Bandreddi | IEEE Std 830-1998", fill="#38bdf8", font=font_meta, anchor="mm")

Y_TOP_BOX = 165
Y_BOTTOM_BOX = 225
Y_START_FLOW = 250
Y_END_FLOW = 3050

# Draw Lifelines & Header Boxes
for p in participants:
    x = p["x"]
    box_w = 176
    box_h = 58
    x0, y0 = x - box_w // 2, Y_TOP_BOX
    x1, y1 = x + box_w // 2, Y_BOTTOM_BOX
    draw.rounded_rectangle([(x0, y0), (x1, y1)], radius=8, fill=p["bg"], outline=p["border"], width=2)
    draw.text((x, y0 + 17), p["name"], fill=p["border"], font=font_header, anchor="mm")
    draw.text((x, y0 + 39), p["sub"], fill="#475569", font=font_subhdr, anchor="mm")

    # Dashed Lifeline
    for y in range(Y_BOTTOM_BOX, Y_END_FLOW, 12):
        draw.line([(x, y), (x, min(y + 6, Y_END_FLOW))], fill="#cbd5e1", width=2)

    # Bottom Mirror Box
    draw.rounded_rectangle([(x0, Y_END_FLOW), (x1, Y_END_FLOW + 48)], radius=6, fill=p["bg"], outline=p["border"], width=1)
    draw.text((x, Y_END_FLOW + 18), p["name"], fill=p["border"], font=font_header, anchor="mm")
    draw.text((x, Y_END_FLOW + 36), p["sub"], fill="#475569", font=font_subhdr, anchor="mm")

# Helper Drawing Functions
def draw_message(x_from, x_to, y, label, is_response=False, self_call=False, bold=False):
    font = font_msg_bold if bold else font_msg
    color = "#0f172a" if not is_response else "#334155"
    arrow_color = "#1d4ed8" if not is_response else "#64748b"

    if self_call:
        loop_w = 45
        loop_h = 24
        draw.line([(x_from, y), (x_from + loop_w, y)], fill=arrow_color, width=2)
        draw.line([(x_from + loop_w, y), (x_from + loop_w, y + loop_h)], fill=arrow_color, width=2)
        draw.line([(x_from + loop_w, y + loop_h), (x_from + 6, y + loop_h)], fill=arrow_color, width=2)
        draw.polygon([(x_from, y + loop_h), (x_from + 8, y + loop_h - 4), (x_from + 8, y + loop_h + 4)], fill=arrow_color)
        draw.text((x_from + loop_w + 10, y + loop_h // 2), label, fill=color, font=font, anchor="lm")
        return y + loop_h + 18

    mid_x = (x_from + x_to) // 2
    if is_response:
        step = 8
        cur_x = x_from
        dx = step if x_to > x_from else -step
        while (cur_x < x_to if dx > 0 else cur_x > x_to):
            next_x = cur_x + dx
            draw.line([(cur_x, y), (next_x, y)], fill=arrow_color, width=2)
            cur_x = next_x + dx
        ah_size = 8
        if x_to > x_from:
            draw.line([(x_to, y), (x_to - ah_size, y - 5)], fill=arrow_color, width=2)
            draw.line([(x_to, y), (x_to - ah_size, y + 5)], fill=arrow_color, width=2)
        else:
            draw.line([(x_to, y), (x_to + ah_size, y - 5)], fill=arrow_color, width=2)
            draw.line([(x_to, y), (x_to + ah_size, y + 5)], fill=arrow_color, width=2)
    else:
        draw.line([(x_from, y), (x_to, y)], fill=arrow_color, width=2)
        ah_size = 8
        if x_to > x_from:
            draw.polygon([(x_to, y), (x_to - ah_size, y - 5), (x_to - ah_size, y + 5)], fill=arrow_color)
        else:
            draw.polygon([(x_to, y), (x_to + ah_size, y - 5), (x_to + ah_size, y + 5)], fill=arrow_color)

    draw.text((mid_x, y - 11), label, fill=color, font=font, anchor="mm")
    return y + 44

def draw_activation(x, y_start, y_end, color="#93c5fd"):
    draw.rectangle([(x - 7, y_start), (x + 7, y_end)], fill="#eff6ff", outline=color, width=2)

def draw_phase_banner(y, title, desc=""):
    draw.rectangle([(60, y), (WIDTH - 60, y + 34)], fill="#f8fafc", outline="#cbd5e1", width=1)
    draw.rectangle([(60, y), (70, y + 34)], fill="#2563eb")
    draw.text((85, y + 17), title.upper(), fill="#0f172a", font=font_tag, anchor="lm")
    if desc:
        draw.text((WIDTH - 80, y + 17), desc, fill="#64748b", font=font_subhdr, anchor="rm")
    return y + 54

def draw_note(x, y, text_lines, width=230):
    padding = 10
    line_h = 17
    h = padding * 2 + len(text_lines) * line_h
    draw.rounded_rectangle([(x, y), (x + width, y + h)], radius=4, fill="#fef9c3", outline="#eab308", width=1)
    for i, line in enumerate(text_lines):
        draw.text((x + padding, y + padding + i * line_h), line, fill="#713f12", font=font_note)

# Coordinates
X_APP = participants[0]["x"]
X_UI  = participants[1]["x"]
X_CTL = participants[2]["x"]
X_SRV = participants[3]["x"]
X_DB  = participants[4]["x"]
X_REV = participants[5]["x"]
X_BNK = participants[6]["x"]

# ==============================================================================
# PHASE 1: Proposal Submission & Form Validation
# ==============================================================================
cur_y = Y_START_FLOW
cur_y = draw_phase_banner(cur_y, "Phase 1: Grant Proposal Submission & Client Validation (Module 2)", "Applicant submits proposal via Angular wizard")

draw_activation(X_UI, cur_y + 10, cur_y + 205)
cur_y = draw_message(X_APP, X_UI, cur_y + 10, "1: submitProposal(title, requestedBudget, operatingAge, turnover, PAN, bankDetails)", bold=True)
cur_y = draw_message(X_UI, X_UI, cur_y, "2: validateClientForm(PAN:10chars, GSTIN:15chars, Min/Max Limits)", self_call=True)

draw_activation(X_CTL, cur_y + 10, cur_y + 140)
cur_y = draw_message(X_UI, X_CTL, cur_y + 10, "3: POST /api/v1/applications [Authorization: Bearer <JWT_TOKEN>]")

draw_activation(X_SRV, cur_y + 10, cur_y + 95)
cur_y = draw_message(X_CTL, X_SRV, cur_y + 10, "4: createApplication(ApplicationRequestDTO, authPrincipal)")

draw_activation(X_DB, cur_y + 10, cur_y + 55)
cur_y = draw_message(X_SRV, X_DB, cur_y + 10, "5: saveApplicationRecord(status = 'SUBMITTED')")
cur_y = draw_message(X_DB, X_SRV, cur_y + 10, "6: Return saved ApplicationEntity (ID: 101, Status: SUBMITTED)", is_response=True)

# Note on Security & Architecture
draw_note(X_CTL + 25, cur_y + 5, [
    "Security & RBAC Layer:",
    "• Spring Security 6 JWT Filter",
    "• Validates HMAC-SHA256 signature",
    "• Asserts @PreAuthorize('hasRole(APPLICANT)')"
], width=265)

cur_y += 65

# ==============================================================================
# PHASE 2: Automated Algorithmic Eligibility Engine Execution
# ==============================================================================
cur_y = draw_phase_banner(cur_y, "Phase 2: Automated Algorithmic Eligibility Evaluation Engine (Module 2)", "Threshold validation & error recovery branch")

draw_activation(X_SRV, cur_y + 10, cur_y + 520)
cur_y = draw_message(X_SRV, X_DB, cur_y + 10, "7: findCriteriaByProgramId(programId)")
draw_activation(X_DB, cur_y - 25, cur_y + 25)
cur_y = draw_message(X_DB, X_SRV, cur_y + 10, "8: Return Set<ProgramEligibilityCriterion> (Min Years, Max Turnover, Allowed Entities)", is_response=True)
cur_y = draw_message(X_SRV, X_SRV, cur_y + 5, "9: executeEligibilityRules(applicantMetrics, criteriaList)", self_call=True)

# Dynamic ALT Frame 1
alt1_x0, alt1_x1 = 80, WIDTH - 80
alt1_top = cur_y + 20

# Branch 1: Error Recovery (Ineligible)
b1_label_y = alt1_top + 38
draw.text((105, b1_label_y), "[Error Recovery: Threshold Breach Detected (e.g. Operating Age < 2 Years OR Turnover > Ceiling)]", fill="#b91c1c", font=font_msg_bold)
cur_y = b1_label_y + 35
draw_activation(X_DB, cur_y, cur_y + 40)
cur_y = draw_message(X_SRV, X_DB, cur_y, "10a: updateEligibilityStatus('AUTO_INELIGIBLE', failureRemarks)")
cur_y = draw_message(X_CTL, X_UI, cur_y + 10, "11a: HTTP 422 Unprocessable Entity {status: 'AUTO_INELIGIBLE', remarks: 'Age below threshold'}", is_response=True)
cur_y = draw_message(X_UI, X_APP, cur_y + 10, "12a: Render Ineligibility Warning & Policy Remediation Feedback to Applicant", is_response=True)

# Divider Line
alt1_div_y = cur_y + 18
for x in range(alt1_x0, alt1_x1, 10):
    draw.line([(x, alt1_div_y), (min(x + 5, alt1_x1), alt1_div_y)], fill="#94a3b8", width=1)

# Branch 2: Happy Path (Eligible)
b2_label_y = alt1_div_y + 22
draw.text((105, b2_label_y), "[Happy-Path: Applicant Satisfies All Eligibility Criteria & Active GSTIN / PAN]", fill="#15803d", font=font_msg_bold)
cur_y = b2_label_y + 35
draw_activation(X_DB, cur_y, cur_y + 40)
cur_y = draw_message(X_SRV, X_DB, cur_y, "10b: updateEligibilityStatus('AUTO_ELIGIBLE', 'All mandatory criteria satisfied')")
cur_y = draw_message(X_CTL, X_UI, cur_y + 10, "11b: HTTP 201 Created {status: 'AUTO_ELIGIBLE', appNumber: 'APP-2024-AGRI-00101'}", is_response=True)
cur_y = draw_message(X_UI, X_APP, cur_y + 10, "12b: Render Live Compliance Badge (Green) & Active Tracker Milestone", is_response=True)

alt1_bottom = cur_y + 15
# Draw ALT 1 Frame boundary
draw.rounded_rectangle([(alt1_x0, alt1_top), (alt1_x1, alt1_bottom)], radius=6, fill=None, outline="#475569", width=2)
draw.polygon([(alt1_x0, alt1_top), (alt1_x0 + 55, alt1_top), (alt1_x0 + 68, alt1_top + 16), (alt1_x0 + 55, alt1_top + 26), (alt1_x0, alt1_top + 26)], fill="#e2e8f0", outline="#475569")
draw.text((alt1_x0 + 26, alt1_top + 13), "alt", fill="#0f172a", font=font_tag, anchor="mm")
draw.text((alt1_x0 + 78, alt1_top + 13), "[Eligibility Engine Assessment]", fill="#0f172a", font=font_msg_bold, anchor="lm")

cur_y = alt1_bottom + 40

# ==============================================================================
# PHASE 3: Reviewer Assignment, 4-Slider Rubric Scoring & Auto-Approval
# ==============================================================================
cur_y = draw_phase_banner(cur_y, "Phase 3: Reviewer Assignment & 4-Slider Rubric Scoring (Module 3)", "Peer review completed -> Status automatically transitions to APPROVED")

draw_activation(X_UI, cur_y + 10, cur_y + 90)
cur_y = draw_message(X_UI, X_CTL, cur_y + 10, "13: POST /api/v1/applications/101/assign-reviewer {reviewerId: 4} [Program Officer Action]")
draw_activation(X_SRV, cur_y - 20, cur_y + 55)
cur_y = draw_message(X_CTL, X_SRV, cur_y + 5, "14: assignReviewer(appId = 101, reviewerId = 4)")
draw_activation(X_DB, cur_y - 15, cur_y + 35)
cur_y = draw_message(X_SRV, X_DB, cur_y + 5, "15: createReviewAssignment & updateStatus('UNDER_REVIEW')")

cur_y += 24
draw_activation(X_REV, cur_y + 10, cur_y + 65)
cur_y = draw_message(X_REV, X_UI, cur_y + 10, "16: GET /reviews/reviewer/4 (Reviewer inspects assigned proposal dossier & attachments)")

cur_y += 24
draw_activation(X_REV, cur_y + 10, cur_y + 265)
cur_y = draw_message(X_REV, X_UI, cur_y + 10, "17: submitScorecard(Feasibility:23, Innovation:22, Budget:21, Social:24, Rec:'RECOMMEND_APPROVE')", bold=True)
draw_activation(X_CTL, cur_y - 10, cur_y + 225)
cur_y = draw_message(X_UI, X_CTL, cur_y + 10, "18: POST /api/v1/reviews/401/submit {rubricScores, comments, recommendation}")
draw_activation(X_SRV, cur_y - 10, cur_y + 180)
cur_y = draw_message(X_CTL, X_SRV, cur_y + 10, "19: submitReview(reviewId, SubmitReviewRequestDTO)")

cur_y = draw_message(X_SRV, X_SRV, cur_y + 5, "20: recalculateTotal(Score: 90/100) & evaluateRecommendation()", self_call=True)

draw_activation(X_DB, cur_y + 10, cur_y + 75)
cur_y = draw_message(X_SRV, X_DB, cur_y + 10, "21: updateApplicationStatus('APPROVED') & setApprovedAmount(4500000)", bold=True)
cur_y = draw_message(X_SRV, X_DB, cur_y + 10, "22: insertApprovalWorkflowLog('UNDER_REVIEW' -> 'APPROVED', 'REVIEW_APPROVED', 90/100)")

cur_y = draw_message(X_CTL, X_UI, cur_y + 16, "23: HTTP 200 OK {reviewStatus: 'SUBMITTED', appStatus: 'APPROVED', totalScore: 90}", is_response=True)
cur_y = draw_message(X_UI, X_APP, cur_y + 16, "24: Real-time Synchronized Notification: Proposal APPROVED by Technical Committee", is_response=True)

# Note on Record Updation Fix
draw_note(X_DB + 25, cur_y - 120, [
    "Workflow Auto-Approval Integrity:",
    "• Review submission automatically flips",
    "  application status to APPROVED",
    "• Persists in database & localStorage",
    "• Program Officer immediately sees",
    "  verified score & Sanction Order ready"
], width=265)

cur_y += 40

# ==============================================================================
# PHASE 4: Sanction Order, Multi-Tranche PFMS Disbursement & Banking ALT Frame
# ==============================================================================
cur_y = draw_phase_banner(cur_y, "Phase 4: Sanction Order & Multi-Tranche PFMS Electronic Disbursement (Module 4)", "Electronic fund release with banking error recovery branch")

draw_activation(X_UI, cur_y + 10, cur_y + 130)
cur_y = draw_message(X_UI, X_CTL, cur_y + 10, "25: POST /api/v1/applications/101/decision {decision: 'APPROVE', sanctionOrder: 'SAN-2024-DST-098'}")
cur_y = draw_message(X_UI, X_CTL, cur_y + 16, "26: POST /api/v1/disbursements/501/execute [Program Officer authorizes Tranche 1: INR 2,250,000]")

draw_activation(X_SRV, cur_y - 20, cur_y + 420)
cur_y = draw_message(X_CTL, X_SRV, cur_y + 10, "27: executeDisbursementTranche(disbursementId = 501)")

draw_activation(X_BNK, cur_y + 10, cur_y + 275)
cur_y = draw_message(X_SRV, X_BNK, cur_y + 10, "28: POST /pfms/api/direct-benefit-transfer {amount: 2250000, accNo: '****5678', ifsc: 'SBIN0001234'}", bold=True)

# Dynamic ALT Frame 2
alt2_x0, alt2_x1 = 80, WIDTH - 80
alt2_top = cur_y + 20

# Branch 1: Bank Error Recovery
b3_label_y = alt2_top + 38
draw.text((105, b3_label_y), "[Error Recovery: PFMS Gateway Timeout / Beneficiary Account Frozen / IFSC Mismatch]", fill="#b91c1c", font=font_msg_bold)
cur_y = b3_label_y + 35
draw_activation(X_DB, cur_y, cur_y + 40)
cur_y = draw_message(X_BNK, X_SRV, cur_y, "29a: HTTP 504 Gateway Timeout / Payment Rejected (NPCI Reason Code: AC04)", is_response=True)
cur_y = draw_message(X_SRV, X_DB, cur_y + 10, "30a: updateDisbursementStatus('FAILED') & recordPaymentAudit('GATEWAY_TIMEOUT')")
cur_y = draw_message(X_CTL, X_UI, cur_y + 10, "31a: HTTP 502 Bad Gateway {error: 'PFMS Transfer Failed', action: 'Verify IFSC or Retry'}", is_response=True)

# Divider Line
alt2_div_y = cur_y + 18
for x in range(alt2_x0, alt2_x1, 10):
    draw.line([(x, alt2_div_y), (min(x + 5, alt2_x1), alt2_div_y)], fill="#94a3b8", width=1)

# Branch 2: Bank Happy Path
b4_label_y = alt2_div_y + 22
draw.text((105, b4_label_y), "[Happy-Path: Electronic Transfer Successful via Reserve Bank of India PFMS Network]", fill="#15803d", font=font_msg_bold)
cur_y = b4_label_y + 35
draw_activation(X_DB, cur_y, cur_y + 50)
cur_y = draw_message(X_BNK, X_SRV, cur_y, "29b: HTTP 200 OK {status: 'SUCCESS', utr: 'UTR-2024-PFMS-988214', timestamp: '2024-10-15T10:30:00'}", is_response=True, bold=True)
cur_y = draw_message(X_SRV, X_DB, cur_y + 10, "30b: @Transactional: updateDisbursement('DISBURSED', utr) & debitSchemeBudget(2250000)", bold=True)
cur_y = draw_message(X_CTL, X_UI, cur_y + 10, "31b: HTTP 200 OK {disbursementStatus: 'DISBURSED', utrNumber: 'UTR-2024-PFMS-988214'}", is_response=True)
cur_y = draw_message(X_UI, X_APP, cur_y + 10, "32b: Render Payment Sanction Advice (PDF Download) & Unlock Tranche 2 Milestone UC Form", is_response=True)

alt2_bottom = cur_y + 15
# Draw ALT 2 Frame boundary
draw.rounded_rectangle([(alt2_x0, alt2_top), (alt2_x1, alt2_bottom)], radius=6, fill=None, outline="#475569", width=2)
draw.polygon([(alt2_x0, alt2_top), (alt2_x0 + 55, alt2_top), (alt2_x0 + 68, alt2_top + 16), (alt2_x0 + 55, alt2_top + 26), (alt2_x0, alt2_top + 26)], fill="#e2e8f0", outline="#475569")
draw.text((alt2_x0 + 26, alt2_top + 13), "alt", fill="#0f172a", font=font_tag, anchor="mm")
draw.text((alt2_x0 + 78, alt2_top + 13), "[PFMS / Core Banking Settlement Channel]", fill="#0f172a", font=font_msg_bold, anchor="lm")

cur_y = alt2_bottom + 40

# ==============================================================================
# PHASE 5: Milestone Utilization Certificate (UC) & Subsequent Tranches
# ==============================================================================
cur_y = draw_phase_banner(cur_y, "Phase 5: Milestone Utilization Certificate (UC) Submission & Officer Verification (Module 4)", "Milestone compliance audit before releasing next tranche")

draw_activation(X_UI, cur_y + 10, cur_y + 80)
cur_y = draw_message(X_APP, X_UI, cur_y + 10, "33: submitMilestoneUC(Tranche:1, Expenditure:2100000, Progress:50%, uc_document.pdf)")
cur_y = draw_message(X_UI, X_CTL, cur_y + 10, "34: POST /api/v1/utilization-reports [Applicant submits certified UC document]")

draw_activation(X_SRV, cur_y - 10, cur_y + 70)
cur_y = draw_message(X_CTL, X_SRV, cur_y + 10, "35: createUtilizationReport(dto, ucFile)")
draw_activation(X_DB, cur_y - 10, cur_y + 40)
cur_y = draw_message(X_SRV, X_DB, cur_y + 10, "36: saveUtilizationReport(status = 'SUBMITTED') & logMilestoneAudit()")

cur_y += 15
draw_activation(X_CTL, cur_y + 10, cur_y + 70)
cur_y = draw_message(X_UI, X_CTL, cur_y + 10, "37: POST /api/v1/utilization-reports/801/verify {status: 'VERIFIED_SATISFACTORY'} [Program Officer Action]")
draw_activation(X_DB, cur_y + 10, cur_y + 45)
cur_y = draw_message(X_CTL, X_DB, cur_y + 10, "38: updateUCStatus('VERIFIED_SATISFACTORY') & unlockTranche2Disbursement()")

cur_y += 45

# Bottom Summary Card / Footer
draw.rectangle([(60, cur_y), (WIDTH - 60, cur_y + 55)], fill="#0f172a", outline="#334155", width=1)
draw.text((WIDTH // 2, cur_y + 28), "LEGEND:  Solid Arrow (──▶) = Synchronous Request  |  Dashed Arrow (- - ▷) = Return Response  |  alt Frame = Conditional Branch (Error vs Happy Path)", fill="#94a3b8", font=font_subhdr, anchor="mm")

# Save high-resolution PNG
out_dir = r"c:\Users\arunj\OneDrive\Desktop\grants\docs\images"
os.makedirs(out_dir, exist_ok=True)
out_png = os.path.join(out_dir, "sequence_diagram.png")
img.save(out_png, "PNG", dpi=(300, 300))

print(f"SUCCESS: Generated crisp UML Sequence Diagram at: {out_png}")
print(f"Dimensions: {WIDTH}x{HEIGHT} px, File size: {os.path.getsize(out_png)} bytes")
