export const degToRad = (deg: number): number => deg / 180 * Math.PI;
export const radToDeg = (rad: number): number => rad / Math.PI * 180;

export const loadImage = (source: string, callback: (result: HTMLImageElement) => void) => {
    const image = new Image();
    image.onload = () => {
        callback(image);
    }
    image.src = source;
}
