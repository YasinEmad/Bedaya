import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Users, Stethoscope, TestTube, Activity } from "lucide-react";

export function Dashboard() {
  const clinicReferrals = [
    {
      title: "Internal Medicine",
      done: 30,
      total: 45,
      icon: Stethoscope,
    },
    {
      title: "Pediatrics",
      done: 20,
      total: 32,
      icon: Stethoscope,
    },
    {
      title: "Cardiology",
      done: 10,
      total: 18,
      icon: Stethoscope,
    },
    {
      title: "Dental",
      done: 5,
      total: 11,
      icon: Stethoscope,
    },
  ];

  const labNumbers = [
    {
      title: "Blood Labs",
      done: 60,
      total: 78,
      icon: TestTube,
    },
    {
      title: "Urine Labs",
      done: 40,
      total: 56,
      icon: TestTube,
    },
    {
      title: "Stool Labs",
      done: 15,
      total: 23,
      icon: TestTube,
    },
  ];

  const totalClinicReferrals = clinicReferrals.reduce((sum, clinic) => sum + clinic.total, 0);
  const totalLabNumbers = labNumbers.reduce((sum, lab) => sum + lab.total, 0);

  const stats = [
    {
      title: "Adult Patients",
      value: "152",
      icon: Users,
      accent: true,
    },
    {
      title: "Pediatric Patients",
      value: "95",
      icon: Users,
      accent: false,
    },
    {
      title: "Total Clinic Referrals",
      value: totalClinicReferrals.toString(),
      icon: Stethoscope,
      accent: false,
    },
    {
      title: "Total Lab Samples",
      value: totalLabNumbers.toString(),
      icon: TestTube,
      accent: false,
    },
  ];

  const getProgressPercentage = (done: number, total: number) => {
    return Math.round((done / total) * 100);
  };

  return (
    <div className="space-y-8 p-8 bg-slate-50/50 min-h-full fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-1.5 h-8 bg-primary rounded-full"></div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
          <p className="text-slate-500 text-sm">
            Key metrics for the medical convoy
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card 
              key={index} 
              className={`border transition-all duration-200 hover:shadow-md ${
                stat.accent 
                  ? 'bg-primary text-primary-foreground border-primary shadow-lg shadow-green-200' 
                  : 'bg-white border-slate-100 shadow-sm'
              }`}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className={`text-sm font-medium ${
                  stat.accent ? 'text-primary-foreground/80' : 'text-slate-500'
                }`}>
                  {stat.title}
                </CardTitle>
                <div className={`p-2.5 rounded-xl ${
                  stat.accent 
                    ? 'bg-white/20 text-white' 
                    : 'bg-slate-50 text-primary'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className={`text-3xl font-bold tracking-tight ${
                  stat.accent ? 'text-white' : 'text-slate-900'
                }`}>
                  {stat.value}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Clinic Referrals Section */}
      <div className="space-y-5">
        <div className="flex items-center gap-2 px-1">
          <Activity className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-slate-900">Clinic Referrals by Type</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {clinicReferrals.map((clinic, index) => {
            const Icon = clinic.icon;
            const percentage = getProgressPercentage(clinic.done, clinic.total);
            return (
              <Card key={index} className="shadow-sm border-slate-100 hover:border-slate-200 hover:shadow-md transition-all duration-200 group">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <CardTitle className="text-sm font-medium text-slate-700 group-hover:text-primary transition-colors">
                    {clinic.title}
                  </CardTitle>
                  <div className="p-2 rounded-lg bg-green-50 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    <Icon className="w-4 h-4" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl font-bold text-slate-900">{clinic.done}</span>
                    <span className="text-slate-400 text-sm font-medium">/ {clinic.total}</span>
                  </div>
                  {/* Progress Bar */}
                  <div className="space-y-1.5">
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-slate-500 font-medium text-right">{percentage}% patients seen</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Lab Samples Section */}
      <div className="space-y-5">
        <div className="flex items-center gap-2 px-1">
          <TestTube className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-slate-900">Lab Samples by Type</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {labNumbers.map((lab, index) => {
            const Icon = lab.icon;
            const percentage = getProgressPercentage(lab.done, lab.total);
            return (
              <Card key={index} className="shadow-sm border-slate-100 hover:border-slate-200 hover:shadow-md transition-all duration-200 group">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <CardTitle className="text-sm font-medium text-slate-700 group-hover:text-primary transition-colors">
                    {lab.title}
                  </CardTitle>
                  <div className="p-2 rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Icon className="w-4 h-4" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl font-bold text-slate-900">{lab.done}</span>
                    <span className="text-slate-400 text-sm font-medium">/ {lab.total}</span>
                  </div>
                  {/* Progress Bar */}
                  <div className="space-y-1.5">
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-600 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-slate-500 font-medium text-right">{percentage}% processed</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}