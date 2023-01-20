import AddRoundRectanglePath from './AddRoundRectanglePath.js'

var DrawRoundRectangle = function (
    canvas, context,
    x, y,
    width, height, radiusConfig,
    fillStyle, strokeStyle, lineWidth, fillColor2, isHorizontalGradient,
    iteration
) {

    AddRoundRectanglePath(context, x, y, width, height, radiusConfig, iteration);

    if (fillStyle != null) {
        if (fillColor2 != null) {
            var grd;
            if (isHorizontalGradient) {
                grd = context.createLinearGradient(0, 0, width, 0);
            } else {
                grd = context.createLinearGradient(0, 0, 0, height);
            }
            grd.addColorStop(0, fillStyle);
            grd.addColorStop(1, fillColor2);
            fillStyle = grd;
        }

        context.fillStyle = fillStyle;
        context.fill();
    }

    if ((strokeStyle != null) && (lineWidth > 0)) {
        context.strokeStyle = strokeStyle;
        context.lineWidth = lineWidth;
        context.stroke();
    }
}

export default DrawRoundRectangle;