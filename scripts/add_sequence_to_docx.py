import zipfile
import copy
import xml.etree.ElementTree as ET

docx_in = r"c:\Users\arunj\OneDrive\Desktop\grants\docs\Devansh_Srs_GrantsManagement.docx"
seq_png = r"c:\Users\arunj\OneDrive\Desktop\grants\docs\images\sequence_diagram.png"
docx_uploaded = r"C:\Users\arunj\.gemini\antigravity\brain\261f29e1-d413-469a-93d2-8e9f11d69d2d\.user_uploaded\media_1795083307092_270672ab.docx"

w_ns = "http://schemas.openxmlformats.org/wordprocessingml/2006/main"
r_ns = "http://schemas.openxmlformats.org/officeDocument/2006/relationships"
a_ns = "http://schemas.openxmlformats.org/drawingml/2006/main"
wp_ns = "http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing"

ET.register_namespace('w', w_ns)
ET.register_namespace('r', r_ns)
ET.register_namespace('a', a_ns)
ET.register_namespace('wp', wp_ns)

w = f"{{{w_ns}}}"
a = f"{{{a_ns}}}"
r = f"{{{r_ns}}}"
wp = f"{{{wp_ns}}}"

with zipfile.ZipFile(docx_in, 'r') as z:
    all_files = {name: z.read(name) for name in z.namelist()}

# 1. Add image4.png to media
with open(seq_png, 'rb') as f:
    all_files['word/media/image4.png'] = f.read()

# 2. Add relationship to word/_rels/document.xml.rels
rels_root = ET.fromstring(all_files['word/_rels/document.xml.rels'])
rel_elem = ET.SubElement(rels_root, '{http://schemas.openxmlformats.org/package/2006/relationships}Relationship')
rel_elem.attrib['Id'] = 'rId21'
rel_elem.attrib['Type'] = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/image'
rel_elem.attrib['Target'] = 'media/image4.png'
all_files['word/_rels/document.xml.rels'] = ET.tostring(rels_root, encoding='utf-8', xml_declaration=True)

# 3. Modify word/document.xml
root = ET.fromstring(all_files['word/document.xml'])
body = root.find(w + 'body')

def get_text(el):
    texts = [t.text for t in el.iter(w + 't') if t.text]
    return ''.join(texts).strip()

def create_p(text, style='Normal', bold=False, italic=False, align='left'):
    p = ET.Element(w + 'p')
    pPr = ET.SubElement(p, w + 'pPr')
    if style:
        pStyle = ET.SubElement(pPr, w + 'pStyle')
        pStyle.attrib[w + 'val'] = style
    if align != 'left':
        jc = ET.SubElement(pPr, w + 'jc')
        jc.attrib[w + 'val'] = align
    res = ET.SubElement(p, w + 'r')
    if bold or italic:
        rPr = ET.SubElement(res, w + 'rPr')
        if bold: ET.SubElement(rPr, w + 'b')
        if italic: ET.SubElement(rPr, w + 'i')
    t = ET.SubElement(res, w + 't')
    t.text = text
    return p

# Find an existing drawing paragraph to clone for sequence diagram
drawing_template = None
for el in body:
    if list(el.iter(a + 'blip')):
        drawing_template = copy.deepcopy(el)
        break

# Configure drawing_template to point to rId21 and set dimensions
seq_drawing_p = copy.deepcopy(drawing_template)
blip = seq_drawing_p.find(f".//{a}blip")
if blip is not None:
    blip.attrib[r + 'embed'] = 'rId21'

# Set aspect ratio in extent: width 5.5 inches = 5029200 dxa, height = 7.0 inches = 6400800 dxa
extent = seq_drawing_p.find(f".//{wp}extent")
if extent is not None:
    extent.attrib['cx'] = '5029200'
    extent.attrib['cy'] = '7184600'

# Update TOC to include 6.4
for i, el in enumerate(body):
    txt = get_text(el)
    if "6. System Design and Analysis Models" in txt and "Page" in txt:
        # Insert 6.4 entry right after 6.3 or after this line
        toc_64 = create_p("6.4 Activity and UML Sequence Model .................................... Page 6")
        body.insert(i + 1, toc_64)
        break

# Locate Section 6.3 in body
idx_s63 = -1
for i, el in enumerate(body):
    txt = get_text(el)
    if "Figure 6.3:" in txt:
        idx_s63 = i
        break

print(f"Found Figure 6.3 at index: {idx_s63}")

# Elements for Section 6.4
s64_elements = [
    create_p("6.4 Activity and UML Sequence Model (Happy-Path and Error Recovery)", style='Heading2', bold=True),
    create_p("The UML Sequence Diagram captures the dynamic chronological sequence of message interactions across client UI, Spring Boot REST controllers, automated eligibility rule evaluation, database persistence, committee peer review scoring, and PFMS banking settlement:"),
    seq_drawing_p,
    create_p("Figure 6.4: UML Sequence Diagram - Chronological Message Flow, Rubric Scoring, Auto-Approval & PFMS Disbursement", style='Caption', italic=True, align='center'),
    create_p("Detailed Execution Phases & Decision Branches:\n"
             "• Phase 1 (Proposal Submission): Applicant submits proposal form via Angular 14 wizard. Client-side regex verifies PAN, GSTIN, and budget boundaries before dispatching an authenticated Bearer JWT payload.\n"
             "• Phase 2 (Algorithmic Eligibility Evaluation): EligibilityEngineService executes rules comparing applicant age, turnover, and entity type. Breaches trigger Error Recovery (AUTO_INELIGIBLE, HTTP 422); passing all rules marks AUTO_ELIGIBLE (HTTP 201 Created).\n"
             "• Phase 3 (Peer Review Scoring & Auto-Approval): Reviewer completes 4-slider rubric scorecard (Feasibility, Innovation, Budget Realism, Social Impact: 0-100). The engine recalculates the score (90/100), automatically updates application status to APPROVED, and logs an immutable audit event.\n"
             "• Phase 4 (Sanction Order & PFMS Electronic Disbursement): Program Officer issues Sanction Order and releases Tranche 1. If bank gateway times out, Error Recovery marks DISBURSEMENT_FAILED; on settlement success, PFMS returns UTR, tranche is marked DISBURSED, and scheme budget is atomically debited.\n"
             "• Phase 5 (Milestone UC Compliance): Applicant submits milestone Utilization Certificate (UC); Program Officer inspects and certifies compliance (VERIFIED_SATISFACTORY), unlocking subsequent tranches.")
]

# Insert after Figure 6.3 and its following paragraph
insert_pos = idx_s63 + 2
for offset, elem in enumerate(s64_elements):
    body.insert(insert_pos + offset, elem)

all_files['word/document.xml'] = ET.tostring(root, encoding='utf-8', xml_declaration=True)

# Save to both locations
for path in [docx_in, docx_uploaded]:
    with zipfile.ZipFile(path, 'w', zipfile.ZIP_DEFLATED) as z_out:
        for fname, data in all_files.items():
            z_out.writestr(fname, data)

print("SUCCESS: Embedded sequence_diagram.png as Figure 6.4 in both .docx documents!")
