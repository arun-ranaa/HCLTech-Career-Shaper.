import { Component, OnInit } from '@angular/core';
import { ApiService } from './services/api.service';
import { AuthService } from './services/auth.service';
import { User, DashboardStats } from './models/grants.models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Grants Management System';
  currentUser: User | null = null;
  stats: DashboardStats | null = null;
  activeTab: string = 'dashboard';

  constructor(private apiService: ApiService, private authService: AuthService) {
    this.authService.currentUser.subscribe(u => this.currentUser = u);
  }

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.apiService.getDashboardStats().subscribe({
      next: (res) => this.stats = res,
      error: () => {
        // Fallback demo statistics
        this.stats = {
          totalPrograms: 4,
          activePrograms: 4,
          totalAllocatedBudget: 280000000,
          totalDisbursedBudget: 90500000,
          totalApplications: 5,
          applicationsApproved: 2,
          applicationsUnderReview: 1,
          applicationsDisbursed: 2,
          applicationsRejected: 0,
          budgetUtilizationRate: 32.32
        };
      }
    });
  }

  setTab(tab: string): void {
    this.activeTab = tab;
  }

  switchRole(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.authService.switchRole(target.value);
  }
}
