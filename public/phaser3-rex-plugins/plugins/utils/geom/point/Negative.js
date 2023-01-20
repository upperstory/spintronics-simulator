/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import Point from './Point.js';

/**
 * Inverts a Point's coordinates.
 *
 * @function Phaser.Geom.Point.Negative
 * @since 3.0.0
 *
 * @generic {Phaser.Geom.Point} O - [out,$return]
 *
 * @param {Phaser.Geom.Point} point - The Point to invert.
 * @param {Phaser.Geom.Point} [out] - The Point to return the inverted coordinates in.
 *
 * @return {Phaser.Geom.Point} The modified `out` Point, or a new Point if none was provided.
 */
var Negative = function (point, out) {
    if (out === undefined) { out = new Point(); }

    return out.setTo(-point.x, -point.y);
};

export default Negative;
