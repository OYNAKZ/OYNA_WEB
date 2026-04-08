export type PCStatus = "online" | "offline" | "reserved";

export interface LivePC {
  id: string;
  name: string;
  status: PCStatus;
  user: string | null;
  sessionTime: string | null;
  temperature: number;
  specs: string;
}

export type LiveActivityType = "login" | "logout" | "reservation" | "payment" | "system";

export interface LiveActivity {
  id: string;
  type: LiveActivityType;
  user: string;
  time: string;
  description: string;
}
