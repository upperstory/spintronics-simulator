import {
    StringType, NumberType, NumberRangeType, ListType,
    BooleanType, ColorType, Pointer2dType, Pointer3dType,
} from './Const.js';


var GetInputType = function (value, config) {
    // Force input type to view
    if (config.view) {
        return config.view;
    }

    if (config.options) {
        return ListType;
    }

    switch (typeof (value)) {
        case 'number':
            if (HasProperties(config, 'min', 'max')) {
                return NumberRangeType;
            }

            return NumberType;

        case 'string':
            return StringType;

        case 'boolean':
            return BooleanType;

        case 'object':
            if (HasProperties(value, 'r', 'g', 'b')) {
                return ColorType;
            }
            if (HasProperties(value, 'x', 'y', 'z')) {
                return Pointer3dType;
            }
            if (HasProperties(value, 'x', 'y')) {
                return Pointer2dType;
            }

        // undefined
    }

    // undefined
}

var HasProperties = function (object, ...keys) {
    for (var i = 0, cnt = keys.length; i < cnt; i++) {
        if (object[keys[i]] === undefined) {
            return false;
        }
    }
    return true;
}

export default GetInputType;