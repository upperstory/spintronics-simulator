import { PartBase } from './partbase.js';
import {worldScale} from '../constants.js';

const smallSprocketRadius = 0.011348; // in m
const mediumSprocketRadius = 0.022638;
const largeSprocketRadius = 0.033941;
const sprocketCapRadius = 0.0045;
const planetOrbitRadius = 0.009;
const planetRadius = 0.003;

export class JunctionPart extends PartBase
{
    // Levels:
    // 1 = Below bottom level sprockets
    // 2 = Level 1 sprockets
    // 3 = Level 1 chains
    // 4 = Part content between level 1 and level 2 sprockets
    // 5 = Level 2 sprockets
    // 6 = Level 2 chains
    // 7 = Part content between level 2 and level 3 sprockets
    // 8 = Level 3 sprockets
    // 9 = Level 3 chains
    // 10 = Part content between level 3 and level 4 sprockets
    // 11 = Level 4 sprockets
    // 12 = Level 4 chains
    // 13 = Part content between level 4 and level 5 sprockets
    // 14 = Level 5 sprockets
    // 15 = Level 5 chains
    // 16 = Part content above level 5 sprockets
    partType = 'junction';
    constructor (scene, x, y, planckWorld)
    {
        super(scene, x, y, planckWorld);
        this.markBody(this.ground);
        // Create the images for this part
        this.partImage = PartBase.makeImage(scene, this.x, this.y,'junction-bottom', 0.5, 2)
        this.markImage(this.partImage);
        //this.add(this.partImage);
        this.partWidth = this.partImage.displayWidth;
        this.partHeight = this.partImage.displayHeight;
        // Set the size of the container to the size of the biggest piece (this base sprocket)
        //this.setSize(this.partWidth, this.partHeight);
        //this.partCenterX = this.partWidth / 2;
        //this.partCenterY = this.partHeight / 2;
        this.capImage = PartBase.makeImage(scene, this.x, this.y, 'junction-cap', 0.5, 10);
        this.markImage(this.capImage);
        //this.add(this.capImage);
        this.middleSprocketImage = PartBase.makeImage(scene, this.x, this.y, 'junction-middle', 0.5, 5);
        this.markImage(this.middleSprocketImage);
        //this.add(this.middleSprocketImage);
        this.topSprocketImage = PartBase.makeImage(scene, this.x, this.y, 'junction-top', 0.5, 8);
        this.markImage(this.topSprocketImage);
        //this.add(this.topSprocketImage);

        /*this.planet1Image = scene.add.image(this.x, this.y,'junction-planet');
        this.planet1Image.setScale(0.5);
        this.planet1Image.setDepth(5);
        //this.add(this.planet1Image);

        this.planet2Image = scene.add.image(this.x, this.y,'junction-planet');
        this.planet2Image.setScale(0.5);
        this.planet2Image.setDepth(5);
        //this.add(this.planet2Image);

        this.planet3Image = scene.add.image(this.x, this.y,'junction-planet');
        this.planet3Image.setScale(0.5);
        this.planet3Image.setDepth(5);
        //this.add(this.planet3Image);*/
        PartBase.setAllInteractive({
            draggable: true,
            pixelPerfect: true,
            alphaTolerance: 1
        },
            this.partImage,
            this.capImage,
            this.middleSprocketImage,
            this.topSprocketImage
        )

        this.setupSprocket(0, {x: 0, y: 0}, 176/2, true, largeSprocketRadius);
        this.setupSprocket(1, {x: 0, y: 0}, 117/2, true, mediumSprocketRadius);
        this.setupSprocket(2, {x: 0, y: 0}, 59/2, true, smallSprocketRadius);

        // Create bodies and fixtures for Planck world
        // Create junction bodies and joints
        this.largeSprocketBody = this.standardBody(0.5);
        this.markBody(this.largeSprocketBody)
        PartBase.createFixture(this.largeSprocketBody, largeSprocketRadius);
        this.sprocketBodies[0] = this.largeSprocketBody;
        this.largeSprocketBodyNG = this.standardBody(0);
        this.markBody(this.largeSprocketBodyNG);
        PartBase.createFixture(this.largeSprocketBodyNG, largeSprocketRadius);
        this.mediumSprocketBody = this.standardBody(0.5);
        this.markBody(this.mediumSprocketBody);
        PartBase.createFixture(this.mediumSprocketBody, mediumSprocketRadius);
        this.sprocketBodies[1] = this.mediumSprocketBody;
        this.smallSprocketBody = this.standardBody(0.5);
        this.markBody(this.smallSprocketBody);
        PartBase.createFixture(this.smallSprocketBody, smallSprocketRadius);
        this.sprocketBodies[2] = this.smallSprocketBody;
        this.sprocketCapBody = this.world.createDynamicBody(planck.Vec2(0,0));
        this.markBody(this.sprocketCapBody);
        PartBase.createFixture(this.sprocketCapBody, sprocketCapRadius);

        // Create the planets
        /*this.planet1Body = this.world.createDynamicBody(planck.Vec2(this.x / worldScale, this.y / worldScale - planetOrbitRadius));
        this.planet1Body.createFixture(planck.Circle(planetRadius), {density: 0.1, filterGroupIndex: -1});
        this.planet2Body = this.world.createDynamicBody(planck.Vec2((this.x / worldScale) + Math.cos(((Math.PI * 2) / 3) - Math.PI / 2) * planetOrbitRadius, (this.y / worldScale) + Math.sin(((Math.PI * 2) / 3) - Math.PI / 2) * planetOrbitRadius));
        this.planet2Body.createFixture(planck.Circle(planetRadius), {density: 0.1, filterGroupIndex: -1});
        this.planet3Body = this.world.createDynamicBody(planck.Vec2((this.x / worldScale) + Math.cos(-((Math.PI * 2) / 3) - Math.PI / 2) * planetOrbitRadius, (this.y / worldScale) + Math.sin(-((Math.PI * 2) / 3) - Math.PI / 2) * planetOrbitRadius));
        this.planet3Body.createFixture(planck.Circle(planetRadius), {density: 0.1, filterGroupIndex: -1});*/
        let jointBNG = this.standardRevolute(this.ground, this.largeSprocketBodyNG);
        let jointB = this.standardRevolute(this.ground, this.largeSprocketBody);
        this.sprocketJoints[0] = jointB;
        let jointM = this.standardRevolute(this.largeSprocketBodyNG, this.mediumSprocketBody);
        let jointMground = this.standardRevolute(this.ground,this.mediumSprocketBody);
        this.sprocketJoints[1] = jointMground;
        let jointT = this.standardRevolute(this.largeSprocketBody, this.smallSprocketBody);
        let jointTground = this.standardRevolute(this.ground, this.smallSprocketBody);
        this.sprocketJoints[2] = jointTground;
        let jointCap = this.weld(this.largeSprocketBodyNG, this.sprocketCapBody);
        
        this.markJoint(jointBNG);
        this.markJoint(jointB);
        this.markJoint(jointM);
        this.markJoint(jointMground);
        this.markJoint(jointT);
        this.markJoint(jointTground);
        this.markJoint(jointCap);
        /*let jointPlanet1 = this.world.createJoint(planck.RevoluteJoint({}, this.largeSprocketBody, this.planet1Body, this.planet1Body.getPosition()));
        let jointPlanet2 = this.world.createJoint(planck.RevoluteJoint({}, this.largeSprocketBody, this.planet2Body, this.planet2Body.getPosition()));
        let jointPlanet3 = this.world.createJoint(planck.RevoluteJoint({}, this.largeSprocketBody, this.planet3Body, this.planet3Body.getPosition()));*/

        /*let jointPlanet1MediumSprocket = this.world.createJoint(planck.GearJoint({}, this.planet1Body, this.mediumSprocketBody, jointPlanet1, jointM, 48/12));
        let jointPlanet2MediumSprocket = this.world.createJoint(planck.GearJoint({}, this.planet2Body, this.mediumSprocketBody, jointPlanet2, jointM, 48/12));
        let jointPlanet3MediumSprocket = this.world.createJoint(planck.GearJoint({}, this.planet3Body, this.mediumSprocketBody, jointPlanet3, jointM, 48/12));
*/
        //2(vm - 2vb) = vt - vb
        this.jointLargeLargeNGSprocket = this.gearJoint(this.largeSprocketBody, this.largeSprocketBodyNG, jointB, jointBNG, -1);
        this.markJoint(this.jointLargeLargeNGSprocket);
        this.jointMediumTopSprocket = this.gearJoint(this.mediumSprocketBody, this.largeSprocketBodyNG, jointM, jointT, 1/2);
        this.markJoint(this.jointMediumTopSprocket);

        // Set up drag listeners
        this.setupInteractions(
            this.partImage,
            this.largeSprocketBody
        );
        
        this.setupInteractions(
            this.middleSprocketImage,
            this.mediumSprocketBody
        );
        
        this.setupInteractions(
            this.topSprocketImage,
            this.smallSprocketBody
        );
        
        this.setupInteractions(
            this.capImage,
            this.sprocketCapBody
        );

        this.largeSprocketBody.applyAngularImpulse(0.0000002);
    }

