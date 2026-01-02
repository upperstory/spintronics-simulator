import { PartBase } from './partbase.js';
import {worldScale} from '../constants.js';

const buttonRadius =  0.041168 / 2;

export class ButtonPart extends PartBase
{
    constructor (scene, x, y, planckWorld)
    {
        super(scene, x, y, planckWorld);
        this.partType = 'button';

        this.partImage = scene.add.image(this.x, this.y,'button-sprocket');
        this.partImage.setScale(0.5);
        this.partImage.setDepth(8);

        this.partWidth = this.partImage.displayWidth;
        this.partHeight = this.partImage.displayHeight;

        this.buttonBaseImage = scene.add.image(this.x, this.y,'button-base');
        this.buttonBaseImage.setScale(0.5);
        this.buttonBaseImage.setDepth(16);

        this.partImage.setInteractive({
            draggable: true,
            pixelPerfect: true,
            alphaTolerance: 1
        });
        this.buttonBaseImage.setInteractive({
            draggable: true,
            pixelPerfect: true,
            alphaTolerance: 1
        });

        this.sprocketCenter[0] = {x: 0, y: 0};
        this.sprocketRadius[0] = 117/2;
        this.sprocketExists[0] = true;
        this.sprocketPhysicsRadius[0] = buttonRadius; // in m
        this.sprocketCenter[1] = {x: 0, y: 0};
        this.sprocketRadius[1] = 117/2;
        this.sprocketExists[1] = true;
        this.sprocketPhysicsRadius[1] = buttonRadius; // in m
        this.sprocketCenter[2] = {x: 0, y: 0};
        this.sprocketRadius[2] = 117/2;
        this.sprocketExists[2] = true;
        this.sprocketPhysicsRadius[2] = buttonRadius; // in m

        // Create bodies and fixtures for Planck world

        // Create a rigid ground body
        this.ground = this.world.createBody();
        //this.ground.createFixture(planck.Edge(planck.Vec2(50.0, 0.0), planck.Vec2(-50.0, 0.0)),{density: 0.1, filterGroupIndex: -1});

        this.buttonBody = this.world.createDynamicBody({position: planck.Vec2(0,0), angularDamping: 0.02});//this.resistance / 100});
        this.buttonFixture = this.buttonBody.createFixture(planck.Circle(buttonRadius), {density: 0.1, filterGroupIndex: -1, friction: 0});
        this.sprocketBodies[0] = this.buttonBody;
        this.sprocketBodies[1] = this.buttonBody;
        this.sprocketBodies[2] = this.buttonBody;

        this.buttonJoint = this.world.createJoint(planck.RevoluteJoint({}, this.ground, this.buttonBody, this.buttonBody.getPosition()));
        this.sprocketJoints[0] = this.buttonJoint;
        this.sprocketJoints[1] = this.buttonJoint;
        this.sprocketJoints[2] = this.buttonJoint;

        this.partImage.on('pointerdown', (pointer, localx, localy, event) => this.onPointerDown(pointer, localx, localy, event));
        this.partImage.on('pointermove', (pointer, localx, localy, event) => this.onPointerMove(pointer, localx, localy, event));
        this.partImage.on('pointerout', (pointer, event) => this.onPointerOut(pointer, event));
        this.partImage.on('dragstart', (pointer, dragX, dragY) => this.onDragStart(pointer, dragX, dragY, this.buttonBody));
        this.partImage.on('dragend', (pointer, dragX, dragY) => this.onDragEnd(pointer, dragX, dragY, this.buttonBody));
        this.partImage.on('drag', (pointer, dragX, dragY) => this.onDrag(pointer, dragX, dragY, this.buttonBody));

        this.buttonBaseImage.on('pointerdown', (pointer, localx, localy, event) => this.onPointerDown(pointer, localx, localy, event));
        this.buttonBaseImage.on('pointermove', (pointer, localx, localy, event) => this.onPointerMove(pointer, localx, localy, event));
        this.buttonBaseImage.on('pointerout', (pointer, event) => this.onPointerOut(pointer, event));
        this.buttonBaseImage.on('dragstart', (pointer, dragX, dragY) => this.onDragStart(pointer, dragX, dragY));
        this.buttonBaseImage.on('dragend', (pointer, dragX, dragY) => this.onDragEnd(pointer, dragX, dragY));
        this.buttonBaseImage.on('drag', (pointer, dragX, dragY) => this.onDrag(pointer, dragX, dragY));

        this.setButtonState(false);
    }

    buttonState = true;

    setButtonState(state)
    {
        if (state) {
            this.buttonBody.setType(planck.Body.DYNAMIC);
            this.buttonBaseImage.setTexture('button-base-pushed');
        }
        else
        {
            this.buttonBody.setType(planck.Body.STATIC);
            this.buttonBaseImage.setTexture('button-base');
        }
        this.buttonState = state;
    }

    toggleState()
    {
        this.setButtonState(!this.buttonState);
    }

    // Override with new behavior
    changePartProperty()
    {
        this.toggleState();
    }

    updatePhysics()
    {
        //this.partImage.x = this.buttonBody.getPosition().x * worldScale;
        //this.partImage.y = this.buttonBody.getPosition().y * worldScale;
        this.partImage.rotation = this.buttonBody.getAngle();
    }

    setPartTint(color)
    {
        this.partImage.setTint(color);
        this.buttonBaseImage.setTint(color);
    }

    clearPartTint()
    {
        this.partImage.clearTint();
        this.buttonBaseImage.clearTint();
    }

    setPosition(x, y)
    {
        this.x = x;
        this.y = y;
        if (this.partImage != undefined)
            this.partImage.setPosition(x, y);
        if (this.buttonBaseImage != undefined)
            this.buttonBaseImage.setPosition(x, y);
    }

    clickedInInteractMode(pointer)
    {
        // The button was clicked in Interact mode. If it's over the center, change the button's state.
        // Part's midpoint:
        if (Math.sqrt(Math.pow(Math.abs(this.x - pointer.worldX),2) + Math.pow(Math.abs(this.y - pointer.worldY), 2)) < 22)
        {
            this.toggleState();
        }
    }

    serialize()
    {
        let partObject = {
            type: this.partType,
            x: this.x,
            y: this.y,
            value: this.buttonState
        }
        return partObject;
    }

    destroy()
    {
        // Remove event listeners before destroying to prevent memory leaks
        this.partImage.off('pointerdown');
        this.partImage.off('pointermove');
        this.partImage.off('pointerout');
        this.partImage.off('dragstart');
        this.partImage.off('dragend');
        this.partImage.off('drag');

        this.buttonBaseImage.off('pointerdown');
        this.buttonBaseImage.off('pointermove');
        this.buttonBaseImage.off('pointerout');
        this.buttonBaseImage.off('dragstart');
        this.buttonBaseImage.off('dragend');
        this.buttonBaseImage.off('drag');

        // Destroy game objects
        this.partImage.destroy();
        this.buttonBaseImage.destroy();

        // Destroy physics bodies
        this.world.destroyBody(this.buttonBody);
        this.world.destroyBody(this.ground);
    }

    getPartExtents()
    {
        return {left: this.x - 117/2, right: this.x + 117/2, top: this.y - 117/2, bottom: this.y + 117/2};
    }
}
