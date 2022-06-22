import DrawRoundRectangle from '../../../utils/canvas/DrawRoundRectangle.js';

var DrawRoundRectangleBackground = function (
    canvasObject,
    color,
    strokeColor, strokeLineWidth,
    radius,
    color2, isHorizontalGradient,
    iteration
) {

    if ((color == null) && (strokeColor == null)) {
        return;
    }

    var width = canvasObject.canvas.width,
        height = canvasObject.canvas.height;

    if (strokeColor == null) {
        strokeLineWidth = 0;
    }
    var x = strokeLineWidth / 2;
    width -= strokeLineWidth;
    height -= strokeLineWidth;
    DrawRoundRectangle(canvasObject.canvas, canvasObject.context,
        x, x,
        width, height,
        radius,
        color,
        strokeColor, strokeLineWidth,
        color2, isHorizontalGradient,
        iteration
    );
}

export default DrawRoundRectangleBackground;