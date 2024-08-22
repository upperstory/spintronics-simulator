import { PartBase } from './partbase.js';
import {worldScale} from '../constants.js';

const diodeRadius = 0.033979 / 2;

export class DiodePart extends PartBase
{
    constructor (scene, x, y, planckWorld)
    {
        super(scene, x, y, planckWorld);
        this.partType = 'diode';
        this.hasChainConnection = 'open';
        this.partImage = scene.add.image(this.x, this.y,'diode-sprocket');
        this.partImage.setScale(0.5);
        this.partImage.setDepth(10);

        //this.add(this.partImage);
        // this.partWidth = this.partImage.displayWidth;
        // this.partHeight = this.partImage.displayHeight;
        //this.setSize(this.partWidth, this.partHeight);
        //this.partImage.setDisplaySize(this.partWidth, this.partHeight);
        //this.partCenterX = this.partWidth / 2;
        //this.partCenterY = this.partHeight / 2;

        this.diodeBaseImage = scene.add.image(this.x, this.y,'diode-base');
        this.diodeBaseImage.setScale(0.5);
        this.diodeBaseImage.setDepth(10);

        this.partImage.setInteractive({
            draggable: true,
            pixelPerfect: true,
            alphaTolerance: 1
        });
        this.diodeBaseImage.setInteractive({
            draggable: true,
            pixelPerfect: true,
            alphaTolerance: 1
        });

        this.sprocketCenter[0] = {x: 0, y: 0};
        this.sprocketRadius[0] = 99/2;
        this.sprocketExists[0] = true;
        this.sprocketPhysicsRadius[0] = diodeRadius; // in m
        this.sprocketCenter[1] = {x: 0, y: 0};
        this.sprocketRadius[1] = 99/2;
        this.sprocketExists[1] = true;
        this.sprocketPhysicsRadius[1] = diodeRadius; // in m
        this.sprocketCenter[2] = {x: 0, y: 0};
        this.sprocketRadius[2] = 99/2;
        this.sprocketExists[2] = true;
        this.sprocketPhysicsRadius[2] = diodeRadius; // in m

        // Create bodies and fixtures for Planck world

        // Create a rigid ground body
        this.ground = this.world.createBody();
        //this.ground.createFixture(planck.Edge(planck.Vec2(50.0, 0.0), planck.Vec2(-50.0, 0.0)),{density: 0.1, filterGroupIndex: -1});

        this.diodeSprocket = this.world.createDynamicBody({position: planck.Vec2(0,0), angularDamping: 0.05});//this.resistance / 100});
        this.diodeFixture = this.diodeSprocket.createFixture(planck.Circle(diodeRadius), {density: 0.1, filterGroupIndex: -1, friction: 0});
        this.sprocketBodies[0] = this.diodeSprocket;
        this.sprocketBodies[1] = this.diodeSprocket;
        this.sprocketBodies[2] = this.diodeSprocket;

        this.diodeJoint = this.world.createJoint(planck.RevoluteJoint({enableLimit: true}, this.ground, this.diodeSprocket, this.diodeSprocket.getPosition()));
        this.sprocketJoints[0] = this.diodeJoint;
        this.sprocketJoints[1] = this.diodeJoint;
        this.sprocketJoints[2] = this.diodeJoint;

        this.partImage.on('pointerdown', (pointer, localx, localy, event) => this.onPointerDown(pointer, localx, localy, event));
        this.partImage.on('pointermove', (pointer, localx, localy, event) => this.onPointerMove(pointer, localx, localy, event));
        this.partImage.on('pointerout', (pointer, event) => this.onPointerOut(pointer, event));
        this.partImage.on('dragstart', (pointer, dragX, dragY) => this.onDragStart(pointer, dragX, dragY, this.diodeSprocket));
        this.partImage.on('dragend', (pointer, dragX, dragY) => this.onDragEnd(pointer, dragX, dragY, this.diodeSprocket));
        this.partImage.on('drag', (pointer, dragX, dragY) => this.onDrag(pointer, dragX, dragY, this.diodeSprocket));

        this.diodeBaseImage.on('pointerdown', (pointer, localx, localy, event) => this.onPointerDown(pointer, localx, localy, event));
        this.diodeBaseImage.on('pointermove', (pointer, localx, localy, event) => this.onPointerMove(pointer, localx, localy, event));
        this.diodeBaseImage.on('pointerout', (pointer, event) => this.onPointerOut(pointer, event));
        this.diodeBaseImage.on('dragstart', (pointer, dragX, dragY) => this.onDragStart(pointer, dragX, dragY));
        this.diodeBaseImage.on('dragend', (pointer, dragX, dragY) => this.onDragEnd(pointer, dragX, dragY));
        this.diodeBaseImage.on('drag', (pointer, dragX, dragY) => this.onDrag(pointer, dragX, dragY));

        this.diodeSprocket.applyAngularImpulse(0.0000002);
    }

    lowerLimit = null;

    updatePhysics()
    {
        //this.partImage.x = this.diodeSprocket.getPosition().x * worldScale;
        //this.partImage.y = this.diodeSprocket.getPosition().y * worldScale;
        this.partImage.rotation = this.diodeSprocket.getAngle();

        if (this.lowerLimit == null || this.diodeSprocket.getAngle() > this.lowerLimit) {
            this.lowerLimit = this.diodeSprocket.getAngle();
            this.diodeJoint.setLimits(this.lowerLimit, this.diodeSprocket.getAngle() + Math.PI * 2);
        }

        //this.buttonBody.setType(planck.Body.DYNAMIC);
    }

    setPartTint(color)
    {
        this.partImage.setTint(color);
        this.diodeBaseImage.setTint(color);
    }

    clearPartTint()
    {
        this.partImage.clearTint();
        this.diodeBaseImage.clearTint();
    }

    setPosition(x, y)
    {
        this.x = x;
        this.y = y;
        if (this.partImage != undefined)
            this.partImage.setPosition(x, y);
        if (this.diodeBaseImage != undefined)
            this.diodeBaseImage.setPosition(x, y);
    }

    destroy()
    {
        this.partImage.destroy();
        this.diodeBaseImage.destroy();
        this.world.destroyBody(this.diodeSprocket);
        this.world.destroyBody(this.ground);
    }

    getPartExtents()
    {
        return {left: this.x - 99/2, right: this.x + 99/2, top: this.y - 99/2, bottom: this.y + 99/2};
    }

}