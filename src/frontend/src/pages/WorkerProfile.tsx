import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft, Clock, MapPin, Phone, Star } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { useNav } from "../App";
import type { Rating, Worker } from "../backend";
import { RateType } from "../backend";
import { useActor } from "../hooks/useActor";

const STAR_INDICES = [0, 1, 2, 3, 4];

function rateTypeLabel(rt: RateType) {
  if (rt === RateType.sqft) return "/sq ft";
  if (rt === RateType.runningft) return "/running ft";
  return "/day";
}

export default function WorkerProfile() {
  const { navigate, params } = useNav();
  const { actor } = useActor();
  const worker = params.worker as Worker;
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [avgRating, setAvgRating] = useState<number | null>(null);

  useEffect(() => {
    if (!actor || !worker) return;
    void Promise.all([
      actor.getWorkerRatings(worker.id),
      actor.getWorkerAverageRating(worker.id),
    ])
      .then(([r, avg]) => {
        setRatings(r);
        setAvgRating(avg);
      })
      .catch(() => {});
  }, [actor, worker]);

  if (!worker) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-muted-foreground">Worker not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="bg-primary px-4 pt-10 pb-8">
        <button
          type="button"
          data-ocid="profile.secondary_button"
          onClick={() => navigate("worker-list", { workType: worker.workType })}
          className="bg-white/20 p-2 rounded-full mb-4"
        >
          <ChevronLeft className="h-5 w-5 text-white" />
        </button>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-3xl">
            👷
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-primary-foreground">
              {worker.name}
            </h1>
            <p className="text-primary-foreground/80 text-sm">
              {worker.workType}
            </p>
            <div className="flex items-center gap-1 mt-1">
              <Star className="h-4 w-4 fill-yellow-300 text-yellow-300" />
              <span className="text-primary-foreground text-sm font-medium">
                {avgRating !== null ? avgRating.toFixed(1) : "New"}
              </span>
              <span className="text-primary-foreground/60 text-xs">
                ({ratings.length} reviews)
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="page-content">
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-card border border-border rounded-2xl p-3 shadow-card">
            <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
              <MapPin className="h-3 w-3" /> City
            </div>
            <p className="font-display font-bold">{worker.city}</p>
          </div>
          <div className="bg-card border border-border rounded-2xl p-3 shadow-card">
            <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
              <Clock className="h-3 w-3" /> Experience
            </div>
            <p className="font-display font-bold">
              {String(worker.experience)} years
            </p>
          </div>
          <div className="bg-card border border-border rounded-2xl p-3 shadow-card">
            <div className="text-muted-foreground text-xs mb-1">💰 Rate</div>
            <p className="font-display font-bold text-primary">
              ₹{String(worker.rateAmount)}
              {rateTypeLabel(worker.rateType)}
            </p>
          </div>
          <div className="bg-card border border-border rounded-2xl p-3 shadow-card">
            <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
              <Phone className="h-3 w-3" /> Mobile
            </div>
            <p className="font-display font-bold">{worker.mobile}</p>
          </div>
        </div>

        {ratings.length > 0 && (
          <div className="mb-4">
            <h2 className="font-display text-lg font-bold mb-3">
              Reviews ({ratings.length})
            </h2>
            <div className="space-y-3">
              {ratings.map((r, i) => (
                <motion.div
                  key={String(r.bookingId)}
                  data-ocid={`profile.item.${i + 1}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-card border border-border rounded-2xl p-4 shadow-card"
                >
                  <div className="flex items-center gap-1 mb-2">
                    {STAR_INDICES.map((idx) => (
                      <Star
                        key={`star-${idx}`}
                        className={`h-4 w-4 ${
                          idx < Number(r.stars)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-muted-foreground/30"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-foreground/80">{r.review}</p>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {ratings.length === 0 && (
          <div className="bg-muted/40 rounded-2xl p-4 text-center mb-4">
            <p className="text-muted-foreground text-sm">
              Abhi tak koi review nahi
            </p>
          </div>
        )}

        <Separator className="my-4" />
      </div>

      <div className="fixed bottom-0 left-0 right-0 max-w-[480px] mx-auto px-4 pb-8 pt-4 bg-background/90 backdrop-blur">
        <Button
          data-ocid="profile.primary_button"
          onClick={() =>
            navigate("job-post", { worker, workType: worker.workType })
          }
          className="w-full h-14 text-base font-bold rounded-2xl shadow-glow"
        >
          Book Now – अभी Book करें
        </Button>
      </div>
    </div>
  );
}
