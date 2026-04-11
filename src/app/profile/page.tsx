"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { getCelsiaLogoUrl } from "@/lib/url-utils";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Settings,
  CreditCard,
  Bell,
  Shield,
  LogOut,
  Edit,
  Save,
  X,
  Info
} from "lucide-react";
import { versionInfo } from "@/lib/version";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [editedNombre, setEditedNombre] = useState("");
  const [editedContractId, setEditedContractId] = useState("");
  const [editedUbicacion, setEditedUbicacion] = useState("");

  useEffect(() => {
  const data = localStorage.getItem("user");

  if (!data) {
    router.push("/");
    return;
  }

  const parsedUser = JSON.parse(data);
  setUser(parsedUser);

  setEditedNombre(parsedUser.nombre);
  setEditedContractId(parsedUser.contractId);
  setEditedUbicacion(parsedUser.ubicacion.address);

}, []);

useEffect(() => {
    
    if (user) {
      setEditedNombre(user.nombre);
      setEditedContractId(user.contractId);
      setEditedUbicacion(user.ubicacion.address);
    }
  }, [user, router]);

  const handleSave = () => {
  if (user) {
    const updatedUser = {
      ...user,
      nombre: editedNombre,
      contractId: editedContractId,
      ubicacion: {
        ...user.ubicacion,
        address: editedUbicacion,
      },
    };

    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
    setIsEditing(false);
  }
};
  const handleCancel = () => {
    if (user) {
      setEditedNombre(user.nombre);
      setEditedContractId(user.contractId);
      setEditedUbicacion(user.ubicacion.address);
    }
    setIsEditing(false);
  };

  const handleLogout = () => {
  localStorage.removeItem("user");
  router.push("/");
};

  if (!user) return null;
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8 pt-4 md:pt-16 w-full">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Perfil de Usuario
          </h1>
          <p className="text-muted-foreground">
            Gestiona tu información personal y preferencias de la cuenta
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Profile Information */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="xl:col-span-2 space-y-6">
              {/* Personal Information */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Información Personal
                    </CardTitle>
                    {!isEditing ? (
                      <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={handleCancel}>
                          <X className="h-4 w-4 mr-2" />
                          Cancelar
                        </Button>
                        <Button size="sm" onClick={handleSave}>
                          <Save className="h-4 w-4 mr-2" />
                          Guardar
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage 
                        src={getCelsiaLogoUrl()} 
                        alt={user.nombre}
                        className="object-contain bg-white p-2"
                      />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-lg font-semibold">
                        {user.nombre.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      {isEditing ? (
                        <div className="space-y-2">
                          <Input
                            value={editedNombre}
                            onChange={(e) => setEditedNombre(e.target.value)}
                            className="max-w-xs"
                          />
                        </div>
                      ) : (
                        <>
                          <h3 className="text-lg font-semibold text-foreground">{user.nombre}</h3>
                          <p className="text-muted-foreground">{user.contractId}</p>
                          <Badge variant="secondary" className="mt-1">Activo</Badge>
                        </>
                      )}
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <div className="flex-1">
                        <Label className="text-sm font-medium text-foreground">ID del Contrato</Label>
                        {isEditing ? (
                          <Input
                            value={editedContractId}
                            onChange={(e) => setEditedContractId(e.target.value)}
                            className="mt-1"
                          />
                        ) : (
                          <p className="text-sm text-muted-foreground">{user.contractId}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <div className="flex-1">
                        <Label className="text-sm font-medium text-foreground">Ubicación</Label>
                        {isEditing ? (
                          <Input
                            value={editedUbicacion}
                            onChange={(e) => setEditedUbicacion(e.target.value)}
                            className="mt-1"
                          />
                        ) : (
                          <p className="text-sm text-muted-foreground">{user.ubicacion.address}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Miembro desde</p>
                        <p className="text-sm text-muted-foreground">{new Date().toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Account Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Configuración de Cuenta
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button variant="outline" className="justify-start h-auto p-4">
                      <div className="flex items-center gap-3">
                        <Shield className="h-5 w-5 text-blue-500" />
                        <div className="text-left">
                          <p className="font-medium">Seguridad</p>
                          <p className="text-sm text-muted-foreground">Cambiar contraseña y configuración de seguridad</p>
                        </div>
                      </div>
                    </Button>

                    <Button variant="outline" className="justify-start h-auto p-4">
                      <div className="flex items-center gap-3">
                        <Bell className="h-5 w-5 text-yellow-500" />
                        <div className="text-left">
                          <p className="font-medium">Notificaciones</p>
                          <p className="text-sm text-muted-foreground">Configurar alertas y preferencias</p>
                        </div>
                      </div>
                    </Button>

                    <Button variant="outline" className="justify-start h-auto p-4">
                      <div className="flex items-center gap-3">
                        <CreditCard className="h-5 w-5 text-green-500" />
                        <div className="text-left">
                          <p className="font-medium">Facturación</p>
                          <p className="text-sm text-muted-foreground">Métodos de pago y facturas</p>
                        </div>
                      </div>
                    </Button>

                    <Button variant="outline" className="justify-start h-auto p-4">
                      <div className="flex items-center gap-3">
                        <User className="h-5 w-5 text-purple-500" />
                        <div className="text-left">
                          <p className="font-medium">Privacidad</p>
                          <p className="text-sm text-muted-foreground">Control de datos y privacidad</p>
                        </div>
                      </div>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Estadísticas Rápidas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">2,450</div>
                    <p className="text-sm text-muted-foreground">kWh Consumidos</p>
                  </div>

                  <Separator />

                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">$1,250,000</div>
                    <p className="text-sm text-muted-foreground">Ahorro Mensual</p>
                  </div>

                  <Separator />

                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">98%</div>
                    <p className="text-sm text-muted-foreground">Eficiencia</p>
                  </div>
                </CardContent>
              </Card>

              {/* Account Status */}
              <Card>
                <CardHeader>
                  <CardTitle>Estado de Cuenta</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Plan Actual</span>
                    <Badge>Premium</Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Próxima Factura</span>
                    <span className="text-sm font-medium">15 Nov 2024</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Último Pago</span>
                    <span className="text-sm font-medium text-green-600">15 Oct 2024</span>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Acciones Rápidas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button className="w-full justify-start" variant="outline">
                    <Settings className="h-4 w-4 mr-2" />
                    Configuración General
                  </Button>

                  <Button className="w-full justify-start" variant="outline">
                    <Bell className="h-4 w-4 mr-2" />
                    Preferencias de Notificaciones
                  </Button>

                  <Separator className="my-3" />

                  {/* Version Info */}
                  <div className="px-3 py-2 bg-muted/50 rounded-lg flex items-center gap-2">
                    <Info className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      Versión {versionInfo.version}
                    </span>
                  </div>

                  <Button 
                    className="w-full justify-start text-destructive hover:text-destructive" 
                    variant="ghost"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Cerrar Sesión
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
