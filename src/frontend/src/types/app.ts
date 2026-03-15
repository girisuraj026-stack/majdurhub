export type Screen =
  | "splash"
  | "auth"
  | "customer-home"
  | "worker-list"
  | "worker-profile"
  | "job-post"
  | "booking"
  | "my-bookings"
  | "rating"
  | "worker-dashboard"
  | "worker-register"
  | "admin-panel";

export interface NavState {
  screen: Screen;
  params?: Record<string, unknown>;
}

export const WORK_CATEGORIES = [
  { id: "Tile Fitting", emoji: "🪟", label: "Tile Fitting" },
  { id: "Tile Cutting", emoji: "✂️", label: "Tile Cutting" },
  { id: "Marble Fitting", emoji: "🔷", label: "Marble Fitting" },
  { id: "Marble Cutting", emoji: "🔪", label: "Marble Cutting" },
  { id: "Marble Polishing", emoji: "✨", label: "Marble Polishing" },
  { id: "Granite Fitting", emoji: "🪨", label: "Granite Fitting" },
  { id: "Granite Cutting", emoji: "⚒️", label: "Granite Cutting" },
  { id: "Granite Polishing", emoji: "💎", label: "Granite Polishing" },
  { id: "Labour", emoji: "👷", label: "Labour" },
];
