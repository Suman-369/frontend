import React, { useState } from 'react';
import { Plus, CheckCircle2, Clock, AlertCircle, Filter } from 'lucide-react';

const AdminWorkAssign = () => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Work Assignments</h1>
          <p className="text-sm text-gray-500 mt-1">Assign and track tasks for staff members.</p>
        </div>
        <button className="flex items-center px-4 py-2 bg-[#1E3A8A] text-white rounded-xl hover:bg-[#1E3A8A]/90 transition-colors shadow-sm text-sm font-medium w-fit">
          <Plus className="w-4 h-4 mr-2" />
          New Assignment
        </button>
      </div>

      <div className="flex items-center space-x-2 border-b border-gray-200 pb-4">
        <button className="flex items-center px-4 py-2 bg-gray-100 text-gray-900 rounded-lg text-sm font-medium">
          All Tasks
        </button>
        <button className="flex items-center px-4 py-2 text-gray-500 hover:bg-gray-50 rounded-lg text-sm font-medium transition-colors">
          Pending
        </button>
        <button className="flex items-center px-4 py-2 text-gray-500 hover:bg-gray-50 rounded-lg text-sm font-medium transition-colors">
          In Progress
        </button>
        <button className="flex items-center px-4 py-2 text-gray-500 hover:bg-gray-50 rounded-lg text-sm font-medium transition-colors">
          Completed
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { title: 'Fix leaky faucet in Room 104', assignedTo: 'Robert Brown', status: 'Pending', priority: 'High', date: 'Oct 24, 2024' },
          { title: 'Clean common area Block A', assignedTo: 'Jane Wilson', status: 'In Progress', priority: 'Medium', date: 'Oct 23, 2024' },
          { title: 'Inspect fire extinguishers', assignedTo: 'Alice Smith', status: 'Completed', priority: 'High', date: 'Oct 20, 2024' },
          { title: 'Replace light bulb hallway B', assignedTo: 'Robert Brown', status: 'Pending', priority: 'Low', date: 'Oct 25, 2024' },
        ].map((task, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow group relative overflow-hidden">
            {task.status === 'Completed' && (
              <div className="absolute top-0 right-0 w-16 h-16 bg-green-50 rounded-bl-full flex items-start justify-end p-3 transition-transform group-hover:scale-110">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              </div>
            )}
            {task.status === 'In Progress' && (
              <div className="absolute top-0 right-0 w-16 h-16 bg-blue-50 rounded-bl-full flex items-start justify-end p-3 transition-transform group-hover:scale-110">
                <Clock className="w-5 h-5 text-blue-500" />
              </div>
            )}
            {task.status === 'Pending' && (
              <div className="absolute top-0 right-0 w-16 h-16 bg-orange-50 rounded-bl-full flex items-start justify-end p-3 transition-transform group-hover:scale-110">
                <AlertCircle className="w-5 h-5 text-orange-500" />
              </div>
            )}

            <div className="pr-12">
              <span className={`inline-block px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md mb-3 ${
                task.priority === 'High' ? 'bg-red-100 text-red-600' : 
                task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-600' : 'bg-blue-100 text-blue-600'
              }`}>
                {task.priority} Priority
              </span>
              <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight">{task.title}</h3>
              
              <div className="space-y-2 mt-4">
                <div className="flex items-center text-sm text-gray-500">
                  <span className="w-24 font-medium">Assigned to:</span>
                  <span className="text-gray-900">{task.assignedTo}</span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <span className="w-24 font-medium">Due Date:</span>
                  <span>{task.date}</span>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                  task.status === 'Completed' ? 'bg-green-100 text-green-700' :
                  task.status === 'In Progress' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'
                }`}>
                  {task.status}
                </span>
                <button className="text-[#1E3A8A] text-sm font-medium hover:underline focus:outline-none">
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminWorkAssign;
