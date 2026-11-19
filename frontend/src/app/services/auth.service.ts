import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../models/grants.models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:8080/api/v1/auth';
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  constructor(private http: HttpClient) {
    const stored = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<User | null>(stored ? JSON.parse(stored) : {
      userId: 2,
      username: 'officer_sharma',
      fullName: 'Sunita Sharma',
      email: 'sunita.sharma@dst.gov.in',
      role: 'ROLE_PROGRAM_OFFICER',
      organizationName: 'Department of Science and Technology'
    });
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/login`, { username, password })
      .pipe(map(response => {
        if (response && response.token) {
          localStorage.setItem('currentUser', JSON.stringify(response));
          localStorage.setItem('token', response.token);
          this.currentUserSubject.next(response);
        }
        return response;
      }));
  }

  switchRole(role: string): void {
    let mockUser: User;
    if (role === 'officer') {
      mockUser = { userId: 2, username: 'officer_sharma', fullName: 'Sunita Sharma', email: 'sunita@dst.gov.in', role: 'ROLE_PROGRAM_OFFICER', organizationName: 'DST' };
    } else if (role === 'reviewer') {
      mockUser = { userId: 4, username: 'reviewer_kapoor', fullName: 'Dr. Alok Kapoor', email: 'alok@iitd.ac.in', role: 'ROLE_REVIEWER', organizationName: 'IIT Delhi' };
    } else if (role === 'applicant') {
      mockUser = { userId: 7, username: 'applicant_patel', fullName: 'Chirag Patel', email: 'chirag@krishi.com', role: 'ROLE_APPLICANT', organizationName: 'KrishiAI Tech' };
    } else {
      mockUser = { userId: 1, username: 'admin', fullName: 'Rajesh Verma', email: 'admin@gov.in', role: 'ROLE_ADMIN', organizationName: 'NIC' };
    }
    localStorage.setItem('currentUser', JSON.stringify(mockUser));
    this.currentUserSubject.next(mockUser);
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
  }
}
