import type { Status } from "../backend";

interface Props {
  status: Status;
}

const labels: Record<string, string> = {
  pending: "Pending",
  accepted: "Accepted",
  inProgress: "In Progress",
  completed: "Completed",
};

export default function StatusBadge({ status }: Props) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold status-${status}`}
    >
      {labels[status] ?? status}
    </span>
  );
}
