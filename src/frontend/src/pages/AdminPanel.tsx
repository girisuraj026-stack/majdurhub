import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, LogOut } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useNav } from "../App";
import type { Booking, Worker } from "../backend";
import StatusBadge from "../components/StatusBadge";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

interface PlatformStats {
  totalWorkers: bigint;
  totalBookings: bigint;
  completedBookings: bigint;
  totalRevenue: bigint;
}

export default function AdminPanel() {
  const { navigate } = useNav();
  const { actor } = useActor();
  const { clear } = useInternetIdentity();
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!actor) return;
    setLoading(true);
    void Promise.all([
      actor.adminGetPlatformStats(),
      actor.adminListAllWorkers(),
      actor.adminListAllBookings(),
    ])
      .then(([s, w, b]) => {
        setStats(s);
        setWorkers(w);
        setBookings(b);
      })
      .catch((e) => toast.error(`Admin data load nahi hua: ${String(e)}`))
      .finally(() => setLoading(false));
  }, [actor]);

  return (
    <div className="min-h-screen">
      <div className="bg-primary px-4 pt-10 pb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-primary-foreground/80 text-sm">Admin Panel</p>
            <h1 className="font-display text-2xl font-bold text-primary-foreground">
              MajdurHub Admin
            </h1>
          </div>
          <button
            type="button"
            data-ocid="admin.secondary_button"
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

      <div className="page-content">
        {loading ? (
          <div
            data-ocid="admin.loading_state"
            className="flex justify-center py-12"
          >
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {stats && (
              <div className="grid grid-cols-2 gap-3 mb-6">
                {[
                  {
                    label: "Total Workers",
                    value: String(stats.totalWorkers),
                    emoji: "👷",
                  },
                  {
                    label: "Total Bookings",
                    value: String(stats.totalBookings),
                    emoji: "📦",
                  },
                  {
                    label: "Completed",
                    value: String(stats.completedBookings),
                    emoji: "✅",
                  },
                  {
                    label: "Revenue",
                    value: `₹${Number(stats.totalRevenue).toLocaleString("en-IN")}`,
                    emoji: "💰",
                  },
                ].map((s, i) => (
                  <motion.div
                    key={s.label}
                    data-ocid="admin.card"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="bg-card border border-border rounded-2xl p-4 shadow-card"
                  >
                    <div className="text-2xl mb-1">{s.emoji}</div>
                    <div className="font-display font-bold text-xl">
                      {s.value}
                    </div>
                    <div className="text-muted-foreground text-xs">
                      {s.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            <Tabs defaultValue="workers">
              <TabsList data-ocid="admin.tab" className="w-full mb-4">
                <TabsTrigger
                  data-ocid="admin.tab"
                  value="workers"
                  className="flex-1"
                >
                  Workers ({workers.length})
                </TabsTrigger>
                <TabsTrigger
                  data-ocid="admin.tab"
                  value="bookings"
                  className="flex-1"
                >
                  Bookings ({bookings.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="workers">
                {workers.length === 0 ? (
                  <div
                    data-ocid="admin.empty_state"
                    className="text-center py-8 text-muted-foreground"
                  >
                    Koi worker nahi
                  </div>
                ) : (
                  <div className="space-y-2">
                    {workers.map((w, i) => (
                      <motion.div
                        key={String(w.id)}
                        data-ocid={`admin.item.${i + 1}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.04 }}
                        className="bg-card border border-border rounded-2xl p-4 shadow-card"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-display font-bold">{w.name}</p>
                            <p className="text-muted-foreground text-xs">
                              {w.workType} · {w.city} · {String(w.experience)}yr
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-primary text-sm">
                              ₹{String(w.rateAmount)}
                            </p>
                            <p className="text-muted-foreground text-xs">
                              {w.rateType}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="bookings">
                {bookings.length === 0 ? (
                  <div
                    data-ocid="admin.empty_state"
                    className="text-center py-8 text-muted-foreground"
                  >
                    Koi booking nahi
                  </div>
                ) : (
                  <div className="space-y-2">
                    {bookings.map((b, i) => (
                      <motion.div
                        key={String(b.id)}
                        data-ocid={`admin.item.${i + 1}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.04 }}
                        className="bg-card border border-border rounded-2xl p-4 shadow-card"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-display font-bold">
                              Booking #{String(b.id)}
                            </p>
                            <p className="text-muted-foreground text-xs">
                              Worker {String(b.workerId)} · {b.paymentMethod}
                            </p>
                          </div>
                          <div className="text-right">
                            <StatusBadge status={b.status} />
                            <p className="font-bold text-primary text-sm mt-1">
                              ₹{Number(b.totalPrice).toLocaleString("en-IN")}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </div>
  );
}
