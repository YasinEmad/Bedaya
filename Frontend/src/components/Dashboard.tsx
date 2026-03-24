import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@ui/card";
import { Users, Stethoscope, TestTube, Activity, AlertCircle } from "lucide-react";
import { patientService } from "../services/patientService";
import { clinicService } from "../services/clinicService";
import { labService } from "../services/labService";

interface ClinicReferralItem {
  title: string;
  total: number;
  icon: React.ComponentType<any>;
}

interface LabItem {
  title: string;
  total: number;
  icon: React.ComponentType<any>;
}

interface DashboardStats {
  adultPatients: number;
  pediatricPatients: number;
  totalClinicReferrals: number;
  totalLabSamples: number;
}

interface LoadingState {
  patients: boolean;
  clinics: boolean;
  labs: boolean;
}

interface ErrorState {
  patients: string | null;
  clinics: string | null;
  labs: string | null;
}

const labTypeLabels: { [key: string]: string } = {
  blood: "Blood Labs",
  urine: "Urine Labs",
  stool: "Stool Labs",
  cr_urea: "Cr/Urea Labs",
};

const clinicTypeLabels: { [key: string]: string } = {
  "internal-medicine": "Internal Medicine",
  cardiology: "Cardiology",
  orthopedics: "Orthopedics",
  ophthalmology: "Ophthalmology",
  "obstetrics-gynecology": "Obstetrics & Gynecology",
  dermatology: "Dermatology",
  dental: "Dental",
  surgery: "Surgery",
  ent: "ENT",
  "pediatrics-clinic": "Pediatrics",
};

