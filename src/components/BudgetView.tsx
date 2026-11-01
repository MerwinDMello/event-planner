import React, { useState } from 'react';
import { BudgetItem, CelebrationEvent } from '../types';
import { Wallet, IndianRupee, Plus, CheckCircle2, AlertCircle, PieChart, Trash2 } from 'lucide-react';
import { formatCurrencyINR } from '../utils/formatters';

interface BudgetViewProps {
  budgetItems: BudgetItem[];
  activeEvent?: CelebrationEvent;
  onAddBudgetItem: (item: BudgetItem) => void;
  onDeleteBudgetItem: (id: string) => void;
  onToggleStatus: (id: string) => void;
}

export const BudgetView: React.FC<BudgetViewProps> = ({
  budgetItems,
  activeEvent,
  onAddBudgetItem,
  onDeleteBudgetItem,
  onToggleStatus
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<BudgetItem['category']>('Decor');
  const [estimatedCost, setEstimatedCost] = useState(5000);
  const [actualCost, setActualCost] = useState(0);
  const [status, setStatus] = useState<BudgetItem['status']>('planned');
  const [paidTo, setPaidTo] = useState('');

  const totalEstimated = budgetItems.reduce((acc, curr) => acc + curr.estimatedCost, 0);
  const totalSpent = budgetItems.reduce((acc, curr) => acc + curr.actualCost, 0);
  const eventTarget = activeEvent?.budgetEstimated || 50000;
  const remaining = Math.max(0, eventTarget - totalSpent);
  const spentPercentage = Math.min(100, Math.round((totalSpent / eventTarget) * 100));

  const categories: BudgetItem['category'][] = [
    'Decor',
    'Food & Drinks',
    'Cake & Treats',
    'Entertainment',
    'Gifts & Favors',
    'Venue'
  ];

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newItem: BudgetItem = {
      id: `bgt-${Date.now()}`,
      category,
      title: title.trim(),
      estimatedCost: Number(estimatedCost) || 0,
      actualCost: Number(actualCost) || 0,
      status,
      paidTo: paidTo.trim() || undefined
    };

    onAddBudgetItem(newItem);
    setTitle('');
    setEstimatedCost(5000);
    setActualCost(0);
    setPaidTo('');
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Wallet className="w-6 h-6 text-amber-400" />
            <span>Budget & Expense Tracker</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Managing costs for{' '}
            <span className="text-amber-400 font-semibold">{activeEvent?.title || 'Active Celebration'}</span>
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs shadow-lg shadow-orange-500/20 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Expense Item</span>
        </button>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Target Budget */}
        <div className="p-4 rounded-2xl bg-[#14152a] border border-[#242646] shadow-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Target Budget</span>
            <PieChart className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-white tabular-nums flex items-center">
            <IndianRupee className="w-5 h-5 text-purple-400" />
            {eventTarget.toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Est. total planned: {formatCurrencyINR(totalEstimated)}
          </span>
        </div>

        {/* Total Spent */}
        <div className="p-4 rounded-2xl bg-[#14152a] border border-[#242646] shadow-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Total Actual Spent</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-amber-400 tabular-nums flex items-center">
            <IndianRupee className="w-5 h-5 text-amber-400" />
            {totalSpent.toLocaleString('en-IN')}
          </div>
          <div className="mt-2 w-full bg-[#0e0f22] rounded-full h-1.5 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-orange-500"
              style={{ width: `${spentPercentage}%` }}
            />
          </div>
        </div>

        {/* Remaining */}
        <div className="p-4 rounded-2xl bg-[#14152a] border border-[#242646] shadow-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Remaining Funds</span>
            <AlertCircle className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400 tabular-nums flex items-center">
            <IndianRupee className="w-5 h-5 text-emerald-400" />
            {remaining.toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            {100 - spentPercentage}% of budget remaining
          </span>
        </div>
      </div>

      {/* Add Item Inline Panel */}
      {showAddForm && (
        <form onSubmit={handleCreate} className="p-5 rounded-2xl bg-[#181935] border border-purple-500/40 space-y-4">
          <h3 className="text-sm font-bold text-white">Record New Expense / Estimate</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] text-slate-300 block mb-1">Item Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. 50 Custom Return Gift Pouches"
                className="w-full bg-[#101124] border border-[#2b2d4f] rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-purple-400"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-300 block mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as BudgetItem['category'])}
                className="w-full bg-[#101124] border border-[#2b2d4f] rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-purple-400"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[11px] text-slate-300 block mb-1">Vendor / Payee (Optional)</label>
              <input
                type="text"
                value={paidTo}
                onChange={(e) => setPaidTo(e.target.value)}
                placeholder="e.g. Spooky Decor Co."
                className="w-full bg-[#101124] border border-[#2b2d4f] rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-purple-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] text-slate-300 block mb-1">Estimated Cost (₹)</label>
              <input
                type="number"
                value={estimatedCost}
                onChange={(e) => setEstimatedCost(Number(e.target.value))}
                className="w-full bg-[#101124] border border-[#2b2d4f] rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-purple-400"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-300 block mb-1">Actual Paid (₹)</label>
              <input
                type="number"
                value={actualCost}
                onChange={(e) => setActualCost(Number(e.target.value))}
                className="w-full bg-[#101124] border border-[#2b2d4f] rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-purple-400"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-300 block mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as BudgetItem['status'])}
                className="w-full bg-[#101124] border border-[#2b2d4f] rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-purple-400"
              >
                <option value="planned">Planned</option>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1.5 rounded-xl bg-[#202244] text-xs text-slate-300 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white shadow-md"
            >
              Save Expense
            </button>
          </div>
        </form>
      )}

      {/* Expenses Table */}
      <div className="rounded-2xl border border-[#242646] bg-[#14152a] overflow-hidden shadow-xl">
        <div className="px-5 py-4 border-b border-[#212342] flex items-center justify-between">
          <h2 className="text-sm font-bold text-white">Expense Ledger</h2>
          <span className="text-xs text-slate-400">{budgetItems.length} items logged</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#212342] bg-[#101124] text-slate-400 text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4 font-semibold">Category</th>
                <th className="py-3 px-4 font-semibold">Item & Payee</th>
                <th className="py-3 px-4 font-semibold text-right">Estimate</th>
                <th className="py-3 px-4 font-semibold text-right">Actual Paid</th>
                <th className="py-3 px-4 font-semibold text-center">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e203c]">
              {budgetItems.map((item) => (
                <tr key={item.id} className="hover:bg-[#181936] transition-colors">
                  <td className="py-3 px-4">
                    <span className="px-2.5 py-1 rounded-md bg-[#202244] text-slate-300 font-semibold text-[11px]">
                      {item.category}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-white block">{item.title}</span>
                    {item.paidTo && (
                      <span className="text-[11px] text-slate-400">Vendor: {item.paidTo}</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right tabular-nums text-slate-300 font-medium">
                    {formatCurrencyINR(item.estimatedCost)}
                  </td>
                  <td className="py-3 px-4 text-right tabular-nums font-bold text-amber-400">
                    {formatCurrencyINR(item.actualCost)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => onToggleStatus(item.id)}
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase transition-colors cursor-pointer ${
                        item.status === 'paid'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : item.status === 'pending'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-slate-700/40 text-slate-300 border border-slate-600/30'
                      }`}
                    >
                      {item.status}
                    </button>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => onDeleteBudgetItem(item.id)}
                      className="p-1 rounded-lg hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"
                      title="Remove expense"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
