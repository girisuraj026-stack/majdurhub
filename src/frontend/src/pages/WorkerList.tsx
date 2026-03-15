import type { Principal } from "@icp-sdk/core/principal";
import { ChevronLeft, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useNav } from "../App";
import type { Worker } from "../backend";
import { RateType } from "../backend";
import WorkerCard from "../components/WorkerCard";
import { useActor } from "../hooks/useActor";

const DEMO_WORKERS: Worker[] = [
  {
    id: 1n,
    name: "Ramesh Patel",
    mobile: "9876543210",
    city: "Ahmedabad",
    experience: 8n,
    workType: "Tile Fitting",
    rateType: RateType.sqft,
    rateAmount: 25n,
    owner: "demo" as unknown as Principal,
  },
  {
    id: 2n,
    name: "Suresh Kumar",
    mobile: "9865432109",
    city: "Surat",
    experience: 5n,
    workType: "Tile Fitting",
    rateType: RateType.sqft,
    rateAmount: 22n,
    owner: "demo" as unknown as Principal,
  },
  {
    id: 3n,
    name: "Mahesh Verma",
    mobile: "9754321098",
    city: "Vadodara",
    experience: 12n,
    workType: "Tile Fitting",
    rateType: RateType.sqft,
    rateAmount: 30n,
    owner: "demo" as unknown as Principal,
  },
];

export default function WorkerList() {
  const { navigate, params } = useNav();
  const { actor } = useActor();
  const workType = (params.workType as string) || "Tile Fitting";
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!actor) return;
    setLoading(true);
    void actor
      .listWorkersByType(workType)
      .then((list) => {
        setWorkers(
          list.length > 0
            ? list
            : DEMO_WORKERS.map((w) => ({ ...w, workType })),
        );
      })
      .catch(() => {
        toast.error("Workers load nahi hue");
        setWorkers(DEMO_WORKERS.map((w) => ({ ...w, workType })));
      })
      .finally(() => setLoading(false));
  }, [actor, workType]);

  return (
    <div className="min-h-screen">
      <div className="bg-primary px-4 pt-10 pb-5 flex items-center gap-3">
        <button
          type="button"
          data-ocid="workers.secondary_button"
          onClick={() => navigate("customer-home")}
          className="bg-white/20 p-2 rounded-full"
        >
          <ChevronLeft className="h-5 w-5 text-white" />
        </button>
        <div>
          <h1 className="font-display text-xl font-bold text-primary-foreground">
            {workType}
          </h1>
          <p className="text-primary-foreground/80 text-xs">
            Available workers
          </p>
        </div>
      </div>

      <div className="page-content">
        {loading ? (
          <div
            data-ocid="workers.loading_state"
            className="flex justify-center py-12"
          >
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : workers.length === 0 ? (
          <div data-ocid="workers.empty_state" className="text-center py-12">
            <div className="text-5xl mb-3">😔</div>
            <p className="font-display font-bold">Koi worker nahi mila</p>
            <p className="text-muted-foreground text-sm mt-1">
              Baad mein dobara try karein
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {workers.map((worker, i) => (
              <motion.div
                key={String(worker.id)}
                data-ocid={`workers.item.${i + 1}`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
              >
                <WorkerCard
                  worker={worker}
                  onClick={() => navigate("worker-profile", { worker })}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
