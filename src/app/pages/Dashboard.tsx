import { Monitor, Users, DollarSign, Wallet } from 'lucide-react';
import { StatCard } from '../components/StatCard';
import { PCStatusGrid } from '../components/PCStatusGrid';
import { ActivityList } from '../components/ActivityList';
import { useHubLiveData } from '../hooks/useHubLiveData';
import { useEffect, useMemo, useState } from 'react';

import { ApiError, backendApi } from '../lib/apiClient';
import type { BackendOperationsSummary, BackendPaymentListItem } from '../types/backend';

export function Dashboard() {
  const { pcs, activities, error, loading, lastUpdatedAt } = useHubLiveData();
  const [summary, setSummary] = useState<BackendOperationsSummary | null>(null);
  const [payments, setPayments] = useState<BackendPaymentListItem[]>([]);
  const [backendError, setBackendError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void Promise.all([backendApi.getOperationsSummary(), backendApi.getPayments()])
      .then(([summaryResponse, paymentsResponse]) => {
        if (!cancelled) {
          setSummary(summaryResponse);
          setPayments(paymentsResponse.items);
          setBackendError(null);
        }
      })
      .catch((requestError) => {
        if (!cancelled) {
          setBackendError(requestError instanceof ApiError ? requestError.message : 'Failed to load backend summary');
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const activePCs = pcs.filter((pc) => pc.status === 'online').length;
  const reservedPCs = pcs.filter((pc) => pc.status === 'reserved').length;
  const offlinePCs = pcs.filter((pc) => pc.status === 'offline').length;
  const onlineUsers = pcs.filter((pc) => pc.user).length;
  const revenueToday = useMemo(() => {
    const dateKey = new Date().toISOString().slice(0, 10);
    return payments
      .filter((payment) => payment.status === 'succeeded' && payment.created_at.startsWith(dateKey))
      .reduce((sum, payment) => sum + payment.amount_minor / 100, 0);
  }, [payments]);

  return (
    <div className="space-y-5">
      <section className="rounded-md border border-[#E5E7EB] bg-white">
        <div className="flex flex-col gap-3 border-b border-[#E5E7EB] px-4 py-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-base font-semibold text-[#111827]">Operations Overview</h2>
            <p className="text-sm text-[#6B7280]">
              {activePCs} active PCs, {reservedPCs} reserved, {offlinePCs} offline
            </p>
            {error ? <p className="text-xs text-[#B91C1C]">Hub error: {error}</p> : null}
            {backendError ? <p className="text-xs text-[#B91C1C]">Backend error: {backendError}</p> : null}
          </div>
          <div className="text-xs text-[#6B7280]">
            Last updated:{' '}
            {lastUpdatedAt
              ? new Date(lastUpdatedAt).toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : loading
                ? 'loading...'
                : 'never'}
          </div>
        </div>
        <div className="grid grid-cols-1 divide-y divide-[#E5E7EB] md:grid-cols-2 md:divide-y-0 lg:grid-cols-4 lg:divide-x lg:divide-[#E5E7EB]">
          <StatCard title="Active PCs" value={activePCs} icon={Monitor} trend={{ value: '+12%', positive: true }} />
          <StatCard title="Reserved PCs" value={summary?.active_reservations ?? reservedPCs} icon={Monitor} trend={{ value: 'backend scope', positive: true }} />
          <StatCard title="Revenue Today" value={`$${revenueToday.toFixed(2)}`} icon={DollarSign} trend={{ value: 'payments API', positive: true }} />
          <StatCard title="Online Users" value={summary?.active_sessions ?? onlineUsers} icon={Users} trend={{ value: 'live sessions', positive: true }} />
        </div>
      </section>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[2fr_1fr]">
        <section className="rounded-md border border-[#E5E7EB] bg-white">
          <div className="flex items-center justify-between border-b border-[#E5E7EB] px-4 py-3">
            <div>
              <h3 className="text-sm font-semibold text-[#111827]">Live PC Status</h3>
              <p className="text-xs text-[#6B7280]">Real-time station availability</p>
            </div>
            <div className="hidden items-center gap-4 text-xs text-[#6B7280] md:flex">
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#16A34A]" /> Active
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#CA8A04]" /> Reserved
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#9CA3AF]" /> Offline
              </span>
            </div>
          </div>
          <PCStatusGrid pcs={pcs} />
        </section>

        <section className="rounded-md border border-[#E5E7EB] bg-white">
          <div className="flex items-center justify-between border-b border-[#E5E7EB] px-4 py-3">
            <div>
              <h3 className="text-sm font-semibold text-[#111827]">Recent Activity</h3>
              <p className="text-xs text-[#6B7280]">Latest operator events</p>
            </div>
            <Wallet className="h-4 w-4 text-[#9CA3AF]" />
          </div>
          <ActivityList activities={activities} />
        </section>
      </div>
    </div>
  );
}
