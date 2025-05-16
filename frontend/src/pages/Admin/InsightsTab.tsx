import LoadingSpinner from "@/components/LoadingSpinner";
import { useAdminStore } from "@/stores/admin.store";
import { SystemState, TotalReport } from "@/types/admin.types";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function InsightsTab() {
  const [stats, setStats] = useState<TotalReport["stats"] | null>(null);
  const [overview, setOverview] = useState<SystemState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getTotalReport, getSystemState } = useAdminStore();

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        console.log("Fetching dashboard data...");

        // Fetch stats
        const statsResponse = await getTotalReport();
        console.log("Stats response:", statsResponse);
        if (statsResponse?.success) {
          setStats(statsResponse.stats);
        }

        // Fetch overview
        const overviewResponse = await getSystemState();
        console.log("Overview response:", overviewResponse);
        setOverview(overviewResponse);

        setError(null);
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error("Error fetching dashboard data:", err);
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [getTotalReport, getSystemState]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4">
        <p className="text-red-500">{error}</p>
        <Button
          onClick={() => window.location.reload()}
          className="bg-[#F7B32B] text-black hover:bg-[#F7B32B]/90"
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total Parents", value: stats?.totalParents || 0 },
          { label: "Total Drivers", value: stats?.totalDrivers || 0 },
          { label: "Total Schools", value: stats?.totalSchools || 0 },
          { label: "Total Buses", value: stats?.totalBuses || 0 },
        ].map(({ label, value }) => (
          <Card key={label}>
            <CardHeader>
              <CardTitle className="text-sm font-medium">{label}</CardTitle>
              <CardDescription className="text-2xl font-bold">
                {value}
              </CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* Overview Cards */}
      {overview && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Active Routes</CardTitle>
                <CardDescription className="text-2xl font-bold">
                  {overview.activeRoutes?.length || 0}
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Active Buses</CardTitle>
                <CardDescription className="text-2xl font-bold">
                  {overview.activeBuses?.length || 0}
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* Recent Alerts */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              {overview.recentAlerts?.length > 0 ? (
                <div className="space-y-2">
                  {overview.recentAlerts.map((alert) => (
                    <div
                      key={alert._id}
                      className="p-3 bg-background rounded-lg border"
                    >
                      <p>{alert.message}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {new Date(alert.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground">
                  No recent alerts
                </p>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

export default InsightsTab;
