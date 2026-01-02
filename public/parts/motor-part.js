import { PartBase } from './partbase.js';
import {worldScale} from '../constants.js';
import { ToggleButton } from '../toggle-button.js';

const motorWheelRadius = 0.025771 / 2;
const intermediateGearTopRadius = 0.0364 / 2;
const intermediateGearBottomRadius = 0.014 / 2;
const driveGearRadius = 0.042 / 2;
const sprocketGearRadius = 0.014 / 2;

export class MotorPart extends PartBase
{
    constructor (scene, x, y, planckWorld)
    {
        super(scene, x, y, planckWorld);
        this.partType = 'motor';

        this.isShorted = false;
        this.buttonWidth = 300;
        this.buttonHeight = 50;

        // Create the reset button textures only once (check if they already exist)
        this.resetButtonYOffset = 140;
        if (!scene.textures.exists('reset-button-default-background')) {
            let graphics = scene.add.graphics();
            graphics.fillStyle(0xED1C24, 1);
            graphics.fillRoundedRect(0, 0, this.buttonWidth, this.buttonHeight, 10);
            graphics.generateTexture('reset-button-default-background', this.buttonWidth, this.buttonHeight);
            graphics.destroy();

            graphics = scene.add.graphics();
            graphics.fillStyle(0xD6212E, 1);
            graphics.fillRoundedRect(0, 0, this.buttonWidth, this.buttonHeight, 10);
            graphics.generateTexture('reset-button-hover-background', this.buttonWidth, this.buttonHeight);
            graphics.destroy();

            graphics = scene.add.graphics();
            graphics.fillStyle(0xED1C24, 1);
            graphics.fillRoundedRect(0, 0, this.buttonWidth, this.buttonHeight, 10);
            graphics.generateTexture('reset-button-disabled-background', this.buttonWidth, this.buttonHeight);
            graphics.destroy();

            graphics = scene.add.graphics();
            graphics.fillStyle(0xB51F2B, 1);
            graphics.lineStyle(2,0x111111, 0.8);
            graphics.fillRoundedRect(0, 0, this.buttonWidth, this.buttonHeight, 10);
            graphics.strokeRoundedRect(1, 1, this.buttonWidth-2, this.buttonHeight-2, 10);
            graphics.generateTexture('reset-button-selected-background', this.buttonWidth, this.buttonHeight);
            graphics.destroy();
        }

        this.onSwitchToggled = this.onSwitchToggled.bind(this);

        this.resetButton = new ToggleButton(scene, 'reset-circuit-breaker', this.x, this.y + this.resetButtonYOffset, this.buttonWidth, this.buttonHeight, 'reset-button-default-background', 'reset-button-hover-background', 'reset-button-selected-background', 'reset-circuit-breaker', this.onSwitchToggled, 'reset-button-disabled-background');
        this.resetButton.setDepth(12);
        this.resetButton.setVisible(false);

        this.partImageOffset = {x: 0.5, y: -91.5};
        this.partImage = scene.add.image(this.x + this.partImageOffset.x, this.y + this.partImageOffset.y,'motor-wheel');
        this.partImage.setScale(0.5);
        this.partImage.setDepth(10);

        this.partWidth = this.partImage.displayWidth;
        this.partHeight = this.partImage.displayHeight;

        this.motorBaseUnderImageOffset = {x: -8, y: -7};
        this.motorBaseUnderImage = scene.add.image(this.x + this.motorBaseUnderImageOffset.x, this.y + this.motorBaseUnderImageOffset.y, 'motor-base-under');
        this.motorBaseUnderImage.setScale(0.5);
        this.motorBaseUnderImage.setDepth(0);

        this.motorBaseTileImageOffset = {x: 0, y: 20.5};
        this.motorBaseTileImage = scene.add.image(this.x + this.motorBaseTileImageOffset.x, this.y + this.motorBaseTileImageOffset.y, 'motor-base-tile');
        this.motorBaseTileImage.setScale(0.5);
        this.motorBaseTileImage.setDepth(1);

        this.motorPawlClosedImageOffset = {x: 11, y: 58};
        this.motorPawlClosedImage = scene.add.image(this.x + this.motorPawlClosedImageOffset.x, this.y + this.motorPawlClosedImageOffset.y, 'motor-pawl-closed');
        this.motorPawlClosedImage.setScale(0.5);
        this.motorPawlClosedImage.setDepth(0);
        this.motorPawlClosedImage.setVisible(false);

        this.motorPawlOpenImageOffset = {x: 11, y: 66};
        this.motorPawlOpenImage = scene.add.image(this.x + this.motorPawlOpenImageOffset.x, this.y + this.motorPawlOpenImageOffset.y, 'motor-pawl-open');
        this.motorPawlOpenImage.setScale(0.5);
        this.motorPawlOpenImage.setDepth(0);
        //this.motorPawlOpenImage.setAlpha(0.0);

        this.motorScrewImageOffset = {x: 0.5, y: -91.5};
        this.motorScrewImage = scene.add.image(this.x + this.motorScrewImageOffset.x, this.y + this.motorScrewImageOffset.y,'motor-screw');
        this.motorScrewImage.setScale(0.5);
        this.motorScrewImage.setDepth(10);

        this.motorDriveGearImageOffset = {x: -32.5, y: 129-91.5};
        this.motorDriveGearImage = scene.add.image(this.x + this.motorDriveGearImageOffset.x, this.y + this.motorDriveGearImageOffset.y,'motor-drive-gear');
        this.motorDriveGearImage.setScale(0.5);
        this.motorDriveGearImage.setDepth(1);
        //this.motorDriveGearImage.setAlpha(0.5);

        this.motorIntermediateGearImageOffset = {x: 25.5, y: 70.5-91.5};
        this.motorIntermediateGearImage = scene.add.image(this.x + this.motorIntermediateGearImageOffset.x, this.y + this.motorIntermediateGearImageOffset.y,'motor-intermediate-gear');
        this.motorIntermediateGearImage.setScale(0.5);
        this.motorIntermediateGearImage.setDepth(1);
        //this.motorIntermediateGearImage.setAlpha(0.5);

        this.motorSpannerImageOffset = {x: -3.5, y: 99.5-91.5};
        this.motorSpannerImage = scene.add.image(this.x + this.motorSpannerImageOffset.x, this.y + this.motorSpannerImageOffset.y,'motor-spanner');
        this.motorSpannerImage.setScale(0.5);
        this.motorSpannerImage.setDepth(2);
        //this.motorSpannerImage.setAlpha(0.5);

        this.partImage.setInteractive({
            draggable: true,
            pixelPerfect: true,
            alphaTolerance: 1
        });
        this.motorBaseUnderImage.setInteractive({
            draggable: true,
            pixelPerfect: true,
            alphaTolerance: 1
        });
        this.motorBaseTileImage.setInteractive({
            draggable: true,
            pixelPerfect: true,
            alphaTolerance: 1
        });
        this.motorPawlClosedImage.setInteractive({
            draggable: true,
            pixelPerfect: true,
            alphaTolerance: 1
        });
        this.motorPawlOpenImage.setInteractive({
            draggable: true,
            pixelPerfect: true,
            alphaTolerance: 1
        });
        this.motorScrewImage.setInteractive({
            draggable: true,
            pixelPerfect: true,
            alphaTolerance: 1
        });
        this.motorDriveGearImage.setInteractive({
            draggable: true,
            pixelPerfect: true,
            alphaTolerance: 1
        });
        this.motorIntermediateGearImage.setInteractive({
            draggable: true,
            pixelPerfect: true,
            alphaTolerance: 1
        });
        this.motorSpannerImage.setInteractive({
            draggable: true,
            pixelPerfect: true,
            alphaTolerance: 1
        });

        this.sprocketCenter[0] = {x: 0.5, y: -91.5};//{x: -75/2, y: -216/2};
        this.sprocketRadius[0] = 75/2;
        this.sprocketExists[0] = true;
        this.sprocketPhysicsRadius[0] = motorWheelRadius; // in m
        this.sprocketCenter[1] = {x: 0.5, y: -91.5};//{x: -75/2, y: -216/2};
        this.sprocketRadius[1] = 75/2;
        this.sprocketExists[1] = true;
        this.sprocketPhysicsRadius[1] = motorWheelRadius; // in m
        this.sprocketCenter[2] = {x: 0.5, y: -91.5};//{x: -75/2, y: -216/2};
        this.sprocketRadius[2] = 75/2;
        this.sprocketExists[2] = true;
        this.sprocketPhysicsRadius[2] = motorWheelRadius; // in m

        // Create bodies and fixtures for Planck world

        // Create a rigid ground body
        this.ground = this.world.createBody();
        this.ground.createFixture(planck.Edge(planck.Vec2(50.0, 0.0), planck.Vec2(-50.0, 0.0)),{density: 0.1, filterGroupIndex: -1});

        // Create junction bodies and joints
        this.motorWheelSprocketBody = this.world.createDynamicBody({position: planck.Vec2(0,0), angularDamping: 0.02});
        this.motorWheelSprocketBody.createFixture(planck.Circle(motorWheelRadius), {density: 0.1, filterGroupIndex: -1});
        this.sprocketBodies[0] = this.motorWheelSprocketBody;
        this.sprocketBodies[1] = this.motorWheelSprocketBody;
        this.sprocketBodies[2] = this.motorWheelSprocketBody;
        this.motorIntermediateGearBody = this.world.createDynamicBody({position: planck.Vec2((0 + 44.5) / worldScale, (0 + 59.5) / worldScale), angularDamping: 0.02});
        this.motorIntermediateGearBody.createFixture(planck.Circle(intermediateGearTopRadius), {density: 0.1, filterGroupIndex: -1});
        this.motorDriveGearBody = this.world.createDynamicBody({position: planck.Vec2((0 + 7.5) / worldScale, (0 + 133) / worldScale), angularDamping: 0.02});
        this.motorDriveGearBody.createFixture(planck.Circle(driveGearRadius), {density: 0.1, filterGroupIndex: -1});

        this.motorWheelJoint = this.world.createJoint(planck.RevoluteJoint({}, this.ground, this.motorWheelSprocketBody, this.motorWheelSprocketBody.getPosition()));
        this.sprocketJoints[0] = this.motorWheelJoint;
        this.sprocketJoints[1] = this.motorWheelJoint;
        this.sprocketJoints[2] = this.motorWheelJoint;
        this.motorIntermediateGearJoint = this.world.createJoint(planck.RevoluteJoint({}, this.ground, this.motorIntermediateGearBody, this.motorIntermediateGearBody.getPosition()));
        this.motorDriveGearJoint = this.world.createJoint(planck.RevoluteJoint({}, this.ground, this.motorDriveGearBody, this.motorDriveGearBody.getPosition()));

        // Create the gear joints
        this.motorIntermediateGearGearJoint = this.world.createJoint(planck.GearJoint({}, this.motorIntermediateGearBody, this.motorWheelSprocketBody, this.motorIntermediateGearJoint, this.motorWheelJoint, sprocketGearRadius/intermediateGearTopRadius));
        this.motorDriveGearGearJoint = this.world.createJoint(planck.GearJoint({}, this.motorDriveGearBody, this.motorIntermediateGearBody, this.motorDriveGearJoint, this.motorIntermediateGearJoint, intermediateGearBottomRadius/driveGearRadius));

        this.partImage.on('pointerdown', (pointer, localx, localy, event) => this.onPointerDown(pointer, localx, localy, event));
        this.partImage.on('pointermove', (pointer, localx, localy, event) => this.onPointerMove(pointer, localx, localy, event));
        this.partImage.on('pointerout', (pointer, event) => this.onPointerOut(pointer, event));
        this.partImage.on('dragstart', (pointer, dragX, dragY) => this.onDragStart(pointer, dragX, dragY, this.motorWheelSprocketBody));
        this.partImage.on('dragend', (pointer, dragX, dragY) => this.onDragEnd(pointer, dragX, dragY, this.motorWheelSprocketBody));
        this.partImage.on('drag', (pointer, dragX, dragY) => this.onDrag(pointer, dragX, dragY, this.motorWheelSprocketBody));

        this.motorBaseUnderImage.on('pointerdown', (pointer, localx, localy, event) => this.onPointerDown(pointer, localx, localy, event));
        this.motorBaseUnderImage.on('pointermove', (pointer, localx, localy, event) => this.onPointerMove(pointer, localx, localy, event));
        this.motorBaseUnderImage.on('pointerout', (pointer, event) => this.onPointerOut(pointer, event));
        this.motorBaseUnderImage.on('dragstart', (pointer, dragX, dragY) => this.onDragStart(pointer, dragX, dragY));
        this.motorBaseUnderImage.on('dragend', (pointer, dragX, dragY) => this.onDragEnd(pointer, dragX, dragY));
        this.motorBaseUnderImage.on('drag', (pointer, dragX, dragY) => this.onDrag(pointer, dragX, dragY));

        this.motorBaseTileImage.on('pointerdown', (pointer, localx, localy, event) => this.onPointerDown(pointer, localx, localy, event));
        this.motorBaseTileImage.on('pointermove', (pointer, localx, localy, event) => this.onPointerMove(pointer, localx, localy, event));
        this.motorBaseTileImage.on('pointerout', (pointer, event) => this.onPointerOut(pointer, event));
        this.motorBaseTileImage.on('dragstart', (pointer, dragX, dragY) => this.onDragStart(pointer, dragX, dragY));
        this.motorBaseTileImage.on('dragend', (pointer, dragX, dragY) => this.onDragEnd(pointer, dragX, dragY));
        this.motorBaseTileImage.on('drag', (pointer, dragX, dragY) => this.onDrag(pointer, dragX, dragY));

        this.motorPawlClosedImage.on('pointerdown', (pointer, localx, localy, event) => this.onPointerDown(pointer, localx, localy, event));
        this.motorPawlClosedImage.on('pointermove', (pointer, localx, localy, event) => this.onPointerMove(pointer, localx, localy, event));
        this.motorPawlClosedImage.on('pointerout', (pointer, event) => this.onPointerOut(pointer, event));
        this.motorPawlClosedImage.on('dragstart', (pointer, dragX, dragY) => this.onDragStart(pointer, dragX, dragY));
        this.motorPawlClosedImage.on('dragend', (pointer, dragX, dragY) => this.onDragEnd(pointer, dragX, dragY));
        this.motorPawlClosedImage.on('drag', (pointer, dragX, dragY) => this.onDrag(pointer, dragX, dragY));

        this.motorPawlOpenImage.on('pointerdown', (pointer, localx, localy, event) => this.onPointerDown(pointer, localx, localy, event));
        this.motorPawlOpenImage.on('pointermove', (pointer, localx, localy, event) => this.onPointerMove(pointer, localx, localy, event));
        this.motorPawlOpenImage.on('pointerout', (pointer, event) => this.onPointerOut(pointer, event));
        this.motorPawlOpenImage.on('dragstart', (pointer, dragX, dragY) => this.onDragStart(pointer, dragX, dragY));
        this.motorPawlOpenImage.on('dragend', (pointer, dragX, dragY) => this.onDragEnd(pointer, dragX, dragY));
        this.motorPawlOpenImage.on('drag', (pointer, dragX, dragY) => this.onDrag(pointer, dragX, dragY));

        this.motorScrewImage.on('pointerdown', (pointer, localx, localy, event) => this.onPointerDown(pointer, localx, localy, event));
        this.motorScrewImage.on('pointermove', (pointer, localx, localy, event) => this.onPointerMove(pointer, localx, localy, event));
        this.motorScrewImage.on('pointerout', (pointer, event) => this.onPointerOut(pointer, event));
        this.motorScrewImage.on('dragstart', (pointer, dragX, dragY) => this.onDragStart(pointer, dragX, dragY));
        this.motorScrewImage.on('dragend', (pointer, dragX, dragY) => this.onDragEnd(pointer, dragX, dragY));
        this.motorScrewImage.on('drag', (pointer, dragX, dragY) => this.onDrag(pointer, dragX, dragY));

        this.motorDriveGearImage.on('pointerdown', (pointer, localx, localy, event) => this.onPointerDown(pointer, localx, localy, event));
        this.motorDriveGearImage.on('pointermove', (pointer, localx, localy, event) => this.onPointerMove(pointer, localx, localy, event));
        this.motorDriveGearImage.on('pointerout', (pointer, event) => this.onPointerOut(pointer, event));
        this.motorDriveGearImage.on('dragstart', (pointer, dragX, dragY) => this.onDragStart(pointer, dragX, dragY, this.motorDriveGearBody));
        this.motorDriveGearImage.on('dragend', (pointer, dragX, dragY) => this.onDragEnd(pointer, dragX, dragY, this.motorDriveGearBody));
        this.motorDriveGearImage.on('drag', (pointer, dragX, dragY) => this.onDrag(pointer, dragX, dragY, this.motorDriveGearBody));

        this.motorIntermediateGearImage.on('pointerdown', (pointer, localx, localy, event) => this.onPointerDown(pointer, localx, localy, event));
        this.motorIntermediateGearImage.on('pointermove', (pointer, localx, localy, event) => this.onPointerMove(pointer, localx, localy, event));
        this.motorIntermediateGearImage.on('pointerout', (pointer, event) => this.onPointerOut(pointer, event));
        this.motorIntermediateGearImage.on('dragstart', (pointer, dragX, dragY) => this.onDragStart(pointer, dragX, dragY, this.motorIntermediateGearBody));
        this.motorIntermediateGearImage.on('dragend', (pointer, dragX, dragY) => this.onDragEnd(pointer, dragX, dragY, this.motorIntermediateGearBody));
        this.motorIntermediateGearImage.on('drag', (pointer, dragX, dragY) => this.onDrag(pointer, dragX, dragY, this.motorIntermediateGearBody));

        this.motorSpannerImage.on('pointerdown', (pointer, localx, localy, event) => this.onPointerDown(pointer, localx, localy, event));
        this.motorSpannerImage.on('pointermove', (pointer, localx, localy, event) => this.onPointerMove(pointer, localx, localy, event));
        this.motorSpannerImage.on('pointerout', (pointer, event) => this.onPointerOut(pointer, event));
        this.motorSpannerImage.on('dragstart', (pointer, dragX, dragY) => this.onDragStart(pointer, dragX, dragY));
        this.motorSpannerImage.on('dragend', (pointer, dragX, dragY) => this.onDragEnd(pointer, dragX, dragY));
        this.motorSpannerImage.on('drag', (pointer, dragX, dragY) => this.onDrag(pointer, dragX, dragY));
    }

