"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Bell,
  Search,
  Filter,
  Grid3X3,
  List,
  CheckSquare,
  Archive,
  Trash2,
  Eye,
  EyeOff
} from "lucide-react";
import { useState } from "react";
import { mockNotifications, formatTimestamp } from "@/lib/notifications";

type ViewMode = "list" | "grid";
type FilterStatus = "all" | "unread" | "read";

export default function NotificationsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);

  const filteredNotifications = mockNotifications.filter((notification) => {
    const matchesSearch = notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (notification.category?.toLowerCase() || '').includes(searchQuery.toLowerCase());

    const matchesStatus = filterStatus === "all" ||
                         (filterStatus === "unread" && !notification.read) ||
                         (filterStatus === "read" && notification.read);

    return matchesSearch && matchesStatus;
  });

  const unreadCount = mockNotifications.filter(n => !n.read).length;
  const totalCount = mockNotifications.length;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "destructive";
      case "medium": return "default";
      case "low": return "secondary";
      default: return "default";
    }
  };

  const toggleNotificationSelection = (id: string) => {
    setSelectedNotifications(prev =>
      prev.includes(id)
        ? prev.filter(n => n !== id)
        : [...prev, id]
    );
  };

  const selectAll = () => {
    setSelectedNotifications(filteredNotifications.map(n => n.id));
  };

  const deselectAll = () => {
    setSelectedNotifications([]);
  };

  return (
    <div className="h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-primary/10">
                <Bell className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Centro de Notificaciones</h1>
                <p className="text-muted-foreground">
                  Gestiona todas tus alertas y recomendaciones en un solo lugar
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-sm">
                {totalCount} totales
              </Badge>
              <Badge variant="destructive" className="text-sm">
                {unreadCount} sin leer
              </Badge>
            </div>
          </div>


          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar notificaciones..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex items-center gap-2">
              <Select value={filterStatus} onValueChange={(value: FilterStatus) => setFilterStatus(value)}>
                <SelectTrigger className="w-[140px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="unread">Sin leer</SelectItem>
                  <SelectItem value="read">Leídas</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center border rounded-md">
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-r-none"
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-l-none"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedNotifications.length > 0 && (
            <Card className="p-4 mb-6 border-primary">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckSquare className="h-5 w-5 text-primary" />
                  <span className="font-medium">
                    {selectedNotifications.length} notificación{selectedNotifications.length > 1 ? 'es' : ''} seleccionada{selectedNotifications.length > 1 ? 's' : ''}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-1" />
                    Marcar como leída{selectedNotifications.length > 1 ? 's' : ''}
                  </Button>
                  <Button variant="outline" size="sm">
                    <Archive className="h-4 w-4 mr-1" />
                    Archivar
                  </Button>
                  <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                    <Trash2 className="h-4 w-4 mr-1" />
                    Eliminar
                  </Button>
                  <Button variant="ghost" size="sm" onClick={deselectAll}>
                    Cancelar
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Notifications Content */}
        {filteredNotifications.length === 0 ? (
          <Card className="p-12 text-center">
            <Bell className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No hay notificaciones</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery || filterStatus !== "all"
                ? "No se encontraron notificaciones que coincidan con tus filtros."
                : "No tienes notificaciones nuevas en este momento."}
            </p>
            {(searchQuery || filterStatus !== "all") && (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setFilterStatus("all");
                }}
              >
                Limpiar filtros
              </Button>
            )}
          </Card>
        ) : (
          <div className={viewMode === "grid"
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            : "space-y-3"
          }>
            {filteredNotifications.map((notification) => (
              <Card
                key={notification.id}
                className={`p-4 transition-all hover:shadow-md cursor-pointer border-l-4 ${
                  !notification.read ? "bg-blue-50/50 dark:bg-blue-950/20" : ""
                } ${
                  selectedNotifications.includes(notification.id) ? "ring-2 ring-primary" : ""
                }`}
                style={{
                  borderLeftColor:
                    notification.priority === "high"
                      ? "hsl(var(--destructive))"
                      : notification.priority === "medium"
                      ? "hsl(var(--primary))"
                      : "hsl(var(--muted))",
                }}
                onClick={() => toggleNotificationSelection(notification.id)}
              >
                <div className="flex gap-3">
                  {viewMode === "list" && (
                    <div className="flex-shrink-0 mt-1">
                      <input
                        type="checkbox"
                        checked={selectedNotifications.includes(notification.id)}
                        onChange={() => toggleNotificationSelection(notification.id)}
                        className="rounded border-gray-300"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  )}

                  <div className="flex-shrink-0 mt-1">
                    <div className={`p-2 rounded-full ${
                      notification.type === "alert" ? "bg-red-100 text-red-600" :
                      notification.type === "tariff" ? "bg-blue-100 text-blue-600" :
                      "bg-yellow-100 text-yellow-600"
                    }`}>
                      {notification.type === "alert" && <Bell className="h-4 w-4" />}
                      {notification.type === "tariff" && <span className="text-xs font-bold">$</span>}
                      {notification.type === "recommendation" && <span className="text-xs font-bold">💡</span>}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex-1 min-w-0">
                        <h3 className={`font-semibold leading-tight truncate ${
                          !notification.read ? "text-foreground" : "text-muted-foreground"
                        }`}>
                          {notification.title}
                        </h3>
                        <p className={`text-sm mt-1 leading-relaxed ${
                          !notification.read ? "text-foreground/80" : "text-muted-foreground"
                        }`}>
                          {notification.message}
                        </p>
                      </div>

                      <div className="flex flex-col items-end gap-2 flex-shrink-0">
                        <Badge
                          variant={getPriorityColor(notification.priority) as any}
                          className="text-xs whitespace-nowrap"
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
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{formatTimestamp(notification.timestamp)}</span>
                        <span>•</span>
                        <Badge variant="outline" className="text-xs">
                          {notification.category || 'General'}
                        </Badge>
                      </div>

                      {notification.actionable && (
                        <div className="flex gap-1">
                          <Button size="sm" variant="ghost" className="h-7 px-2 text-xs">
                            <EyeOff className="h-3 w-3 mr-1" />
                            Ignorar
                          </Button>
                          <Button size="sm" className="h-7 px-2 text-xs">
                            <Eye className="h-3 w-3 mr-1" />
                            Ver
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        {filteredNotifications.length > 0 && (
          <div className="flex items-center justify-between mt-8">
            <div className="text-sm text-muted-foreground">
              Mostrando {filteredNotifications.length} de {totalCount} notificaciones
            </div>

            <div className="flex items-center gap-2">
              {selectedNotifications.length === 0 ? (
                <Button variant="outline" size="sm" onClick={selectAll}>
                  <CheckSquare className="h-4 w-4 mr-1" />
                  Seleccionar todas
                </Button>
              ) : (
                <Button variant="outline" size="sm" onClick={deselectAll}>
                  Deseleccionar
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Information Sections - Moved to bottom */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Información del Sector Energético</h2>
          
          {/* New Information Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Alertas de Tarifa */}
            <Card className="p-6 border-l-4 border-l-blue-500">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                  <Bell className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">Alertas de tu tarifa de energía</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Mantente informado sobre cambios en tu tarifa energética
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Tarifa actualizada para diciembre 2025</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span>Incremento del 0,9% en la tarifa total</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Noticias y Actualidad */}
            <Card className="p-6 border-l-4 border-l-green-500">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-green-100 text-green-600">
                  <span className="text-lg">📰</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">Noticias y Actualidad energética</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Últimas novedades del sector energético colombiano
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Nuevas regulaciones CREG 2025</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span>Actualización del IPP y cargos regulados</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Información Detallada */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Como va el IPP */}
            <Card className="p-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="p-2 rounded-lg bg-orange-100 text-orange-600">
                  <span className="text-lg">📈</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">¿Cómo va el IPP?</h3>
                  <p className="text-sm text-muted-foreground">
                    Índice de Precios al Productor - Actualización 2025
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-3">
                    El incremento del IPP en un 3% en el G+C durante el 2025, y de los cargos regulados de Transmisión (STR) y otros (Restricciones, SIC, CREG), ha ocasionado un incremento en la tarifa total del 5% en 2025.
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Variación mensual más alta:</span>
                        <span className="font-semibold text-red-600">1,38%</span>
                      </div>
                      <div className="text-xs text-muted-foreground">diciembre de 2025</div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Variación acumulada:</span>
                        <span className="font-semibold text-orange-600">3.93%</span>
                      </div>
                      <div className="text-xs text-muted-foreground">últimos 12 meses</div>
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Proyección crecimiento:</span>
                      <span className="font-semibold text-green-600">4.3%</span>
                    </div>
                    <div className="text-xs text-muted-foreground">al cierre de año</div>
                  </div>
                </div>
                
                <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg">
                  <p className="text-xs text-muted-foreground">
                    <strong>Nota:</strong> Históricamente se ha utilizado el IPP en lugar del Índice de Precios al Consumidor (IPC) por considerarse un indicador que aproxima el avance en los precios de los insumos para la producción a nivel agregado y tiene un comportamiento más estable.
                  </p>
                </div>
              </div>
            </Card>

            {/* Como van las Restricciones */}
            <Card className="p-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="p-2 rounded-lg bg-red-100 text-red-600">
                  <span className="text-lg">⚡</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">¿Cómo van las Restricciones en Colombia?</h3>
                  <p className="text-sm text-muted-foreground">
                    Información sobre restricciones del sistema eléctrico
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-3">
                    Cuando el precio de bolsa es menor que el costo de las plantas térmicas, se genera una diferencia que debe reconocerse. Esta diferencia se remunera a través de las Restricciones del sistema, calculadas como la diferencia entre el costo térmico y el precio de bolsa.
                  </p>
                  
                  <div className="bg-yellow-50 dark:bg-yellow-950/20 p-3 rounded-lg">
                    <p className="text-xs text-muted-foreground">
                      <strong>Compromiso Celsia:</strong> Existen variables económicas, nacionales e internacionales, que están fuera del control de una empresa de energía. En Celsia mantenemos el compromiso de informarte ante cualquier cambio regulatorio que pueda impactar el costo unitario del servicio.
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
