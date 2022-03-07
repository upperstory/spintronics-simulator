let game;
window.onload = function() {
    let gameConfig = {
        type: Phaser.AUTO,
        scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH,
            parent: "thegame",
            width: 600,
            height: 600
        },
        backgroundColor: 'rgba(255,255,255,255)',
        scene: playGame
    }
    game = new Phaser.Game(gameConfig);
    window.focus();
}
import { ToggleButton } from './toggle-button.js';
class playGame extends Phaser.Scene{
    constructor(){
        super("PlayGame");
    }

    preload ()
    {
        this.load.image('junction-bottom', 'Images/junction-bottom-1.png');
        this.load.image('junction-middle', 'Images/junction-middle-1.png');
        this.load.image('junction-top', 'Images/junction-top-2.png');
        this.load.image('junction-cap', 'Images/junction-cap-1.png');
        this.load.image('junction-planet', 'Images/junction-planet-1.png');

        this.load.image('level-changer', 'Images/level-changer.png');
        this.load.image('resistor', 'Images/resistor.png');
    }

    create ()
    {
        // Box2D works with meters. We need to convert meters to pixels.
        // let's say 2 pixels = 0.001 m.
        this.worldScale = 3/0.001;

        // world gravity, as a Vec2 object. It's just a x, y vector
        let gravity = planck.Vec2(0, 0);

        // this is how we create a Box2D world
        this.world = planck.World(gravity);
        this.mouseGround = this.world.createBody();

/*        let shapeDef = {};
        shapeDef.density = 10.0;
        shapeDef.filterGroupIndex = -1;
        shapeDef.restitution = 0
        //shapeDef.frictionStatic = 1;*/

        this.ground = this.world.createBody();
        this.ground.createFixture(planck.Edge(planck.Vec2(50.0, 0.0), planck.Vec2(-50.0, 0.0)));

        // Create the sprockets
        let smallSprocketRadius = 0.011348;
        let mediumSprocketRadius = 0.022638;
        let largeSprocketRadius = 0.033941;
        let sprocketCapRadius = 0.0045;

        let resistorRadius = 0.041168 / 2;
        let levelChangerRadius = 0.033979 / 2;

        let junctionPosition = {x: 300, y: 300};
        let levelChangerPosition = {x: 300, y: 500};
        let resistor1Position = {x: 100, y: 100};
        let resistor2Position = {x: 500, y: 100};

        // Create junction bodies and joints
        this.largeSprocketBody = this.world.createDynamicBody({position: planck.Vec2(junctionPosition.x / this.worldScale, junctionPosition.y / this.worldScale), angularDamping: 0.02});
        this.largeSprocketBody.createFixture(planck.Circle(largeSprocketRadius), {density: 0.1, filterGroupIndex: -1});
        this.largeSprocketBodyNG = this.world.createDynamicBody({position: planck.Vec2(junctionPosition.x / this.worldScale, junctionPosition.y / this.worldScale), angularDamping: 0});
        this.largeSprocketBodyNG.createFixture(planck.Circle(largeSprocketRadius), {density: 0.1, filterGroupIndex: -1});
        this.mediumSprocketBody = this.world.createDynamicBody({position: planck.Vec2(junctionPosition.x / this.worldScale, junctionPosition.y / this.worldScale), angularDamping: 0.02});
        this.mediumSprocketBody.createFixture(planck.Circle(mediumSprocketRadius), {density: 0.1, filterGroupIndex: -1});
        this.smallSprocketBody = this.world.createDynamicBody({position: planck.Vec2(junctionPosition.x / this.worldScale, junctionPosition.y / this.worldScale), angularDamping: 0.02});
        this.smallSprocketBody.createFixture(planck.Circle(smallSprocketRadius), {density: 0.1, filterGroupIndex: -1});
        this.sprocketCapBody = this.world.createDynamicBody(planck.Vec2(junctionPosition.x / this.worldScale, junctionPosition.y / this.worldScale));
        this.sprocketCapBody.createFixture(planck.Circle(sprocketCapRadius), {density: 0.1, filterGroupIndex: -1});

        // Create the planets
        let planetOrbitRadius = 0.009;
        let planetRadius = 0.003;
        this.planet1Body = this.world.createDynamicBody(planck.Vec2((junctionPosition.x / this.worldScale), (junctionPosition.y / this.worldScale) - planetOrbitRadius));
        this.planet1Body.createFixture(planck.Circle(planetRadius), {density: 0.1, filterGroupIndex: -1});
        this.planet2Body = this.world.createDynamicBody(planck.Vec2((junctionPosition.x / this.worldScale) + Math.cos(((Math.PI * 2) / 3) - Math.PI / 2) * planetOrbitRadius, (junctionPosition.y / this.worldScale) + Math.sin(((Math.PI * 2) / 3) - Math.PI / 2) * planetOrbitRadius));
        this.planet2Body.createFixture(planck.Circle(planetRadius), {density: 0.1, filterGroupIndex: -1});
        this.planet3Body = this.world.createDynamicBody(planck.Vec2((junctionPosition.x / this.worldScale) + Math.cos(-((Math.PI * 2) / 3) - Math.PI / 2) * planetOrbitRadius, (junctionPosition.y / this.worldScale) + Math.sin(-((Math.PI * 2) / 3) - Math.PI / 2) * planetOrbitRadius));
        this.planet3Body.createFixture(planck.Circle(planetRadius), {density: 0.1, filterGroupIndex: -1});

        let jointBNG = this.world.createJoint(planck.RevoluteJoint({}, this.ground, this.largeSprocketBodyNG, this.largeSprocketBodyNG.getPosition()));
        let jointB = this.world.createJoint(planck.RevoluteJoint({}, this.ground, this.largeSprocketBody, this.largeSprocketBody.getPosition()));
        let jointM = this.world.createJoint(planck.RevoluteJoint({}, this.largeSprocketBodyNG, this.mediumSprocketBody, this.mediumSprocketBody.getPosition()));
        let jointMground = this.world.createJoint(planck.RevoluteJoint({}, this.ground, this.mediumSprocketBody, this.mediumSprocketBody.getPosition()));
        let jointT = this.world.createJoint(planck.RevoluteJoint({}, this.largeSprocketBody, this.smallSprocketBody, this.smallSprocketBody.getPosition()));
        let jointTground = this.world.createJoint(planck.RevoluteJoint({}, this.ground, this.smallSprocketBody, this.smallSprocketBody.getPosition()));
        let jointCap = this.world.createJoint(planck.WeldJoint({}, this.largeSprocketBody, this.sprocketCapBody));

        // JointM = vm - vb
        // JointT = vt - vb

        // JointM needs to be vm - 2vb
        // vb2 = 2vb
        //
        //2(vm - 2vb) = vt - vb
        //let jointMediumLargeSprocket = this.world.createJoint(planck.GearJoint({}, this.mediumSprocketBody, this.largeSprocketBody, jointMground, jointB, 1/2));
        let jointLargeLargeNGSprocket = this.world.createJoint(planck.GearJoint({}, this.largeSprocketBody, this.largeSprocketBodyNG, jointB, jointBNG, -1));
        let jointMediumTopSprocket = this.world.createJoint(planck.GearJoint({}, this.mediumSprocketBody, this.largeSprocketBodyNG, jointM, jointT, 1/2));
        //let jointMediumSmallSprocket = this.world.createJoint(planck.GearJoint({}, this.mediumSprocketBody, this.smallSprocketBody, jointM, jointT, -1));
        //let jointSmallLargeSprocket = this.world.createJoint(planck.GearJoint({}, this.smallSprocketBody, this.largeSprocketBody, jointB, jointT, 1/3));

        let jointPlanet1 = this.world.createJoint(planck.RevoluteJoint({}, this.largeSprocketBody, this.planet1Body, this.planet1Body.getPosition()));
        let jointPlanet2 = this.world.createJoint(planck.RevoluteJoint({}, this.largeSprocketBody, this.planet2Body, this.planet2Body.getPosition()));
        let jointPlanet3 = this.world.createJoint(planck.RevoluteJoint({}, this.largeSprocketBody, this.planet3Body, this.planet3Body.getPosition()));

        let jointPlanet1MediumSprocket = this.world.createJoint(planck.GearJoint({}, this.planet1Body, this.mediumSprocketBody, jointPlanet1, jointM, 48/12));
        let jointPlanet2MediumSprocket = this.world.createJoint(planck.GearJoint({}, this.planet2Body, this.mediumSprocketBody, jointPlanet2, jointM, 48/12));
        let jointPlanet3MediumSprocket = this.world.createJoint(planck.GearJoint({}, this.planet3Body, this.mediumSprocketBody, jointPlanet3, jointM, 48/12));


        /*let jointB = this.world.createJoint(planck.RevoluteJoint({}, this.ground, this.largeSprocketBody, this.largeSprocketBody.getPosition()));
        let jointM = this.world.createJoint(planck.RevoluteJoint({}, this.largeSprocketBody, this.mediumSprocketBody, this.mediumSprocketBody.getPosition()));
        let jointT = this.world.createJoint(planck.RevoluteJoint({}, this.largeSprocketBody, this.smallSprocketBody, this.smallSprocketBody.getPosition()));
        let jointCap = this.world.createJoint(planck.WeldJoint({}, this.largeSprocketBody, this.sprocketCapBody));

        let jointPlanet1 = this.world.createJoint(planck.RevoluteJoint({}, this.largeSprocketBody, this.planet1Body, this.planet1Body.getPosition()));
        let jointPlanet2 = this.world.createJoint(planck.RevoluteJoint({}, this.largeSprocketBody, this.planet2Body, this.planet2Body.getPosition()));
        let jointPlanet3 = this.world.createJoint(planck.RevoluteJoint({}, this.largeSprocketBody, this.planet3Body, this.planet3Body.getPosition()));

        let jointPlanet1MediumSprocket = this.world.createJoint(planck.GearJoint({}, this.planet1Body, this.mediumSprocketBody, jointPlanet1, jointM, -0.875 * 48/12));
        let jointPlanet2MediumSprocket = this.world.createJoint(planck.GearJoint({}, this.planet2Body, this.mediumSprocketBody, jointPlanet2, jointM, -0.875 * 48/12));
        let jointPlanet3MediumSprocket = this.world.createJoint(planck.GearJoint({}, this.planet3Body, this.mediumSprocketBody, jointPlanet3, jointM, -0.875 * 48/12));

        let jointPlanet1SmallSprocket = this.world.createJoint(planck.GearJoint({}, this.mediumSprocketBody, this.smallSprocketBody, jointM, jointT, 12/24));
        */
        // Create graphics objects for each junction body
        let userData = this.add.image(0, 0,'junction-bottom');
        userData.setDisplaySize((largeSprocketRadius + 0.0016) * 2 * this.worldScale, (largeSprocketRadius + 0.0016) * 2 * this.worldScale);
        userData.setDepth(1);
        this.largeSprocketBody.setUserData(userData);
        //userData = this.add.image(0, 0,'junction-bottom');
        //userData.setDisplaySize((largeSprocketRadius + 0.0016) * 2 * this.worldScale, (largeSprocketRadius + 0.0016) * 2 * this.worldScale);
        //userData.setTint(0xFF0000);
        //userData.setDepth(1);
        //this.largeSprocketBodyNG.setUserData(userData);

        userData = this.add.image(0, 0,'junction-cap');
        userData.setDisplaySize(sprocketCapRadius * 2 * this.worldScale, sprocketCapRadius * 2 * this.worldScale);
        userData.setDepth(5);
        this.sprocketCapBody.setUserData(userData);

        userData = this.add.image(0, 0,'junction-middle');
        userData.setDisplaySize((mediumSprocketRadius + 0.0016) * 2 * this.worldScale, (mediumSprocketRadius + 0.0016) * 2 * this.worldScale);
        userData.setDepth(2);
        this.mediumSprocketBody.setUserData(userData);

        userData = this.add.image(0, 0,'junction-top');
        userData.setDisplaySize((smallSprocketRadius + 0.0016)  * 2 * this.worldScale, (smallSprocketRadius + 0.0016) * 2 * this.worldScale);
        userData.setDepth(4);
        this.smallSprocketBody.setUserData(userData);

        userData = this.add.image(0, 0,'junction-planet');
        userData.setDisplaySize((planetRadius + 0.002) * 2 * this.worldScale, (planetRadius + 0.002) * 2 * this.worldScale);
        userData.setDepth(3);
        this.planet1Body.setUserData(userData);

        userData = this.add.image(0, 0,'junction-planet');
        userData.setDisplaySize((planetRadius + 0.002) * 2 * this.worldScale, (planetRadius + 0.002) * 2 * this.worldScale);
        userData.setDepth(3);
        this.planet2Body.setUserData(userData);

        userData = this.add.image(0, 0,'junction-planet');
        userData.setDisplaySize((planetRadius + 0.002) * 2 * this.worldScale, (planetRadius + 0.002) * 2 * this.worldScale);
        userData.setDepth(3);
        this.planet3Body.setUserData(userData);

        // Create resistor bodies and joints
        this.resistor1Body = this.world.createDynamicBody({position: planck.Vec2(resistor1Position.x / this.worldScale, resistor1Position.y / this.worldScale), angularDamping: 3.5});
        this.resistor1Body.createFixture(planck.Circle(resistorRadius), {density: 10, filterGroupIndex: -1});
        let jointR1 = this.world.createJoint(planck.RevoluteJoint({}, this.ground, this.resistor1Body, this.resistor1Body.getPosition()));

        userData = this.add.image(0, 0,'resistor');
        userData.setDisplaySize((resistorRadius + 0.0016) * 2 * this.worldScale, (resistorRadius + 0.0016) * 2 * this.worldScale);
        userData.setDepth(1);
        this.resistor1Body.setUserData(userData);

        this.resistor2Body = this.world.createDynamicBody({position: planck.Vec2(resistor2Position.x / this.worldScale, resistor2Position.y / this.worldScale), angularDamping: 13});
        this.resistor2Body.createFixture(planck.Circle(resistorRadius), {density: 10, filterGroupIndex: -1});
        let jointR2 = this.world.createJoint(planck.RevoluteJoint({}, this.ground, this.resistor2Body, this.resistor2Body.getPosition()));

        userData = this.add.image(0, 0,'resistor');
        userData.setDisplaySize((resistorRadius + 0.0016) * 2 * this.worldScale, (resistorRadius + 0.0016) * 2 * this.worldScale);
        userData.setDepth(1);
        this.resistor2Body.setUserData(userData);

        // Create the level changer bodies and joints
        this.levelChangerBody = this.world.createDynamicBody({position: planck.Vec2(levelChangerPosition.x / this.worldScale, levelChangerPosition.y / this.worldScale), angularDamping: 0.2});
        this.levelChangerBody.createFixture(planck.Circle(levelChangerRadius), {density: 0.1, filterGroupIndex: -1});
        let jointLevelChanger1 = this.world.createJoint(planck.RevoluteJoint({}, this.ground, this.levelChangerBody, this.levelChangerBody.getPosition()));
        //let motorJointDef = {};
        //motorJointDef.angularOffset = 0;
       // motorJointDef.maxTorque = 1;

/*        let revoluteJointDef = {};
        //revoluteJointDef.bodyA = this.ground;
        //revoluteJointDef.bodyB = this.levelChangerBody;
        revoluteJointDef.collideConnected = false;
        //revoluteJointDef.localAnchorA = planck.Vec2(this.levelChangerBody.getPosition());
        //revoluteJointDef.localAnchorB = planck.Vec2(this.levelChangerBody.getPosition());
        revoluteJointDef.enableMotor = true;
        revoluteJointDef.maxMotorTorque = 100000.0;
        //revoluteJointDef.motorSpeed = 2.0;
        revoluteJointDef.referenceAngle = 1;
//        b2RevoluteJoint* m_joint = (b2RevoluteJoint*)world->CreateJoint(&revoluteJointDef);
        let jointLevelChanger1 = this.world.createJoint(planck.RevoluteJoint(revoluteJointDef, this.levelChangerBody, this.ground, planck.Vec2(this.levelChangerBody.getPosition())));
*/

        //let jointLevelChanger1 = this.world.createJoint(planck.MotorJoint({angularOffset: 0, maxTorque: 1, maxForce: 1}, this.ground, this.levelChangerBody, this.levelChangerBody.getPosition()));

        userData = this.add.image(0, 0,'level-changer');
        userData.setDisplaySize((levelChangerRadius + 0.0016) * 2 * this.worldScale, (levelChangerRadius + 0.0016) * 2 * this.worldScale);
        userData.setDepth(1);
        this.levelChangerBody.setUserData(userData);
        let jointMotorToMediumSprocket = this.world.createJoint(planck.GearJoint({}, this.levelChangerBody, this.mediumSprocketBody, jointLevelChanger1, jointMground, -mediumSprocketRadius/levelChangerRadius));
        let jointLargeSprocketToResistor1 = this.world.createJoint(planck.GearJoint({}, this.largeSprocketBody, this.resistor1Body, jointB, jointR1, -resistorRadius/largeSprocketRadius));
        let jointSmallSprocketToResistor2 = this.world.createJoint(planck.GearJoint({}, this.smallSprocketBody, this.resistor2Body, jointTground, jointR2, -resistorRadius/smallSprocketRadius));
        //let jointMotorToResistor1 = this.world.createJoint(planck.GearJoint({}, this.resistor1Body, this.levelChangerBody, jointLevelChanger1, jointR1, -resistorRadius/levelChangerRadius));

        // Create motor
        //this.mediumSprocketBody.applyAngularImpulse(-0.0000003);
        //this.largeSprocketBody.applyAngularImpulse(-0.000001);
        //this.smallSprocketBody.applyAngularImpulse(0.000001);

        this.dragZone = this.add.zone(0, 0, 600, 600);
        this.dragZone.setInteractive({
            draggable: true
        });

        this.dragZone.setPosition(300,300);

        this.dragZone.on('dragstart', (pointer, dragX, dragY) => this.onDragStart(pointer, dragX, dragY));
        this.dragZone.on('dragend', (pointer, dragX, dragY) => this.onDragEnd(pointer, dragX, dragY));
        this.dragZone.on('drag', (pointer, dragX, dragY) => this.onDrag(pointer, dragX, dragY));
    }

