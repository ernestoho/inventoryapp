import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { LowStockAlerts } from "@/components/dashboard/low-stock-alerts"
import { DemoBanner } from "@/components/demo-banner"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <DemoBanner />
      <DashboardStats />

      <div className="grid gap-6 md:grid-cols-2">
        <LowStockAlerts />
        <RecentActivity />
      </div>
    </div>
  )
}
