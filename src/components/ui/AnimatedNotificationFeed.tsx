"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export type NotificationType = "success" | "error" | "info" | "warning";

export interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
}

// Global state mechanism for notifications (simple event emitter)
type Listener = (notification: NotificationItem) => void;
let listeners: Listener[] = [];

export const addNotification = (notification: Omit<NotificationItem, "id">) => {
  const id = Math.random().toString(36).substring(2, 9);
  const fullNotification = { ...notification, id };
  listeners.forEach(listener => listener(fullNotification));
};

export default function AnimatedNotificationFeed() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    const handleNotification = (notification: NotificationItem) => {
      setNotifications(prev => [...prev, notification]);
      
      // Auto-remove after 5 seconds
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== notification.id));
      }, 5000);
    };

    listeners.push(handleNotification);
    return () => {
      listeners = listeners.filter(l => l !== handleNotification);
    };
  }, []);

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="fixed bottom-24 lg:bottom-10 left-1/2 -translate-x-1/2 z-[100] flex flex-col items-center gap-3 w-full max-w-[90vw] md:max-w-md pointer-events-none">
      <AnimatePresence mode="popLayout">
        {notifications.map((notification) => {
          
          let bgColor = "bg-surface-container-high border-white/10 text-on-surface";
          let icon = "info";
          let iconColor = "text-secondary";

          if (notification.type === "success") {
             bgColor = "bg-secondary-container/90 border-secondary/20 text-on-secondary-container";
             icon = "check_circle";
             iconColor = "text-secondary";
          } else if (notification.type === "error") {
             bgColor = "bg-error-container/90 border-error/20 text-on-error-container";
             icon = "error";
             iconColor = "text-error";
          } else if (notification.type === "warning") {
             bgColor = "bg-[#f59e0b]/20 border-[#f59e0b]/20 text-on-surface";
             icon = "warning";
             iconColor = "text-[#f59e0b]";
          }

          return (
            <motion.div
              layout
              key={notification.id}
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.3 } }}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 300,
                duration: 0.4
              }}
              className={`w-full backdrop-blur-xl border shadow-2xl p-4 rounded-2xl flex items-start gap-4 pointer-events-auto ${bgColor}`}
            >
              <span className={`material-symbols-outlined mt-0.5 ${iconColor}`} style={{ fontVariationSettings: "'FILL' 1" }}>
                {icon}
              </span>
              <div className="flex-1">
                <h4 className="font-bold text-sm tracking-tight">{notification.title}</h4>
                <p className="text-xs opacity-80 leading-relaxed mt-0.5">{notification.message}</p>
              </div>
              <button 
                onClick={() => removeNotification(notification.id)}
                className="opacity-50 hover:opacity-100 transition-opacity active:scale-95 p-1 rounded-lg hover:bg-white/10"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
