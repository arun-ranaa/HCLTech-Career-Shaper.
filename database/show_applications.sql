SET LINESIZE 180;
SET PAGESIZE 50;
SET FEEDBACK ON;

COL APPLICATION_NUMBER FORMAT A20 HEADING 'Application No';
COL PROJECT_TITLE FORMAT A35 HEADING 'Project Title';
COL APPLICANT_NAME FORMAT A20 HEADING 'Applicant Name';
COL STATUS FORMAT A12 HEADING 'Status';
COL REQUESTED_AMOUNT FORMAT 99999999.99 HEADING 'Amount (INR)';

PROMPT =========================================================================================;
PROMPT   ORACLE DATABASE XE: GRANTS_ADMIN.APPLICATIONS (LIVE SUBMISSIONS)
PROMPT =========================================================================================;

SELECT application_number, project_title, applicant_name, status, requested_amount 
FROM GRANTS_ADMIN.APPLICATIONS 
ORDER BY submitted_at DESC;

EXIT;
