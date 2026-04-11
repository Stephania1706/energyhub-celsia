import { Bell, AlertTriangle, TrendingUp, Lightbulb, X, Check, ChevronDown, Filter } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { mockNotifications, formatTimestamp } from "@/lib/notifications";

type FilterType = "all" | "alert" | "tariff" | "recommendation";
type SortType = "newest" | "oldest" | "priority";

export default function NotificationCenter() {
  const [visibleCount, setVisibleCount] = useState(4);
  const [filter, setFilter] = useState<FilterType>("all");
  const [sort, setSort] = useState<SortType>("newest");

  const filteredNotifications = mockNotifications.filter((notification) => {
    if (filter === "all") return true;
    return notification.type === filter;
  });

  const sortedNotifications = [...filteredNotifications].sort((a, b) => {
    if (sort === "priority") {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }
    if (sort === "newest") {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    }
    return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
  });

  const visibleNotifications = sortedNotifications.slice(0, visibleCount);
  const hasMore = visibleCount < sortedNotifications.length;

  const getIcon = (type: string) => {
    switch (type) {
      case "alert":
        return <AlertTriangle className="h-5 w-5 text-destructive" />;
      case "tariff":
        return <TrendingUp className="h-5 w-5 text-blue-500" />;
      case "recommendation":
        return <Lightbulb className="h-5 w-5 text-yellow-500" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "destructive";
      case "medium":
        return "default";
      case "low":
        return "secondary";
      default:
        return "default";
    }
  };

  const showMore = () => {
    setVisibleCount(prev => Math.min(prev + 4, sortedNotifications.length));
  };

  const showLess = () => {
    setVisibleCount(4);
  };

  return (
    <Card className="bg-card border-border">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Bell className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">Centro de Notificaciones</h2>
              <p className="text-sm text-muted-foreground">Alertas y recomendaciones personalizadas</p>
            </div>
          </div>
          <Badge variant="secondary" className="text-xs">
            {sortedNotifications.length} total
          </Badge>
        </div>

        {/* Filters and Sort */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  {filter === "all" ? "Todas" : filter === "alert" ? "Alertas" : filter === "tariff" ? "Tarifas" : "Recomendaciones"}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setFilter("all")}>Todas</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter("alert")}>Alertas</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter("tariff")}>Tarifas</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter("recommendation")}>Recomendaciones</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                {sort === "newest" ? "Más recientes" : sort === "oldest" ? "Más antiguas" : "Por prioridad"}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setSort("newest")}>Más recientes</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSort("oldest")}>Más antiguas</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSort("priority")}>Por prioridad</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <ScrollArea className="h-[500px]">
        <div className="p-4 space-y-3">
          {visibleNotifications.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No hay notificaciones que coincidan con los filtros seleccionados.</p>
            </div>
          ) : (
            visibleNotifications.map((notification) => (
              <Card
                key={notification.id}
                className="p-4 hover:shadow-md transition-all duration-200 border-l-4"
                style={{
                  borderLeftColor:
                    notification.priority === "high"
                      ? "hsl(var(--destructive))"
                      : notification.priority === "medium"
                      ? "hsl(var(--primary))"
                      : "hsl(var(--muted))",
                }}
              >
                <div className="flex gap-4">
                  <div className="flex-shrink-0 mt-1">{getIcon(notification.type)}</div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold text-foreground">{notification.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                      </div>
                      <Badge variant={getPriorityColor(notification.priority) as any} className="text-xs whitespace-nowrap">
                        {notification.priority === "high" ? "Alta" : notification.priority === "medium" ? "Media" : "Baja"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{formatTimestamp(notification.timestamp)}</span>
                      {notification.actionable && (
                        <div className="flex gap-2">
                          <Button size="sm" variant="ghost" className="h-8 text-xs">
                            <X className="h-3 w-3 mr-1" />
                            Ignorar
                          </Button>
                          <Button size="sm" className="h-8 text-xs">
                            <Check className="h-3 w-3 mr-1" />
                            Implementar
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </ScrollArea>

      {/* Show More/Less Controls */}
      {sortedNotifications.length > 4 && (
        <div className="p-4 border-t border-border">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Mostrando {visibleNotifications.length} de {sortedNotifications.length} notificaciones
            </span>
            <div className="flex gap-2">
              {visibleCount > 4 && (
                <Button variant="outline" size="sm" onClick={showLess}>
                  Mostrar menos
                </Button>
              )}
              {hasMore && (
                <Button size="sm" onClick={showMore}>
                  Mostrar más ({sortedNotifications.length - visibleCount} restantes)
                </Button>
              )}
              <Link href="/notifications">
                <Button variant="outline" size="sm">
                  Ver todas
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Show Ver todas when no pagination needed */}
      {sortedNotifications.length <= 4 && (
        <div className="p-4 border-t border-border">
          <div className="flex items-center justify-center">
            <Link href="/notifications">
              <Button variant="outline" size="sm">
                Ver todas las notificaciones
              </Button>
            </Link>
          </div>
        </div>
      )}
    </Card>
  );
}