import React, { useState } from 'react';
import { ToDoItem, CelebrationEvent } from '../types';
import { CheckSquare, Plus, Calendar, Check, Trash2, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ToDoViewProps {
  todos: ToDoItem[];
  activeEvent?: CelebrationEvent;
  onToggleTodo: (id: string) => void;
  onAddTodo: (todo: ToDoItem) => void;
  onDeleteTodo: (id: string) => void;
}

export const ToDoView: React.FC<ToDoViewProps> = ({
  todos,
  activeEvent,
  onToggleTodo,
  onAddTodo,
  onDeleteTodo
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ToDoItem['category']>('Checklist');
  const [dueDate, setDueDate] = useState('2026-11-14');
  const [priority, setPriority] = useState<ToDoItem['priority']>('high');
  const [selectedFilter, setSelectedFilter] = useState<string>('All');

  const completedCount = todos.filter((t) => t.completed).length;
  const progressPercent = todos.length > 0 ? Math.round((completedCount / todos.length) * 100) : 0;

  const categories = ['All', 'Checklist', 'Vendors', 'Invites', 'Decor', 'Day-of'];

  const filteredTodos = todos.filter((t) => {
    return selectedFilter === 'All' || t.category === selectedFilter;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newTodo: ToDoItem = {
      id: `td-${Date.now()}`,
      title: title.trim(),
      dueDate,
      category,
      completed: false,
      priority
    };

    onAddTodo(newTodo);
    setTitle('');
    setShowAddForm(false);
  };

  const handleToggle = (id: string) => {
    onToggleTodo(id);
    const item = todos.find((t) => t.id === id);
    if (item && !item.completed) {
      try {
        confetti({
          particleCount: 18,
          spread: 45,
          origin: { y: 0.7 }
        });
      } catch {
        // fallback
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <CheckSquare className="w-6 h-6 text-purple-400" />
            <span>Party Checklist & To-Do List</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Tracking execution tasks for{' '}
            <span className="text-amber-400 font-semibold">{activeEvent?.title || 'Celebration'}</span>
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs shadow-lg shadow-orange-500/20 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Task</span>
        </button>
      </div>

      {/* Progress Strip */}
      <div className="p-4 rounded-2xl bg-[#14152a] border border-[#242646] shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="text-sm font-bold text-white flex items-center gap-2">
            <span>Overall Completion:</span>
            <span className="text-amber-400 tabular-nums">{progressPercent}%</span>
            <span className="text-xs text-slate-400 font-normal">
              ({completedCount} of {todos.length} done)
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Checking off tasks automatically updates the event planning status!
          </p>
        </div>

        <div className="w-full sm:w-64 bg-[#0e0f22] rounded-full h-2.5 overflow-hidden ring-1 ring-white/10 shrink-0">
          <div
            className="h-full bg-gradient-to-r from-purple-600 via-indigo-500 to-amber-500 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Add Task Form */}
      {showAddForm && (
        <form onSubmit={handleCreate} className="p-5 rounded-2xl bg-[#181935] border border-purple-500/40 space-y-4">
          <h3 className="text-sm font-bold text-white">Add New Milestone or Task</h3>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="sm:col-span-2">
              <label className="text-[11px] text-slate-300 block mb-1">Task Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Confirm beach volleyball referee"
                className="w-full bg-[#101124] border border-[#2b2d4f] rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-purple-400"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-300 block mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ToDoItem['category'])}
                className="w-full bg-[#101124] border border-[#2b2d4f] rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-purple-400"
              >
                <option value="Checklist">General Checklist</option>
                <option value="Vendors">Vendors</option>
                <option value="Invites">Invites</option>
                <option value="Decor">Decor</option>
                <option value="Day-of">Day-of Event</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] text-slate-300 block mb-1">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-[#101124] border border-[#2b2d4f] rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-purple-400"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-1">
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
              Add Task
            </button>
          </div>
        </form>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedFilter(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedFilter === cat
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-[#161730] text-slate-400 hover:text-slate-200 border border-[#272949]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* To-Do Items List */}
      <div className="rounded-2xl border border-[#242646] bg-[#14152a] p-4 divide-y divide-[#1e203c] shadow-xl space-y-2">
        {filteredTodos.map((todo) => (
          <div
            key={todo.id}
            className={`pt-3 first:pt-0 flex items-center justify-between gap-3 group transition-opacity ${
              todo.completed ? 'opacity-60' : 'opacity-100'
            }`}
          >
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleToggle(todo.id)}
                className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all cursor-pointer ${
                  todo.completed
                    ? 'bg-purple-600 border-purple-500 text-white'
                    : 'bg-[#181934] border-[#313459] hover:border-purple-400 text-transparent'
                }`}
              >
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </button>

              <div>
                <p
                  className={`text-xs font-bold transition-all ${
                    todo.completed ? 'line-through text-slate-400' : 'text-white'
                  }`}
                >
                  {todo.title}
                </p>
                <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                  <span className="px-2 py-0.2 rounded bg-[#1f2142] text-slate-300 font-medium">
                    {todo.category}
                  </span>
                  <span>Due {todo.dueDate}</span>
                  {todo.priority === 'high' && (
                    <span className="text-red-400 font-semibold flex items-center gap-0.5">
                      <AlertCircle className="w-2.5 h-2.5" /> High Priority
                    </span>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={() => onDeleteTodo(todo.id)}
              className="p-1 rounded-lg hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
