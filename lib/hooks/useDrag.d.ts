interface Option {
    cursor: string;
}
interface Offset {
    x: number;
    y: number;
}
declare function useDrag(onDrag: (offset: Offset) => Offset, option: Option): (e: MouseEvent) => void;
export default useDrag;
