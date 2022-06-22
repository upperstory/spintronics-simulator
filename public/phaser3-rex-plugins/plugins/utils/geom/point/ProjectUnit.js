/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import Point from './Point.js';

/**
 * [description]
 *
 * @function Phaser.Geom.Point.ProjectUnit
 * @since 3.0.0
 *
 * @generic {Phaser.Geom.Point} O - [out,$return]
 *
 * @param {Phaser.Geom.Point} pointA - [description]
 * @param {Phaser.Geom.Point} pointB - [description]
 * @param {Phaser.Geom.Point} [out] - [description]
 *
 * @return {Phaser.Geom.Point} [description]
 */
var ProjectUnit = function (pointA, pointB, out) {
    if (out === undefined) { out = new Point(); }

    var amt = ((pointA.x * pointB.x) + (pointA.y * pointB.y));

    if (amt !== 0) {
        out.x = amt * pointB.x;
        out.y = amt * pointB.y;
    }

    return out;
};

export default ProjectUnit;
