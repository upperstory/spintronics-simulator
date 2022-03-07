import { PartBase } from './partbase.js';
import {worldScale} from '../constants.js';

const levelChangerRadius = 0.033979 / 2;

export class LevelChangerPart extends PartBase
{
    constructor (scene, x, y, planckWorld)
    {
        super(scene, x, y, planckWorld);
        this.partType = 'level-changer';

        this.partImage = scene.add.image(this.x, this.y,'level-changer');
        this.partImage.setScale(0.5);
        this.partImage.setDepth(16);

        //this.add(this.partImage);
        this.partWidth = this.partImage.displayWidth;
        this.partHeight = this.partImage.displayHeight;
        //this.setSize(this.partWidth, this.partHeight);
        //this.partImage.setDisplaySize(this.partWidth, this.partHeight);
        //this.partCenterX = this.partWidth / 2;
        //this.partCenterY = this.partHeight / 2;

        this.partImage.setInteractive({
            draggable: true,
            pixelPerfect: true,
            alphaTolerance: 1
        });


        this.sprocketCenter[0] = {x: 0, y: 0};
        this.sprocketRadius[0] = 98/2;
        this.sprocketExists[0] = true;
        this.sprocketPhysicsRadius[0] = levelChangerRadius; // in m
        this.sprocketCenter[1] = {x: 0, y: 0};
        this.sprocketRadius[1] = 98/2;
        this.sprocketExists[1] = true;
        this.sprocketPhysicsRadius[1] = levelChangerRadius; // in m
        this.sprocketCenter[2] = {x: 0, y: 0};
        this.sprocketRadius[2] = 98/2;
        this.sprocketExists[2] = true;
        this.sprocketPhysicsRadius[2] = levelChangerRadius; // in m
        this.sprocketCenter[3] = {x: 0, y: 0};
        this.sprocketRadius[3] = 98/2;
        this.sprocketExists[3] = true;
        this.sprocketPhysicsRadius[3] = levelChangerRadius; // in m
        this.sprocketCenter[4] = {x: 0, y: 0};
        this.sprocketRadius[4] = 98/2;
        this.sprocketExists[4] = true;
        this.sprocketPhysicsRadius[4] = levelChangerRadius; // in m

        // Create bodies and fixtures for Planck world

        // Create a rigid ground body
        this.ground = this.world.createBody();
        //this.ground.createFixture(planck.Edge(planck.Vec2(50.0, 0.0), planck.Vec2(-50.0, 0.0)),{density: 0.1, filterGroupIndex: -1});

        this.levelChangerBody = this.world.createDynamicBody({position: planck.Vec2(0, 0), angularDamping: 0.02});//this.resistance / 100});
        this.levelChangerFixture = this.levelChangerBody.createFixture(planck.Circle(levelChangerRadius), {density: 0.1, filterGroupIndex: -1, friction: 0});
        this.sprocketBodies[0] = this.levelChangerBody;
        this.sprocketBodies[1] = this.levelChangerBody;
        this.sprocketBodies[2] = this.levelChangerBody;

        this.levelChangerJoint = this.world.createJoint(planck.RevoluteJoint({}, this.ground, this.levelChangerBody, this.levelChangerBody.getPosition()));
        this.sprocketJoints[0] = this.levelChangerJoint;
        this.sprocketJoints[1] = this.levelChangerJoint;
        this.sprocketJoints[2] = this.levelChangerJoint;

        this.partImage.on('pointerdown', (pointer, localx, localy, event) => this.onPointerDown(pointer, localx, localy, event));
        this.partImage.on('pointermove', (pointer, localx, localy, event) => this.onPointerMove(pointer, localx, localy, event));
        this.partImage.on('pointerout', (pointer, event) => this.onPointerOut(pointer, event));
        this.partImage.on('dragstart', (pointer, dragX, dragY) => this.onDragStart(pointer, dragX, dragY, this.levelChangerBody));
        this.partImage.on('dragend', (pointer, dragX, dragY) => this.onDragEnd(pointer, dragX, dragY, this.levelChangerBody));
        this.partImage.on('drag', (pointer, dragX, dragY) => this.onDrag(pointer, dragX, dragY, this.levelChangerBody));

        this.levelChangerBody.applyAngularImpulse(0.00000005);
    }

    updatePhysics()
    {
        //this.partImage.x = this.levelChangerBody.getPosition().x * worldScale;
        //this.partImage.y = this.levelChangerBody.getPosition().y * worldScale;
        this.partImage.rotation = this.levelChangerBody.getAngle();
    }

    setPartTint(color)
    {
        this.partImage.setTint(color);
    }

    clearPartTint()
    {
        this.partImage.clearTint();
    }

    setPosition(x, y)
    {
        this.x = x;
        this.y = y;
        if (this.partImage != undefined)
            this.partImage.setPosition(x, y);
    }

    destroy()
    {
        this.partImage.destroy();
        this.world.destroyBody(this.levelChangerBody);
        this.world.destroyBody(this.ground);
    }

    getPartExtents()
    {
        return {left: this.x - 98/2, right: this.x + 98/2, top: this.y - 98/2, bottom: this.y + 98/2};
    }

}
