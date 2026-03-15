import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft, Loader2, Star } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useNav } from "../App";
import type { Booking } from "../backend";
import { useActor } from "../hooks/useActor";

export default function RatingScreen() {
  const { navigate, params } = useNav();
  const { actor } = useActor();
  const booking = params.booking as Booking;
  const [stars, setStars] = useState(0);
  const [review, setReview] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (stars === 0) {
      toast.error("Rating dein (1-5 stars)");
      return;
    }
    if (!actor || !booking) {
      toast.error("Actor not ready");
      return;
    }
    setSubmitting(true);
    try {
      await actor.addRating(booking.id, BigInt(stars), review);
      toast.success("Rating dene ke liye shukriya! ⭐");
      navigate("my-bookings");
    } catch (e) {
      toast.error(`Rating save nahi hui: ${String(e)}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="bg-primary px-4 pt-10 pb-5 flex items-center gap-3">
        <button
          type="button"
          data-ocid="rating.secondary_button"
          onClick={() => navigate("my-bookings")}
          className="bg-white/20 p-2 rounded-full"
        >
          <ChevronLeft className="h-5 w-5 text-white" />
        </button>
        <div>
          <h1 className="font-display text-xl font-bold text-primary-foreground">
            Worker ko Rate Karein
          </h1>
          <p className="text-primary-foreground/80 text-xs">
            Booking #{booking ? String(booking.id) : ""}
          </p>
        </div>
      </div>

      <div className="page-content">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="bg-card border border-border rounded-2xl p-6 shadow-card text-center">
            <p className="font-display font-bold text-lg mb-4">
              Kitne stars denge?
            </p>
            <div className="flex justify-center gap-3">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  type="button"
                  key={s}
                  data-ocid={`rating.toggle.${s}`}
                  onClick={() => setStars(s)}
                  className="transition-transform hover:scale-110 active:scale-95"
                >
                  <Star
                    className={`h-10 w-10 transition-colors ${
                      s <= stars
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-muted-foreground/30"
                    }`}
                  />
                </button>
              ))}
            </div>
            {stars > 0 && (
              <p className="mt-3 font-medium text-sm text-muted-foreground">
                {
                  [
                    "😤 Bilkul achha nahi",
                    "😕 Theek nahi tha",
                    "😐 Average tha",
                    "😊 Achha tha!",
                    "🤩 Bahut achha!",
                  ][stars - 1]
                }
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="font-semibold">Review likhein (optional)</Label>
            <Textarea
              data-ocid="rating.textarea"
              placeholder="Worker ke kaam ke baare mein kuch batayein..."
              value={review}
              onChange={(e) => setReview(e.target.value)}
              className="rounded-xl"
              rows={4}
            />
          </div>

          <Button
            data-ocid="rating.submit_button"
            onClick={handleSubmit}
            disabled={submitting || stars === 0}
            className="w-full h-14 text-base font-bold rounded-2xl"
          >
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submit ho rahi
                hai...
              </>
            ) : (
              "⭐ Rating Submit Karein"
            )}
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
