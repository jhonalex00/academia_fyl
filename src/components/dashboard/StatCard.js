'use client';
import React from 'react';
import styles from '@/app/admin/dashboard/dashboard.module.css';

const StatCard = ({ title, value, icon, increment, color = 'indigo' }) => {
  const colorClasses = {
    indigo: 'text-indigo-500 bg-indigo-50',
    green: 'text-green-500 bg-green-50',
    orange: 'text-orange-500 bg-orange-50',
    blue: 'text-blue-500 bg-blue-50'
  };
  
  const iconColorClasses = {
    indigo: 'text-indigo-500',
    green: 'text-green-500',
    orange: 'text-orange-500',
    blue: 'text-blue-500'
  };
  
  return (
    <div className={`bg-white rounded-lg shadow p-6 flex flex-col ${styles['stat-card']}`}>
      <div className="flex justify-between items-center mb-4">
        <p className="text-gray-500 text-sm font-medium">{title}</p>
        <div className={`${iconColorClasses[color]} rounded-full p-2 ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
      <div className="flex flex-col flex-1">
        <h3 className="text-3xl font-bold text-gray-800 mb-2">{value}</h3>
        {increment && (
          <div className="text-green-500 text-sm font-medium flex items-center">
            <span className="mr-1">↑</span> {increment}% <span className="ml-1 text-gray-500">desde el mes pasado</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
