import AppendCommand from '../../../dynamictext/methods/AppendCommand.js';

const GetValue = Phaser.Utils.Objects.GetValue;

var OnParseScrollCameraTag = function (textPlayer, parser, config) {
    var tagName = GetValue(config, 'tags.camera.scroll', 'camera.scroll');
    parser
        .on(`+${tagName}`, function (x, y) {
            AppendCommand.call(textPlayer,
                'camera.scroll',  // name
                Scroll,           // callback
                [x, y],           // params
                textPlayer,       // scope
            );
            parser.skipEvent();
        })
        .on(`+${tagName}.to`, function (x, y, duration, ease) {
            AppendCommand.call(textPlayer,
                'camera.scroll.to',       // name
                ScrollTo,                 // callback
                [x, y, duration, ease],   // params
                textPlayer,               // scope
            );
            parser.skipEvent();
        })
}

var Scroll = function (params) {
    // this: textPlayer
    this.camera.setScroll(...params);
}

var ScrollTo = function (params) {
    var x = params[0];
    var y = params[1];
    var duration = params[2];
    var ease = params[3];

    // this: textPlayer
    var camera = this.camera;
    var xSave = camera.scrollX;
    var ySave = camera.scrollY;
    camera.setScroll(x, y);
    x += camera.centerX;
    y += camera.centerY;
    camera.setScroll(xSave, ySave);

    // x,y in pan() is the centerX, centerY
    camera.pan(x, y, duration, ease);
}

export default OnParseScrollCameraTag;