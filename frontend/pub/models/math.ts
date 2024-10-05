
export function screenToSVG(x: number, y: number, svg: SVGSVGElement) {
    var point = svg.createSVGPoint();
    point.x = x;
    point.y = y;
    (<any>svg)._isctm ??= svg.getScreenCTM()!.inverse();
    point = point.matrixTransform((<any>svg)._isctm);
    return point;
}