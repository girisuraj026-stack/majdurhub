import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { useNav } from "../App";

export default function SplashScreen() {
  const { navigate } = useNav();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-br from-[oklch(0.62_0.19_42)] via-[oklch(0.7_0.16_55)] to-[oklch(0.55_0.2_30)]">
      {/* Background texture */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-white/20 blur-2xl" />
        <div className="absolute bottom-20 right-10 w-48 h-48 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-white/5 blur-3xl" />
      </div>

      <motion.div
        className="text-center px-8 z-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Logo */}
        <motion.div
          className="text-7xl mb-4"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          👷
        </motion.div>

        <motion.h1
          className="font-display text-5xl font-bold text-white mb-2 tracking-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          MajdurHub
        </motion.h1>

        <motion.p
          className="text-white/90 font-body text-xl font-medium mb-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Har Kaam Ka Worker
        </motion.p>

        <motion.p
          className="text-white/70 font-body text-sm mb-12 max-w-xs mx-auto leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Tile, Marble, Granite experts aur Labour workers ko aasaani se book
          karein apne ghar ke liye
        </motion.p>

        <motion.div
          className="space-y-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Button
            data-ocid="splash.primary_button"
            onClick={() => navigate("auth")}
            className="w-full bg-white text-primary hover:bg-white/90 font-display font-bold text-lg h-14 rounded-2xl shadow-glow"
          >
            शुरू करें – Get Started
          </Button>
        </motion.div>

        {/* Feature badges */}
        <motion.div
          className="flex flex-wrap justify-center gap-2 mt-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          {["Tile", "Marble", "Granite", "Labour"].map((cat) => (
            <span
              key={cat}
              className="bg-white/20 text-white text-xs font-medium px-3 py-1.5 rounded-full backdrop-blur-sm"
            >
              {cat}
            </span>
          ))}
        </motion.div>
      </motion.div>

      {/* Footer */}
      <motion.p
        className="absolute bottom-6 text-white/50 text-xs"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        © {new Date().getFullYear()}. Built with ❤️ using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noreferrer"
          className="underline underline-offset-2"
        >
          caffeine.ai
        </a>
      </motion.p>
    </div>
  );
}
