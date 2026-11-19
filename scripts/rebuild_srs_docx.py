import zipfile
import io
import copy
import os
import xml.etree.ElementTree as ET

# File paths
input_docx = r"C:\Users\arunj\.gemini\antigravity\brain\261f29e1-d413-469a-93d2-8e9f11d69d2d\.user_uploaded\media_1795083307092_270672ab.docx"
output_docx_repo = r"c:\Users\arunj\OneDrive\Desktop\grants\docs\Devansh_Srs_GrantsManagement.docx"
output_docx_uploaded = input_docx

# XML Namespaces
w_ns = "http://schemas.openxmlformats.org/wordprocessingml/2006/main"
r_ns = "http://schemas.openxmlformats.org/officeDocument/2006/relationships"
a_ns = "http://schemas.openxmlformats.org/drawingml/2006/main"
pic_ns = "http://schemas.openxmlformats.org/drawingml/2006/picture"
wp_ns = "http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing"
w14_ns = "http://schemas.microsoft.com/office/word/2010/wordml"

ET.register_namespace('w', w_ns)
ET.register_namespace('r', r_ns)
ET.register_namespace('a', a_ns)
ET.register_namespace('pic', pic_ns)
ET.register_namespace('wp', wp_ns)
ET.register_namespace('w14', w14_ns)

w = f"{{{w_ns}}}"

def get_text(element):
    texts = [t.text for t in element.iter(w + 't') if t.text]
    return ''.join(texts).strip()

def set_p_text(p, text, bold=False, italic=False, style=None, align='left'):
    pPr = p.find(w + 'pPr')
    if pPr is None:
        pPr = ET.Element(w + 'pPr')
        p.insert(0, pPr)
    
    if style:
        pStyle = pPr.find(w + 'pStyle')
        if pStyle is None:
            pStyle = ET.SubElement(pPr, w + 'pStyle')
        pStyle.attrib[w + 'val'] = style
        
    if align != 'left':
        jc = pPr.find(w + 'jc')
        if jc is None:
            jc = ET.SubElement(pPr, w + 'jc')
        jc.attrib[w + 'val'] = align
        
    # Remove old runs
    for child in list(p):
        if child != pPr:
            p.remove(child)
            
    r = ET.SubElement(p, w + 'r')
    if bold or italic:
        rPr = ET.SubElement(r, w + 'rPr')
        if bold:
            ET.SubElement(rPr, w + 'b')
        if italic:
            ET.SubElement(rPr, w + 'i')
    t = ET.SubElement(r, w + 't')
    t.text = text

def create_p(text, style='Normal', bold=False, italic=False, align='left'):
    p = ET.Element(w + 'p')
    set_p_text(p, text, bold=bold, italic=italic, style=style, align=align)
    return p

def set_cell_text(cell, text, bold=False, align='left'):
    tcPr = cell.find(w + 'tcPr')
    for child in list(cell):
        if child != tcPr:
            cell.remove(child)
    p = ET.SubElement(cell, w + 'p')
    if align != 'left':
        pPr = ET.SubElement(p, w + 'pPr')
        jc = ET.SubElement(pPr, w + 'jc')
        jc.attrib[w + 'val'] = align
    r = ET.SubElement(p, w + 'r')
    if bold:
        rPr = ET.SubElement(r, w + 'rPr')
        ET.SubElement(rPr, w + 'b')
    t = ET.SubElement(r, w + 't')
    t.text = text

def repopulate_table(tbl, rows_data, header_bold=True):
    existing_rows = tbl.findall(w + 'tr')
    template_row = copy.deepcopy(existing_rows[1] if len(existing_rows) > 1 else existing_rows[0])
    template_header = copy.deepcopy(existing_rows[0])
    for r in list(tbl.findall(w + 'tr')):
        tbl.remove(r)
    for r_idx, row_values in enumerate(rows_data):
        is_hdr = (r_idx == 0)
        new_row = copy.deepcopy(template_header if is_hdr else template_row)
        cells = new_row.findall(w + 'tc')
        while len(cells) < len(row_values):
            new_tc = copy.deepcopy(cells[-1])
            new_row.append(new_tc)
            cells.append(new_tc)
        for c_idx, val in enumerate(row_values):
            set_cell_text(cells[c_idx], val, bold=(is_hdr and header_bold))
        tbl.append(new_row)

