function useDrag(onDrag, option) {
    const { cursor } = option;
    return (e) => {
        const originCursor = document.body.style.cursor;
        document.body.style.cursor = cursor;
        const curPosition = {
            x: e.clientX,
            y: e.clientY,
        };
        const handleMousemove = (e) => {
            const { x, y } = onDrag({
                x: e.clientX - curPosition.x,
                y: e.clientY - curPosition.y,
            });
            curPosition.x += x;
            curPosition.y += y;
        };
        const handleMouseup = () => {
            document.removeEventListener('mousemove', handleMousemove);
            document.removeEventListener('mouseup', handleMouseup);
            document.body.style.cursor = originCursor;
        };
        document.addEventListener('mousemove', handleMousemove);
        document.addEventListener('mouseup', handleMouseup);
    };
}
export default useDrag;
