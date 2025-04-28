'use client';
import React from 'react';
import styles from '@/app/dashboard/dashboard.module.css';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const RecentActivity = ({ activities, title, className = '' }) => {
  return (
    <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
      <h3 className="text-lg font-medium text-gray-700 mb-4">{title}</h3>
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div key={index} className={`flex items-start ${styles['activity-item']} p-2 rounded-md`}>
            <Avatar className="h-10 w-10 mr-3 bg-indigo-100">
              <AvatarFallback className="text-xs font-medium text-indigo-700">
                {activity.initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium text-gray-900">{activity.title}</p>
              <p className="text-sm text-gray-500">{activity.description}</p>
              <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;
