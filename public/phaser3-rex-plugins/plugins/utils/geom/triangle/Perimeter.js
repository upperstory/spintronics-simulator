/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import Length from '../line/Length.js';

// The 2D area of a triangle. The area value is always non-negative.

/**
 * Gets the length of the perimeter of the given triangle.
 *
 * @function Phaser.Geom.Triangle.Perimeter
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Triangle} triangle - [description]
 *
 * @return {number} [description]
 */
var Perimeter = function (triangle) {
    var line1 = triangle.getLineA();
    var line2 = triangle.getLineB();
    var line3 = triangle.getLineC();

    return (Length(line1) + Length(line2) + Length(line3));
};

export default Perimeter;
