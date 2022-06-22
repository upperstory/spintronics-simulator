import Make from '../../Make.js';

var CreateChild = function (scene, data, subKey, styles, customBuilders) {
    var childData = data[subKey];
    if (!childData) {
        return undefined;
    }

    var child;
    child = Make(scene, childData, styles, customBuilders);
    data[subKey] = child;

    return child;
}

export default CreateChild;