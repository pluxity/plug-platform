/**
 * 카메라, 픽킹등에 사용할 레이어 열거형
 */
enum CustomLayer {
    Default = 0,
    Invisible,
    Pickable,
}

/**
 * 마우스 버튼 열거형
 */
enum MouseButton {
    Left = 0,
    Middle = 1,
    Right = 2,
}

/**
 * 조합키 열거형
 */
enum ModifyKey {
    Shift = 'shiftKey',
    Control = 'ctrlKey',
    Alt = 'altKey',
}

export {
    CustomLayer,
    MouseButton,
    ModifyKey,
}