/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import Contains from './Contains.js';

/**
 * Tests if a triangle contains a point.
 *
 * @function Phaser.Geom.Triangle.ContainsPoint
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Triangle} triangle - The triangle.
 * @param {(Phaser.Geom.Point|Phaser.Math.Vector2|any)} point - The point to test, or any point-like object with public `x` and `y` properties.
 *
 * @return {boolean} `true` if the point is within the triangle, otherwise `false`.
 */
var ContainsPoint = function (triangle, point) {
    return Contains(triangle, point.x, point.y);
};

export default ContainsPoint;
