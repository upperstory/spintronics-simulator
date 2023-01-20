import Canvas from '../../canvas/canvas/Canvas.js';
import Background from './bob/Background.js';
import InnerBounds from './bob/InnerBounds.js';
import TextStyle from './bob/char/TextStyle.js';
import Methods from './methods/Methods';
import PoolManager from './poolmanager/PoolManager.js';

const IsPlainObject = Phaser.Utils.Objects.IsPlainObject;
const GetValue = Phaser.Utils.Objects.GetValue;

class DynamicText extends Canvas {
    constructor(scene, x, y, fixedWidth, fixedHeight, config) {
        if (IsPlainObject(x)) {
            config = x;
            x = GetValue(config, 'x', 0);
            y = GetValue(config, 'y', 0);
            fixedWidth = GetValue(config, 'width', 0);
            fixedHeight = GetValue(config, 'height', 0);
        } else if (IsPlainObject(fixedWidth)) {
            config = fixedWidth;
            fixedWidth = GetValue(config, 'width', 0);
            fixedHeight = GetValue(config, 'height', 0);
        }

        var width = (fixedWidth === 0) ? 1 : fixedWidth;
        var height = (fixedHeight === 0) ? 1 : fixedHeight;
        super(scene, x, y, width, height);
        this.type = 'rexDynamicText';
        this.autoRound = true;
        this.padding = {};

        var textStyleConfig = GetValue(config, 'style', undefined);
        this.defaultTextStyle = new TextStyle(textStyleConfig);
        this.textStyle = this.defaultTextStyle.clone();

        this.background = new Background(this, GetValue(config, 'background', undefined));
        this.innerBounds = new InnerBounds(this, GetValue(config, 'innerBounds', undefined));
        this.children = [];
        this.lastAppendedChildren = [];
        this.poolManager = new PoolManager(config);

        this.setFixedSize(fixedWidth, fixedHeight);
        this.setPadding(GetValue(config, 'padding', 0));
        this.setWrapConfig(GetValue(config, 'wrap', undefined));

        var text = GetValue(config, 'text', undefined);
        if (text) {
            this.setText(text);
        }
    }

    updateTexture() {
        this.drawContent();
        super.updateTexture();
        return this;
    }
}

Object.assign(
    DynamicText.prototype,
    Methods
);


export default DynamicText;