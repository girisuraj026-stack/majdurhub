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
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useNav } from "../App";
import { useActor } from "../hooks/useActor";
import { WORK_CATEGORIES } from "../types/app";

export default function JobPostScreen() {
  const { navigate, params } = useNav();
  const { actor } = useActor();
  const [workType, setWorkType] = useState((params.workType as string) || "");
  const [area, setArea] = useState("");
  const [address, setAddress] = useState("");
  const [startDate, setStartDate] = useState("");
  const [description, setDescription] = useState("");
  const [priceEstimate, setPriceEstimate] = useState<bigint | null>(null);
  const [loadingPrice, setLoadingPrice] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!actor || !workType || !area || Number.isNaN(Number(area))) {
      setPriceEstimate(null);
      return;
    }
    const timeout = setTimeout(() => {
      setLoadingPrice(true);
      void actor
        .calculatePrice(workType, BigInt(area))
        .then(setPriceEstimate)
        .catch(() => setPriceEstimate(null))
        .finally(() => setLoadingPrice(false));
    }, 500);
    return () => clearTimeout(timeout);
  }, [actor, workType, area]);

  const handleSubmit = async () => {
    if (!workType || !area || !address || !startDate) {
      toast.error("Sabhi fields bharo");
      return;
    }
    if (!actor) {
      toast.error("Actor not ready");
      return;
    }
    setSubmitting(true);
    try {
      const jobId = await actor.createJob(
        workType,
        BigInt(area),
        address,
        startDate,
        description,
      );
      toast.success("Job post ho gayi!");
      navigate("booking", { jobId, workType, area, address, priceEstimate });
    } catch (e) {
      toast.error(`Job post nahi hui: ${String(e)}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="bg-primary px-4 pt-10 pb-5 flex items-center gap-3">
        <button
          type="button"
          data-ocid="jobpost.secondary_button"
          onClick={() => navigate("customer-home")}
          className="bg-white/20 p-2 rounded-full"
        >
          <ChevronLeft className="h-5 w-5 text-white" />
        </button>
        <div>
          <h1 className="font-display text-xl font-bold text-primary-foreground">
            Job Post Karein
          </h1>
          <p className="text-primary-foreground/80 text-xs">
            Kaam ki jaankari bharein
          </p>
        </div>
      </div>

      <div className="page-content space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label className="font-semibold">Kaam ka type *</Label>
            <Select value={workType} onValueChange={setWorkType}>
              <SelectTrigger
                data-ocid="jobpost.select"
                className="h-12 rounded-xl"
              >
                <SelectValue placeholder="Category choose karein" />
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
            <Label className="font-semibold">Area (sq ft) *</Label>
            <Input
              data-ocid="jobpost.input"
              type="number"
              placeholder="Jaise: 500"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              className="h-12 rounded-xl"
            />
          </div>

          {(priceEstimate !== null || loadingPrice) && (
            <div className="bg-primary/10 border border-primary/20 rounded-2xl p-4">
              <p className="text-xs text-muted-foreground mb-1">
                Estimated Price
              </p>
              {loadingPrice ? (
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
              ) : (
                <p className="font-display text-2xl font-bold text-primary">
                  ₹{Number(priceEstimate).toLocaleString("en-IN")}
                </p>
              )}
              {area && workType && !loadingPrice && (
                <p className="text-xs text-muted-foreground mt-1">
                  {workType} × {area} sq ft
                </p>
              )}
            </div>
          )}

          <div className="space-y-2">
            <Label className="font-semibold">Pata (Address) *</Label>
            <Textarea
              data-ocid="jobpost.textarea"
              placeholder="Ghar ka pura address likhein"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="rounded-xl"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label className="font-semibold">Kaam shuru kab? *</Label>
            <Input
              data-ocid="jobpost.input"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="h-12 rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label className="font-semibold">Description (optional)</Label>
            <Textarea
              data-ocid="jobpost.textarea"
              placeholder="Kaam ke baare mein aur kuch batana ho toh..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="rounded-xl"
              rows={3}
            />
          </div>

          <Button
            data-ocid="jobpost.submit_button"
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full h-14 text-base font-bold rounded-2xl"
          >
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Post ho rahi
                hai...
              </>
            ) : (
              "Job Post Karein →"
            )}
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
