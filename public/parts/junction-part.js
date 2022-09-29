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

    constructor (scene, x, y, planckWorld)
    {
        super(scene, x, y, planckWorld);
        this.partType = 'junction';

        // Create the images for this part
        this.partImage = scene.add.image(this.x, this.y,'junction-bottom');
        this.partImage.setScale(0.5);
        this.partImage.setDepth(2);
        //this.add(this.partImage);
        // this.partWidth = this.partImage.displayWidth;
        // this.partHeight = this.partImage.displayHeight;
        // Set the size of the container to the size of the biggest piece (this base sprocket)
        //this.setSize(this.partWidth, this.partHeight);
        //this.partCenterX = this.partWidth / 2;
        //this.partCenterY = this.partHeight / 2;

        this.capImage = scene.add.image(this.x, this.y,'junction-cap');
        this.capImage.setScale(0.5);
        this.capImage.setDepth(10);
        //this.add(this.capImage);

        this.middleSprocketImage = scene.add.image(this.x, this.y,'junction-middle');
        this.middleSprocketImage.setScale(0.5);
        this.middleSprocketImage.setDepth(5);
        //this.add(this.middleSprocketImage);

        this.topSprocketImage = scene.add.image(this.x, this.y,'junction-top');
        this.topSprocketImage.setScale(0.5);
        this.topSprocketImage.setDepth(8);
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

        this.partImage.setInteractive({
            draggable: true,
            pixelPerfect: true,
            alphaTolerance: 1
        });
        this.capImage.setInteractive({
            draggable: true,
            pixelPerfect: true,
            alphaTolerance: 1
        });
        this.middleSprocketImage.setInteractive({
            draggable: true,
            pixelPerfect: true,
            alphaTolerance: 1
        });
        this.topSprocketImage.setInteractive({
            draggable: true,
            pixelPerfect: true,
            alphaTolerance: 1
        });

        this.sprocketCenter[0] = {x: 0, y: 0};
        this.sprocketRadius[0] = 176/2;
        this.sprocketExists[0] = true;
        this.sprocketPhysicsRadius[0] = largeSprocketRadius; // in m
        this.sprocketCenter[1] = {x: 0, y: 0};
        this.sprocketRadius[1] = 117/2;
        this.sprocketExists[1] = true;
        this.sprocketPhysicsRadius[1] = mediumSprocketRadius;
        this.sprocketCenter[2] = {x: 0, y: 0};
        this.sprocketRadius[2] = 59/2;
        this.sprocketExists[2] = true;
        this.sprocketPhysicsRadius[2] = smallSprocketRadius;

        // Create bodies and fixtures for Planck world

        // Create a rigid ground body
        this.ground = this.world.createBody();

        // Create junction bodies and joints
        this.largeSprocketBody = this.world.createDynamicBody({position: planck.Vec2(0,0), angularDamping: 0.5});
        this.largeSprocketBody.createFixture(planck.Circle(largeSprocketRadius), {density: 0.1, filterGroupIndex: -1});
        this.sprocketBodies[0] = this.largeSprocketBody;
        this.largeSprocketBodyNG = this.world.createDynamicBody({position: planck.Vec2(0,0), angularDamping: 0});
        this.largeSprocketBodyNG.createFixture(planck.Circle(largeSprocketRadius), {density: 0.1, filterGroupIndex: -1});
        this.mediumSprocketBody = this.world.createDynamicBody({position: planck.Vec2(0,0), angularDamping: 0.5});
        this.mediumSprocketBody.createFixture(planck.Circle(mediumSprocketRadius), {density: 0.1, filterGroupIndex: -1});
        this.sprocketBodies[1] = this.mediumSprocketBody;
        this.smallSprocketBody = this.world.createDynamicBody({position: planck.Vec2(0,0), angularDamping: 0.5});
        this.smallSprocketBody.createFixture(planck.Circle(smallSprocketRadius), {density: 0.1, filterGroupIndex: -1});
        this.sprocketBodies[2] = this.smallSprocketBody;
        this.sprocketCapBody = this.world.createDynamicBody(planck.Vec2(0,0));
        this.sprocketCapBody.createFixture(planck.Circle(sprocketCapRadius), {density: 0.1, filterGroupIndex: -1});

        // Create the planets
        /*this.planet1Body = this.world.createDynamicBody(planck.Vec2(this.x / worldScale, this.y / worldScale - planetOrbitRadius));
        this.planet1Body.createFixture(planck.Circle(planetRadius), {density: 0.1, filterGroupIndex: -1});
        this.planet2Body = this.world.createDynamicBody(planck.Vec2((this.x / worldScale) + Math.cos(((Math.PI * 2) / 3) - Math.PI / 2) * planetOrbitRadius, (this.y / worldScale) + Math.sin(((Math.PI * 2) / 3) - Math.PI / 2) * planetOrbitRadius));
        this.planet2Body.createFixture(planck.Circle(planetRadius), {density: 0.1, filterGroupIndex: -1});
        this.planet3Body = this.world.createDynamicBody(planck.Vec2((this.x / worldScale) + Math.cos(-((Math.PI * 2) / 3) - Math.PI / 2) * planetOrbitRadius, (this.y / worldScale) + Math.sin(-((Math.PI * 2) / 3) - Math.PI / 2) * planetOrbitRadius));
        this.planet3Body.createFixture(planck.Circle(planetRadius), {density: 0.1, filterGroupIndex: -1});*/

        let jointBNG = this.world.createJoint(planck.RevoluteJoint({}, this.ground, this.largeSprocketBodyNG, this.largeSprocketBodyNG.getPosition()));
        let jointB = this.world.createJoint(planck.RevoluteJoint({}, this.ground, this.largeSprocketBody, this.largeSprocketBody.getPosition()));
        this.sprocketJoints[0] = jointB;
        let jointM = this.world.createJoint(planck.RevoluteJoint({}, this.largeSprocketBodyNG, this.mediumSprocketBody, this.mediumSprocketBody.getPosition()));
        let jointMground = this.world.createJoint(planck.RevoluteJoint({}, this.ground, this.mediumSprocketBody, this.mediumSprocketBody.getPosition()));
        this.sprocketJoints[1] = jointMground;
        let jointT = this.world.createJoint(planck.RevoluteJoint({}, this.largeSprocketBody, this.smallSprocketBody, this.smallSprocketBody.getPosition()));
        let jointTground = this.world.createJoint(planck.RevoluteJoint({}, this.ground, this.smallSprocketBody, this.smallSprocketBody.getPosition()));
        this.sprocketJoints[2] = jointTground;
        let jointCap = this.world.createJoint(planck.WeldJoint({}, this.largeSprocketBodyNG, this.sprocketCapBody));

        /*let jointPlanet1 = this.world.createJoint(planck.RevoluteJoint({}, this.largeSprocketBody, this.planet1Body, this.planet1Body.getPosition()));
        let jointPlanet2 = this.world.createJoint(planck.RevoluteJoint({}, this.largeSprocketBody, this.planet2Body, this.planet2Body.getPosition()));
        let jointPlanet3 = this.world.createJoint(planck.RevoluteJoint({}, this.largeSprocketBody, this.planet3Body, this.planet3Body.getPosition()));*/

        /*let jointPlanet1MediumSprocket = this.world.createJoint(planck.GearJoint({}, this.planet1Body, this.mediumSprocketBody, jointPlanet1, jointM, 48/12));
        let jointPlanet2MediumSprocket = this.world.createJoint(planck.GearJoint({}, this.planet2Body, this.mediumSprocketBody, jointPlanet2, jointM, 48/12));
        let jointPlanet3MediumSprocket = this.world.createJoint(planck.GearJoint({}, this.planet3Body, this.mediumSprocketBody, jointPlanet3, jointM, 48/12));
*/
        //2(vm - 2vb) = vt - vb
        this.jointLargeLargeNGSprocket = this.world.createJoint(planck.GearJoint({}, this.largeSprocketBody, this.largeSprocketBodyNG, jointB, jointBNG, -1));
        this.jointMediumTopSprocket = this.world.createJoint(planck.GearJoint({}, this.mediumSprocketBody, this.largeSprocketBodyNG, jointM, jointT, 1/2));

        // Set up drag listeners
        this.partImage.on('dragstart', (pointer, dragX, dragY) => this.onDragStart(pointer, dragX, dragY, this.largeSprocketBody));
        this.partImage.on('dragend', (pointer, dragX, dragY) => this.onDragEnd(pointer, dragX, dragY, this.largeSprocketBody));
        this.partImage.on('drag', (pointer, dragX, dragY) => this.onDrag(pointer, dragX, dragY, this.largeSprocketBody));
        this.partImage.on('pointerdown', (pointer, localx, localy, event) => this.onPointerDown(pointer, localx, localy, event));
        this.partImage.on('pointermove', (pointer, localx, localy, event) => this.onPointerMove(pointer, localx, localy, event));
        this.partImage.on('pointerout', (pointer, event) => this.onPointerOut(pointer, event));

        this.middleSprocketImage.on('dragstart', (pointer, dragX, dragY) => this.onDragStart(pointer, dragX, dragY, this.mediumSprocketBody));
        this.middleSprocketImage.on('dragend', (pointer, dragX, dragY) => this.onDragEnd(pointer, dragX, dragY, this.mediumSprocketBody));
        this.middleSprocketImage.on('drag', (pointer, dragX, dragY) => this.onDrag(pointer, dragX, dragY, this.mediumSprocketBody));
        this.middleSprocketImage.on('pointerdown', (pointer, localx, localy, event) => this.onPointerDown(pointer, localx, localy, event));
        this.middleSprocketImage.on('pointermove', (pointer, localx, localy, event) => this.onPointerMove(pointer, localx, localy, event));
        this.middleSprocketImage.on('pointerout', (pointer, event) => this.onPointerOut(pointer, event));

        this.topSprocketImage.on('dragstart', (pointer, dragX, dragY) => this.onDragStart(pointer, dragX, dragY, this.smallSprocketBody));
        this.topSprocketImage.on('dragend', (pointer, dragX, dragY) => this.onDragEnd(pointer, dragX, dragY, this.smallSprocketBody));
        this.topSprocketImage.on('drag', (pointer, dragX, dragY) => this.onDrag(pointer, dragX, dragY, this.smallSprocketBody));
        this.topSprocketImage.on('pointerdown', (pointer, localx, localy, event) => this.onPointerDown(pointer, localx, localy, event));
        this.topSprocketImage.on('pointermove', (pointer, localx, localy, event) => this.onPointerMove(pointer, localx, localy, event));
        this.topSprocketImage.on('pointerout', (pointer, event) => this.onPointerOut(pointer, event));

        this.capImage.on('dragstart', (pointer, dragX, dragY) => this.onDragStart(pointer, dragX, dragY, this.sprocketCapBody));
        this.capImage.on('dragend', (pointer, dragX, dragY) => this.onDragEnd(pointer, dragX, dragY, this.sprocketCapBody));
        this.capImage.on('drag', (pointer, dragX, dragY) => this.onDrag(pointer, dragX, dragY, this.sprocketCapBody));
        this.capImage.on('pointerdown', (pointer, localx, localy, event) => this.onPointerDown(pointer, localx, localy, event));
        this.capImage.on('pointermove', (pointer, localx, localy, event) => this.onPointerMove(pointer, localx, localy, event));
        this.capImage.on('pointerout', (pointer, event) => this.onPointerOut(pointer, event));

        this.largeSprocketBody.applyAngularImpulse(0.0000002);
    }

    updatePhysics()
    {
        //this.partImage.x = this.largeSprocketBody.getPosition().x * worldScale;
        //this.partImage.y = this.largeSprocketBody.getPosition().y * worldScale;
        this.partImage.rotation = this.largeSprocketBody.getAngle();

        //this.middleSprocketImage.x = this.mediumSprocketBody.getPosition().x * worldScale;
        //this.middleSprocketImage.y = this.mediumSprocketBody.getPosition().y * worldScale;
        this.middleSprocketImage.rotation = this.mediumSprocketBody.getAngle();

        //this.topSprocketImage.x = this.smallSprocketBody.getPosition().x * worldScale;
        //this.topSprocketImage.y = this.smallSprocketBody.getPosition().y * worldScale;
        this.topSprocketImage.rotation = this.smallSprocketBody.getAngle();

        //this.capImage.x = this.sprocketCapBody.getPosition().x * worldScale;
        //this.capImage.y = this.sprocketCapBody.getPosition().y * worldScale;
        this.capImage.rotation = this.sprocketCapBody.getAngle();

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
        if (this.partImage !== undefined)
            this.partImage.setPosition(x, y);
        if (this.middleSprocketImage !== undefined)
            this.middleSprocketImage.setPosition(x, y);
        if (this.topSprocketImage !== undefined)
            this.topSprocketImage.setPosition(x, y);
        if (this.capImage !== undefined)
            this.capImage.setPosition(x, y);
    }

    destroy()
    {
        this.partImage.destroy();
        this.middleSprocketImage.destroy();
        this.topSprocketImage.destroy();
        this.capImage.destroy();
        this.world.destroyJoint(this.jointLargeLargeNGSprocket);
        this.world.destroyJoint(this.jointMediumTopSprocket);
        this.world.destroyBody(this.largeSprocketBody);
        this.world.destroyBody(this.mediumSprocketBody);
        this.world.destroyBody(this.smallSprocketBody);
        this.world.destroyBody(this.sprocketCapBody);
        this.world.destroyBody(this.ground);
    }

    getPartExtents()
    {
        return {left: this.x - 176/2, right: this.x + 176/2, top: this.y - 176/2, bottom: this.y + 176/2};
    }
}