    updatePhysics()
    {
        if (!this.isShorted) {
            // We use the motorDriveGearBody because it rotates slower and is therefore under the limit of angular velocity.
            if (this.motorDriveGearBody.getAngularVelocity() >= 20) {
                // We detected a short!
                this.isShorted = true;
                this.motorPawlClosedImage.setVisible(true);
                this.motorPawlOpenImage.setVisible(false);
                //this.motorDriveGearBody.setAngularVelocity(0);
                //this.motorIntermediateGearBody.setAngularVelocity(0);
                //this.motorWheelSprocketBody.setAngularVelocity(0);

                this.motorWheelSprocketBody.setAngularDamping(5);
                //this.resistorFixture.setDensity(this.density);
                this.motorWheelSprocketBody.resetMassData();

                this.resetButton.setVisible(true);
            }
            else {
                this.motorWheelSprocketBody.applyTorque(0.00001648875);//0.000019236875);//0.00000901985); // in units of (N m / 1000)
                //console.log(this.motorDriveGearBody.getAngularVelocity());
            }
        }


        //this.partImage.x = this.motorWheelSprocketBody.getPosition().x * worldScale;
        //this.partImage.y = this.motorWheelSprocketBody.getPosition().y * worldScale;
        this.partImage.rotation = this.motorWheelSprocketBody.getAngle();

        //this.motorDriveGearImage.x = this.motorDriveGearBody.getPosition().x * worldScale;
        //this.motorDriveGearImage.y = this.motorDriveGearBody.getPosition().y * worldScale;
        this.motorDriveGearImage.rotation = this.motorDriveGearBody.getAngle();

        //this.motorIntermediateGearImage.x = this.motorIntermediateGearBody.getPosition().x * worldScale;
        //this.motorIntermediateGearImage.y = this.motorIntermediateGearBody.getPosition().y * worldScale;
        this.motorIntermediateGearImage.rotation = this.motorIntermediateGearBody.getAngle();
    }

