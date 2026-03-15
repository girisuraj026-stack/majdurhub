import {
  Home,
  LayoutDashboard,
  PackageOpen,
  PlusCircle,
  User,
} from "lucide-react";
import { useNav } from "../App";
import type { Screen } from "../types/app";

interface Props {
  active: "home" | "post" | "bookings" | "profile";
  userRole: "customer" | "worker";
}

export default function BottomNav({ active, userRole }: Props) {
  const { navigate } = useNav();

  const customerItems = [
    {
      id: "home",
      label: "Home",
      icon: Home,
      screen: "customer-home" as Screen,
    },
    {
      id: "post",
      label: "Post Job",
      icon: PlusCircle,
      screen: "job-post" as Screen,
    },
    {
      id: "bookings",
      label: "Bookings",
      icon: PackageOpen,
      screen: "my-bookings" as Screen,
    },
    { id: "profile", label: "Profile", icon: User, screen: "auth" as Screen },
  ];

  const workerItems = [
    {
      id: "home",
      label: "Dashboard",
      icon: LayoutDashboard,
      screen: "worker-dashboard" as Screen,
    },
    {
      id: "profile",
      label: "Profile",
      icon: User,
      screen: "worker-register" as Screen,
    },
  ];

  const items = userRole === "customer" ? customerItems : workerItems;

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-[480px] mx-auto bg-card border-t border-border px-2 pb-safe">
      <div className="flex items-center justify-around">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;
          return (
            <button
              type="button"
              key={item.id}
              data-ocid={`nav.${item.id}.link`}
              onClick={() => navigate(item.screen)}
              className={`flex flex-col items-center gap-0.5 py-3 px-4 transition-colors ${
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className={`h-5 w-5 ${isActive ? "stroke-[2.5]" : ""}`} />
              <span
                className={`text-xs font-medium ${isActive ? "font-bold" : ""}`}
              >
                {item.label}
              </span>
              {isActive && <div className="w-1 h-1 rounded-full bg-primary" />}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
