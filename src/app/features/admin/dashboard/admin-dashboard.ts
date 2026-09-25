import { Component, computed, inject } from '@angular/core';
import { ChartConfiguration, ChartData } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { AdminMockService } from '../admin-mock.service';

@Component({
  selector: 'app-admin-dashboard',
  imports: [BaseChartDirective],
  styleUrl: './admin-dashboard.scss',
  templateUrl: './admin-dashboard.html',
})
export class AdminDashboard {
  private readonly adminMock = inject(AdminMockService);

  readonly kpis = this.adminMock.kpis;

  readonly chartData = computed<ChartData<'bar'>>(() => {
    const weeklyOccupancy = this.adminMock.weeklyOccupancy();
    return {
      labels: weeklyOccupancy.map((entry) => entry.day),
      datasets: [
        {
          label: 'Ocupación (%)',
          data: weeklyOccupancy.map((entry) => entry.pct),
          backgroundColor: '#2E7D32',
          borderRadius: 6,
        },
      ],
    };
  });

  readonly chartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: { callback: (value) => `${value}%` },
      },
    },
    plugins: {
      legend: { display: false },
    },
  };
}