def main():
    print("Reading input docx...")
    with zipfile.ZipFile(input_docx, 'r') as z:
        all_files = {name: z.read(name) for name in z.namelist()}
    
    root = ET.fromstring(all_files['word/document.xml'])
    body = root.find(w + 'body')
    
    print(f"Original body child elements count: {len(body)}")
    
    # 1. Update Title and Header Block
    set_p_text(body[1], "<DEPARTMENT OF COMPUTER APPLICATIONS / CSE> ABES ENGINEERING COLLEGE, GHAZIABAD", bold=True, align='center')
    set_p_text(body[2], "SOFTWARE REQUIREMENTS SPECIFICATION (SRS)", bold=True, style='Title', align='center')
    set_p_text(body[3], "Grants Management System (GMS) | Project Code: J18\nStandard Academic Compliance: IEEE Std 830-1998", bold=True, style='Subtitle', align='center')
    
    # Update Submission Table (body[5])
    tbl5_cells = body[5].findall(f".//{w}tc")
    if len(tbl5_cells) >= 2:
        set_cell_text(tbl5_cells[0], "SUBMITTED BY:\n1. Devansh Srivastava (Roll No: 2500320140048)\nDegree: Master of Computer Applications (MCA)\nAcademic Year: 2026 - 2027\nSkill Track: FSD Java (HCLTech EdTech Career Shaper)", bold=False)
        set_cell_text(tbl5_cells[1], "UNDER THE GUIDANCE OF:\nMs. Charshini Bandreddi\nAssistant Professor, MCA\nStatus: Capstone Full-Stack System Specification\nDate of Submission: 19-11-2026", bold=False)
    
    # Update Document Revision History (body[10])
    rev_data = [
        ["Version", "Date", "Description / Major Changes", "Prepared By", "Reviewed By"],
        ["0.1", "15-Sep-2026", "Initial Draft, Domain Analysis & Scope Definition", "Devansh Srivastava", "Ms. Charshini Bandreddi"],
        ["0.2", "10-Oct-2026", "Database Schema Normalization (3NF) & REST API Design", "Devansh Srivastava", "Project Review Committee"],
        ["1.0", "19-Nov-2026", "Final Full-Stack IEEE 830 Baseline with Architectural Diagrams & RBAC", "Devansh Srivastava", "Project Guide & HOD"]
    ]
    repopulate_table(body[10], rev_data)
    
    # 2. Section 1: Introduction
    set_p_text(body[83], "1.1 Purpose", bold=True, style='Heading2')
    set_p_text(body[84], "The purpose of this Software Requirements Specification (SRS) document is to provide a complete, clear, and unambiguous definition of the functionality, external interfaces, performance targets, and architectural constraints of the proposed system: 'Grants Management System (GMS)' (Project Code: J18). This specification serves as a binding reference agreement between student developers, project evaluators, academic supervisors, and prospective end users during the 2nd-year MCA engineering curriculum at ABES Engineering College, Ghaziabad.")
    
    set_p_text(body[85], "1.2 Scope of the System", bold=True, style='Heading2')
    set_p_text(body[86], "The proposed application is designed to solve delays, manual eligibility verification errors, opaque multi-stage committee reviews, and fragmented tranche-wise fund tracking in traditional spreadsheet-driven government grant administration by delivering an end-to-end automated platform. Key boundary guidelines include:")
    set_p_text(body[87], "In-Scope Capabilities: Centralized grant scheme setup, applicant self-registration, proposal submission, automated algorithmic eligibility verification engine, multi-criteria reviewer rubric scoring (0-100 scale), sanction order generation, multi-tranche PFMS fund disbursement tracking, milestone Utilization Certificate (UC) verification, and immutable security audit trails.")
    set_p_text(body[88], "Out-of-Scope Boundaries: Direct core banking interbank clearing software (PFMS simulation via UTR electronic transfer references is implemented), and physical biometric hardware.")
    set_p_text(body[89], "Expected Benefits: Reduction of operational turnaround time by 60%, 100% automated eligibility verification, elimination of spreadsheet calculation errors, complete transparency in reviewer scoring, and auditable milestone-linked fund disbursements.")
    
    # Definitions Table (body[91])
    defs_data = [
        ["Category", "Term / Acronym", "Definition / Standard Context"],
        ["Standard", "SRS", "Software Requirements Specification conforming to IEEE Std 830-1998."],
        ["Project Domain", "GMS", "Grants Management System (Project Code: J18) for public sector grant workflows."],
        ["Architecture", "REST", "Representational State Transfer stateless API interchange via JSON over HTTPS."],
        ["Security", "JWT / RBAC", "JSON Web Token for stateless authorization; Role-Based Access Control enforcing role boundaries."],
        ["Security", "BCrypt", "Adaptive cryptographic password hashing function with salted rounds."],
        ["Database", "3NF", "Third Normal Form schema eliminating transitive and partial dependencies."],
        ["Disbursement", "PFMS / DBT", "Public Financial Management System / Direct Benefit Transfer tracking."],
        ["Disbursement", "UTR", "Unique Transaction Reference number issued by banking networks upon fund transfer."],
        ["Compliance", "UC", "Utilization Certificate submitted by beneficiaries certifying sanctioned fund usage."]
    ]
    repopulate_table(body[91], defs_data)
    
    # 1.4 References
    set_p_text(body[92], "1.4 References", bold=True, style='Heading2')
    set_p_text(body[93], "1. IEEE Std 830-1998: IEEE Recommended Practice for Software Requirements Specifications, IEEE Computer Society.")
    set_p_text(body[94], "2. Sommerville, Ian: Software Engineering (10th Edition), Pearson Education, 2015.")
    set_p_text(body[95], "3. Spring Boot 3.2.x Reference Documentation; Oracle Database 21c XE Architecture Manual; HCLTech EdTech Career Shaper Project Development Document J18.")
    
    # 2. Section 2: Overall Description
    set_p_text(body[127], "2. Overall Description", bold=True, style='Heading1')
    set_p_text(body[128], "2.1 Product Perspective", bold=True, style='Heading2')
    set_p_text(body[129], "The Grants Management System is structured as a self-contained multi-tier enterprise web application comprising: (1) Presentation Tier built with Angular 14 delivering four isolated, role-partitioned portals; (2) Application Logic Tier built with Java 17 and Spring Boot 3 exposing stateless RESTful APIs, securing operations via Spring Security 6 and JWT, and running an automated eligibility engine; and (3) Relational Database Tier deployed on Oracle Database 21c XE (with H2 in-memory compatibility) maintaining 3NF relational data integrity. External system interfaces include the Public Financial Management System (PFMS) for electronic fund releases.")
    
    # Update Context Diagram Placeholder Table (body[130])
    set_cell_text(body[130].find(f".//{w}tc"), "System Context Model: The high-level external entity boundaries (Applicant, Reviewer, Administrator/Program Officer, and Bank / Payment System PFMS) are formally illustrated in Figure 6.2 (DFD Level 0 Context Diagram) in Section 6.2.", bold=False)
    
    # User Classes Table (body[134])
    roles_data = [
        ["User Role / Persona", "Technical Proficiency", "Core Responsibilities & Rights"],
        ["System Administrator (ROLE_ADMIN)", "High (DevOps / DB Management)", "Complete platform governance: user account lifecycle, role onboarding, master security audit logging, and macro system KPIs."],
        ["Program Officer (ROLE_PROGRAM_OFFICER)", "Medium-High (Public Administration)", "Designs grant schemes, configures eligibility rules, initiates automated rule checks, assigns proposals to reviewers, issues sanction orders, schedules/executes PFMS disbursements, verifies milestone UCs."],
        ["Grant Applicant (ROLE_APPLICANT)", "Intermediate (General Web User)", "Browses active grant schemes, self-registers organization profile, submits proposals, uploads compliance files, tracks real-time evaluation status, submits milestone utilization certificates (UCs)."],
        ["Committee Reviewer (ROLE_REVIEWER)", "Intermediate-High (Domain Expert)", "Accesses assigned proposal queue, reviews proposal attachments and financial asks, evaluates applications using 4-slider rubric scorecard (0-100), submits recommendations."],
        ["Guest / Public Visitor", "Basic", "Read-only access to public scheme catalog, eligibility criteria guidelines, promotional landing page, and applicant self-registration portal."]
    ]
    repopulate_table(body[134], roles_data)
    
    # 2.3 Operating Environment
    set_p_text(body[135], "2.3 Operating Environment", bold=True, style='Heading2')
    set_p_text(body[136], "The application operates within standard enterprise software and hardware environments:")
    set_p_text(body[137], "Client Requirements: Modern web browser (Google Chrome >= v110, Mozilla Firefox >= v108, Microsoft Edge >= v110, Safari); minimum display resolution of 1366 x 768 pixels.")
    set_p_text(body[138], "Server Runtime Environment: Linux (Ubuntu 22.04 LTS / Debian 12) or Windows 10/11 64-bit; Java Development Kit (JDK 17 LTS), Spring Boot 3.2.x framework, embedded Apache Tomcat 10.")
    set_p_text(body[139], "Database Storage Tier: Oracle Database 21c Express Edition (XE) / H2 in-memory relational engine conforming to ANSI-SQL standards.")
    
    # 2.4 Constraints
    set_p_text(body[140], "2.4 Design and Implementation Constraints", bold=True, style='Heading2')
    set_p_text(body[141], "Academic Stack Constraint: Full adherence to mandated technologies: Java 17, Spring Boot 3, Angular 14, and Oracle 21c XE.")
    set_p_text(body[142], "Security Compliance: Passwords stored exclusively as salted hashes using BCrypt (cost 10); stateless JWT authorization with HS256 algorithm; strict Role-Based Access Control (RBAC) preventing privilege escalation.")
    set_p_text(body[143], "Modularity Standards: 3NF normalized database schema, separation of concerns across Controller, Service, Repository, and Model layers.")
    
    # 2.5 Assumptions
    set_p_text(body[144], "2.5 Assumptions and Dependencies", bold=True, style='Heading2')
    set_p_text(body[145], "Assumptions: Users possess continuous internet connectivity (minimum 2 Mbps); client clocks are synchronized via NTP for token validity.")
    set_p_text(body[146], "Dependencies: Availability of Java 17 runtime, modern ECMAScript 6+ web browser, and Oracle XE/H2 database connectivity.")
    
    # 3. Section 3: Functional Requirements
    set_p_text(body[147], "3. System Features and Functional Requirements", bold=True, style='Heading1')
    set_p_text(body[148], "Requirements are categorized by functional subsystem modules with unique requirement identifiers (FR-x.x):")
    
    # 3.1 Module 1: Grant Program Setup and Configuration
    set_p_text(body[149], "3.1 Module 1: Grant Program Setup and Configuration", bold=True, style='Heading2')
    m1_data = [
        ["Req ID", "Feature Description", "Input / Validation Rule", "Priority"],
        ["FR-1.1", "Grant Scheme Creation & Budgeting", "Program Code, Title, Agency, Category (INNOVATION, AGRI, MSME), Total Budget INR, Grant Range Min/Max, Application Window (Start/End Dates). Budget > 0.", "High"],
        ["FR-1.2", "Parametric Eligibility Rule Setup", "Criterion Name, Operator (GREATER_THAN_EQUAL, LESS_THAN_EQUAL, EQUALS, IN_LIST), Threshold Value, Mandatory Flag, Weightage (0-100).", "High"],
        ["FR-1.3", "Program Lifecycle State Machine", "Enforces strict state transitions: DRAFT -> ACTIVE -> UNDER_EVALUATION -> CLOSED with validation checks.", "Medium"],
        ["FR-1.4", "Scheme Guidelines & Document Rules", "Configures required attachments (Proposal PDF, Budget Sheet, PAN, Audited Financials, GSTIN) and max file sizes.", "Medium"]
    ]
    repopulate_table(body[150], m1_data)
    
    # 3.2 Module 2: Application Submission and Eligibility Check
    set_p_text(body[151], "3.2 Module 2: Application Submission and Eligibility Check", bold=True, style='Heading2')
    m2_data = [
        ["Req ID", "Feature Description", "Input / Validation Rule", "Priority"],
        ["FR-2.1", "Applicant Self-Registration", "Organization Name, Entity Type (STARTUP, NGO, ACADEMIA), PAN (10 chars), GSTIN (15 chars), Authorized Email, Password (salted BCrypt hash).", "High"],
        ["FR-2.2", "Proposal Drafting & Submission", "Selects ACTIVE Scheme, Project Title, Executive Summary, Requested Amount, Duration (Months), Operating Age (Years), Annual Turnover (INR), Beneficiary Count, Bank Details.", "High"],
        ["FR-2.3", "Automated Algorithmic Eligibility Engine", "Executes scheme rule engine comparing Applicant Age, Turnover, Entity Type, and Mandatory credentials. Marks AUTO_ELIGIBLE or AUTO_INELIGIBLE with audit failure reasons.", "High"],
        ["FR-2.4", "Real-Time Lifecycle Tracking", "Tracks application progress: SUBMITTED -> AUTO_ELIGIBLE -> UNDER_REVIEW -> APPROVED/REJECTED -> DISBURSED.", "High"],
        ["FR-2.5", "Officer Eligibility Override", "Program Officer inspects flagged applications and performs audited manual eligibility override with justification notes.", "Medium"]
    ]
    repopulate_table(body[152], m2_data)
    
    # 3.3 Module 3: Review and Approval Workflow
    set_p_text(body[153], "3.3 Module 3: Review and Approval Workflow", bold=True, style='Heading2')
    m3_data = [
        ["Req ID", "Feature Description", "Input / Validation Rule", "Priority"],
        ["FR-3.1", "Peer Reviewer Assignment", "Program Officer assigns eligible applications to technical evaluators from the committee panel based on domain expertise.", "High"],
        ["FR-3.2", "4-Dimensional Rubric Scorecard", "Reviewers score proposals across 4 criteria: Feasibility (25), Innovation (25), Budget Realism (25), Social Impact (25); calculates composite 0-100 score + recommendation.", "High"],
        ["FR-3.3", "Sanction Committee Decision", "Program Officer reviews composite reviewer scores, decides final Sanctioned Grant Amount (<= requested), generates Sanction Order Number, updates status APPROVED/REJECTED.", "High"],
        ["FR-3.4", "Immutable Workflow Audit Trail", "Records every stage transition with Actor ID, Previous Status, New Status, Action Remarks, and Server Timestamp.", "High"]
    ]
    repopulate_table(body[154], m3_data)
    
    # Now, check what is at body[155] (currently "4. External Interface Requirements")
    # We should add Module 4 before Section 4!
    # Let's clone table 150 for Module 4:
    m4_heading = create_p("3.4 Module 4: Grant Disbursement and Reporting", style='Heading2', bold=True)
    m4_tbl = copy.deepcopy(body[150])
    m4_data = [
        ["Req ID", "Feature Description", "Input / Validation Rule", "Priority"],
        ["FR-4.1", "Multi-Tranche Disbursement Scheduling", "Schedules milestone tranches (Tranche No, Amount, Scheduled Date, Bank Account & IFSC). Total tranches sum <= Approved Sanctioned Amount.", "High"],
        ["FR-4.2", "PFMS Fund Release & UTR Tracking", "Program Officer triggers tranche execution; generates simulated PFMS Unique Transaction Reference (UTR); updates program disbursed counter.", "High"],
        ["FR-4.3", "Milestone Utilization Certificate (UC) Submission", "Applicant logs expenditure incurred, narrative progress, completion percentage (0-100%), and uploads certified Utilization Certificate (UC).", "High"],
        ["FR-4.4", "Officer UC Verification & Audit", "Program Officer inspects submitted UC; marks status VERIFIED_SATISFACTORY or REQUIRES_CLARIFICATION before subsequent tranches are unlocked.", "High"],
        ["FR-4.5", "Executive Analytics Dashboard", "Visualizes macro KPIs: Total Programs, Sanctioned Capital, Disbursed Funds, Sectoral Budget Allocation, and Application Status Pipeline.", "Medium"]
    ]
    repopulate_table(m4_tbl, m4_data)
    
    # Insert Module 4 right after body[154]
    body.insert(155, m4_heading)
    body.insert(156, m4_tbl)
    
    # 4. Section 4: External Interfaces (indices shifted by +2)
    # Let's find Section 4 heading
    idx_s4 = -1
    for i, el in enumerate(body):
        if el.tag == w + 'p' and "4. External Interface Requirements" in get_text(el):
            idx_s4 = i
            break
            
    print(f"Section 4 found at index {idx_s4}")
    
    # Update Wireframe placeholder table in Section 4
    for i in range(idx_s4, idx_s4 + 6):
        if body[i].tag == w + 'tbl' and "Wireframe" in get_text(body[i]):
            set_cell_text(body[i].find(f".//{w}tc"), "User Interface Architecture: The interface implements 4 role-partitioned portals: (1) Applicant Portal with program browsing and submission wizards; (2) Program Officer Desk with scheme design and sanction management; (3) Reviewer Evaluation Portal with 4-slider rubric scorecards; and (4) System Admin Console with macro analytics and user governance.", bold=False)
            break
            
    # Update Section 5: NFR table
    idx_s5_tbl = -1
    for i, el in enumerate(body):
        if el.tag == w + 'tbl' and "Performance" in get_text(el):
            idx_s5_tbl = i
            break
    if idx_s5_tbl != -1:
        nfr_data = [
            ["Attribute", "Target Metric / Standard", "Verification & Testing Method"],
            ["5.1 Performance", "API response latency < 300 ms under concurrency of 50 users; automated eligibility evaluation < 50 ms per submission.", "Apache JMeter load testing & Spring Boot Actuator metrics."],
            ["5.2 Security", "BCrypt password hashing (cost 10); stateless JWT authentication (HS256); strict RBAC endpoint guards; zero SQL injection via JPA parameterized queries.", "OWASP ZAP vulnerability assessment & automated security tests."],
            ["5.3 Reliability", "System uptime >= 99.5%; ACID transactional integrity enforced via Spring @Transactional on all mutations; centralized global exception handling.", "Automated JUnit 5 integration test suite & server uptime monitoring."],
            ["5.4 Portability & Usability", "Cross-browser responsive UI (Chrome, Edge, Firefox, Safari); responsive grid layout (>=1366x768 desktop, tablet, mobile); ANSI SQL portability.", "Cross-browser rendering tests & database dialect migration tests."]
        ]
        repopulate_table(body[idx_s5_tbl], nfr_data)
        print(f"Updated NFR table at {idx_s5_tbl}")
        
    # 5. Section 6: System Design and Analysis Models
    # Locate Section 6
    idx_s6 = -1
    for i, el in enumerate(body):
        if el.tag == w + 'p' and "6. System Design and Analysis Models" in get_text(el):
            idx_s6 = i
            break
            
    print(f"Section 6 found at index {idx_s6}")
    
    # Find the paragraphs with drawing blips
    blip_indices = []
    for i in range(idx_s6, len(body)):
        if list(body[i].iter(f"{{{a_ns}}}blip")):
            blip_indices.append(i)
            
    print(f"Drawing blips found at indices: {blip_indices}")
    # We know:
    # blip_indices[0] has rId14 (image1.png - ERD)
    # blip_indices[1] has rId15 (image2.png - DFD Level 0 Context)
    # blip_indices[2] has rId16 (image3.png - Use Case Diagram)
    
    erd_p = copy.deepcopy(body[blip_indices[0]])
    dfd_p = copy.deepcopy(body[blip_indices[1]])
    uc_p = copy.deepcopy(body[blip_indices[2]])
    
    # Find Table 183 (Analysis Models Summary Table)
    idx_summary_tbl = -1
    for i in range(idx_s6, len(body)):
        if body[i].tag == w + 'tbl' and "Diagram Type" in get_text(body[i]):
            idx_summary_tbl = i
            break
            
    # Remove everything between Section 6 heading intro and the summary table
    summary_tbl_elem = copy.deepcopy(body[idx_summary_tbl])
    
    # Find Section 7 heading
    idx_s7 = -1
    for i in range(idx_s6, len(body)):
        if el.tag == w + 'p' and "7. Academic Review & Sign-Off" in get_text(body[i]):
            idx_s7 = i
            break
            
    # Delete elements from idx_s6 + 2 to idx_s7 - 1
    # First, let's collect the elements to keep after Section 6
    s7_and_beyond = []
    for i in range(idx_s7, len(body)):
        s7_and_beyond.append(copy.deepcopy(body[i]))
        
    # Trim body back to idx_s6 + 2
    del body[idx_s6 + 2:]
    
    # Now build clean Section 6:
    # 6.1 UML Use Case Model
    body.append(create_p("6.1 UML Use Case Model and Actor Interaction", style='Heading2', bold=True))
    body.append(create_p("The Use Case Diagram captures the behavioral boundaries of the Grants Management System, defining actor interactions across Visitor, Grant Applicant, Committee Reviewer, System Administrator, and external Banking / Payment Systems (PFMS):"))
    body.append(uc_p) # image3.png
    body.append(create_p("Figure 6.1: UML Use Case Diagram - Grants Management System", style='Caption', italic=True, align='center'))
    body.append(create_p("Actors and Functional Capabilities:\n• Visitor: Browses open grant schemes and inspects eligibility criteria guidelines.\n• Grant Applicant: Self-registers organization account, submits proposals (including validation and automated eligibility checks), tracks lifecycle status, and submits milestone Utilization Certificates (UCs).\n• Administrator / Program Officer: Configures grant schemes, sets eligibility rules, assigns proposals to peer reviewers, issues sanction decisions (approve/reject), manages multi-tranche disbursements, and inspects audit logs.\n• Bank / Payment System (PFMS): Receives electronic disbursement orders, executes fund transfer, and confirms payments via UTR transaction references."))
    
    # 6.2 Data Flow Diagram (DFD Level 0 Context Diagram)
    body.append(create_p("6.2 Data Flow Diagram (DFD Level 0 Context Diagram)", style='Heading2', bold=True))
    body.append(create_p("The Level 0 Context Diagram establishes the data boundaries and information flow between external entities and the central Grants Management System (Process 0):"))
    body.append(dfd_p) # image2.png
    body.append(create_p("Figure 6.2: DFD Level 0 Context Diagram - External Entity Information Flows", style='Caption', italic=True, align='center'))
    body.append(create_p("Context Data Flow Paths:\n• Applicant ➔ GMS: Dispatches Organization Registration, Proposal Narratives, Budget Requests, Compliance Files, and Milestone UCs.\n• GMS ➔ Applicant: Dispatches Real-Time Status, Automated Eligibility Evaluation Results, Sanction Notifications, and Tranche Status.\n• Reviewer ➔ GMS: Submits 4-Dimensional Rubric Scorecards (0-100), Evaluator Feedback, and Sanction Recommendations.\n• GMS ➔ Reviewer: Dispatches Assigned Proposal Dossiers and Compliance Attachments.\n• Administrator / Officer ➔ GMS: Configures Grant Programs, Parametric Rules, Reviewer Assignments, and Sanction Orders.\n• GMS ➔ Administrator / Officer: Yields Analytical Dashboards, Comprehensive Review Summaries, and Audit Event Trails.\n• GMS ➔ Bank / Payment System: Issues Electronic Fund Transfer Requests with Beneficiary Bank Account and IFSC.\n• Bank / Payment System ➔ GMS: Returns Payment Confirmation containing Unique Transaction Reference (UTR) numbers."))
    
    # 6.3 3NF Entity-Relationship Diagram (ERD)
    body.append(create_p("6.3 3NF Entity-Relationship Diagram and Relational Architecture", style='Heading2', bold=True))
    body.append(create_p("The Entity-Relationship model defines the normalized Third Normal Form (3NF) relational database deployed on Oracle Database 21c XE, eliminating insertion, deletion, and update anomalies:"))
    body.append(erd_p) # image1.png
    body.append(create_p("Figure 6.3: 3NF Entity-Relationship Diagram - Relational Schema Architecture", style='Caption', italic=True, align='center'))
    body.append(create_p("Relational Entity Mappings & Cardinalities:\n• ROLES to USERS (1 : M): Each role governs multiple authenticated users under strict RBAC.\n• USERS to GRANT_APPLICATIONS (1 : M): Registered applicants submit one or more grant proposals.\n• GRANT_PROGRAMS to ELIGIBILITY_CRITERIA (1 : M): Program Officers define multiple parametric rules per scheme.\n• GRANT_PROGRAMS to GRANT_APPLICATIONS (1 : M): Each scheme receives multiple submissions.\n• GRANT_APPLICATIONS to APPLICATION_REVIEWS (1 : M): Applications are reviewed by expert evaluators.\n• USERS (Reviewers) to APPLICATION_REVIEWS (1 : M): Evaluators submit rubric scorecards for assigned proposals.\n• GRANT_APPLICATIONS to GRANT_DISBURSEMENTS (1 : M): Sanctioned grants are disbursed in multiple scheduled tranches.\n• GRANT_DISBURSEMENTS to UTILIZATION_REPORTS (1 : 1): Each disbursed tranche requires a verified milestone Utilization Certificate (UC)."))
    
    # Add Analysis Models Summary Table
    body.append(create_p("Table 6.1: Summary of System Analysis Models", bold=True))
    body.append(summary_tbl_elem)
    
    # Append Section 7 and beyond
    for el in s7_and_beyond:
        body.append(el)
        
    print(f"New body child elements count: {len(body)}")
    
    # Serialize back to XML
    xml_output = ET.tostring(root, encoding='utf-8', xml_declaration=True)
    all_files['word/document.xml'] = xml_output
    
    # Write output zip
    print(f"Writing to repo: {output_docx_repo}")
    os.makedirs(os.path.dirname(output_docx_repo), exist_ok=True)
    with zipfile.ZipFile(output_docx_repo, 'w', zipfile.ZIP_DEFLATED) as z_out:
        for fname, data in all_files.items():
            z_out.writestr(fname, data)
            
    print(f"Writing to uploaded location: {output_docx_uploaded}")
    with zipfile.ZipFile(output_docx_uploaded, 'w', zipfile.ZIP_DEFLATED) as z_out:
        for fname, data in all_files.items():
            z_out.writestr(fname, data)
            
    print("SUCCESS: Both docx files successfully created and updated!")

if __name__ == '__main__':
    main()
