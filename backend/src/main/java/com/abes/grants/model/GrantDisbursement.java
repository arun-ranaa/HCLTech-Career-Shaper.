package com.abes.grants.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "GRANT_DISBURSEMENTS")
public class GrantDisbursement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "disbursement_id")
    private Long disbursementId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "application_id", nullable = false)
    private Application application;

    @Column(name = "tranche_number", nullable = false)
    private Integer trancheNumber = 1;

    @Column(name = "disbursement_reference", unique = true, nullable = false, length = 50)
    private String disbursementReference;

    @Column(name = "disbursement_amount", nullable = false, precision = 14, scale = 2)
    private BigDecimal disbursementAmount;

    @Column(name = "payment_method", nullable = false, length = 50)
    private String paymentMethod = "PFMS_NEFT"; // PFMS_NEFT, RTGS, DIRECT_BENEFIT_TRANSFER

    @Column(name = "bank_name", nullable = false, length = 100)
    private String bankName;

    @Column(name = "account_number_masked", nullable = false, length = 50)
    private String accountNumberMasked;

    @Column(name = "ifsc_code", nullable = false, length = 20)
    private String ifscCode;

    @Column(name = "transaction_reference", length = 100)
    private String transactionReference;

    @Column(name = "scheduled_date", nullable = false)
    private LocalDate scheduledDate;

    @Column(name = "disbursement_date")
    private LocalDate disbursementDate;

    @Column(name = "status", nullable = false, length = 30)
    private String status = "SCHEDULED"; // SCHEDULED, PROCESSING, DISBURSED, FAILED, HOLD

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "disbursed_by")
    private User disbursedBy;

    @Column(name = "remarks", length = 1000)
    private String remarks;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public GrantDisbursement() {}

    public Long getDisbursementId() { return disbursementId; }
    public void setDisbursementId(Long disbursementId) { this.disbursementId = disbursementId; }

    public Application getApplication() { return application; }
    public void setApplication(Application application) { this.application = application; }

    public Integer getTrancheNumber() { return trancheNumber; }
    public void setTrancheNumber(Integer trancheNumber) { this.trancheNumber = trancheNumber; }

    public String getDisbursementReference() { return disbursementReference; }
    public void setDisbursementReference(String disbursementReference) { this.disbursementReference = disbursementReference; }

    public BigDecimal getDisbursementAmount() { return disbursementAmount; }
    public void setDisbursementAmount(BigDecimal disbursementAmount) { this.disbursementAmount = disbursementAmount; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public String getBankName() { return bankName; }
    public void setBankName(String bankName) { this.bankName = bankName; }

    public String getAccountNumberMasked() { return accountNumberMasked; }
    public void setAccountNumberMasked(String accountNumberMasked) { this.accountNumberMasked = accountNumberMasked; }

    public String getIfscCode() { return ifscCode; }
    public void setIfscCode(String ifscCode) { this.ifscCode = ifscCode; }

    public String getTransactionReference() { return transactionReference; }
    public void setTransactionReference(String transactionReference) { this.transactionReference = transactionReference; }

    public LocalDate getScheduledDate() { return scheduledDate; }
    public void setScheduledDate(LocalDate scheduledDate) { this.scheduledDate = scheduledDate; }

    public LocalDate getDisbursementDate() { return disbursementDate; }
    public void setDisbursementDate(LocalDate disbursementDate) { this.disbursementDate = disbursementDate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public User getDisbursedBy() { return disbursedBy; }
    public void setDisbursedBy(User disbursedBy) { this.disbursedBy = disbursedBy; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
