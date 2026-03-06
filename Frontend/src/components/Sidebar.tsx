import React, { useState } from "react";
import {
    Activity,
    AlertTriangle,
    Baby,
    ChevronDown,
    LayoutDashboard,
    Pill,
    Stethoscope,
    TestTube,
    Users,
    Building2,
} from "lucide-react";
import BedayaLogo from '../assets/bedaya logo colored.png';
interface SidebarProps {
    activeModule: string;
    setActiveModule: (module: string) => void;
}

export function Sidebar({ activeModule, setActiveModule }: SidebarProps) {
    const [isClinicsOpen, setIsClinicsOpen] = useState(false);
    const [isLabsOpen, setIsLabsOpen] = useState(false);
    const [isPharmacyOpen, setIsPharmacyOpen] = useState(false); // Added for pharmacy
    const [clinicsTimeoutId, setClinicsTimeoutId] = useState<NodeJS.Timeout | null>(null);
    const [labsTimeoutId, setLabsTimeoutId] = useState<NodeJS.Timeout | null>(null);
    const [pharmacyTimeoutId, setPharmacyTimeoutId] = useState<NodeJS.Timeout | null>(null); // Added for pharmacy

    const handleMouseEnter = (itemId: string, setIsOpen: React.Dispatch<React.SetStateAction<boolean>>) => {
        if (itemId === "clinics" && clinicsTimeoutId) {
            clearTimeout(clinicsTimeoutId);
            setClinicsTimeoutId(null);
        } else if (itemId === "labs" && labsTimeoutId) {
            clearTimeout(labsTimeoutId);
            setLabsTimeoutId(null);
        } else if (itemId === "pharmacy" && pharmacyTimeoutId) { // Added for pharmacy
            clearTimeout(pharmacyTimeoutId);
            setPharmacyTimeoutId(null);
        }
        setIsOpen(true);
    };

    const handleMouseLeave = (itemId: string, setIsOpen: React.Dispatch<React.SetStateAction<boolean>>, currentActiveModule: string) => {
        const currentItem = menuItems.find(menuItem => menuItem.id === itemId);
        const isSubItemActive = currentItem?.subItems?.some(subItem => currentActiveModule.startsWith(subItem.id));

        if (isSubItemActive) {
            // If a sub-item is active, do not close the parent menu on mouse leave.
            return;
        }

        const id = setTimeout(() => {
            setIsOpen(false);
        }, 200); // 200ms delay
        if (itemId === "clinics") {
            setClinicsTimeoutId(id);
        } else if (itemId === "labs") {
            setLabsTimeoutId(id);
        } else if (itemId === "pharmacy") { // Added for pharmacy
            setPharmacyTimeoutId(id);
        }
    };

    const clinics = [
        { id: "internal-medicine", name: "Internal Medicine" },
        { id: "orthopedics", name: "Orthopedics" },
        { id: "ophthalmology", name: "Ophthalmology" },
        { id: "obstetrics-gynecology", name: "Obs & Gynecology" },
        { id: "dermatology", name: "Dermatology" },
        { id: "dental", name: "Dental" },
        { id: "cardiology", name: "Cardiology" },
        { id: "surgery", name: "Surgery" },
        { id: "ent", name: "ENT" },
        { id: "pediatrics-clinic", name: "Pediatrics" },
    ];

    const menuItems = [
        {
            id: "dashboard",
            label: "Dashboard",
            icon: LayoutDashboard,
            badge: null
        },
        {
            id: "adults",
            label: "Adults",
            icon: Users,
            badge: "247"
        },
        {
            id: "pediatrics",
            label: "Pediatrics",
            icon: Baby,
            badge: "5"
        },
        {
            id: "clinics",
            label: "Clinics",
            icon: Building2,
            badge: "9",
            subItems: clinics,
        },

        {
            id: "labs",
            label: "Labs",
            icon: TestTube,
            badge: "45",
            subItems: [
                { id: "labs-overall-status", name: "In/Out" },
                { id: "labs-blood", name: "Blood" },
                { id: "labs-urine", name: "Urine" },
                { id: "labs-stool", name: "Stool" },
                { id: "labs-cr_urea", name: "Cr/Urea" },
            ],
        },
        {
            id: "pharmacy",
            label: "Pharmacy",
            icon: Pill,
            badge: "3", // Keep badge for parent, or remove if sub-items have badges
            subItems: [
                { id: "pharmacy-inventory", name: "Inventory Control" },
                { id: "pharmacy-dispensing", name: "Dispensing Operations" },
            ],
        }
    ];

    return (
        <div className="w-64 bg-white border-r border-border p-4 flex flex-col h-screen">
            {/* Header */}
            <div className="mb-8 px-2">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-50 rounded-lg">
                        <img src={BedayaLogo} alt="Bedaya Caravan Logo" className="w-6 h-6 object-contain" />
                    </div>
                    <div>
                        <h1 className="text-base font-bold text-slate-900 leading-tight">Bedaya Caravan</h1>
                        <p className="text-xs text-slate-500 font-medium">Medical System</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1 overflow-y-auto">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeModule === item.id;

                    if (item.subItems) {
                        const isSubItemActive = item.subItems.some(subItem => activeModule.startsWith(subItem.id));
                        const isParentHovered =
                            item.id === "clinics" ? isClinicsOpen :
                                (item.id === "labs" ? isLabsOpen : isPharmacyOpen);
                        const showSubMenu = isParentHovered || isSubItemActive;
                        const setIsOpen =
                            item.id === "clinics" ? setIsClinicsOpen :
                                (item.id === "labs" ? setIsLabsOpen : setIsPharmacyOpen);

                        return (
                            <div
                                key={item.id}
                                onMouseEnter={() => handleMouseEnter(item.id, setIsOpen)}
                                onMouseLeave={() => handleMouseLeave(item.id, setIsOpen, activeModule)}
                                className="mb-1"
                            >
                                <button
                                    onClick={() => setActiveModule(item.id)}
                                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium ${isActive || isSubItemActive
                                        ? "bg-primary text-primary-foreground shadow-sm shadow-green-200"
                                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <Icon className={`w-4 h-4 ${isActive || isSubItemActive ? "text-white" : "text-slate-500 group-hover:text-slate-900"}`} />
                                        <span>{item.label}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {item.badge && !showSubMenu && (
                                            <span className="bg-green-100 text-green-700 text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                                                {item.badge}
                                            </span>
                                        )}
                                        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${showSubMenu ? "rotate-180" : ""} opacity-50`} />
                                    </div>
                                </button>
                                
                                <div
                                    className={`overflow-hidden transition-all duration-300 ease-in-out ${showSubMenu ? 'max-h-[500px] opacity-100 mt-1' : 'max-h-0 opacity-0'}`}
                                >
                                    <div className="pl-1 space-y-0.5 border-l-2 border-slate-100 ml-4 my-1">
                                        {item.subItems.map((subItem) => (
                                            <button
                                                key={subItem.id}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setActiveModule(subItem.id);
                                                }}
                                                className={`w-full text-left pl-3 pr-2 py-2 text-xs font-medium rounded-r-md transition-colors block border-l-2 -ml-[2px] ${activeModule === subItem.id
                                                    ? "border-green-500 text-green-700 bg-green-50/50"
                                                    : "border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                                                    }`}
                                            >
                                                {subItem.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        );
                    }

                    return (
                        <button
                            key={item.id}
                            onClick={() => setActiveModule(item.id)}
                            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium mb-1 ${isActive
                                ? "bg-primary text-primary-foreground shadow-sm shadow-green-200"
                                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-500"}`} />
                                <span>{item.label}</span>
                            </div>
                            {item.badge && (
                                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${isActive 
                                    ? "bg-white/20 text-white" 
                                    : "bg-slate-100 text-slate-600"}`}>
                                    {item.badge}
                                </span>
                            )}
                        </button>
                    );
                })}
            </nav>

            {/* Footer Profile/User */}
            <div className="pt-4 mt-4 border-t border-slate-100">
                <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
                    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                        SC
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">Dr. Sarah Chen</p>
                        <p className="text-xs text-slate-500 truncate">Lead Physician</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
