import { Injectable } from '@nestjs/common';

@Injectable()
export class DashboardService {
  getDashboardData() {
    return {
      message: 'This is protected dashboard data',
      stats: {
        totalUsers: 100,
        activeUsers: 50,
        dailyVisits: 1000
      }
    };
  }
} 