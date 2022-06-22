import NinePatch from './NinePatch.js';
import ObjectFactory from '../ObjectFactory.js';
import SetValue from '../../../plugins/utils/object/SetValue.js';

ObjectFactory.register('ninePatch', function (x, y, width, height, key, columns, rows, config) {
    var gameObject = new NinePatch(this.scene, x, y, width, height, key, columns, rows, config);
    this.scene.add.existing(gameObject);
    return gameObject;
});

SetValue(window, 'RexPlugins.UI.NinePatch', NinePatch);

export default NinePatch;