import MergeStyle from './utils/MergeStyle.js';
import ScrollablePanel from '../../scrollablepanel/ScrollablePanel.js';
import CreateChild from './utils/CreateChild.js';
import ReplaceSliderConfig from './utils/ReplaceSliderConfig.js';

var CreateScrollablePanel = function (scene, data, styles, customBuilders) {
    data = MergeStyle(data, styles);

    // Replace data by child game object
    CreateChild(scene, data, 'background', styles, customBuilders);

    var panelConfig = data.panel;
    if (panelConfig) {
        CreateChild(scene, panelConfig, 'child', styles, customBuilders);
    }

    ReplaceSliderConfig(scene, data.slider, styles, customBuilders);
    CreateChild(scene, data, 'header', styles, customBuilders);
    CreateChild(scene, data, 'footer', styles, customBuilders);

    var gameObject = new ScrollablePanel(scene, data);
    scene.add.existing(gameObject);
    return gameObject;
};

export default CreateScrollablePanel;