/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import Angle from './Angle.js';
import NormalAngle from './NormalAngle.js';

/**
 * Calculate the reflected angle between two lines.
 *
 * This is the outgoing angle based on the angle of Line 1 and the normalAngle of Line 2.
 *
 * @function Phaser.Geom.Line.ReflectAngle
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Line} lineA - The first line.
 * @param {Phaser.Geom.Line} lineB - The second line.
 *
 * @return {number} The reflected angle between each line.
 */
var ReflectAngle = function (lineA, lineB) {
    return (2 * NormalAngle(lineB) - Math.PI - Angle(lineA));
};

export default ReflectAngle;
