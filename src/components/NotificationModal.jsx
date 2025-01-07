import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function NotificationModal({ isOpen, onClose }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      axios.get('https://beta.techskims.tech/api/notifications')
        .then(response => setNotifications(response.data))
        .catch(error => console.error(error))
        .finally(() => setLoading(false));
    }
  }, [isOpen]);

  const markAsRead = (id) => {
    axios.post(`https://beta.techskims.tech/api/notifications/mark-all`, { id })
      .then(() => {
        setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
      })
      .catch(error => console.error(error));
  };

  const markAsUnread = (id) => {
    axios.post(`https://beta.techskims.tech/api/notifications/mark-all`, { id })
      .then(() => {
        setNotifications(notifications.map(n => n.id === id ? { ...n, read: false } : n));
      })
      .catch(error => console.error(error));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-md bg-white rounded-lg shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Notifications</h2>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 max-h-[70vh] overflow-y-auto">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="w-6 h-6 border-2 border-gray-200 border-t-gray-600 rounded-full animate-spin" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No notifications
            </div>
          ) : (
            <ul className="space-y-3">
              {notifications.map(notification => (
                <li 
                  key={notification.id}
                  className={`p-4 rounded-lg transition-colors ${
                    notification.read ? 'bg-gray-50' : 'bg-blue-50'
                  }`}
                >
                  <p className="text-gray-700 mb-3">{notification.message}</p>
                  <div className="flex gap-2 justify-end">
                    {!notification.read ? (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="px-3 py-1 text-sm font-medium text-blue-600 hover:bg-blue-100 rounded-md transition-colors"
                      >
                        Mark as Read
                      </button>
                    ) : (
                      <button
                        onClick={() => markAsUnread(notification.id)}
                        className="px-3 py-1 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                      >
                        Mark as Unread
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}