    setPartTint(color)
    {
        this.partImage.setTint(color);
        this.motorBaseUnderImage.setTint(color);
        this.motorBaseTileImage.setTint(color);
        this.motorPawlClosedImage.setTint(color);
        this.motorPawlOpenImage.setTint(color);
        this.motorScrewImage.setTint(color);
        this.motorDriveGearImage.setTint(color);
        this.motorIntermediateGearImage.setTint(color);
        this.motorSpannerImage.setTint(color);
    }

    clearPartTint()
    {
        this.partImage.clearTint();
        this.motorBaseUnderImage.clearTint();
        this.motorBaseTileImage.clearTint();
        this.motorPawlClosedImage.clearTint();
        this.motorPawlOpenImage.clearTint();
        this.motorScrewImage.clearTint();
        this.motorDriveGearImage.clearTint();
        this.motorIntermediateGearImage.clearTint();
        this.motorSpannerImage.clearTint();

    }

    setPosition(x, y)
    {
        this.x = x;
        this.y = y;
        if (this.partImage != undefined)
            this.partImage.setPosition(x + this.partImageOffset.x, y + this.partImageOffset.y);
        if (this.motorBaseUnderImage != undefined)
            this.motorBaseUnderImage.setPosition(x + this.motorBaseUnderImageOffset.x, y + this.motorBaseUnderImageOffset.y);
        if (this.motorBaseTileImage != undefined)
            this.motorBaseTileImage.setPosition(x + this.motorBaseTileImageOffset.x, y + this.motorBaseTileImageOffset.y);
        if (this.motorPawlClosedImage != undefined)
            this.motorPawlClosedImage.setPosition(x + this.motorPawlClosedImageOffset.x, y + this.motorPawlClosedImageOffset.y);
        if (this.motorPawlOpenImage != undefined)
            this.motorPawlOpenImage.setPosition(x + this.motorPawlOpenImageOffset.x, y + this.motorPawlOpenImageOffset.y);
        if (this.motorScrewImage != undefined)
            this.motorScrewImage.setPosition(x + this.partImageOffset.x, y + this.partImageOffset.y);
        if (this.motorDriveGearImage != undefined)
            this.motorDriveGearImage.setPosition(x + this.motorDriveGearImageOffset.x, y + this.motorDriveGearImageOffset.y);
        if (this.motorIntermediateGearImage != undefined)
            this.motorIntermediateGearImage.setPosition(x + this.motorIntermediateGearImageOffset.x, y + this.motorIntermediateGearImageOffset.y);
        if (this.motorSpannerImage != undefined)
            this.motorSpannerImage.setPosition(x + this.motorSpannerImageOffset.x, y + this.motorSpannerImageOffset.y);
        if (this.resetButton != undefined)
            this.resetButton.setPosition(x, y + this.resetButtonYOffset);
    }

