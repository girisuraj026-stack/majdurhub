import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import type { Principal } from "@icp-sdk/core/principal";
import { ChevronLeft, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useNav } from "../App";
import type { Worker } from "../backend";
import { PaymentMethod, RateType } from "../backend";
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
];

export default function BookingScreen() {
  const { navigate, params } = useNav();
  const { actor } = useActor();
  const jobId = params.jobId as bigint | undefined;
  const workType = (params.workType as string) || "Tile Fitting";
  const area = params.area as string | undefined;
  const priceEstimate = params.priceEstimate as bigint | null | undefined;

  const [workers, setWorkers] = useState<Worker[]>([]);
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);
  const [payment, setPayment] = useState<PaymentMethod>(PaymentMethod.cash);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!actor) return;
    setLoading(true);
    void actor
      .listWorkersByType(workType)
      .then((list) =>
        setWorkers(
          list.length > 0
            ? list
            : DEMO_WORKERS.map((w) => ({ ...w, workType })),
        ),
      )
      .catch(() => setWorkers(DEMO_WORKERS.map((w) => ({ ...w, workType }))))
      .finally(() => setLoading(false));
  }, [actor, workType]);

  const handleConfirm = async () => {
    if (!selectedWorker) {
      toast.error("Worker select karein");
      return;
    }
    if (!jobId || !actor) {
      toast.error("Job ID nahi mila");
      return;
    }
    setSubmitting(true);
    try {
      await actor.createBooking(jobId, selectedWorker.id, payment);
      toast.success("Booking ho gayi! 🎉");
      navigate("my-bookings");
    } catch (e) {
      toast.error(`Booking nahi hui: ${String(e)}`);
    } finally {
      setSubmitting(false);
    }
  };

  const paymentOptions = [
    { value: PaymentMethod.cash, label: "💵 Cash", desc: "Kaam ke baad dein" },
    { value: PaymentMethod.upi, label: "📱 UPI", desc: "Online payment" },
    { value: PaymentMethod.wallet, label: "👛 Wallet", desc: "App wallet" },
  ];

  return (
    <div className="min-h-screen">
      <div className="bg-primary px-4 pt-10 pb-5 flex items-center gap-3">
        <button
          type="button"
          data-ocid="booking.secondary_button"
          onClick={() => navigate("customer-home")}
          className="bg-white/20 p-2 rounded-full"
        >
          <ChevronLeft className="h-5 w-5 text-white" />
        </button>
        <div>
          <h1 className="font-display text-xl font-bold text-primary-foreground">
            Booking Confirm Karein
          </h1>
          <p className="text-primary-foreground/80 text-xs">{workType}</p>
        </div>
      </div>

      <div className="page-content space-y-5">
        <div className="bg-card border border-border rounded-2xl p-4 shadow-card">
          <h3 className="font-display font-bold text-sm mb-2">Job Summary</h3>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Work Type</span>
              <span className="font-medium">{workType}</span>
            </div>
            {area && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Area</span>
                <span className="font-medium">{area} sq ft</span>
              </div>
            )}
            {priceEstimate !== null && priceEstimate !== undefined && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Estimated Price</span>
                <span className="font-bold text-primary">
                  ₹{Number(priceEstimate).toLocaleString("en-IN")}
                </span>
              </div>
            )}
          </div>
        </div>

        <div>
          <Label className="font-display font-bold text-base block mb-3">
            Worker Select Karein
          </Label>
          {loading ? (
            <div
              data-ocid="booking.loading_state"
              className="flex justify-center py-8"
            >
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : (
            <div className="space-y-2">
              {workers.map((worker, i) => (
                <motion.div
                  key={String(worker.id)}
                  data-ocid={`booking.item.${i + 1}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => setSelectedWorker(worker)}
                  className={`cursor-pointer rounded-2xl transition-all ${
                    selectedWorker?.id === worker.id
                      ? "ring-2 ring-primary"
                      : ""
                  }`}
                >
                  <WorkerCard worker={worker} />
                </motion.div>
              ))}
            </div>
          )}
        </div>

        <div>
          <Label className="font-display font-bold text-base block mb-3">
            Payment Method
          </Label>
          <div className="grid grid-cols-3 gap-2">
            {paymentOptions.map((opt) => (
              <button
                type="button"
                key={opt.value}
                data-ocid="booking.radio"
                onClick={() => setPayment(opt.value)}
                className={`p-3 rounded-2xl border-2 text-center transition-all ${
                  payment === opt.value
                    ? "border-primary bg-primary/5"
                    : "border-border bg-card"
                }`}
              >
                <div className="text-xl mb-1">{opt.label.split(" ")[0]}</div>
                <div className="font-bold text-xs">
                  {opt.label.split(" ")[1]}
                </div>
                <div className="text-muted-foreground text-xs mt-0.5">
                  {opt.desc}
                </div>
              </button>
            ))}
          </div>
        </div>

        <Button
          data-ocid="booking.confirm_button"
          onClick={handleConfirm}
          disabled={submitting || !selectedWorker}
          className="w-full h-14 text-base font-bold rounded-2xl"
        >
          {submitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Booking ho rahi
              hai...
            </>
          ) : (
            "✅ Booking Confirm Karein"
          )}
        </Button>
      </div>
    </div>
  );
}
