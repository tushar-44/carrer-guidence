'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Calendar, 
  BriefcaseIcon, 
  TrendingUp,
  Users,
  Clock
} from 'lucide-react';

interface StatItem {
  label: string;
  value: string | number;
  change?: number;
  icon: React.ElementType;
  color: string;
  bgColor: string;
}

interface StatsGridProps {
  stats: {
    assessmentsCompleted: number;
    sessionsCompleted: number;
    applicationsSubmitted: number;
    successfulApplications: number;
    skillsImproved: number;
  };
  className?: string;
}

export const StatsGrid: React.FC<StatsGridProps> = ({ stats, className = '' }) => {
  const statItems: StatItem[] = [
    {
      label: 'Assessments Completed',
      value: stats.assessmentsCompleted,
      change: 12,
      icon: BookOpen,
      color: 'text-blue-600',
      bgColor: 'from-blue-50 to-indigo-50'
    },
    {
      label: 'Mentoring Sessions',
      value: stats.sessionsCompleted,
      change: 8,
      icon: Calendar,
      color: 'text-emerald-600',
      bgColor: 'from-emerald-50 to-teal-50'
    },
    {
      label: 'Applications Sent',
      value: stats.applicationsSubmitted,
      change: -3,
      icon: BriefcaseIcon,
      color: 'text-purple-600',
      bgColor: 'from-purple-50 to-pink-50'
    },
    {
      label: 'Success Rate',
      value: `${Math.round((stats.successfulApplications / Math.max(stats.applicationsSubmitted, 1)) * 100)}%`,
      change: 15,
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'from-orange-50 to-red-50'
    },
    {
      label: 'Skills Improved',
      value: stats.skillsImproved,
      change: 25,
      icon: Users,
      color: 'text-teal-600',
      bgColor: 'from-teal-50 to-cyan-50'
    },
    {
      label: 'Active Goals',
      value: 7,
      change: 2,
      icon: Clock,
      color: 'text-indigo-600',
      bgColor: 'from-indigo-50 to-blue-50'
    }
  ];

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {statItems.map((stat, index) => {
        const Icon = stat.icon;
        
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -4, scale: 1.02 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/60 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className={`w-12 h-12 bg-gradient-to-r ${stat.bgColor} rounded-xl flex items-center justify-center mb-4`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                
                <h3 className="text-sm font-medium text-slate-600 mb-1">
                  {stat.label}
                </h3>
                
                <p className="text-2xl font-bold text-slate-800 mb-2">
                  {stat.value}
                </p>
                
                {stat.change !== undefined && (
                  <div className="flex items-center space-x-1">
                    <TrendingUp className={`w-4 h-4 ${
                      stat.change >= 0 ? 'text-emerald-500' : 'text-red-500'
                    }`} />
                    <span className={`text-sm font-medium ${
                      stat.change >= 0 ? 'text-emerald-600' : 'text-red-600'
                    }`}>
                      {stat.change >= 0 ? '+' : ''}{stat.change}%
                    </span>
                    <span className="text-sm text-slate-500">vs last month</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
