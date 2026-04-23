import { Badge } from '../components/ui/badge';
import { DollarSign, TrendingUp, Download } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useEffect, useMemo, useState } from 'react';

import { ApiError, backendApi } from '../lib/apiClient';
import type { BackendPaymentListItem } from '../types/backend';

export function Payments() {
  const [payments, setPayments] = useState<BackendPaymentListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void backendApi
      .getPayments()
      .then((response) => {
        if (!cancelled) {
          setPayments(response.items);
          setError(null);
        }
      })
      .catch((requestError) => {
        if (!cancelled) {
          setError(requestError instanceof ApiError ? requestError.message : 'Failed to load payments');
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const getTypeBadge = (type: string) => {
    if (type === 'fake') return <Badge className="border-[#BBF7D0] bg-[#F0FDF4] text-[#166534]">Fake Provider</Badge>;
    return <Badge className="border-[#E5E7EB] bg-[#F9FAFB] text-[#4B5563]">{type}</Badge>;
  };

  const getStatusBadge = (status: string) => {
    if (status === 'succeeded') return <Badge className="border-[#BBF7D0] bg-[#F0FDF4] text-[#166534]">Completed</Badge>;
    if (status === 'pending') return <Badge className="border-[#FDE68A] bg-[#FEFCE8] text-[#854D0E]">Pending</Badge>;
    return <Badge className="border-[#FECACA] bg-[#FEF2F2] text-[#B91C1C]">Failed</Badge>;
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const revenueData = useMemo(() => {
    const today = new Date();
    return Array.from({ length: 7 }).map((_, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() - (6 - index));
      const dateKey = date.toISOString().slice(0, 10);
      const dayPayments = payments.filter((payment) => payment.created_at.startsWith(dateKey));
      const revenue = dayPayments
        .filter((payment) => payment.status === 'succeeded')
        .reduce((sum, payment) => sum + payment.amount_minor / 100, 0);

      return {
        date: date.toLocaleDateString('en-US', { weekday: 'short' }),
        revenue,
        payments: dayPayments.length,
      };
    });
  }, [payments]);

  const weekRevenue = revenueData.reduce((sum, day) => sum + day.revenue, 0);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-[#111827]">Payments</h2>
          <p className="text-sm text-[#6B7280]">Track revenue and payment history</p>
        </div>
        <button disabled className="inline-flex items-center gap-2 rounded-md border border-[#2563EB] bg-[#2563EB] px-3 py-2 text-sm font-medium text-white opacity-60">
          <Download className="w-4 h-4" />
          Export Disabled
        </button>
      </div>

      {error ? <p className="text-sm text-[#B91C1C]">{error}</p> : null}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="rounded-md border border-[#E5E7EB] bg-white p-4">
          <div className="mb-4 flex items-start justify-between">
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[#6B7280]">Total Revenue (7 days)</p>
              <p className="text-2xl font-semibold text-[#111827]">${weekRevenue.toFixed(2)}</p>
              <div className="mt-1 flex items-center gap-1 text-xs text-[#6B7280]">
                <TrendingUp className="w-4 h-4 text-[#166534]" />
                <span>{payments.filter((payment) => payment.status === 'succeeded').length} successful payments</span>
              </div>
            </div>
            <div className="h-10 w-10 rounded-md border border-[#E5E7EB] bg-[#F9FAFB] flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-[#6B7280]" />
            </div>
          </div>

          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="date" stroke="#6B7280" style={{ fontSize: '12px' }} />
              <YAxis stroke="#6B7280" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E5E7EB',
                  borderRadius: '6px',
                  color: '#111827',
                }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#2563EB"
                fill="#DBEAFE"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-md border border-[#E5E7EB] bg-white p-4">
          <div className="mb-4 flex items-start justify-between">
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[#6B7280]">Payments (7 days)</p>
              <p className="text-2xl font-semibold text-[#111827]">{revenueData.reduce((sum, day) => sum + day.payments, 0)}</p>
              <div className="mt-1 flex items-center gap-1 text-xs text-[#6B7280]">
                <TrendingUp className="w-4 h-4 text-[#1D4ED8]" />
                <span>Backend transaction volume</span>
              </div>
            </div>
            <div className="h-10 w-10 rounded-md border border-[#E5E7EB] bg-[#F9FAFB] flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-[#6B7280]" />
            </div>
          </div>

          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="date" stroke="#6B7280" style={{ fontSize: '12px' }} />
              <YAxis stroke="#6B7280" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E5E7EB',
                  borderRadius: '6px',
                  color: '#111827',
                }}
              />
              <Bar dataKey="payments" fill="#60A5FA" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-md border border-[#E5E7EB] bg-white overflow-hidden">
        <div className="border-b border-[#E5E7EB] px-4 py-3">
          <h3 className="text-sm font-semibold text-[#111827]">Recent Payments</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E5E7EB] bg-[#F9FAFB]">
                <th className="text-left py-2.5 px-4 text-xs font-semibold uppercase tracking-wide text-[#6B7280]">User</th>
                <th className="text-left py-2.5 px-4 text-xs font-semibold uppercase tracking-wide text-[#6B7280]">Amount</th>
                <th className="text-left py-2.5 px-4 text-xs font-semibold uppercase tracking-wide text-[#6B7280]">Type</th>
                <th className="text-left py-2.5 px-4 text-xs font-semibold uppercase tracking-wide text-[#6B7280]">Status</th>
                <th className="text-left py-2.5 px-4 text-xs font-semibold uppercase tracking-wide text-[#6B7280]">Date & Time</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td className="px-4 py-6 text-sm text-[#6B7280]" colSpan={5}>Loading payments...</td>
                </tr>
              ) : null}
              {payments.map((payment, index) => (
                <tr
                  key={payment.id}
                  className={`border-b border-[#E5E7EB] hover:bg-[#F9FAFB] transition-colors ${
                    index === payments.length - 1 ? 'border-b-0' : ''
                  }`}
                >
                  <td className="py-2.5 px-4">
                    <span className="font-medium text-[#111827]">{payment.user?.full_name || payment.user?.email || `User #${payment.user_id}`}</span>
                  </td>
                  <td className="py-2.5 px-4">
                    <span className="font-semibold text-[#166534]">
                      {(payment.amount_minor / 100).toLocaleString('en-US', {
                        style: 'currency',
                        currency: payment.currency,
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </td>
                  <td className="py-2.5 px-4">
                    {getTypeBadge(payment.provider)}
                  </td>
                  <td className="py-2.5 px-4">
                    {getStatusBadge(payment.status)}
                  </td>
                  <td className="py-2.5 px-4">
                    <span className="text-[#6B7280]">{formatDateTime(payment.created_at)}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
