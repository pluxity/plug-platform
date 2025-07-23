import { FacilityType } from "@/backoffice/domains/facility/store/FacilityListStore";

export const SEARCH_FIELDS = ["name", "code", "description", "createdBy"];

export const CONFIRMATION_MESSAGES: Record<FacilityType, string> = {
  buildings: "해당 건물을 삭제하시겠습니까?",
  stations: "해당 역사를 삭제하시겠습니까?",
  facilities: "해당 시설을 삭제하시겠습니까?",
};

export const BUTTON_LABELS: Record<FacilityType, string> = {
  buildings: "새 건물 추가",
  stations: "새 역사 추가",
  facilities: "새 시설 추가",
};