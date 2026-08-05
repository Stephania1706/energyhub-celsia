import { DollarSign, TrendingUp, Info, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface TariffComponent {
  name: string;
  percentage: number;
  amount: number;
  color: string;
}

const tariffComponents: TariffComponent[] = [
  { name: "Energía", percentage: 45, amount: 6156000, color: "bg-blue-500" },
  { name: "Peajes", percentage: 28, amount: 3832000, color: "bg-purple-500" },
  { name: "Impuestos", percentage: 18, amount: 2464000, color: "bg-orange-500" },
  { name: "Otros cargos", percentage: 9, amount: 1228000, color: "bg-gray-500" },
];

export default function TariffSection() {
  const totalCost = tariffComponents.reduce((sum, item) => sum + item.amount, 0);

  return (
    <Card className="bg-card border-border">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-500/10">
              <DollarSign className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">Información Tarifaria</h2>
              <p className="text-sm text-muted-foreground">Desglose detallado de costos energéticos</p>
            </div>
          </div>
          <Badge variant="outline" className="gap-1">
            <TrendingUp className="h-3 w-3" />
            +8% próximo mes
          </Badge>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Total Cost Card */}
        <Card className="p-6 bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Costo Total Mensual</p>
              <p className="text-4xl font-bold text-foreground">${totalCost.toLocaleString('es-CO')} COP</p>
              <p className="text-sm text-muted-foreground mt-2">Tarifa actual: 2.0 TD</p>
            </div>
            <Button variant="outline">
              Comparar Planes
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </Card>

        {/* Tariff Breakdown */}
        <div className="space-y-4">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <Info className="h-4 w-4 text-muted-foreground" />
            Desglose de Componentes
          </h3>

          {tariffComponents.map((component, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${component.color}`} />
                  <span className="font-medium text-foreground">{component.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-muted-foreground">{component.percentage}%</span>
                  <span className="font-semibold text-foreground">${component.amount.toLocaleString('es-CO')} COP</span>
                </div>
              </div>
              <Progress value={component.percentage} className="h-2" />
            </div>
          ))}
        </div>

        {/* Alerts */}
        <Card className="p-4 bg-orange-500/5 border-orange-500/20">
          <div className="flex gap-3">
            <TrendingUp className="h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5" />
            <div className="space-y-2">
              <h4 className="font-semibold text-foreground">Alerta de Incremento Tarifario</h4>
              <p className="text-sm text-muted-foreground">
                Se espera un aumento del 8% en el componente de energía a partir del 1 de enero. Esto representa un
                incremento aproximado de $492,000 COP/mes en tu factura.
              </p>
              <Button size="sm" variant="outline" className="mt-2">
                Ver Detalles
              </Button>
            </div>
          </div>
        </Card>

        {/* Alternative Plans */}
        <div className="space-y-3">
          <h3 className="font-semibold text-foreground">Planes Alternativos</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Card className="p-4 hover:shadow-md transition-all cursor-pointer border-2 hover:border-primary">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-foreground">Tarifa 3.0 TD</h4>
                  <Badge variant="secondary">Recomendado</Badge>
                </div>
                <p className="text-2xl font-bold text-green-600">${(12720000).toLocaleString('es-CO')} COP/mes</p>
                <p className="text-sm text-muted-foreground">Ahorro estimado: ${(960000).toLocaleString('es-CO')} COP/mes</p>
                <Button size="sm" className="w-full mt-2">
                  Solicitar Cambio
                </Button>
              </div>
            </Card>

            <Card className="p-4 hover:shadow-md transition-all cursor-pointer">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-foreground">Tarifa 6.1 TD</h4>
                  <Badge variant="outline">Empresas grandes</Badge>
                </div>
                <p className="text-2xl font-bold text-foreground">${(12200000).toLocaleString('es-CO')} COP/mes</p>
                <p className="text-sm text-muted-foreground">Ahorro estimado: ${(1480000).toLocaleString('es-CO')} COP/mes</p>
                <Button size="sm" variant="outline" className="w-full mt-2">
                  Más Información
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Card>
  );
}