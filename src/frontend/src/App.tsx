import { Toaster } from "@/components/ui/sonner";
import { createContext, useCallback, useContext, useState } from "react";
import AdminPanel from "./pages/AdminPanel";
import AuthScreen from "./pages/AuthScreen";
import BookingScreen from "./pages/BookingScreen";
import CustomerHome from "./pages/CustomerHome";
import JobPostScreen from "./pages/JobPostScreen";
import MyBookings from "./pages/MyBookings";
import RatingScreen from "./pages/RatingScreen";
import SplashScreen from "./pages/SplashScreen";
import WorkerDashboard from "./pages/WorkerDashboard";
import WorkerList from "./pages/WorkerList";
import WorkerProfile from "./pages/WorkerProfile";
import WorkerRegistration from "./pages/WorkerRegistration";
import type { Screen } from "./types/app";

interface NavContextType {
  navigate: (screen: Screen, params?: Record<string, unknown>) => void;
  params: Record<string, unknown>;
  currentScreen: Screen;
}

const NavContext = createContext<NavContextType>({
  navigate: () => {},
  params: {},
  currentScreen: "splash",
});

export function useNav() {
  return useContext(NavContext);
}

export default function App() {
  const [screen, setScreen] = useState<Screen>("splash");
  const [params, setParams] = useState<Record<string, unknown>>({});

  const navigate = useCallback(
    (nextScreen: Screen, nextParams?: Record<string, unknown>) => {
      setParams(nextParams ?? {});
      setScreen(nextScreen);
    },
    [],
  );

  const renderScreen = () => {
    switch (screen) {
      case "splash":
        return <SplashScreen />;
      case "auth":
        return <AuthScreen />;
      case "customer-home":
        return <CustomerHome />;
      case "worker-list":
        return <WorkerList />;
      case "worker-profile":
        return <WorkerProfile />;
      case "job-post":
        return <JobPostScreen />;
      case "booking":
        return <BookingScreen />;
      case "my-bookings":
        return <MyBookings />;
      case "rating":
        return <RatingScreen />;
      case "worker-dashboard":
        return <WorkerDashboard />;
      case "worker-register":
        return <WorkerRegistration />;
      case "admin-panel":
        return <AdminPanel />;
      default:
        return <SplashScreen />;
    }
  };

  return (
    <NavContext.Provider value={{ navigate, params, currentScreen: screen }}>
      <div className="app-container">
        {renderScreen()}
        <Toaster position="top-center" />
      </div>
    </NavContext.Provider>
  );
}
