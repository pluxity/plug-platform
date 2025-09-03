// TailwindCSS 기반 텍스트 스타일 클래스
export const TEXT_STYLE = {
    DEFAULT: 'text-white bg-green-600 text-xs',
    ASSIGNED: 'text-white bg-green-600 text-xs',
    UNASSIGNED: 'text-white bg-black text-xs',
} as const;

export type getPoiHtmlStringStyle = keyof typeof TEXT_STYLE;

// 범용 텍스트 스타일
export const getPoiHtmlString = (text: string, style: getPoiHtmlStringStyle = 'DEFAULT') => {
    return `
    <div class="transform -translate-y-4">
        <span class="${TEXT_STYLE[style]}">${text}</span>
    </div>
    `;
};

export const poiAssignedText = (text: string) => {
    return getPoiHtmlString(text, 'ASSIGNED');
}

export const poiUnassignedText = (text: string) => {
    return getPoiHtmlString(text, 'UNASSIGNED');
}
