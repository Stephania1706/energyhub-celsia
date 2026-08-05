import { Activity, TrendingDown, TrendingUp, Zap, Calendar, Download } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';
import { useEffect, useState } from "react";

export default function EnergyConsumptionPanel() {
  const [localUser, setLocalUser] = useState<any>(null);

useEffect(() => {
  const data = localStorage.getItem("user");
  if (data) {
    setLocalUser(JSON.parse(data));
  }
}, []);

const currentUser = localUser;

  
  // Mock data for energy consumption
  const mockData = {
    currentConsumption: 1247,
    previousConsumption: 1156,
    projectedCost: 13680000,
    dailyConsumption: [45, 38, 52, 48, 65, 72, 68, 55, 62, 58, 70, 75, 82, 78, 85, 80, 72, 68, 75, 70, 65, 58, 52, 48],
    weeklyConsumption: [
      { day: "Lun", value: 85, cost: 125000 },
      { day: "Mar", value: 78, cost: 115000 },
      { day: "Mié", value: 92, cost: 135000 },
      { day: "Jue", value: 88, cost: 130000 },
      { day: "Vie", value: 75, cost: 110000 },
      { day: "Sáb", value: 45, cost: 66000 },
      { day: "Dom", value: 38, cost: 56000 }
    ],
    previousWeekConsumption: [
      { day: "Lun", value: 82, cost: 120000 },
      { day: "Mar", value: 75, cost: 110000 },
      { day: "Mié", value: 88, cost: 130000 },
      { day: "Jue", value: 85, cost: 125000 },
      { day: "Vie", value: 72, cost: 105000 },
      { day: "Sáb", value: 42, cost: 62000 },
      { day: "Dom", value: 35, cost: 51000 }
    ],
    monthlyConsumption: [
      { month: "Jul", value: 72, cost: 1050000 },
      { month: "Ago", value: 85, cost: 1250000 },
      { month: "Sep", value: 68, cost: 1000000 },
      { month: "Oct", value: 78, cost: 1150000 },
      { month: "Nov", value: 82, cost: 1200000 },
      { month: "Dic", value: 95, cost: 1400000 }
    ],
    yearlyConsumption: [
      { year: "2022", value: 12450, cost: 182000000 },
      { year: "2023", value: 13180, cost: 193000000 },
      { year: "2024", value: 14960, cost: 219000000 }
    ],
    lastWeekReactive: [
      { day: "Lun", active: 85, inductive: 12, capacitive: 8 },
      { day: "Mar", active: 78, inductive: 11, capacitive: 7 },
      { day: "Mié", active: 92, inductive: 13, capacitive: 9 },
      { day: "Jue", active: 88, inductive: 12.5, capacitive: 8.5 },
      { day: "Vie", active: 75, inductive: 10.5, capacitive: 7.5 },
      { day: "Sáb", active: 45, inductive: 6.5, capacitive: 4.5 },
      { day: "Dom", active: 38, inductive: 5.5, capacitive: 3.5 }
    ],
    monthlyReactive: [
      { month: "Jul", active: 72, inductive: 10, capacitive: 7 },
      { month: "Ago", active: 85, inductive: 12, capacitive: 8.5 },
      { month: "Sep", active: 68, inductive: 9.5, capacitive: 6.5 },
      { month: "Oct", active: 78, inductive: 11, capacitive: 7.5 },
      { month: "Nov", active: 82, inductive: 11.5, capacitive: 8 },
      { month: "Dic", active: 95, inductive: 13.5, capacitive: 9.5 }
    ],
    peakHours: [18, 19, 20, 21],
    offPeakHours: [1, 2, 3, 4, 5, 6],
    efficiency: 87.5,
    savings: 156000
  };

  const percentageChange = ((mockData.currentConsumption - mockData.previousConsumption) / mockData.previousConsumption) * 100;

  const handleExportCSV = () => {
    try {
      if (!currentUser) {
        alert("No hay información de usuario disponible");
        return;
      }

      // Prepare comprehensive CSV data
      const csvRows: string[] = [];
      
      // Header Section
      csvRows.push("RESUMEN EJECUTIVO - DATOS DEL USUARIO");
      csvRows.push("");
      csvRows.push(`Nombre,${currentUser?.nombre || "N/A"}`);
      csvRows.push(`ID de Contrato,${currentUser?.contractId || "N/A"}`);
      csvRows.push(`Dirección,${currentUser?.ubicacion?.address || "N/A"}`);
      csvRows.push(`Fecha de Exportación,${new Date().toLocaleString("es-CO")}`);
      csvRows.push("");
      
      // Consumption Metrics Section
      csvRows.push("MÉTRICAS DE CONSUMO");
      csvRows.push("");
      csvRows.push("Métrica,Valor,Unidad");
      csvRows.push(`Consumo Actual,${mockData.currentConsumption},kWh`);
      csvRows.push(`Consumo Anterior,${mockData.previousConsumption},kWh`);
      csvRows.push(`Variación,${percentageChange.toFixed(1)},%`);
      csvRows.push(`Costo Proyectado,${mockData.projectedCost},COP`);
      csvRows.push(`Eficiencia Energética,${mockData.efficiency},%`);
      csvRows.push(`Ahorro Mensual,${mockData.savings},COP`);
      csvRows.push("");
      
      // Monthly Consumption Section
      csvRows.push("CONSUMO MENSUAL");
      csvRows.push("");
      csvRows.push("Mes,Consumo (kWh),Costo (COP)");
      mockData.monthlyConsumption.forEach(item => {
        const monthNames: { [key: string]: string } = {
          "Jul": "Julio", "Ago": "Agosto", "Sep": "Septiembre",
          "Oct": "Octubre", "Nov": "Noviembre", "Dic": "Diciembre"
        };
        csvRows.push(`${monthNames[item.month] || item.month},${item.value},${item.cost}`);
      });
      csvRows.push("");
      
      // Weekly Consumption Section
      csvRows.push("CONSUMO SEMANAL");
      csvRows.push("");
      csvRows.push("Día,Consumo (kWh),Costo (COP)");
      mockData.weeklyConsumption.forEach(item => {
        csvRows.push(`${item.day},${item.value},${item.cost}`);
      });
      csvRows.push("");
      
      // Reactive Energy Section
      csvRows.push("ENERGÍA REACTIVA - ÚLTIMA SEMANA");
      csvRows.push("");
      csvRows.push("Día,Activa (kWh),Inductiva (kWh),Capacitiva (kWh)");
      mockData.lastWeekReactive.forEach(item => {
        csvRows.push(`${item.day},${item.active},${item.inductive},${item.capacitive}`);
      });
      csvRows.push("");
      
      csvRows.push("ENERGÍA REACTIVA - MENSUAL");
      csvRows.push("");
      csvRows.push("Mes,Activa (kWh),Inductiva (kWh),Capacitiva (kWh)");
      mockData.monthlyReactive.forEach(item => {
        const monthNames: { [key: string]: string } = {
          "Jul": "Julio", "Ago": "Agosto", "Sep": "Septiembre",
          "Oct": "Octubre", "Nov": "Noviembre", "Dic": "Diciembre"
        };
        csvRows.push(`${monthNames[item.month] || item.month},${item.active},${item.inductive},${item.capacitive}`);
      });
      csvRows.push("");
      
      // Hourly Distribution Section
      csvRows.push("DISTRIBUCIÓN HORARIA");
      csvRows.push("");
      csvRows.push("Franja,Porcentaje,Consumo (kWh)");
      csvRows.push("Valle (Tarifa Baja),45,560");
      csvRows.push("Tarifa Media,35,437");
      csvRows.push("Pico (Tarifa Alta),20,250");
      csvRows.push("");
      
      // Environmental Impact Section
      csvRows.push("IMPACTO AMBIENTAL");
      csvRows.push("");
      csvRows.push("Métrica,Valor,Unidad");
      csvRows.push("CO2 Emitido,2.4,toneladas");
      csvRows.push("Equivalente en Árboles,112,árboles");
      csvRows.push("Agua Virtual,1850,litros");
      csvRows.push("Huella de Carbono,3.2,toneladas CO2");
      csvRows.push("");
      
      // Energy Efficiency Section
      csvRows.push("EFICIENCIA ENERGÉTICA");
      csvRows.push("");
      csvRows.push("Métrica,Valor,Unidad");
      csvRows.push("Meta de Sostenibilidad,65,%");
      csvRows.push("Progreso Actual,42,%");
      csvRows.push("Reducción Horas Pico,15,%");
      csvRows.push("Incremento Horas Valle,22,%");
      csvRows.push("");
      
      // Join all rows with UTF-8 BOM for Excel compatibility
      const BOM = "\uFEFF";
      const csvContent = BOM + csvRows.join("\n");
      
      // Create blob and download
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      
      const fileName = `datos_energia_${(currentUser?.nombre || "usuario").replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.csv`;
      
      link.href = url;
      link.download = fileName;
      link.style.display = "none";
      
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      setTimeout(() => {
        if (document.body.contains(link)) {
          document.body.removeChild(link);
        }
        URL.revokeObjectURL(url);
      }, 100);
      
      // Show toast notification
      setTimeout(() => {
        alert("CSV descargado con éxito");
      }, 150);
    } catch (error) {
      console.error("Error al exportar CSV:", error);
      alert("No se pudo exportar el archivo CSV");
    }
  };

  // ECharts configurations
  const chartTheme = 'light';
  // Daily chart configuration
  const dailyChartOption = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#ffffff',
      borderColor:'#e5e7eb',
      textStyle: {
        color: '#111827'
      },
      formatter: function(params: any) {
        const data = params[0];
        const hour = data.axisValue;
        const value = data.value;
        const isPeak = mockData.peakHours.includes(parseInt(hour));
        const isOffPeak = mockData.offPeakHours.includes(parseInt(hour));
        let type = 'Normal';
        if (isPeak) type = 'Pico';
        if (isOffPeak) type = 'Valle';
        return `${hour}:00<br/>${value} kWh<br/>Tipo: ${type}`;
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: Array.from({length: 24}, (_, i) => `${i}:00`),
      axisLabel: {
        color:  '#6b7280',
        interval: 3
      },
      axisLine: {
        lineStyle: {
          color: '#e5e7eb'
        }
      }
    },
    yAxis: {
      type: 'value',
      name: 'kWh',
      nameTextStyle: {
        color:  '#6b7280'
      },
      axisLabel: {
        color:  '#6b7280'
      },
      axisLine: {
        lineStyle: {
          color: '#e5e7eb'
        }
      },
      splitLine: {
        lineStyle: {
          color: '#f3f4f6'
        }
      }
    },
    series: [{
      data: mockData.dailyConsumption.map((value, index) => ({
        value,
        itemStyle: {
          color: mockData.peakHours.includes(index) 
            ? '#ff7f0e' 
            : mockData.offPeakHours.includes(index) 
            ? '#9ca3b8' 
            : '#10b981',
          borderRadius: [4, 4, 0, 0]
        }
      })),
      type: 'bar',
      barWidth: '60%',
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowOffsetY: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }]
  };

  // Weekly chart configuration
  const weeklyChartOption = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#ffffff',
      borderColor: '#e5e7eb',
      textStyle: {
        color: '#111827'
      },
      formatter: function(params: any) {
        const data = params[0];
        const day = data.axisValue;
        const consumption = data.value;
        const cost = mockData.weeklyConsumption.find(item => item.day === day)?.cost || 0;
        return `${day}<br/>Consumo: ${consumption} kWh<br/>Costo: $${cost.toLocaleString('es-CO')} COP`;
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: mockData.weeklyConsumption.map(item => item.day),
      axisLabel: {
        color:  '#6b7280'
      },
      axisLine: {
        lineStyle: {
          color:  '#e5e7eb'
        }
      }
    },
    yAxis: {
      type: 'value',
      name: 'kWh',
      nameTextStyle: {
        color:  '#6b7280'
      },
      axisLabel: {
        color: '#6b7280'
      },
      axisLine: {
        lineStyle: {
          color: '#e5e7eb'
        }
      },
      splitLine: {
        lineStyle: {
          color:  '#f3f4f6'
        }
      }
    },
    series: [{
      data: mockData.weeklyConsumption.map((value, index) => ({
        value: value.value,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
  { offset: 0, color: '#3b82f6' },
  { offset: 1, color: '#1d4ed8' }
]),
          borderRadius: [4, 4, 0, 0]
        }
      })),
      type: 'bar',
      barWidth: '60%',
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowOffsetY: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }]
  };

  // Monthly chart configuration
  const monthlyChartOption = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#ffffff',
      borderColor:'#e5e7eb',
      textStyle: {
        color: '#111827'
      },
      formatter: function(params: any) {
        const data = params[0];
        const month = data.axisValue;
        const consumption = data.value;
        const cost = mockData.monthlyConsumption.find(item => item.month === month)?.cost || 0;
        return `${month}<br/>Consumo: ${consumption} kWh<br/>Costo: $${(cost / 1000000).toFixed(1)}M COP`;
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: mockData.monthlyConsumption.map(item => item.month),
      axisLabel: {
        color: '#6b7280'
      },
      axisLine: {
        lineStyle: {
          color: '#e5e7eb'
        }
      }
    },
    yAxis: {
      type: 'value',
      name: 'kWh',
      nameTextStyle: {
        color: '#6b7280'
      },
      axisLabel: {
        color: '#6b7280'
      },
      axisLine: {
        lineStyle: {
          color:  '#e5e7eb'
        }
      },
      splitLine: {
        lineStyle: {
          color: '#f3f4f6'
        }
      }
    },
    series: [{
      data: mockData.monthlyConsumption.map(item => item.value),
      type: 'line',
      smooth: true,
      lineStyle: {
        width: 3,
        color: '#3b82f6'
      },
      itemStyle: {
        color: '#3b82f6',
        borderWidth: 2,
        borderColor: '#ffffff'
      },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(59, 130, 246, 0.3)' },
          { offset: 1, color: 'rgba(59, 130, 246, 0.05)' }
        ])
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowOffsetY: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }]
  };

  // Two consecutive weeks comparison chart
  const twoWeeksComparisonOption = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor:'#ffffff',
      borderColor: '#e5e7eb',
      textStyle: {
        color:'#111827'
      },
      formatter: function(params: any) {
        let result = params[0].axisValue + '<br/>';
        params.forEach((item: any) => {
          result += `${item.marker}${item.seriesName}: ${item.value} kWh<br/>`;
        });
        return result;
      }
    },
    legend: {
      data: ['Semana Actual', 'Semana Anterior'],
      top: 10,
      textStyle: {
        color: '#6b7280'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: mockData.weeklyConsumption.map(item => item.day),
      axisLabel: {
        color: '#6b7280'
      },
      axisLine: {
        lineStyle: {
          color:  '#e5e7eb'
        }
      }
    },
    yAxis: {
      type: 'value',
      name: 'kWh',
      nameTextStyle: {
        color: '#6b7280'
      },
      axisLabel: {
        color: '#6b7280'
      },
      axisLine: {
        lineStyle: {
          color: '#e5e7eb'
        }
      },
      splitLine: {
        lineStyle: {
          color: '#f3f4f6'
        }
      }
    },
    series: [
      {
        name: 'Semana Actual',
        data: mockData.weeklyConsumption.map(item => item.value),
        type: 'bar',
        barWidth: '35%',
        itemStyle: {
          color: '#ff7f0e', // Naranja como la gráfica diaria
          borderRadius: [4, 4, 0, 0]
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowOffsetY: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      },
      {
        name: 'Semana Anterior',
        data: mockData.previousWeekConsumption.map(item => item.value),
        type: 'bar',
        barWidth: '35%',
        itemStyle: {
          color: '#9ca3b8', // Gris como la gráfica diaria
          borderRadius: [4, 4, 0, 0]
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowOffsetY: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  };

  // Two consecutive years comparison chart
  const twoYearsComparisonOption = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#ffffff',
      borderColor: '#e5e7eb',
      textStyle: {
        color: '#111827'
      },
      formatter: function(params: any) {
        const data = params[0];
        const year = data.axisValue;
        const value = data.value;
        const cost = mockData.yearlyConsumption.find(item => item.year === year)?.cost || 0;
        return `${year}<br/>Consumo: ${value} kWh<br/>Costo: $${(cost / 1000000).toFixed(1)}M COP`;
      }
    },
    legend: {
      data: ['Consumo Anual'],
      top: 10,
      textStyle: {
        color:  '#6b7280'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: mockData.yearlyConsumption.map(item => item.year),
      axisLabel: {
        color: '#6b7280'
      },
      axisLine: {
        lineStyle: {
          color:  '#e5e7eb'
        }
      }
    },
    yAxis: {
      type: 'value',
      name: 'kWh',
      nameTextStyle: {
        color: '#6b7280'
      },
      axisLabel: {
        color: '#6b7280'
      },
      axisLine: {
        lineStyle: {
          color:  '#e5e7eb'
        }
      },
      splitLine: {
        lineStyle: {
          color: '#f3f4f6'
        }
      }
    },
    series: [{
      name: 'Consumo Anual',
      data: mockData.yearlyConsumption.map((item, index) => ({
        value: item.value,
        itemStyle: {
          color: index === mockData.yearlyConsumption.length - 1 
            ? '#ff7f0e' // Naranja para el año más reciente
            : '#9ca3b8', // Gris para años anteriores
          borderRadius: [4, 4, 0, 0]
        }
      })),
      type: 'bar',
      barWidth: '60%',
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowOffsetY: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }]
  };

  // Last week reactive energy chart
  const lastWeekReactiveOption = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      backgroundColor: '#ffffff',
      borderColor:'#e5e7eb',
      textStyle: {
        color: '#111827'
      },
      formatter: function(params: any) {
        let result = params[0].axisValue + '<br/>';
        params.forEach((item: any) => {
          result += `${item.marker}${item.seriesName}: ${item.value} kWh<br/>`;
        });
        return result;
      }
    },
    legend: {
      data: ['Energía Activa', 'Reactiva Inductiva', 'Reactiva Capacitiva'],
      top: 10,
      textStyle: {
        color:  '#6b7280'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: mockData.lastWeekReactive.map(item => item.day),
      axisLabel: {
        color: '#6b7280'
      },
      axisLine: {
        lineStyle: {
          color: '#e5e7eb'
        }
      }
    },
    yAxis: {
      type: 'value',
      name: 'kWh',
      nameTextStyle: {
        color:  '#6b7280'
      },
      axisLabel: {
        color:  '#6b7280'
      },
      axisLine: {
        lineStyle: {
          color: '#e5e7eb'
        }
      },
      splitLine: {
        lineStyle: {
          color: '#f3f4f6'
        }
      }
    },
    series: [
      {
        name: 'Energía Activa',
        data: mockData.lastWeekReactive.map(item => item.active),
        type: 'bar',
        barWidth: '25%',
        itemStyle: {
          color: '#ff7f0e', // Naranja como la gráfica diaria
          borderRadius: [4, 4, 0, 0]
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowOffsetY: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      },
      {
        name: 'Reactiva Inductiva',
        data: mockData.lastWeekReactive.map(item => item.inductive),
        type: 'bar',
        barWidth: '25%',
        itemStyle: {
          color: '#9ca3b8', // Gris como la gráfica diaria
          borderRadius: [4, 4, 0, 0]
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowOffsetY: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      },
      {
        name: 'Reactiva Capacitiva',
        data: mockData.lastWeekReactive.map(item => item.capacitive),
        type: 'bar',
        barWidth: '25%',
        itemStyle: {
          color: '#10b981', // Verde como la gráfica diaria
          borderRadius: [4, 4, 0, 0]
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowOffsetY: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  };

  // Monthly reactive energy chart (bars)
  const monthlyReactiveBarsOption = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      backgroundColor:'#ffffff',
      borderColor: '#e5e7eb',
      textStyle: {
        color: '#111827'
      },
      formatter: function(params: any) {
        let result = params[0].axisValue + '<br/>';
        params.forEach((item: any) => {
          result += `${item.marker}${item.seriesName}: ${item.value} kWh<br/>`;
        });
        return result;
      }
    },
    legend: {
      data: ['Energía Activa', 'Reactiva Inductiva', 'Reactiva Capacitiva'],
      top: 10,
      textStyle: {
        color:  '#6b7280'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: mockData.monthlyReactive.map(item => item.month),
      axisLabel: {
        color: '#6b7280'
      },
      axisLine: {
        lineStyle: {
          color: '#e5e7eb'
        }
      }
    },
    yAxis: {
      type: 'value',
      name: 'kWh',
      nameTextStyle: {
        color: '#6b7280'
      },
      axisLabel: {
        color: '#6b7280'
      },
      axisLine: {
        lineStyle: {
          color:  '#e5e7eb'
        }
      },
      splitLine: {
        lineStyle: {
          color: '#f3f4f6'
        }
      }
    },
    series: [
      {
        name: 'Energía Activa',
        data: mockData.monthlyReactive.map(item => item.active),
        type: 'bar',
        barWidth: '25%',
        itemStyle: {
          color: '#ff7f0e', // Naranja como la gráfica diaria
          borderRadius: [4, 4, 0, 0]
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowOffsetY: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      },
      {
        name: 'Reactiva Inductiva',
        data: mockData.monthlyReactive.map(item => item.inductive),
        type: 'bar',
        barWidth: '25%',
        itemStyle: {
          color: '#9ca3b8', // Gris como la gráfica diaria
          borderRadius: [4, 4, 0, 0]
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowOffsetY: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      },
      {
        name: 'Reactiva Capacitiva',
        data: mockData.monthlyReactive.map(item => item.capacitive),
        type: 'bar',
        barWidth: '25%',
        itemStyle: {
          color: '#10b981', // Verde como la gráfica diaria
          borderRadius: [4, 4, 0, 0]
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowOffsetY: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  };

  return (
  <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">

    {/* HEADER */}
    <div className="bg-gradient-to-r from-orange-50 via-white to-white p-6 border-b border-slate-200">
      <div className="flex items-center justify-between">

        <div className="flex items-center gap-3">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-600 ring-1 ring-orange-200">
            <Activity className="h-6 w-6" />
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Consumo Energético
            </h2>
            <p className="text-sm text-slate-500">
              Análisis y proyecciones en tiempo real
            </p>
          </div>
        </div>

        <Button 
          variant="outline" 
          size="sm"
          className="border-slate-200 text-slate-700 hover:bg-slate-50"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleExportCSV();
          }}
        >
          <Download className="h-4 w-4 mr-2" />
          Exportar
        </Button>

      </div>
    </div>

    <div className="p-6">

      {/* MÉTRICAS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">

        {/* Consumo */}
        <Card className="p-4 bg-slate-50 border-slate-200">
          <p className="text-sm text-slate-500 mb-1">Consumo Actual</p>
          <p className="text-3xl font-bold text-slate-900">
            {mockData.currentConsumption}
          </p>
          <p className="text-xs text-slate-500 mt-1">kWh este mes</p>
        </Card>

        {/* Variación */}
        <Card className="p-4 bg-orange-50 border-orange-200">
          <p className="text-sm text-slate-500 mb-1">Variación</p>
          <div className="flex items-center gap-2">
            <p className="text-3xl font-bold text-slate-900">
              {percentageChange.toFixed(1)}%
            </p>
            {percentageChange > 0 ? (
              <TrendingUp className="text-orange-500" />
            ) : (
              <TrendingDown className="text-green-500" />
            )}
          </div>
        </Card>

        {/* Eficiencia */}
        <Card className="p-4 bg-emerald-50 border-emerald-200">
          <p className="text-sm text-slate-500 mb-1">Eficiencia</p>
          <p className="text-3xl font-bold text-slate-900">
            {mockData.efficiency}%
          </p>
        </Card>

        {/* Ahorro */}
        <Card className="p-4 bg-purple-50 border-purple-200">
          <p className="text-sm text-slate-500 mb-1">Ahorro Mensual</p>
          <p className="text-3xl font-bold text-slate-900">
            ${mockData.savings.toLocaleString("es-CO")}
          </p>
        </Card>

      </div>

      {/* TABS */}
      <Tabs defaultValue="daily" className="w-full">

        <TabsList className="grid w-full grid-cols-4 mb-6 bg-slate-100 rounded-xl p-1">
          <TabsTrigger value="daily" className="rounded-lg data-[state=active]:bg-orange-500 data-[state=active]:text-white">
            Diario
          </TabsTrigger>
          <TabsTrigger value="weekly" className="rounded-lg data-[state=active]:bg-orange-500 data-[state=active]:text-white">
            Semanal
          </TabsTrigger>
          <TabsTrigger value="monthly" className="rounded-lg data-[state=active]:bg-orange-500 data-[state=active]:text-white">
            Mensual
          </TabsTrigger>
          <TabsTrigger value="comparativos" className="rounded-lg data-[state=active]:bg-orange-500 data-[state=active]:text-white">
            Comparativos
          </TabsTrigger>
        </TabsList>

        {/* CONTENIDO */}
        <TabsContent value="daily" className="mt-6 space-y-4">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Consumo por hora</span>
            <Badge variant="outline">Últimas 24h</Badge>
          </div>

          <div className="h-80 rounded-xl bg-white border border-slate-200 p-2">
            <ReactECharts option={dailyChartOption} style={{ height: "100%" }} theme={chartTheme} />
          </div>
        </TabsContent>

        <TabsContent value="weekly" className="mt-6 space-y-4">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Consumo por día</span>
            <Badge variant="outline">Esta semana</Badge>
          </div>

          <div className="h-80 rounded-xl bg-white border border-slate-200 p-2">
            <ReactECharts option={weeklyChartOption} style={{ height: "100%" }} theme={chartTheme} />
          </div>
        </TabsContent>

        <TabsContent value="monthly" className="mt-6 space-y-4">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Comparativa mensual</span>
            <Badge variant="outline">Últimos 6 meses</Badge>
          </div>

          <div className="h-80 rounded-xl bg-white border border-slate-200 p-2">
            <ReactECharts option={monthlyChartOption} style={{ height: "100%" }} theme={chartTheme} />
          </div>
        </TabsContent>

        <TabsContent value="comparativos" className="mt-6 space-y-6">
          <div className="h-80 rounded-xl bg-white border border-slate-200 p-2">
            <ReactECharts option={twoWeeksComparisonOption} style={{ height: "100%" }} theme={chartTheme} />
          </div>

          <div className="h-80 rounded-xl bg-white border border-slate-200 p-2">
            <ReactECharts option={twoYearsComparisonOption} style={{ height: "100%" }} theme={chartTheme} />
          </div>
        </TabsContent>

      </Tabs>

    </div>
  </Card>
);
}