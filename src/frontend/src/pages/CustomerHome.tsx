import { Bell, LogOut } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { useNav } from "../App";
import type { UserProfile } from "../backend";
import BottomNav from "../components/BottomNav";
import CategoryCard from "../components/CategoryCard";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { WORK_CATEGORIES } from "../types/app";

export default function CustomerHome() {
  const { navigate } = useNav();
  const { actor } = useActor();
  const { clear } = useInternetIdentity();
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (!actor) return;
    void actor
      .getCallerUserProfile()
      .then(setProfile)
      .catch(() => {});
  }, [actor]);

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary px-4 pt-10 pb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-primary-foreground/80 text-sm">Namaste 🙏</p>
            <h1 className="font-display text-2xl font-bold text-primary-foreground">
              {profile?.name ?? "Customer"}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              data-ocid="home.secondary_button"
              className="bg-white/20 p-2 rounded-full"
            >
              <Bell className="h-5 w-5 text-white" />
            </button>
            <button
              type="button"
              data-ocid="home.secondary_button"
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

        <button
          type="button"
          className="mt-4 w-full bg-white/20 backdrop-blur rounded-xl px-4 py-3 text-primary-foreground/80 text-sm text-left cursor-pointer"
          onClick={() => navigate("job-post")}
          data-ocid="home.search_input"
        >
          🔍 Kaunsa kaam chahiye aapko?
        </button>
      </div>

      <div className="page-content">
        <div className="grid grid-cols-2 gap-3 mb-6">
          <motion.button
            type="button"
            data-ocid="home.primary_button"
            onClick={() => navigate("job-post")}
            className="bg-primary text-primary-foreground rounded-2xl p-4 text-left shadow-glow"
            whileTap={{ scale: 0.97 }}
          >
            <div className="text-2xl mb-1">📋</div>
            <div className="font-display font-bold text-sm">
              Job Post Karein
            </div>
            <div className="text-primary-foreground/80 text-xs">
              Kaam ka order dein
            </div>
          </motion.button>
          <motion.button
            type="button"
            data-ocid="home.secondary_button"
            onClick={() => navigate("my-bookings")}
            className="bg-card border border-border rounded-2xl p-4 text-left shadow-card"
            whileTap={{ scale: 0.97 }}
          >
            <div className="text-2xl mb-1">📦</div>
            <div className="font-display font-bold text-sm">Meri Bookings</div>
            <div className="text-muted-foreground text-xs">Status dekho</div>
          </motion.button>
        </div>

        <div className="mb-4">
          <h2 className="font-display text-lg font-bold mb-3">
            Work Categories
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {WORK_CATEGORIES.map((cat, i) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <CategoryCard
                  category={cat}
                  onClick={() => navigate("worker-list", { workType: cat.id })}
                />
              </motion.div>
            ))}
          </div>
        </div>

        <div className="bg-accent/30 rounded-2xl p-4 mt-2">
          <h3 className="font-display font-bold text-sm mb-3">
            Kaise kaam karta hai?
          </h3>
          <div className="space-y-2">
            {[
              { icon: "1️⃣", text: "Category choose karein" },
              { icon: "2️⃣", text: "Worker dekho & profile check karein" },
              { icon: "3️⃣", text: "Book karein & kaam shuru karein" },
            ].map((step) => (
              <div key={step.text} className="flex items-center gap-2 text-sm">
                <span>{step.icon}</span>
                <span className="text-foreground/80">{step.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <BottomNav active="home" userRole="customer" />
    </div>
  );
}
