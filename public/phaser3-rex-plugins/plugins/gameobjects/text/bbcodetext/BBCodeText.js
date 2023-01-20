import Text from '../textbase/Text.js'
import ParserKlass from './parser/Parser.js';

class BBCodeText extends Text {
    constructor(scene, x, y, text, style) {
        var parser = new ParserKlass(style);
        super(scene, x, y, text, style, 'rexBBCodeText', parser);
    }
}

export default BBCodeText;