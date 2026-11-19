package com.abes.grants.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "APPROVAL_WORKFLOW_LOGS")
public class ApprovalWorkflowLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "log_id")
    private Long logId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "application_id", nullable = false)
    private Application application;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "action_by", nullable = false)
    private User actionBy;

    @Column(name = "previous_status", nullable = false, length = 50)
    private String previousStatus;

    @Column(name = "new_status", nullable = false, length = 50)
    private String newStatus;

    @Column(name = "action_taken", nullable = false, length = 50)
    private String actionTaken;

    @Column(name = "decision_notes", length = 2000)
    private String decisionNotes;

    @Column(name = "action_timestamp", nullable = false)
    private LocalDateTime actionTimestamp = LocalDateTime.now();

    public ApprovalWorkflowLog() {}

    public ApprovalWorkflowLog(Application application, User actionBy, String previousStatus, String newStatus, String actionTaken, String decisionNotes) {
        this.application = application;
        this.actionBy = actionBy;
        this.previousStatus = previousStatus;
        this.newStatus = newStatus;
        this.actionTaken = actionTaken;
        this.decisionNotes = decisionNotes;
        this.actionTimestamp = LocalDateTime.now();
    }

    public Long getLogId() { return logId; }
    public void setLogId(Long logId) { this.logId = logId; }

    public Application getApplication() { return application; }
    public void setApplication(Application application) { this.application = application; }

    public User getActionBy() { return actionBy; }
    public void setActionBy(User actionBy) { this.actionBy = actionBy; }

    public String getPreviousStatus() { return previousStatus; }
    public void setPreviousStatus(String previousStatus) { this.previousStatus = previousStatus; }

    public String getNewStatus() { return newStatus; }
    public void setNewStatus(String newStatus) { this.newStatus = newStatus; }

    public String getActionTaken() { return actionTaken; }
    public void setActionTaken(String actionTaken) { this.actionTaken = actionTaken; }

    public String getDecisionNotes() { return decisionNotes; }
    public void setDecisionNotes(String decisionNotes) { this.decisionNotes = decisionNotes; }

    public LocalDateTime getActionTimestamp() { return actionTimestamp; }
    public void setActionTimestamp(LocalDateTime actionTimestamp) { this.actionTimestamp = actionTimestamp; }
}
