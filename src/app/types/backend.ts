export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
}

export interface BackendUser {
  id: number;
  full_name: string | null;
  club_id: number | null;
  email: string;
  phone: string | null;
  role: string;
  is_active: boolean;
}

export interface BackendZoneSummary {
  id: number;
  branch_id: number;
  name: string;
  zone_type: string;
  description: string | null;
  is_active: boolean;
}

export interface BackendBranchSummary {
  id: number;
  club_id: number;
  name: string;
  address: string;
  city: string;
  open_time: string;
  close_time: string;
  is_active: boolean;
}

export interface BackendSeatSummary {
  id: number;
  zone_id: number;
  code: string;
  seat_type: string;
  is_active: boolean;
  is_maintenance: boolean;
  operational_status: string;
  x_position: number | null;
  y_position: number | null;
  zone: BackendZoneSummary;
  branch: BackendBranchSummary;
}

export interface BackendReservationRead {
  id: number;
  seat_id: number;
  start_at: string;
  end_at: string;
  status: string;
  idempotency_key: string | null;
  expires_at: string | null;
  cancelled_at: string | null;
  user_id: number;
}

export interface BackendOperationalReservation extends BackendReservationRead {
  seat: BackendSeatSummary;
}

export interface BackendPaymentListItem {
  id: number;
  user_id: number;
  reservation_id: number | null;
  provider: string;
  provider_payment_id: string | null;
  status: string;
  amount_minor: number;
  currency: string;
  idempotency_key: string;
  checkout_url: string | null;
  created_at: string;
  updated_at: string;
  user: BackendUser | null;
}

export interface BackendClubZoneLoad {
  zone: BackendZoneSummary;
  total_seats: number;
  occupied_seats: number;
  reserved_seats: number;
  maintenance_seats: number;
  offline_seats: number;
  available_seats: number;
}

export interface BackendOperationsSummary {
  club_id: number;
  branch_id: number | null;
  active_sessions: number;
  active_reservations: number;
  occupied_seats: number;
  available_seats: number;
  maintenance_seats: number;
  offline_seats: number;
  zone_load: BackendClubZoneLoad[];
}
