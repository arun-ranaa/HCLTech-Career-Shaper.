import zipfile
import copy
import xml.etree.ElementTree as ET

docx_in = r"c:\Users\arunj\OneDrive\Desktop\grants\docs\Devansh_Srs_GrantsManagement.docx"
docx_out = docx_in
docx_uploaded = r"C:\Users\arunj\.gemini\antigravity\brain\261f29e1-d413-469a-93d2-8e9f11d69d2d\.user_uploaded\media_1795083307092_270672ab.docx"

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

with zipfile.ZipFile(docx_in, 'r') as z:
    all_files = {name: z.read(name) for name in z.namelist()}

root = ET.fromstring(all_files['word/document.xml'])
body = root.find(w + 'body')

# 1. Update Table of Contents (paragraphs 57-63)
# 57: 3.1 Module 1: Grant Program Setup and Configuration
# 58: 3.2 Module 2: Application Submission and Eligibility Check
# 59: 3.3 Module 3: Review and Approval Workflow
set_p_text(body[57], "3.1 Module 1: Grant Program Setup and Configuration ........................ Page 3")
set_p_text(body[58], "3.2 Module 2: Application Submission and Eligibility Check ................. Page 4")
set_p_text(body[59], "3.3 Module 3: Review and Approval Workflow ................................. Page 4")

# Insert 3.4 Module 4 entry in TOC after body[59]
p_toc_m4 = ET.Element(w + 'p')
set_p_text(p_toc_m4, "3.4 Module 4: Grant Disbursement and Reporting ............................. Page 5")
body.insert(60, p_toc_m4)

# Now extract the Section 6 diagram elements that were inserted at index 65 to 81
# Let's locate them by text:
s6_elements = []
indices_to_remove = []
for i, el in enumerate(body):
    txt = get_text(el)
    if any(k in txt for k in ["6.1 UML Use Case Model", "Figure 6.1", "6.2 Data Flow Diagram", "Figure 6.2", "6.3 3NF Entity-Relationship", "Figure 6.3", "Table 6.1: Summary of System Analysis"]):
        s6_elements.append(copy.deepcopy(el))
        indices_to_remove.append(i)
    elif list(el.iter(f"{{{a_ns}}}blip")) and i < 100:
        s6_elements.append(copy.deepcopy(el))
        indices_to_remove.append(i)
    elif "Actors and Functional Capabilities:" in txt or "Context Data Flow Paths:" in txt or "Relational Entity Mappings & Cardinalities:" in txt:
        s6_elements.append(copy.deepcopy(el))
        indices_to_remove.append(i)
    elif el.tag == w + 'tbl' and "Diagram Type" in txt and i < 100:
        s6_elements.append(copy.deepcopy(el))
        indices_to_remove.append(i)

print(f"Extracted {len(s6_elements)} elements from TOC region; removing from indices: {indices_to_remove}")

# Remove in reverse order
for idx in sorted(indices_to_remove, reverse=True):
    del body[idx]

# Clean up any leftover duplicate TOC entry for Section 7:
for i in range(40, 90):
    if i < len(body):
        txt = get_text(body[i])
        if "7. Academic Review & Sign-Off" in txt and body[i-1] is not None and "7. Academic Review & Sign-Off" in get_text(body[i-1]):
            del body[i]
            break

# Now locate Section 4 items to update (Hardware, Software, Interfaces)
for el in body:
    txt = get_text(el)
    if "Embedded / IoT Variants" in txt:
        set_p_text(el, "Enterprise Deployment Architecture: The system is designed for high availability deployment on standard virtualized or cloud Linux/Windows server environments interfacing via secure HTTP/JSON REST channels.")
    elif "Relational Database Connector: SQLAlchemy" in txt:
        set_p_text(el, "Relational Database Tier: Spring Data JPA and Hibernate 6.x ORM connecting via JDBC thin driver (ojdbc11) to Oracle Database 21c XE, enforcing 3NF schema constraints.")
    elif "External Cloud Utilities: Amazon Web Services" in txt:
        set_p_text(el, "Public Financial Management Interface: Simulated PFMS / DBT gateway integration for automated payment dispatch, tranche execution, and UTR generation.")
    elif "[User Interface Wireframe Mockups]" in txt:
        set_cell_text(el.find(f".//{w}tc"), "User Interface Architecture: Four isolated responsive portals built with Angular 14: (1) Applicant Portal for scheme discovery, proposal submission, and milestone UCs; (2) Program Officer Desk for scheme setup, reviewer assignment, and sanction management; (3) Reviewer Evaluation Portal with 4-slider rubric scorecards; and (4) System Admin Console for user lifecycle and security audit trails.", bold=False)

# Now locate the real Section 6 heading near the end of body
idx_s6_real = -1
for i, el in enumerate(body):
    if el.tag == w + 'p' and get_text(el) == "6. System Design and Analysis Models":
        idx_s6_real = i
        break

print(f"Real Section 6 found at index: {idx_s6_real}")

# Find Section 7 heading
idx_s7_real = -1
for i in range(idx_s6_real, len(body)):
    if body[i].tag == w + 'p' and get_text(body[i]) == "7. Academic Review & Sign-Off":
        idx_s7_real = i
        break

print(f"Real Section 7 found at index: {idx_s7_real}")

# Remove the old placeholder elements between Section 6 heading intro and Section 7
# (idx_s6_real + 2 to idx_s7_real - 1)
del body[idx_s6_real + 2 : idx_s7_real]

# Now insert the rich s6_elements right at idx_s6_real + 2
for offset, elem in enumerate(s6_elements):
    body.insert(idx_s6_real + 2 + offset, elem)

print("Section 6 populated with diagrams, captions, and model specifications!")
print(f"Final body child elements count: {len(body)}")

# Save to docx
xml_output = ET.tostring(root, encoding='utf-8', xml_declaration=True)
all_files['word/document.xml'] = xml_output

with zipfile.ZipFile(docx_out, 'w', zipfile.ZIP_DEFLATED) as z_out:
    for fname, data in all_files.items():
        z_out.writestr(fname, data)

with zipfile.ZipFile(docx_uploaded, 'w', zipfile.ZIP_DEFLATED) as z_out:
    for fname, data in all_files.items():
        z_out.writestr(fname, data)

print("SUCCESS: Both docx documents successfully finalized!")
