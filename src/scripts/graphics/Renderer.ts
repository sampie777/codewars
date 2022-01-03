export interface Renderer {
    init: () => void
    step: () => void
    onDestroy?: () => void
}