    destroy()
    {
        // Helper to remove all event listeners from an image
        const removeEvents = (img) => {
            if (img) {
                img.off('pointerdown');
                img.off('pointermove');
                img.off('pointerout');
                img.off('dragstart');
                img.off('dragend');
                img.off('drag');
            }
        };

        // Remove all event listeners before destroying to prevent memory leaks
        removeEvents(this.partImage);
        removeEvents(this.motorBaseUnderImage);
        removeEvents(this.motorBaseTileImage);
        removeEvents(this.motorPawlClosedImage);
        removeEvents(this.motorPawlOpenImage);
        removeEvents(this.motorScrewImage);
        removeEvents(this.motorDriveGearImage);
        removeEvents(this.motorIntermediateGearImage);
        removeEvents(this.motorSpannerImage);

        // Destroy game objects
        this.partImage.destroy();
        this.motorBaseUnderImage.destroy();
        this.motorBaseTileImage.destroy();
        this.motorPawlClosedImage.destroy();
        this.motorPawlOpenImage.destroy();
        this.motorScrewImage.destroy();
        this.motorDriveGearImage.destroy();
        this.motorIntermediateGearImage.destroy();
        this.motorSpannerImage.destroy();
        if (this.resetButton) this.resetButton.destroy();

        // Destroy physics - joints first, then bodies
        this.world.destroyJoint(this.motorIntermediateGearGearJoint);
        this.world.destroyJoint(this.motorDriveGearGearJoint);
        this.world.destroyBody(this.motorWheelSprocketBody);
        this.world.destroyBody(this.motorIntermediateGearBody);
        this.world.destroyBody(this.motorDriveGearBody);
        this.world.destroyBody(this.ground);
    }

    onSwitchToggled (name, newToggleState) {

        if (this.resetButton != undefined) {
            this.resetButton.setVisible(false);
            this.isShorted = false;
            this.motorPawlClosedImage.setVisible(false);
            this.motorPawlOpenImage.setVisible(true);

            this.motorWheelSprocketBody.setAngularDamping(0);
            //this.resistorFixture.setDensity(this.density);
            this.motorWheelSprocketBody.resetMassData();

            this.motorWheelSprocketBody.setAwake(true);
            this.motorIntermediateGearBody.setAwake(true);
            this.motorDriveGearBody.setAwake(true);

        }
    }

    getPartExtents()
    {
        return {left: this.x - 184.352, right: this.x + 184.352, top: this.y - 164.444, bottom: this.y + 200};
    }

}
