import { Button } from "@/components/ui/button";
import { ChevronLeft, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { useNav } from "../App";
import type { Booking } from "../backend";
import { Status } from "../backend";
import BottomNav from "../components/BottomNav";
import StatusBadge from "../components/StatusBadge";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export default function MyBookings() {
  const { navigate } = useNav();
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = useCallback(async () => {
    if (!actor || !identity) return;
    setLoading(true);
    try {
      const principal = identity.getPrincipal();
      const list = await actor.listBookingsByCustomer(principal);
      setBookings(list);
    } catch (e) {
      toast.error(`Bookings load nahi hui: ${String(e)}`);
    } finally {
      setLoading(false);
    }
  }, [actor, identity]);

  useEffect(() => {
    void fetchBookings();
  }, [fetchBookings]);

  return (
    <div className="min-h-screen">
      <div className="bg-primary px-4 pt-10 pb-5 flex items-center gap-3">
        <button
          type="button"
          data-ocid="bookings.secondary_button"
          onClick={() => navigate("customer-home")}
          className="bg-white/20 p-2 rounded-full"
        >
          <ChevronLeft className="h-5 w-5 text-white" />
        </button>
        <div>
          <h1 className="font-display text-xl font-bold text-primary-foreground">
            Meri Bookings
          </h1>
          <p className="text-primary-foreground/80 text-xs">
            Aapke saare orders
          </p>
        </div>
      </div>

      <div className="page-content">
        {loading ? (
          <div
            data-ocid="bookings.loading_state"
            className="flex justify-center py-12"
          >
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : bookings.length === 0 ? (
          <div data-ocid="bookings.empty_state" className="text-center py-12">
            <div className="text-5xl mb-3">📦</div>
            <p className="font-display font-bold text-lg">Koi booking nahi</p>
            <p className="text-muted-foreground text-sm mt-1 mb-4">
              Pehle koi job post karein
            </p>
            <Button
              data-ocid="bookings.primary_button"
              onClick={() => navigate("job-post")}
              className="rounded-xl"
            >
              Job Post Karein
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {bookings.map((booking, i) => (
              <motion.div
                key={String(booking.id)}
                data-ocid={`bookings.item.${i + 1}`}
                initial={{ opacity: 0, y: 12 }}
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
                      Worker ID: {String(booking.workerId)}
                    </p>
                  </div>
                  <StatusBadge status={booking.status} />
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div>
                    <span className="text-muted-foreground">Total: </span>
                    <span className="font-bold text-primary">
                      ₹{Number(booking.totalPrice).toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="text-muted-foreground capitalize">
                    {booking.paymentMethod}
                  </div>
                </div>

                {booking.status === Status.completed && (
                  <Button
                    data-ocid={`bookings.secondary_button.${i + 1}`}
                    variant="outline"
                    size="sm"
                    className="mt-3 w-full rounded-xl border-primary text-primary"
                    onClick={() => navigate("rating", { booking })}
                  >
                    ⭐ Rate Worker
                  </Button>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <BottomNav active="bookings" userRole="customer" />
    </div>
  );
}
