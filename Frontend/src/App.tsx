import React, { useState } from "react";
import { AppSidebar as Sidebar, TopBar, Dashboard, AdultsModule, PediatricsModule, ClinicsModule, LabsModule, PharmacyModule } from "@components";

export default function App() {
  const [activeModule, setActiveModule] = useState("dashboard");

  const renderModule = () => {
    console.log("Active Module:", activeModule); // Added for debugging
    if (activeModule.startsWith("internal-medicine") || activeModule.startsWith("orthopedics") || activeModule.startsWith("ophthalmology") || activeModule.startsWith("obstetrics-gynecology") || activeModule.startsWith("dermatology") || activeModule.startsWith("dental") || activeModule.startsWith("cardiology") || activeModule.startsWith("surgery") || activeModule.startsWith("ent") || activeModule.startsWith("pediatrics-clinic")) {
        return <ClinicsModule activeClinic={activeModule} />;
    } else if (activeModule.startsWith("labs")) {
      return <LabsModule activeLabSection={activeModule} />;
    }
    switch (activeModule) {
      case "dashboard":
        return <Dashboard />;
      case "adults":
        return <AdultsModule />;
      case "pediatrics":
        return <PediatricsModule />;

      case "clinics":
        return <ClinicsModule activeClinic={"clinics"} />;
      case "pharmacy":
      case "pharmacy-inventory":
      case "pharmacy-dispensing":
        return <PharmacyModule activePharmacySection={activeModule} />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar activeModule={activeModule} setActiveModule={setActiveModule} />
      <div className="flex-1 flex flex-col">
        {/* <TopBar /> */}
        <main className="flex-1 overflow-auto p-3">
          {renderModule()}
        </main>
      </div>
    </div>
  );
}