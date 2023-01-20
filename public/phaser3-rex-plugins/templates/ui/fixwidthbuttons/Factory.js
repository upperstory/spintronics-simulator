import FixWidthButtons from './FixWidthButtons.js';
import ObjectFactory from '../ObjectFactory.js';
import SetValue from '../../../plugins/utils/object/SetValue.js';

ObjectFactory.register('fixWidthButtons', function (config) {
    var gameObject = new FixWidthButtons(this.scene, config);
    this.scene.add.existing(gameObject);
    return gameObject;
});

SetValue(window, 'RexPlugins.UI.FixWidthButtons', FixWidthButtons);

export default FixWidthButtons;