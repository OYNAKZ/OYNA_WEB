import { PCTable } from '../components/PCTable';
import { Plus } from 'lucide-react';
import { useHubLiveData } from '../hooks/useHubLiveData';

export function PCManagement() {
  const { pcs, error, runSystemAction, runningCommandFor } = useHubLiveData();

  const handleRunSystemAction = async (pcId: string, actionId: 'restart' | 'signOut') => {
    try {
      await runSystemAction(pcId, actionId);
    } catch {
      // UI already reflects fetch errors from hub polling.
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-[#111827]">PC Management</h2>
          <p className="text-sm text-[#6B7280]">Monitor and manage all stations in real-time</p>
          {error ? <p className="text-xs text-[#B91C1C]">Hub error: {error}</p> : null}
        </div>
        <button className="inline-flex items-center gap-2 rounded-md border border-[#2563EB] bg-[#2563EB] px-3 py-2 text-sm font-medium text-white hover:bg-[#1D4ED8] transition-colors">
          <Plus className="w-4 h-4" />
          Add PC
        </button>
      </div>

      <PCTable pcs={pcs} runningCommandFor={runningCommandFor} onRunSystemAction={handleRunSystemAction} />
    </div>
  );
}
