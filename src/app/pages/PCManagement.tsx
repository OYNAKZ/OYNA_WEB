import { PCTable } from '../components/PCTable';
import { pcs } from '../data/mockData';
import { Plus } from 'lucide-react';

export function PCManagement() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-2">PC Management</h2>
          <p className="text-gray-500">Monitor and manage all gaming PCs in real-time</p>
        </div>
        <button className="group flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl transition-all shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-105">
          <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
          Add PC
        </button>
      </div>

      <PCTable pcs={pcs} />
    </div>
  );
}