    update () {
        // advance the simulation by 1/20 seconds
        this.world.step(1 / 30);

        // clearForces method should be added at the end on each step
        this.world.clearForces();

        this.levelChangerBody.applyTorque(0.000021985);//0.00000901985); // in units of (N m / 1000)

        // iterate through all bodies
        for (let b = this.world.getBodyList(); b; b = b.getNext()) {

            // get body position
            let bodyPosition = b.getPosition();

            // get body angle, in radians
            let bodyAngle = b.getAngle();

            // get body user data, the graphics object
            let userData = b.getUserData();
            if (userData != null) {
                // adjust graphic object position and rotation
                userData.x = bodyPosition.x * this.worldScale;
                userData.y = bodyPosition.y * this.worldScale;
                userData.rotation = bodyAngle;
            }
        }
    }

    findBody(point) {
        let body;
        let aabb = planck.AABB(point, point);
        this.world.queryAABB(aabb, function(fixture) {
            if (body) {
                return;
            }
            if (!fixture.getBody().isDynamic() || !fixture.testPoint(point)) {
                return;
            }
            body = fixture.getBody();
            return true;
        });
        return body;
    }

    mouseJoint;

    targetBody;
    mouseMove = {x:0, y:0};

    onDragStart(pointer, dragX, dragY)
    {
        let point = {x: pointer.x / this.worldScale, y: pointer.y / this.worldScale};
        let body = this.findBody(point);
        if (body != undefined) {
            this.mouseJoint = planck.MouseJoint({maxForce: 1000}, this.mouseGround, body, planck.Vec2(point));
            this.world.createJoint(this.mouseJoint);
        }
    }

    onDrag(pointer, dragX, dragY)
    {
        let point = {x: pointer.x / this.worldScale, y: pointer.y / this.worldScale}
        if (this.mouseJoint) {
            this.mouseJoint.setTarget(point);
        }

        this.mouseMove.x = point.x;
        this.mouseMove.y = point.y;
    }

    onDragEnd(pointer, dragX, dragY)
    {
        let point = {x: pointer.x / this.worldScale, y: pointer.y / this.worldScale}
        if (this.mouseJoint) {
            this.world.destroyJoint(this.mouseJoint);
            this.mouseJoint = null;
        }
        /*if (this.targetBody) {
            var force = Vec2.sub(point, this.targetBody.getPosition());
            this.targetBody.applyForceToCenter(force.mul(testbed.mouseForce), true);
            this.targetBody = null;
        }*/
    }
}
