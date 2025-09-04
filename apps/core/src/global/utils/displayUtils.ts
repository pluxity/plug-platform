export const TEXT_STYLE = {
    DEFAULT: 'color: white; background-color: green;',
    ASSIGNED: 'color: white; background-color: green;',
    UNASSIGNED: 'color: white; background-color: black;',
} as const;

export type PoiDisplayTextStyle = keyof typeof TEXT_STYLE;

// 범용 텍스트 스타일
export const poiDisplayText = (text: string, style: PoiDisplayTextStyle = 'DEFAULT') => {
    return `<span style="${TEXT_STYLE[style]}">${text}</span>`;
}

export const poiAssignedText = (text: string) => {
    return poiDisplayText(text, 'ASSIGNED');
}

export const poiUnassignedText = (text: string) => {
    return poiDisplayText(text, 'UNASSIGNED');
}
