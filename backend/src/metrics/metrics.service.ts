import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MetricsService {
  constructor(private prisma: PrismaService) {}

  async getUserMetrics(userId: string) {
    return this.prisma.userMetric.findUnique({
      where: { userId },
    });
  }

  async getAgentMetrics(agentId: string) {
    return this.prisma.agentMetric.findUnique({
      where: { agentId },
    });
  }

  async getAdminDashboard() {
    const [totalUsers, totalBookings, totalRevenue, vehicles] =
      await Promise.all([
        this.prisma.user.count(),
        this.prisma.booking.count(),
        this.prisma.payment.aggregate({ _sum: { amount: true } }),
        this.prisma.vehicle.findMany(),
      ]);

    return {
      totalUsers,
      totalBookings,
      totalRevenue: totalRevenue._sum.amount || 0,
      fleet: {
        total: vehicles.length,
        byCategory: vehicles.reduce(
          (acc, v) => {
            acc[v.category] = (acc[v.category] || 0) + 1;
            return acc;
          },
          {} as Record<string, number>,
        ),
      },
    };
  }
}
