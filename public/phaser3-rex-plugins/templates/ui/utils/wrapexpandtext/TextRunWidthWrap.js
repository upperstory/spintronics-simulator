import IsTextGameObject from '../../../../plugins/utils/text/IsTextGameObject.js';

var TextRunWidthWrap = function (textObject) {
    var RunWidthWrap = function (width) {
        var padding = textObject.padding;
        var wrapWidth = width - padding.left - padding.right;
        var style = textObject.style;
        if (IsTextGameObject(textObject)) {
            style.wordWrapWidth = wrapWidth;
            style.maxLines = 0;
        } else {  // BBCode text, Tag text
            if (style.wrapMode === 0) { // Turn no-wrap to word-wrap
                style.wrapMode = 1;
            }
            style.wrapWidth = wrapWidth;
            style.maxLines = 0;
        }

        textObject.setFixedSize(width, 0);  // Redraw text
        return textObject;
    }
    return RunWidthWrap;
}

export default TextRunWidthWrap;