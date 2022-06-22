import Scrollable from '../utils/scrollable/Scrollable.js';
import TextBlock from './textblock/TextBlock.js';
import InjectProperties from './InjectProperties.js';
import SetText from './SetText.js';
import AppendText from './AppendText.js';

const GetValue = Phaser.Utils.Objects.GetValue;

class TextArea extends Scrollable {
    constructor(scene, config) {
        if (config === undefined) {
            config = {};
        }

        // Create text-block
        var textObject = GetValue(config, 'text', undefined);
        var textWidth = GetValue(config, 'textWidth', undefined);
        var textHeight = GetValue(config, 'textHeight', undefined);
        var textCrop = GetValue(config, 'textCrop', !!textObject.setCrop);
        var textMask = GetValue(config, 'textMask', !textCrop);
        var content = GetValue(config, 'content', '');
        var textBlock = new TextBlock(scene, {
            width: textWidth,
            height: textHeight,
            text: textObject,
            textMask: textMask,
            textCrop: textCrop && !textMask,
            content: content,
            clamplTextOY: GetValue(config, 'clamplChildOY', false),
            alwaysScrollable: GetValue(config, 'alwaysScrollable', false),
        });
        scene.add.existing(textBlock); // Important: Add to display list for touch detecting
        var proportion = (textWidth === undefined) ? 1 : 0;
        var expand = (textHeight === undefined);
        // Inject properties for scrollable interface
        InjectProperties(textBlock);

        // Fill config of scrollable
        config.scrollMode = 0; // Vertical
        config.type = 'rexTextArea';
        config.child = {
            gameObject: textBlock,
            proportion: proportion,
            expand: expand,
        };
        var spaceConfig = GetValue(config, 'space', undefined);
        if (spaceConfig) {
            spaceConfig.child = spaceConfig.text;
        }
        super(scene, config);

        this.addChildrenMap('text', textObject);
    }

    get text() {
        return this.childrenMap.child.text;
    }

    get linesCount() {
        return this.childrenMap.child.linesCount;
    }

    get contentHeight() {
        return this.childrenMap.child.textHeight;
    }
}

var methods = {
    setText: SetText,
    appendText: AppendText,
}
Object.assign(
    TextArea.prototype,
    methods
);

export default TextArea;