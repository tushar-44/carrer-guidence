'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Target, Award } from 'lucide-react';

interface ProgressData {
  skillDevelopment: number;
  mentoringProgress: number;
  applicationSuccess: number;
}

interface ProgressChartProps {
  data: ProgressData;
  className?: string;
}

export const ProgressChart: React.FC<ProgressChartProps> = ({ 
  data, 
  className = '' 
}) => {
  const progressItems = [
    {
      label: 'Skill Development',
      value: data.skillDevelopment,
      color: 'from-blue-500 to-indigo-500',
      bgColor: 'from-blue-50 to-indigo-50',
      icon: Target
    },
    {
      label: 'Mentoring Progress',
      value: data.mentoringProgress,
      color: 'from-emerald-500 to-teal-500',
      bgColor: 'from-emerald-50 to-teal-50',
      icon: TrendingUp
    },
    {
      label: 'Application Success',
      value: data.applicationSuccess,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'from-purple-50 to-pink-50',
      icon: Award
    }
  ];

  return (
    <div className={`bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/60 shadow-lg ${className}`}>
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
          <TrendingUp className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-800">Progress Overview</h3>
          <p className="text-sm text-slate-500">Your development metrics</p>
        </div>
      </div>

      <div className="space-y-6">
        {progressItems.map((item, index) => {
          const Icon = item.icon;
          
          return (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 bg-gradient-to-r ${item.bgColor} rounded-lg flex items-center justify-center`}>
                    <Icon className="w-4 h-4 text-slate-600" />
                  </div>
                  <span className="font-medium text-slate-700">{item.label}</span>
                </div>
                <span className="text-sm font-semibold text-slate-600">
                  {Math.round(item.value)}%
                </span>
              </div>
              
              <div className="relative h-3 bg-slate-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${item.value}%` }}
                  transition={{ duration: 1, delay: index * 0.2 }}
                  className={`h-full bg-gradient-to-r ${item.color} rounded-full relative`}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse" />
                </motion.div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
