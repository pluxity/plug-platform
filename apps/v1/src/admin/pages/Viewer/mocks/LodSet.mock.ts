export const LodSetStep: string[] = ['1단계', '2단계', '3단계'];
export const LodSetAddStep: string[] = ['3단계', '4단계' , '5단계'];

export interface LodSetValue {
    step: string;
    options: string[];
}

export const LodSetSelectOptions: string[] = ['일괄등록', '100%', '120%', '150%'];

export const LodSetStepValues = [
  {
    category: "kiosk",
    subcategory: "키오스크",
    steps: LodSetStep.map(step => (
        [
          { step: step, options: LodSetSelectOptions },
        ]
    ))      
  },
  {
    category: "destination",
    subcategory: "목적지",
    steps: LodSetStep.map(step => (
        [
          { step: step, options: LodSetSelectOptions },
        ]
    ))     
  },
  {
    category: "bus-stop",
    subcategory: "버스정류장",
    steps: LodSetStep.map(step => (
        [
          { step: step, options: LodSetSelectOptions },
        ]
    ))     
  },
  {
    category: "obstacle",
    subcategory: "장애물",
    steps: LodSetStep.map(step => (
        [
          { step: step, options: LodSetSelectOptions },
        ]
    ))     
  },
  {
    category: "otherpoi",
    subcategory: "기타 POI",
    steps: LodSetStep.map(step => (
        [
          { step: step, options: LodSetSelectOptions },
        ]
    ))     
  },
];
