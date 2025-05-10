import { Icons } from "@/components/shared/icons";

type ReferralStatus = "requested" | "sent" | "opened" | "replied" | "referred";

interface StatusIndicatorProps {
  status: ReferralStatus;
  className?: string;
}

export function StatusIndicator({ status, className = "" }: StatusIndicatorProps) {
  const getStatusDetails = (status: ReferralStatus) => {
    switch (status) {
      case "requested":
        return {
          icon: Icons.requested,
          label: "Requested",
          color: "text-amber-500"
        };
      case "sent":
        return {
          icon: Icons.sent,
          label: "Sent",
          color: "text-gray-700"
        };
      case "opened":
        return {
          icon: Icons.opened,
          label: "Opened",
          color: "text-blue-500"
        };
      case "replied":
        return {
          icon: Icons.replied,
          label: "Replied",
          color: "text-green-500"
        };
      case "referred":
        return {
          icon: Icons.referred,
          label: "Referred",
          color: "text-green-600"
        };
      default:
        return {
          icon: Icons.sent,
          label: "Sent",
          color: "text-gray-700"
        };
    }
  };

  const { icon: Icon, label, color } = getStatusDetails(status);

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Icon className="h-5 w-5" />
      <span className={`font-medium ${color}`}>{label}</span>
    </div>
  );
} 