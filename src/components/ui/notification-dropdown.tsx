"use client";

import { Bell, AlertTriangle, TrendingUp, Lightbulb, X, Check, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { mockNotifications, formatTimestamp, Notification } from "@/lib/notifications";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface NotificationDropdownProps {
  className?: string;
  open?: boolean;
  animate?: boolean;
}

export default function NotificationDropdown({ className, open = false, animate = false }: NotificationDropdownProps) {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const unreadCount = notifications.filter((n: Notification) => !n.read).length;
  const router = useRouter();

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => 
      prev.filter(notification => notification.id !== id)
    );
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "alert":
        return <AlertTriangle className="h-4 w-4 text-destructive" />;
      case "tariff":
        return <TrendingUp className="h-4 w-4 text-blue-500" />;
      case "recommendation":
        return <Lightbulb className="h-4 w-4 text-yellow-500" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-destructive text-destructive-foreground";
      case "medium":
        return "bg-orange-500 text-white";
      case "low":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className={`relative h-9 w-9 hover:bg-accent ${className}`}>
          <Bell className="h-6 w-6" />
          {unreadCount > 0 && (
            <Badge
              className={cn(
                "absolute -top-0.5 -right-0.5 flex items-center justify-center p-0 text-xs font-medium border border-background bg-red-500 text-white",
                animate && open
                  ? "h-4 w-4 text-[10px]"  // Sidebar context: smaller badge
                  : "h-5 w-5"  // Floating context: normal size
              )}
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" side="bottom" sideOffset={12} className="w-96 p-0">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Notificaciones</h3>
            {unreadCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                {unreadCount} nuevas
              </Badge>
            )}
          </div>
        </div>

        <ScrollArea className="h-[400px]">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No hay notificaciones nuevas</p>
            </div>
          ) : (
            <div className="p-2">
              {notifications.map((notification: Notification, index: number) => (
                <div key={notification.id}>
                  <div
                    className={`p-3 rounded-lg transition-colors hover:bg-muted/50 ${
                      !notification.read ? "bg-blue-50 dark:bg-blue-950/20" : ""
                    }`}
                  >
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {getIcon(notification.type)}
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <p className={`text-sm font-medium leading-tight ${
                              !notification.read ? "text-foreground" : "text-muted-foreground"
                            }`}>
                              {notification.title}
                            </p>
                            <p className={`text-xs mt-1 leading-relaxed ${
                              !notification.read ? "text-foreground/80" : "text-muted-foreground"
                            }`}>
                              {notification.message}
                            </p>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <Badge
                              className={`text-xs px-1.5 py-0.5 ${getPriorityColor(notification.priority)}`}
                            >
                              {notification.priority === "high" ? "Alta" :
                               notification.priority === "medium" ? "Media" : "Baja"}
                            </Badge>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            {formatTimestamp(notification.timestamp)}
                          </span>
                          {notification.actionable && (
                            <div className="flex gap-1">
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="h-6 px-2 text-xs"
                                onClick={() => dismissNotification(notification.id)}
                              >
                                <X className="h-3 w-3 mr-1" />
                                Ignorar
                              </Button>
                              <Button 
                                size="sm" 
                                className="h-6 px-2 text-xs"
                                onClick={() => {
                                  markAsRead(notification.id);
                                  router.push('/notifications');
                                }}
                              >
                                <Check className="h-3 w-3 mr-1" />
                                Ver
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  {index < notifications.length - 1 && (
                    <Separator className="my-1" />
                  )}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {notifications.length > 0 && (
          <div className="p-3 border-t">
            <div className="flex items-center justify-between">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs"
                onClick={markAllAsRead}
                disabled={unreadCount === 0}
              >
                Marcar todas como leídas
              </Button>
              <Link href="/notifications">
                <Button variant="outline" size="sm" className="text-xs">
                  Ver todas
                </Button>
              </Link>
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
