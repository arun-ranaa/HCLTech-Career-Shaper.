import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  GrantProgram,
  Application,
  ApplicationReview,
  GrantDisbursement,
  UtilizationReport,
  DashboardStats
} from '../models/grants.models';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:8080/api/v1';

  constructor(private http: HttpClient) { }

  // Dashboard & Analytics
  getDashboardStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.baseUrl}/analytics/dashboard`);
  }

  // Module 1: Programs
  getPrograms(status?: string, category?: string): Observable<GrantProgram[]> {
    let params: any = {};
    if (status) params.status = status;
    if (category) params.category = category;
    return this.http.get<GrantProgram[]>(`${this.baseUrl}/programs`, { params });
  }

  getProgramById(id: number): Observable<GrantProgram> {
    return this.http.get<GrantProgram>(`${this.baseUrl}/programs/${id}`);
  }

  createProgram(program: GrantProgram): Observable<GrantProgram> {
    return this.http.post<GrantProgram>(`${this.baseUrl}/programs`, program);
  }

  // Module 2: Applications & Eligibility
  getApplications(programId?: number, applicantId?: number, status?: string): Observable<Application[]> {
    let params: any = {};
    if (programId) params.programId = programId;
    if (applicantId) params.applicantId = applicantId;
    if (status) params.status = status;
    return this.http.get<Application[]>(`${this.baseUrl}/applications`, { params });
  }

  submitApplication(application: any): Observable<Application> {
    return this.http.post<Application>(`${this.baseUrl}/applications`, application);
  }

  reevaluateEligibility(applicationId: number): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/applications/${applicationId}/evaluate-eligibility`, {});
  }

  // Module 3: Review & Sanctions
  assignReviewer(applicationId: number, reviewerId: number): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/applications/${applicationId}/assign-reviewer`, { reviewerId });
  }

  submitReview(reviewId: number, reviewData: any): Observable<ApplicationReview> {
    return this.http.post<ApplicationReview>(`${this.baseUrl}/reviews/${reviewId}/submit`, reviewData);
  }

  decideApplication(applicationId: number, decisionData: any): Observable<Application> {
    return this.http.post<Application>(`${this.baseUrl}/applications/${applicationId}/decision`, decisionData);
  }

  // Module 4: Disbursements & Utilization
  getDisbursements(applicationId?: number): Observable<GrantDisbursement[]> {
    let params: any = {};
    if (applicationId) params.applicationId = applicationId;
    return this.http.get<GrantDisbursement[]>(`${this.baseUrl}/disbursements`, { params });
  }

  scheduleDisbursement(applicationId: number, payload: any): Observable<GrantDisbursement> {
    return this.http.post<GrantDisbursement>(`${this.baseUrl}/applications/${applicationId}/disbursements`, payload);
  }

  executeDisbursement(disbursementId: number, payload: any): Observable<GrantDisbursement> {
    return this.http.post<GrantDisbursement>(`${this.baseUrl}/disbursements/${disbursementId}/execute`, payload);
  }

  getUtilizationReports(applicationId?: number): Observable<UtilizationReport[]> {
    let params: any = {};
    if (applicationId) params.applicationId = applicationId;
    return this.http.get<UtilizationReport[]>(`${this.baseUrl}/utilization-reports`, { params });
  }

  submitUtilizationReport(applicationId: number, payload: any): Observable<UtilizationReport> {
    return this.http.post<UtilizationReport>(`${this.baseUrl}/applications/${applicationId}/utilization-reports`, payload);
  }

  verifyUtilizationReport(reportId: number, payload: any): Observable<UtilizationReport> {
    return this.http.patch<UtilizationReport>(`${this.baseUrl}/utilization-reports/${reportId}/verify`, payload);
  }
}
