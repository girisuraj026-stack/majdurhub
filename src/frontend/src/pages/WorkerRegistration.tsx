import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useNav } from "../App";
import { RateType } from "../backend";
import { useActor } from "../hooks/useActor";
import { WORK_CATEGORIES } from "../types/app";

export default function WorkerRegistration() {
  const { navigate } = useNav();
  const { actor } = useActor();
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [city, setCity] = useState("");
  const [experience, setExperience] = useState("");
  const [workType, setWorkType] = useState("");
  const [rateType, setRateType] = useState<RateType>(RateType.sqft);
  const [rateAmount, setRateAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!name || !mobile || !city || !experience || !workType || !rateAmount) {
      toast.error("Sabhi fields bharo");
      return;
    }
    if (!actor) {
      toast.error("Actor not ready");
      return;
    }
    setSubmitting(true);
    try {
      await actor.registerWorker(
        name,
        mobile,
        city,
        BigInt(experience),
        workType,
        rateType,
        BigInt(rateAmount),
      );
      toast.success("Worker registration ho gayi! 🎉");
      navigate("worker-dashboard");
    } catch (e) {
      toast.error(`Registration nahi hui: ${String(e)}`);
    } finally {
      setSubmitting(false);
    }
  };

  const rateTypeOptions = [
    { value: RateType.sqft, label: "₹ / sq ft" },
    { value: RateType.runningft, label: "₹ / running ft" },
    { value: RateType.perday, label: "₹ / per day" },
  ];

  return (
    <div className="min-h-screen">
      <div className="bg-primary px-4 pt-10 pb-5 flex items-center gap-3">
        <button
          type="button"
          data-ocid="workerreg.secondary_button"
          onClick={() => navigate("customer-home")}
          className="bg-white/20 p-2 rounded-full"
        >
          <ChevronLeft className="h-5 w-5 text-white" />
        </button>
        <div>
          <h1 className="font-display text-xl font-bold text-primary-foreground">
            Worker Registration
          </h1>
          <p className="text-primary-foreground/80 text-xs">
            Apna profile banaein
          </p>
        </div>
      </div>

      <div className="page-content">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label className="font-semibold">Naam *</Label>
            <Input
              data-ocid="workerreg.input"
              placeholder="Aapka poora naam"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-12 rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label className="font-semibold">Mobile Number *</Label>
            <Input
              data-ocid="workerreg.input"
              type="tel"
              placeholder="10-digit number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              className="h-12 rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label className="font-semibold">City *</Label>
            <Input
              data-ocid="workerreg.input"
              placeholder="Jaise: Ahmedabad"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="h-12 rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label className="font-semibold">Experience (years) *</Label>
            <Input
              data-ocid="workerreg.input"
              type="number"
              placeholder="Jaise: 5"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className="h-12 rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label className="font-semibold">Work Type *</Label>
            <Select value={workType} onValueChange={setWorkType}>
              <SelectTrigger
                data-ocid="workerreg.select"
                className="h-12 rounded-xl"
              >
                <SelectValue placeholder="Kaam choose karein" />
              </SelectTrigger>
              <SelectContent>
                {WORK_CATEGORIES.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.emoji} {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="font-semibold">Rate Type *</Label>
            <Select
              value={rateType}
              onValueChange={(v) => setRateType(v as RateType)}
            >
              <SelectTrigger
                data-ocid="workerreg.select"
                className="h-12 rounded-xl"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {rateTypeOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="font-semibold">Rate Amount (₹) *</Label>
            <Input
              data-ocid="workerreg.input"
              type="number"
              placeholder="Jaise: 25"
              value={rateAmount}
              onChange={(e) => setRateAmount(e.target.value)}
              className="h-12 rounded-xl"
            />
          </div>

          <div className="bg-accent/30 rounded-2xl p-3 text-sm">
            <p className="font-semibold mb-1">💡 Rate Example:</p>
            <p className="text-muted-foreground">
              Tile Fitting × ₹25/sq ft × 500 sq ft = <strong>₹12,500</strong>
            </p>
          </div>

          <Button
            data-ocid="workerreg.submit_button"
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full h-14 text-base font-bold rounded-2xl"
          >
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Register ho
                raha hai...
              </>
            ) : (
              "Register Karein →"
            )}
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
