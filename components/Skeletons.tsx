
import React from 'react';

export const MetricSkeleton: React.FC = () => (
  <div className="bg-[#121220] border border-gray-800 p-6 rounded-2xl animate-pulse">
    <div className="flex justify-between items-start mb-4">
      <div className="w-10 h-10 rounded-xl bg-gray-800"></div>
      <div className="w-12 h-4 bg-gray-800 rounded"></div>
    </div>
    <div className="w-24 h-3 bg-gray-800 rounded mb-2"></div>
    <div className="w-16 h-6 bg-gray-800 rounded"></div>
  </div>
);

export const ChartSkeleton: React.FC = () => (
  <div className="bg-[#121220] border border-gray-800 p-6 rounded-3xl animate-pulse">
    <div className="flex justify-between items-center mb-8">
      <div className="w-32 h-6 bg-gray-800 rounded"></div>
      <div className="w-24 h-6 bg-gray-800 rounded"></div>
    </div>
    <div className="h-80 w-full bg-gray-900/50 rounded-2xl"></div>
  </div>
);

export const ChatListSkeleton: React.FC = () => (
  <div className="divide-y divide-gray-800 animate-pulse">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="p-4 flex gap-4 items-center">
        <div className="w-12 h-12 rounded-full bg-gray-800"></div>
        <div className="flex-1 space-y-2">
          <div className="flex justify-between">
            <div className="w-24 h-4 bg-gray-800 rounded"></div>
            <div className="w-8 h-3 bg-gray-800 rounded"></div>
          </div>
          <div className="w-3/4 h-3 bg-gray-800 rounded"></div>
        </div>
      </div>
    ))}
  </div>
);

export const TableSkeleton: React.FC = () => (
  <div className="bg-[#121220] border border-gray-800 rounded-3xl overflow-hidden animate-pulse">
    <div className="h-12 bg-gray-900/50 border-b border-gray-800"></div>
    <div className="divide-y divide-gray-800">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="p-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <div className="w-9 h-9 rounded-xl bg-gray-800"></div>
            <div className="space-y-2">
              <div className="w-32 h-4 bg-gray-800 rounded"></div>
              <div className="w-24 h-3 bg-gray-800 rounded"></div>
            </div>
          </div>
          <div className="w-24 h-4 bg-gray-800 rounded flex-1"></div>
          <div className="w-24 h-4 bg-gray-800 rounded flex-1"></div>
          <div className="w-16 h-6 bg-gray-800 rounded"></div>
          <div className="w-8 h-8 bg-gray-800 rounded"></div>
        </div>
      ))}
    </div>
  </div>
);
