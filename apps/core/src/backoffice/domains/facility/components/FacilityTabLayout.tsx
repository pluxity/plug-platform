import React, { useMemo } from "react";
import { Button, cn } from "@plug/ui";
import { FacilityType } from "../store/FacilityListStore";
import { FacilityRegistry } from "@/backoffice/domains/facility/create/FacilityRegistry";
import { House } from 'lucide-react';

interface FacilityLayoutProps {
  children: React.ReactNode;
  activeTab: FacilityType;
  setActiveTab: (tab: FacilityType) => void;
  showButton?: boolean;
  buttonText?: string;
  onButtonClick?: () => void;
  hideFirstTab?: boolean;
}

export const FacilityLayout: React.FC<FacilityLayoutProps> = ({ children, activeTab, setActiveTab, showButton = true, buttonText = "시설 추가", onButtonClick, hideFirstTab = false }) => {
  const tabs = useMemo(() => {
    const defaultTab = {
      id: 'facilities',
      label: '시설 전체',
      icon: () => (<House/>)
    };

    const registeredTabs = FacilityRegistry.getAll().map(def => ({
      id: def.type,
      label: def.displayName,
      icon: def.icon || defaultTab.icon
    }));
    return [defaultTab, ...registeredTabs];
  }, []);

  const visibleTabs = useMemo(() => {
    return tabs.filter((_, index) => !(hideFirstTab && index === 0));
  }, [hideFirstTab, tabs]);

  const getTabButtonClassName = (tabId: FacilityType) => {
    return cn(
      "flex items-center gap-2 px-4 py-2 rounded-md transition-colors",
      "text-sm font-medium mr-2",
      activeTab === tabId
        ? "bg-blue-600 text-white"
        : "bg-blue-50 text-gray-700 hover:bg-blue-100"
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-wrap">
          {visibleTabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab(tab.id as FacilityType);
                }}
                className={getTabButtonClassName(tab.id as FacilityType)}
                aria-current={activeTab === tab.id ? 'page' : undefined}
              >
                <Icon />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {showButton && (
          <Button variant="default" onClick={onButtonClick} className="rounded-sm">
            {buttonText}
          </Button>
        )}
      </div>

      <div className="p-5 border border-gray-200 rounded-md bg-white shadow-sm">
        {children}
      </div>
    </div>
  );
};