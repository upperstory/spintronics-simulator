/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import RotateAroundXY from './RotateAroundXY.js';
import InCenter from './InCenter.js';

/**
 * Rotates a Triangle about its incenter, which is the point at which its three angle bisectors meet.
 *
 * @function Phaser.Geom.Triangle.Rotate
 * @since 3.0.0
 *
 * @generic {Phaser.Geom.Triangle} O - [triangle,$return]
 *
 * @param {Phaser.Geom.Triangle} triangle - The Triangle to rotate.
 * @param {number} angle - The angle by which to rotate the Triangle, in radians.
 *
 * @return {Phaser.Geom.Triangle} The rotated Triangle.
 */
var Rotate = function (triangle, angle) {
    var point = InCenter(triangle);

    return RotateAroundXY(triangle, point.x, point.y, angle);
};

export default Rotate;
