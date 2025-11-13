// 텍스트 스타일 클래스
export const TEXT_STYLE = {
    DEFAULT: 'text-secondary-100 bg-accent-900/70 p-1 rounded-sm text-xs',
    ASSIGNED: 'text-secondary-100 bg-accent-900/70 p-1 rounded-sm text-xs',
    UNASSIGNED: 'text-secondary-100 bg-secondary-1000/70 p-1 rounded-sm text-xs',
    SERVICE: 'text-white bg-blue-600/80 p-1.5 rounded-md text-sm font-medium shadow-lg',
} as const;

// 비디오 플레이어 스타일 클래스
export const VIDEO_PLAYER_STYLE = {
    CONTAINER: ' -translate-y-20 relative inline-block w-70 h-40 bg-black/80 rounded-lg shadow-lg',
    CLOSE_BUTTON: 'absolute -top-2 -right-2 w-6 h-6 bg-secondary-1000/80 text-white border-0 rounded-full cursor-pointer flex items-center justify-center text-base font-bold z-10 transition-colors duration-200 hover:bg-secondary-1000/60',
    VIDEO: 'w-full h-full object-cover bg-secondary-1000-80',
} as const;

export type getPoiHtmlStringStyle = keyof typeof TEXT_STYLE;

// 범용 텍스트 스타일
export const getPoiHtmlString = (text: string, style: getPoiHtmlStringStyle = 'DEFAULT', poiId?: string) => {
    const clickHandler = poiId ? `onclick="window.__moveToPoiCamera?.('${poiId}')"` : '';
    const cursorClass = poiId ? 'cursor-pointer hover:opacity-80 transition-opacity' : '';

    return `
    <div class="transform -translate-y-4">
        <span class="${TEXT_STYLE[style]} ${cursorClass}" ${clickHandler}>${text}</span>
    </div>
    `;
};

export const poiAssignedText = (text: string) => {
    return getPoiHtmlString(text, 'ASSIGNED');
}

export const poiUnassignedText = (text: string) => {
    return getPoiHtmlString(text, 'UNASSIGNED');
}

export const poiServiceText = (text: string) => {
    return getPoiHtmlString(text, 'SERVICE');
}

// 비디오 플레이어 HTML 템플릿
export const createVideoPlayerHtml = (videoId: string, closeBtnId: string, muted: boolean = false, controls: boolean = true) => {
    return `
    <div class="${VIDEO_PLAYER_STYLE.CONTAINER}">
        <button id="${closeBtnId}" title="닫기" aria-label="닫기" class="${VIDEO_PLAYER_STYLE.CLOSE_BUTTON}">
            ×
        </button>
        <video id="${videoId}" ${muted ? 'muted' : ''} ${controls ? 'controls' : ''} autoplay playsinline class="${VIDEO_PLAYER_STYLE.VIDEO}"></video>
    </div>`;
};

// 비디오 플레이어와 텍스트를 함께 표시하는 HTML 템플릿
export const createVideoWithTextHtml = (videoId: string, closeBtnId: string, textHtml: string, muted: boolean = false, controls: boolean = true) => {
    return `
    <div class="flex flex-col items-center">
        <div class="${VIDEO_PLAYER_STYLE.CONTAINER}">
            <button id="${closeBtnId}" title="닫기" aria-label="닫기" class="${VIDEO_PLAYER_STYLE.CLOSE_BUTTON}">
                ×
            </button>
            <video id="${videoId}" ${muted ? 'muted' : ''} ${controls ? 'controls' : ''} autoplay playsinline class="${VIDEO_PLAYER_STYLE.VIDEO}"></video>
        </div>
        <div class="mt-2">
            ${textHtml}
        </div>
    </div>`;
};