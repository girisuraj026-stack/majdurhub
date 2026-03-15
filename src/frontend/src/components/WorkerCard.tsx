import { Clock, MapPin, Star } from "lucide-react";
import { useEffect, useState } from "react";
import type { Worker } from "../backend";
import { RateType } from "../backend";
import { useActor } from "../hooks/useActor";

interface Props {
  worker: Worker;
  onClick?: () => void;
}

function rateLabel(rt: RateType) {
  if (rt === RateType.sqft) return "/sq ft";
  if (rt === RateType.runningft) return "/rft";
  return "/day";
}

export default function WorkerCard({ worker, onClick }: Props) {
  const { actor } = useActor();
  const [avgRating, setAvgRating] = useState<number | null>(null);

  useEffect(() => {
    if (!actor) return;
    void actor
      .getWorkerAverageRating(worker.id)
      .then(setAvgRating)
      .catch(() => {});
  }, [actor, worker.id]);

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full bg-card border border-border rounded-2xl p-4 shadow-card text-left hover:border-primary/40 transition-colors"
    >
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
          👷
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-display font-bold truncate">{worker.name}</p>
          <div className="flex items-center gap-3 mt-0.5">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              {worker.city}
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {String(worker.experience)}yr
            </div>
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <div className="flex items-center gap-1 justify-end">
            <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-bold">
              {avgRating !== null ? avgRating.toFixed(1) : "New"}
            </span>
          </div>
          <p className="text-primary font-bold text-sm mt-0.5">
            ₹{String(worker.rateAmount)}
            {rateLabel(worker.rateType)}
          </p>
        </div>
      </div>
    </button>
  );
}
