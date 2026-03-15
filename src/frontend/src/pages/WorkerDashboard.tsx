import { Button } from "@/components/ui/button";
import { Loader2, LogOut, Settings } from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { useNav } from "../App";
import type { Booking, UserProfile } from "../backend";
import { Status } from "../backend";
import BottomNav from "../components/BottomNav";
import StatusBadge from "../components/StatusBadge";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export default function WorkerDashboard() {
  const { navigate } = useNav();
  const { actor } = useActor();
  const { clear } = useInternetIdentity();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!actor) return;
    setLoading(true);
    try {
      const [allWorkers, prof] = await Promise.all([
        actor.listWorkers(),
        actor.getCallerUserProfile(),
      ]);
      setProfile(prof);
      if (allWorkers.length > 0) {
        const w = allWorkers[0];
        const wBookings = await actor.listBookingsByWorker(w.id);
        setBookings(wBookings);
      }
    } catch (e) {
      toast.error(`Data load nahi hua: ${String(e)}`);
    } finally {
      setLoading(false);
    }
  }, [actor]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  const handleStatusUpdate = async (bookingId: bigint, newStatus: Status) => {
    if (!actor) return;
    try {
      await actor.updateBookingStatus(bookingId, newStatus);
      toast.success("Status update ho gaya!");
      void fetchData();
    } catch (e) {
      toast.error(`Status update nahi hua: ${String(e)}`);
    }
  };

  const todayJobs = bookings.filter(
    (b) => b.status === Status.accepted || b.status === Status.inProgress,
  );
  const totalEarnings = bookings
    .filter((b) => b.status === Status.completed)
    .reduce((sum, b) => sum + Number(b.totalPrice), 0);

  return (
    <div className="min-h-screen">
      <div className="bg-primary px-4 pt-10 pb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-primary-foreground/80 text-sm">
              Worker Dashboard
            </p>
            <h1 className="font-display text-2xl font-bold text-primary-foreground">
              {profile?.name ?? "Worker"} 👷
            </h1>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              data-ocid="dashboard.edit_button"
              onClick={() => navigate("worker-register")}
              className="bg-white/20 p-2 rounded-full"
            >
              <Settings className="h-5 w-5 text-white" />
            </button>
            <button
              type="button"
              data-ocid="dashboard.secondary_button"
              onClick={() => {
                clear();
                navigate("splash");
              }}
              className="bg-white/20 p-2 rounded-full"
            >
              <LogOut className="h-5 w-5 text-white" />
            </button>
          </div>
        </div>
      </div>

      <div className="page-content">
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            {
              label: "Aaj ke Kaam",
              value: String(todayJobs.length),
              emoji: "📅",
            },
            {
              label: "Total Kaam",
              value: String(bookings.length),
              emoji: "📊",
            },
            {
              label: "Kamayi",
              value: `₹${totalEarnings.toLocaleString("en-IN")}`,
              emoji: "💰",
            },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-card border border-border rounded-2xl p-3 shadow-card text-center"
            >
              <div className="text-2xl mb-1">{stat.emoji}</div>
              <div className="font-display font-bold text-lg">{stat.value}</div>
              <div className="text-muted-foreground text-xs">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <h2 className="font-display text-lg font-bold mb-3">Meri Bookings</h2>
        {loading ? (
          <div
            data-ocid="dashboard.loading_state"
            className="flex justify-center py-8"
          >
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : bookings.length === 0 ? (
          <div data-ocid="dashboard.empty_state" className="text-center py-8">
            <div className="text-4xl mb-2">📭</div>
            <p className="font-display font-bold">Koi booking nahi abhi</p>
            <p className="text-muted-foreground text-sm mt-1">
              Nayi bookings ka intezaar karein
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {bookings.map((booking, i) => (
              <motion.div
                key={String(booking.id)}
                data-ocid={`dashboard.item.${i + 1}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="bg-card border border-border rounded-2xl p-4 shadow-card"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-display font-bold">
                      Booking #{String(booking.id)}
                    </p>
                    <p className="text-muted-foreground text-xs mt-0.5">
                      ₹{Number(booking.totalPrice).toLocaleString("en-IN")} ·{" "}
                      {booking.paymentMethod}
                    </p>
                  </div>
                  <StatusBadge status={booking.status} />
                </div>
                <div className="flex gap-2">
                  {booking.status === Status.pending && (
                    <>
                      <Button
                        data-ocid={`dashboard.confirm_button.${i + 1}`}
                        size="sm"
                        className="flex-1 rounded-xl"
                        onClick={() =>
                          handleStatusUpdate(booking.id, Status.accepted)
                        }
                      >
                        ✅ Accept
                      </Button>
                      <Button
                        data-ocid={`dashboard.delete_button.${i + 1}`}
                        size="sm"
                        variant="outline"
                        className="flex-1 rounded-xl"
                        onClick={() =>
                          handleStatusUpdate(booking.id, Status.completed)
                        }
                      >
                        ❌ Decline
                      </Button>
                    </>
                  )}
                  {booking.status === Status.accepted && (
                    <Button
                      data-ocid={`dashboard.secondary_button.${i + 1}`}
                      size="sm"
                      className="w-full rounded-xl"
                      onClick={() =>
                        handleStatusUpdate(booking.id, Status.inProgress)
                      }
                    >
                      🔨 Kaam Shuru Karein
                    </Button>
                  )}
                  {booking.status === Status.inProgress && (
                    <Button
                      data-ocid={`dashboard.confirm_button.${i + 1}`}
                      size="sm"
                      className="w-full rounded-xl"
                      onClick={() =>
                        handleStatusUpdate(booking.id, Status.completed)
                      }
                    >
                      🎉 Complete Karein
                    </Button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <BottomNav active="home" userRole="worker" />
    </div>
  );
}