export function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    adultPatients: 0,
    pediatricPatients: 0,
    totalClinicReferrals: 0,
    totalLabSamples: 0,
  });

  const [clinicReferrals, setClinicReferrals] = useState<ClinicReferralItem[]>([]);
  const [labNumbers, setLabNumbers] = useState<LabItem[]>([]);
  const [loading, setLoading] = useState<LoadingState>({
    patients: true,
    clinics: true,
    labs: true,
  });
  const [errors, setErrors] = useState<ErrorState>({
    patients: null,
    clinics: null,
    labs: null,
  });

  // Fetch patients data
  useEffect(() => {
    const fetchPatientsData = async () => {
      try {
        setLoading((prev) => ({ ...prev, patients: true }));
        const [adultCount, pediatricCount] = await Promise.all([
          patientService.getAdultPatientCount(),
          patientService.getPediatricPatientCount(),
        ]);

        setStats((prev) => ({
          ...prev,
          adultPatients: adultCount,
          pediatricPatients: pediatricCount,
        }));
        setErrors((prev) => ({ ...prev, patients: null }));
      } catch (error) {
        console.error("Failed to fetch patient data:", error);
        setErrors((prev) => ({
          ...prev,
          patients: "Failed to Load patient data",
        }));
      } finally {
        setLoading((prev) => ({ ...prev, patients: false }));
      }
    };

    fetchPatientsData();
  }, []);

  // Fetch clinic statistics
  useEffect(() => {
    const fetchClinicData = async () => {
      try {
        setLoading((prev) => ({ ...prev, clinics: true }));
        const response = await clinicService.getDashboardClinicStats();
        
        const clinicStats = response.data.breakdown
          .map((item) => ({
            title: clinicTypeLabels[item.clinic] || item.clinic,
            total: item.total,
            icon: Stethoscope,
          }))
          .sort((a, b) => b.total - a.total);

        setClinicReferrals(clinicStats);
        setStats((prev) => ({
          ...prev,
          totalClinicReferrals: response.data.totalVisits,
        }));
        setErrors((prev) => ({ ...prev, clinics: null }));
      } catch (error) {
        console.error("Failed to fetch clinic data:", error);
        setErrors((prev) => ({
          ...prev,
          clinics: "Failed to load clinic referrals",
        }));
      } finally {
        setLoading((prev) => ({ ...prev, clinics: false }));
      }
    };

    fetchClinicData();
  }, []);

  // Fetch lab statistics
  useEffect(() => {
    const fetchLabData = async () => {
      try {
        setLoading((prev) => ({ ...prev, labs: true }));
        const response = await labService.getDashboardLabStats();
        
        const labStats = Object.entries(response.data.breakdown)
          .map(([type, count]) => ({
            title: labTypeLabels[type] || type,
            total: count as number,
            icon: TestTube,
          }))
          .sort((a, b) => b.total - a.total);

        setLabNumbers(labStats);
        setStats((prev) => ({
          ...prev,
          totalLabSamples: response.data.totalTests,
        }));
        setErrors((prev) => ({ ...prev, labs: null }));
      } catch (error) {
        console.error("Failed to fetch lab data:", error);
        setErrors((prev) => ({
          ...prev,
          labs: "Failed to load lab samples",
        }));
      } finally {
        setLoading((prev) => ({ ...prev, labs: false }));
      }
    };

    fetchLabData();
  }, []);

  const dashboardStats = [
    {
      title: "Adult Patients",
      value: stats.adultPatients.toString(),
      icon: Users,
      accent: true,
      loading: loading.patients,
    },
    {
      title: "Pediatric Patients",
      value: stats.pediatricPatients.toString(),
      icon: Users,
      accent: false,
      loading: loading.patients,
    },
    {
      title: "Total Clinic Referrals",
      value: stats.totalClinicReferrals.toString(),
      icon: Stethoscope,
      accent: false,
      loading: loading.clinics,
    },
    {
      title: "Total Lab Samples",
      value: stats.totalLabSamples.toString(),
      icon: TestTube,
      accent: false,
      loading: loading.labs,
    },
  ];

  const getProgressPercentage = (done: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((done / total) * 100);
  };

  const renderLoadingState = (isLoading: boolean) => {
    if (!isLoading) return null;
    return <div className="animate-pulse bg-slate-200 h-8 rounded w-12"></div>;
  };

  const renderErrorBanner = (error: string | null) => {
    if (!error) return null;
    return (
      <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
        <AlertCircle className="w-4 h-4" />
        <span>{error}</span>
      </div>
    );
  };

  return (
    <div className="space-y-8 p-8 bg-slate-50/50 min-h-full fade-in">
      {/* Error Banners */}
      <div className="space-y-2">
        {errors.patients && renderErrorBanner(errors.patients)}
        {errors.clinics && renderErrorBanner(errors.clinics)}
        {errors.labs && renderErrorBanner(errors.labs)}
      </div>

      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-1.5 h-8 bg-primary rounded-full"></div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Dashboard
          </h1>
          <p className="text-slate-500 text-sm">
            Key metrics for the medical convoy
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card
              key={index}
              className={`border transition-all duration-200 hover:shadow-md ${
                stat.accent
                  ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-green-200"
                  : "bg-white border-slate-100 shadow-sm"
              }`}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle
                  className={`text-sm font-medium ${
                    stat.accent
                      ? "text-primary-foreground/80"
                      : "text-slate-500"
                  }`}
                >
                  {stat.title}
                </CardTitle>
                <div
                  className={`p-2.5 rounded-xl ${
                    stat.accent
                      ? "bg-white/20 text-white"
                      : "bg-slate-50 text-primary"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
              </CardHeader>
              <CardContent>
                {stat.loading ? (
                  renderLoadingState(true)
                ) : (
                  <div
                    className={`text-3xl font-bold tracking-tight ${
                      stat.accent ? "text-white" : "text-slate-900"
                    }`}
                  >
                    {stat.value}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Clinic Referrals Section */}
      <div className="space-y-5">
        <div className="flex items-center gap-2 px-1">
          <Activity className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-slate-900">
            Clinic Referrals by Type
          </h2>
          {loading.clinics && (
            <div className="animate-spin">
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full"></div>
            </div>
          )}
        </div>
        {clinicReferrals.length === 0 && !loading.clinics ? (
          <div className="p-6 bg-white border border-slate-100 rounded-lg text-center text-slate-500">
            No clinic referral data available
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {clinicReferrals.map((clinic, index) => {
              const Icon = clinic.icon;
              return (
                <Card
                  key={index}
                  className="shadow-sm border-slate-100 hover:border-slate-200 hover:shadow-md transition-all duration-200 group"
                >
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
                      <span className="text-3xl font-bold text-slate-900">
                        {clinic.total}
                      </span>
                      <span className="text-slate-400 text-sm font-medium">
                        referrals
                      </span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Lab Samples Section */}
      <div className="space-y-5">
        <div className="flex items-center gap-2 px-1">
          <TestTube className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-slate-900">
            Lab Samples by Type
          </h2>
          {loading.labs && (
            <div className="animate-spin">
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full"></div>
            </div>
          )}
        </div>
        {labNumbers.length === 0 && !loading.labs ? (
          <div className="p-6 bg-white border border-slate-100 rounded-lg text-center text-slate-500">
            No lab sample data available
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {labNumbers.map((lab, index) => {
              const Icon = lab.icon;
              return (
                <Card
                  key={index}
                  className="shadow-sm border-slate-100 hover:border-slate-200 hover:shadow-md transition-all duration-200 group"
                >
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
                      <span className="text-3xl font-bold text-slate-900">
                        {lab.total}
                      </span>
                      <span className="text-slate-400 text-sm font-medium">
                        samples
                      </span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}