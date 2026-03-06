import React from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { 
  Search, 
  Bell, 
  Settings, 
  MapPin, 
  Clock,
  AlertTriangle
} from "lucide-react";

export function TopBar() {
  return (
    <header className="bg-white border-b border-border px-6 py-3 sticky top-0 z-30">
      <div className="flex items-center justify-between">
        {/* Left Section - Search */}
        <div className="flex items-center gap-4 flex-1 max-w-xl">
          <div className="relative flex-1 group">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 group-hover:text-primary transition-colors" />
            <Input
              placeholder="Search patients, treatments, or records..."
              className="pl-10 bg-slate-50 border-transparent focus:bg-white focus:border-primary/20 transition-all shadow-sm rounded-lg"
            />
          </div>
        </div>

        {/* Center Section - Convoy Info */}
        <div className="flex items-center gap-6 mx-6">
          <div className="flex items-center gap-2 text-sm px-3 py-1.5 bg-slate-50 rounded-full border border-slate-100">
            <MapPin className="w-3.5 h-3.5 text-primary" />
            <span className="text-slate-600 font-medium">Riverside Community Center</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm px-3 py-1.5 bg-slate-50 rounded-full border border-slate-100">
            <Clock className="w-3.5 h-3.5 text-primary" />
            <span className="text-slate-600 font-medium">Day 2 of 5</span>
          </div>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center gap-3">
          {/* Follow-up Alerts */}
          <Button variant="outline" size="sm" className="relative border-slate-200 hover:bg-slate-50 hover:text-orange-600">
            <AlertTriangle className="w-4 h-4 text-orange-500 mr-2" />
            <span>Follow-ups</span>
            <span className="ml-2 bg-orange-100 text-orange-700 text-[10px] px-1.5 py-0.5 rounded-full font-bold">
              12
            </span>
          </Button>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative text-slate-500 hover:text-slate-900">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
          </Button>

          {/* Settings */}
          <Button variant="ghost" size="icon" className="text-slate-500 hover:text-slate-900">
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}