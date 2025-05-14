'use client';
import React from 'react';
import styles from '@/app/admin/dashboard/dashboard.module.css';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

const UpcomingEvents = ({ events, title, className = '' }) => {
  return (
    <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-700">{title}</h3>
        <Button variant="outline" size="sm">
          Ver todos
        </Button>
      </div>
      
      {events.length === 0 ? (
        <div className="text-sm text-gray-500">
          No hay eventos programados próximamente.
        </div>
      ) : (
        <div className="space-y-4">
          {events.map((event, index) => (
            <div 
              key={index} 
              className={`p-3 border-l-4 border-indigo-500 bg-indigo-50 rounded-r-md ${styles['upcoming-event']}`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">{event.title}</h4>
                  <p className="text-xs text-gray-600">{event.subject}</p>
                </div>
                <div className="text-xs font-semibold text-indigo-600">
                  {event.time}
                </div>
              </div>              <div className="flex items-center mt-2">
                <Avatar className="w-6 h-6 mr-2">
                  <AvatarFallback className="text-xs bg-gray-200 text-gray-700">
                    {event.teacherInitials}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs text-gray-600">{event.teacher}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UpcomingEvents;
