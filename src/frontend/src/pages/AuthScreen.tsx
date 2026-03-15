import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronLeft, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useNav } from "../App";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

type Step = "login" | "profile";

export default function AuthScreen() {
  const { navigate } = useNav();
  const { login, identity, isLoggingIn, isLoginSuccess, clear } =
    useInternetIdentity();
  const { actor } = useActor();
  const [step, setStep] = useState<Step>("login");
  const [name, setName] = useState("");
  const [role, setRole] = useState<"customer" | "worker">("customer");
  const [saving, setSaving] = useState(false);

  const handleLogin = () => {
    login();
  };

  if ((isLoginSuccess || identity) && step === "login") {
    void (async () => {
      if (!actor) return;
      try {
        const profile = await actor.getCallerUserProfile();
        if (profile?.name) {
          const isAdmin = await actor.isCallerAdmin();
          if (isAdmin) {
            navigate("admin-panel");
          } else if (profile.role === "worker") {
            navigate("worker-dashboard");
          } else {
            navigate("customer-home");
          }
          return;
        }
      } catch (_e) {
        // ignore
      }
    })();
    if (step === "login") setStep("profile");
  }

  const handleSaveProfile = async () => {
    if (!name.trim()) {
      toast.error("Kripya apna naam likhein");
      return;
    }
    if (!actor) {
      toast.error("Actor not ready, please wait");
      return;
    }
    setSaving(true);
    try {
      await actor.saveCallerUserProfile({ name: name.trim(), role });
      toast.success("Profile save ho gayi!");
      if (role === "worker") {
        navigate("worker-register");
      } else {
        navigate("customer-home");
      }
    } catch (e) {
      toast.error(`Profile save nahi hui: ${String(e)}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="bg-primary px-4 pt-12 pb-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="text-4xl mb-2">👷</div>
          <h1 className="font-display text-3xl font-bold text-primary-foreground">
            MajdurHub
          </h1>
          <p className="text-primary-foreground/80 text-sm mt-1">
            {step === "login"
              ? "Login karein apne account mein"
              : "Apna profile setup karein"}
          </p>
        </motion.div>
      </div>

      <div className="flex-1 px-6 py-8">
        {step === "login" ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="text-center space-y-2">
              <h2 className="font-display text-2xl font-bold">स्वागत है!</h2>
              <p className="text-muted-foreground text-sm">
                Internet Identity se secure login karein
              </p>
            </div>

            <div className="bg-accent/50 rounded-2xl p-4 space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🔒</span>
                <div>
                  <p className="font-semibold text-sm">Secure Login</p>
                  <p className="text-xs text-muted-foreground">
                    Password ki zaroorat nahi
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl">🆔</span>
                <div>
                  <p className="font-semibold text-sm">Identity Protected</p>
                  <p className="text-xs text-muted-foreground">
                    Aapka data safe rahega
                  </p>
                </div>
              </div>
            </div>

            <Button
              data-ocid="auth.primary_button"
              onClick={handleLogin}
              disabled={isLoggingIn}
              className="w-full h-14 text-base font-bold rounded-2xl"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Logging
                  in...
                </>
              ) : (
                "🔑 Login with Internet Identity"
              )}
            </Button>

            <Button
              variant="ghost"
              data-ocid="auth.cancel_button"
              onClick={() => navigate("splash")}
              className="w-full"
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> Wapas jaayein
            </Button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="text-center">
              <h2 className="font-display text-2xl font-bold">Profile Setup</h2>
              <p className="text-muted-foreground text-sm mt-1">
                Aap kaun hain batayein
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name" className="font-semibold">
                Aapka Naam *
              </Label>
              <Input
                id="name"
                data-ocid="auth.input"
                placeholder="Jaise: Ramesh Kumar"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-12 rounded-xl"
              />
            </div>

            <div className="space-y-3">
              <Label className="font-semibold">Aap kya hain?</Label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  data-ocid="auth.radio"
                  onClick={() => setRole("customer")}
                  className={`p-4 rounded-2xl border-2 text-center transition-all ${
                    role === "customer"
                      ? "border-primary bg-primary/5"
                      : "border-border bg-card hover:border-primary/50"
                  }`}
                >
                  <div className="text-3xl mb-1">🏠</div>
                  <div className="font-display font-bold text-sm">Customer</div>
                  <div className="text-xs text-muted-foreground">
                    Worker book karein
                  </div>
                </button>
                <button
                  type="button"
                  data-ocid="auth.radio"
                  onClick={() => setRole("worker")}
                  className={`p-4 rounded-2xl border-2 text-center transition-all ${
                    role === "worker"
                      ? "border-primary bg-primary/5"
                      : "border-border bg-card hover:border-primary/50"
                  }`}
                >
                  <div className="text-3xl mb-1">👷</div>
                  <div className="font-display font-bold text-sm">Worker</div>
                  <div className="text-xs text-muted-foreground">
                    Kaam dhundhein
                  </div>
                </button>
              </div>
            </div>

            <Button
              data-ocid="auth.submit_button"
              onClick={handleSaveProfile}
              disabled={saving}
              className="w-full h-14 text-base font-bold rounded-2xl"
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                </>
              ) : (
                "Aage badho →"
              )}
            </Button>

            <Button
              variant="ghost"
              data-ocid="auth.secondary_button"
              onClick={() => {
                clear();
                setStep("login");
              }}
              className="w-full text-sm"
            >
              Logout karein
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
