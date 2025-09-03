export const TEXT_STYLE = {
    DEFAULT: 'color: white; background-color: green;',
    ASSIGNED: 'color: white; background-color: green;',
    UNASSIGNED: 'color: white; background-color: black;',
} as const;

export type getPoiHtmlStringStyle = keyof typeof TEXT_STYLE;

// 범용 텍스트 스타일
export const getPoiHtmlString = (text: string, style: getPoiHtmlStringStyle = 'DEFAULT') => {
    return `
    <div style="transform: translateY(-2rem);">
        <span style="${TEXT_STYLE[style]}">${text}</span>
    </div>
    `;
}

export const poiAssignedText = (text: string) => {
    return getPoiHtmlString(text, 'ASSIGNED');
}

export const poiUnassignedText = (text: string) => {
    return getPoiHtmlString(text, 'UNASSIGNED');
}
