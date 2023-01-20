import CreateAnySizer from './utils/CreateAnySizer.js';
import GridSizer from '../../gridsizer/GridSizer.js';
import Make from '../Make.js';

var CreateGridSizer = function (scene, data, styles, customBuilders) {
    // Build createCellContainerCallback
    var createCellContainerCallbackConfig = data.createCellContainerCallback;
    if (createCellContainerCallbackConfig) {
        var childData = createCellContainerCallbackConfig.$child;
        delete createCellContainerCallbackConfig.$child;

        data.createCellContainerCallback = function (scene, x, y, config) {
            var child = Make(scene, childData, styles, customBuilders);

            // Copy config
            for (var key in createCellContainerCallbackConfig) {
                config[key] = createCellContainerCallbackConfig[key];
            }

            return child;
        }
    }

    return CreateAnySizer(scene, data, styles, customBuilders, GridSizer);
}

export default CreateGridSizer;