    updatePhysics()
    {
        //this.partImage.x = this.largeSprocketBody.getPosition().x * worldScale;
        //this.partImage.y = this.largeSprocketBody.getPosition().y * worldScale;
        this.syncRotation(this.partImage, this.largeSprocketBody);

        //this.middleSprocketImage.x = this.mediumSprocketBody.getPosition().x * worldScale;
        //this.middleSprocketImage.y = this.mediumSprocketBody.getPosition().y * worldScale;
        this.syncRotation(this.middleSprocketImage, this.mediumSprocketBody);

        //this.topSprocketImage.x = this.smallSprocketBody.getPosition().x * worldScale;
        //this.topSprocketImage.y = this.smallSprocketBody.getPosition().y * worldScale;
        this.syncRotation(this.topSprocketImage, this.smallSprocketBody);

        //this.capImage.x = this.sprocketCapBody.getPosition().x * worldScale;
        //this.capImage.y = this.sprocketCapBody.getPosition().y * worldScale;
        this.syncRotation(this.capImage, this.sprocketCapBody);

        /*this.planet1Image.x = this.planet1Body.getPosition().x * worldScale;
        this.planet1Image.y = this.planet1Body.getPosition().y * worldScale;
        this.planet1Image.rotation = this.planet1Body.getAngle();

        this.planet2Image.x = this.planet2Body.getPosition().x * worldScale;
        this.planet2Image.y = this.planet2Body.getPosition().y * worldScale;
        this.planet2Image.rotation = this.planet2Body.getAngle();

        this.planet3Image.x = this.planet3Body.getPosition().x * worldScale;
        this.planet3Image.y = this.planet3Body.getPosition().y * worldScale;
        this.planet3Image.rotation = this.planet3Body.getAngle();*/


    }

    setPartTint(color)
    {
        this.partImage.setTint(color);
        this.middleSprocketImage.setTint(color);
        this.topSprocketImage.setTint(color);
        this.capImage.setTint(color);
        /*this.planet1Image.setTint(color);
        this.planet2Image.setTint(color);
        this.planet3Image.setTint(color);*/
    }

    clearPartTint()
    {
        this.partImage.clearTint();
        this.middleSprocketImage.clearTint();
        this.topSprocketImage.clearTint();
        this.capImage.clearTint();
        /*this.planet1Image.clearTint();
        this.planet2Image.clearTint();
        this.planet3Image.clearTint();*/
    }

    setPosition(x, y)
    {
        this.x = x;
        this.y = y;
        if (this.partImage != undefined)
            this.partImage.setPosition(x, y);
        if (this.middleSprocketImage != undefined)
            this.middleSprocketImage.setPosition(x, y);
        if (this.topSprocketImage != undefined)
            this.topSprocketImage.setPosition(x, y);
        if (this.capImage != undefined)
            this.capImage.setPosition(x, y);
    }

    getPartExtents()
    {
        return {left: this.x - 176/2, right: this.x + 176/2, top: this.y - 176/2, bottom: this.y + 176/2};
    }
}
