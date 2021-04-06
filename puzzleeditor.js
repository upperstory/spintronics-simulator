import { ToggleButton } from './toggle-button.js';
import { PartBase } from './parts/partbase.js';
import { PartManager } from './part-manager.js';
import { PopupLevelChooser } from './popup-level-chooser.js';
import {tileSpacing} from './constants.js';

var mapWidth = 4000;
var mapHeight = 4000;

var buttonWidth = 70;
var buttonHeight = 70;

var config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.RESIZE,
        //parent: 'phaser-example',
        width: 400,
        height: 400,
        min: {
            width: 400,
            height: 400
        },
        /*max: {
            width: 1600,
            height: 1200
        }*/
    },
    //width: 1000,
    //height: 1000,
    physics: {
        default: 'matter',
        matter: {
            gravity: {
                y: 0,
                x: 0
            }
        }
    },
    backgroundColor: 'rgba(255,255,255,1)',
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var sceneconfigcontrols = {
    type: Phaser.AUTO,
    //width: 800,
    //height: 600,
    physics: {
        default: 'matter',
        matter: {
            gravity: {
                y: 0,
                x: 0
            }
        }
    },
    scale: {
        mode: Phaser.Scale.RESIZE,
        parent: 'phaser-example',
        width: 400,
        height: 400,
        min: {
            width: 400,
            height: 400
        },
        /*max: {
            width: 1600,
            height: 1200
        }*/
    },
    backgroundColor: 'rgba(0,0,0,0)',
    scene: {
        //preload: preload2,
        //create: create,
        //update: update
    }
};

var game = new Phaser.Game(config);
var self;
var mouseImage;
var mouseImageOffset = {x: 0, y: 0};
const gridSpacing = 15;


var partClickedForLevelSelect = {partIndex: -1, cw: false};

var partManager = null;

var highlightGraphics = null;

// We have to have this variable because of an apparent bug in Phaser that sends POINTER_OVER events to the scene first when objects are in a container in the scene.
var disablePointerOverEvent = false;
var popupLevelChooser = null;
var controlscene = null;

function preload ()
{
    console.log("Hello");
    this.load.setBaseURL();

    this.load.image('junction-bottom', 'Images/junction-bottom-1.png');
    this.load.image('junction-middle', 'Images/junction-middle-1.png');
    this.load.image('junction-top', 'Images/junction-top-2.png');
    this.load.image('junction-cap', 'Images/junction-cap-1.png');
    this.load.image('junction-planet', 'Images/junction-planet-1.png');

    this.load.image('junction-icon', 'Images/junction-icon.png');
    this.load.image('resistor-icon', 'Images/resistor-icon.png');
    this.load.image('motor-icon', 'Images/motor-icon.png');
    this.load.image('inductor-icon', 'Images/inductor-icon.png');
    this.load.image('capacitor-icon', 'Images/capacitor-icon.png');
    this.load.image('button-icon', 'Images/button-icon.png');
    this.load.image('phonograph-icon', 'Images/phonograph-icon.png');
    this.load.image('transistor-icon', 'Images/transistor-icon.png');
    this.load.image('level-changer-icon', 'Images/level-changer-icon.png');
    this.load.image('diode-icon', 'Images/diode-icon.png');
    this.load.image('chain-icon', 'Images/chain-icon.png');
    this.load.image('tile-icon', 'Images/tile-icon.png');

    this.load.image('interact-icon', 'Images/hand-icon.png');
    this.load.image('move-icon', 'Images/move-icon.png');
    this.load.image('delete-icon', 'Images/remove-icon.png');
    this.load.image('remove-all-icon', 'Images/trash-icon.png')
    this.load.image('zoom-in-icon', 'Images/zoom-in-icon.png');
    this.load.image('zoom-out-icon', 'Images/zoom-out-icon.png');
    this.load.image('save-icon', 'Images/save-icon.png');
    this.load.image('load-icon', 'Images/open-icon.png');
    this.load.image('edit-icon', 'Images/edit-icon.png');

    this.load.image('junction', 'Images/junction.png');

    this.load.image('resistor', 'Images/resistor.png');
    this.load.image('resistor-20', 'Images/resistor-20.png');
    this.load.image('resistor-50', 'Images/resistor-50.png');
    this.load.image('resistor-100', 'Images/resistor-100.png');
    this.load.image('resistor-200', 'Images/resistor-200.png');
    this.load.image('resistor-500', 'Images/resistor-500.png');
    this.load.image('resistor-1000', 'Images/resistor-1000.png');
    this.load.image('resistor-2000', 'Images/resistor-2000.png');

    this.load.image('level-changer', 'Images/level-changer.png');

    this.load.image('inductor', 'Images/inductor.png')
    this.load.image('inductor-base', 'Images/inductor-base.png');
    this.load.image('inductor-weights', 'Images/inductor-weights.png');

    this.load.image('capacitor', 'Images/capacitor.png');
    this.load.image('capacitor-sprocket', 'Images/capacitor-sprocket.png');
    this.load.image('capacitor-cap', 'Images/capacitor-cap.png');
    this.load.image('capacitor-long-hand', 'Images/capacitor-long-hand.png');
    this.load.image('capacitor-short-hand', 'Images/capacitor-short-hand.png');
    this.load.image('capacitor-sprocket-no-value', 'Images/capacitor-sprocket-no-value.png');
    this.load.image('capacitor-meter', 'Images/capacitor-meter.png');
    this.load.image('capacitor-numbers', 'Images/capacitor-numbers.png');

    this.load.image('button', 'Images/button.png');
    this.load.image('button-sprocket', 'Images/button-sprocket.png');
    this.load.image('button-base', 'Images/button-base.png');
    this.load.image('button-base-pushed', 'Images/button-base-pushed.png');

    this.load.image('transistor', 'Images/transistor.png');
    this.load.image('transistor-base', 'Images/transistor-base.png');
    this.load.image('transistor-gate', 'Images/transistor-gate.png');
    this.load.image('transistor-brake', 'Images/transistor-brake.png');
    this.load.image('transistor-ball', 'Images/transistor-ball.png');
    this.load.image('transistor-resistor', 'Images/transistor-resistor.png');
    this.load.image('transistor-mid-cap', 'Images/transistor-mid-cap.png');
    this.load.image('transistor-guide', 'Images/transistor-guide.png');
    this.load.image('transistor-tab', 'Images/transistor-tab.png');

    this.load.image('motor', 'Images/motor.png');
    this.load.image('motor-base-tile', 'Images/motor-base-tile.png');
    this.load.image('motor-base-under', 'Images/motor-base-under.png');
    this.load.image('motor-drive-gear', 'Images/motor-drive-gear.png');
    this.load.image('motor-intermediate-gear', 'Images/motor-intermediate-gear.png');
    this.load.image('motor-pawl-closed', 'Images/motor-pawl-closed.png');
    this.load.image('motor-pawl-open', 'Images/motor-pawl-open.png');
    this.load.image('motor-wheel', 'Images/motor-wheel.png');
    this.load.image('motor-screw', 'Images/motor-screw.png');
    this.load.image('motor-spanner', 'Images/motor-spanner.png');
    this.load.image('reset-circuit-breaker', 'Images/reset-circuit-breaker.png');

    this.load.image('phonograph', 'Images/phonograph.png');
    this.load.image('phonograph-base', 'Images/phonograph-base.png');
    this.load.image('phonograph-sprocket', 'Images/phonograph-sprocket.png');

    this.load.image('diode', 'Images/diode.png');
    this.load.image('diode-base', 'Images/diode-base.png');
    this.load.image('diode-sprocket', 'Images/diode-sprocket.png');

    this.load.image('tile', 'Images/tile.png');
    this.load.image('tile-connector', 'Images/tile-connector.png');

    this.load.image('1', 'Images/1.png');
    this.load.image('2', 'Images/2.png');
    this.load.image('3', 'Images/3.png');
    this.load.image('4', 'Images/4.png');
    this.load.image('5', 'Images/5.png');
}

function create ()
{
    self = this;

    // Set up planck.js

    // World gravity, as a Vec2 object. It's just a x, y vector
    let gravity = planck.Vec2(0, 0);
    // Create our Box2D world
    this.world = planck.World(gravity);

    // Create a rigid body for mouse drags
    this.mouseGround = this.world.createBody();

    // Create a second scene that contains the buttons and other fixed items
    controlscene = this.scene.add('controls', sceneconfigcontrols, true);
    this.dragZone = this.add.zone(-mapWidth/2, -mapHeight/2, mapWidth, mapHeight);
    this.dragZone.setPosition(0,0);
    this.cameras.main.setBounds(-mapWidth/2, -mapHeight/2, mapWidth, mapHeight, true);
    // First is the background grid
    drawBackgroundGrid.bind(this)();

    mouseImage = this.add.image(400, 400,'junction');
    mouseImage.setScale(0.5);
    mouseImage.setAlpha(0.4);
    mouseImage.setVisible(false);
    // Always on top
    mouseImage.setDepth(100);

    // Create the button textures
    let graphics = controlscene.add.graphics();
    graphics.fillStyle(0xD1D3D4, 1);
    graphics.fillRoundedRect(0, 0, buttonWidth, buttonHeight, 10);
    graphics.generateTexture('button-default-background', buttonWidth, buttonHeight);
    graphics.destroy();

    graphics = controlscene.add.graphics();
    graphics.fillStyle(0xF1F2F2, 1);
    graphics.fillRoundedRect(0, 0, buttonWidth, buttonHeight, 10);
    graphics.generateTexture('button-hover-background', buttonWidth, buttonHeight);
    graphics.destroy();

    graphics = controlscene.add.graphics();
    graphics.fillStyle(0xD1D3D4, 1);
    graphics.fillRoundedRect(0, 0, buttonWidth, buttonHeight, 10);
    graphics.generateTexture('button-disabled-background', buttonWidth, buttonHeight);
    graphics.destroy();

    graphics = controlscene.add.graphics();
    graphics.fillStyle(0x0097B3, 1);
    graphics.lineStyle(2,0x111111, 0.8);
    graphics.fillRoundedRect(0, 0, buttonWidth, buttonHeight, 10);
    graphics.strokeRoundedRect(1, 1, buttonWidth-2, buttonHeight-2, 10);
    graphics.generateTexture('button-selected-background', buttonWidth, buttonHeight);
    graphics.destroy();

    // Create the buttons
    let buttonX = (buttonWidth /2) + 6;
    let topMargin = 6;
    this.chainbutton = new ToggleButton(controlscene, 'chain', buttonX, topMargin + 35, buttonWidth, buttonHeight, 'button-default-background', 'button-hover-background', 'button-selected-background', 'chain-icon', onSwitchToggled, 'button-disabled-background');
    this.chainbutton.setButtonType('toggle');
    this.chainbutton.setTooltipString('Add chain loop', 'right');
    this.junctionbutton = new ToggleButton(controlscene, 'junction', buttonX, topMargin + 35+75, buttonWidth, buttonHeight, 'button-default-background', 'button-hover-background', 'button-selected-background', 'junction-icon', onSwitchToggled, 'button-disabled-background');
    this.junctionbutton.setButtonType('toggle');
    this.junctionbutton.setTooltipString('Junction', 'right');
    this.motorbutton = new ToggleButton(controlscene, 'motor', buttonX, topMargin + 35+2*75, buttonWidth, buttonHeight, 'button-default-background', 'button-hover-background', 'button-selected-background', 'motor-icon', onSwitchToggled, 'button-disabled-background');
    this.motorbutton.setButtonType('toggle');
    this.motorbutton.setTooltipString('Battery', 'right');
    this.resistorbutton = new ToggleButton(controlscene, 'resistor', buttonX, topMargin + 35+3*75, buttonWidth, buttonHeight, 'button-default-background', 'button-hover-background', 'button-selected-background', 'resistor-icon', onSwitchToggled, 'button-disabled-background');
    this.resistorbutton.setButtonType('toggle');
    this.resistorbutton.setTooltipString('Resistor', 'right');
    this.capacitorbutton = new ToggleButton(controlscene, 'capacitor', buttonX, topMargin + 35+4*75, buttonWidth, buttonHeight, 'button-default-background', 'button-hover-background', 'button-selected-background', 'capacitor-icon', onSwitchToggled, 'button-disabled-background');
    this.capacitorbutton.setButtonType('toggle');
    this.capacitorbutton.setTooltipString('Capacitor', 'right');
    this.inductorbutton = new ToggleButton(controlscene, 'inductor', buttonX, topMargin + 35+5*75, buttonWidth, buttonHeight, 'button-default-background', 'button-hover-background', 'button-selected-background', 'inductor-icon', onSwitchToggled, 'button-disabled-background');
    this.inductorbutton.setButtonType('toggle');
    this.inductorbutton.setTooltipString('Inductor', 'right');
    this.phonographbutton = new ToggleButton(controlscene, 'phonograph', buttonX, topMargin + 35+6*75, buttonWidth, buttonHeight, 'button-default-background', 'button-hover-background', 'button-selected-background', 'phonograph-icon', onSwitchToggled, 'button-disabled-background');
    this.phonographbutton.setButtonType('toggle');
    this.phonographbutton.setTooltipString('Ammeter', 'right');
    this.diodebutton = new ToggleButton(controlscene, 'diode', buttonX, topMargin + 35+7*75, buttonWidth, buttonHeight, 'button-default-background', 'button-hover-background', 'button-selected-background', 'diode-icon', onSwitchToggled, 'button-disabled-background');
    this.diodebutton.setButtonType('toggle');
    this.diodebutton.setVisible(false);
    this.diodebutton.setTooltipString('Diode', 'right');
    this.buttonbutton = new ToggleButton(controlscene, 'button', buttonX, topMargin + 35+8*75, buttonWidth, buttonHeight, 'button-default-background', 'button-hover-background', 'button-selected-background', 'button-icon', onSwitchToggled, 'button-disabled-background');
    this.buttonbutton.setButtonType('toggle');
    this.buttonbutton.setTooltipString('Switch', 'right');
    this.transistorbutton = new ToggleButton(controlscene, 'transistor', buttonX, topMargin + 35+9*75, buttonWidth, buttonHeight, 'button-default-background', 'button-hover-background', 'button-selected-background', 'transistor-icon', onSwitchToggled, 'button-disabled-background');
    this.transistorbutton.setButtonType('toggle');
    this.transistorbutton.setTooltipString('Transistor', 'right');
    this.levelchangerbutton = new ToggleButton(controlscene, 'level-changer', buttonX, topMargin + 35+10*75, buttonWidth, buttonHeight, 'button-default-background', 'button-hover-background', 'button-selected-background', 'level-changer-icon', onSwitchToggled, 'button-disabled-background');
    this.levelchangerbutton.setButtonType('toggle');
    this.levelchangerbutton.setTooltipString('Level changer', 'right');
    this.tilebutton = new ToggleButton(controlscene, 'tile', buttonX, topMargin + 35+11*75, buttonWidth, buttonHeight, 'button-default-background', 'button-hover-background', 'button-selected-background', 'tile-icon', onSwitchToggled, 'button-disabled-background');
    this.tilebutton.setButtonType('toggle');
    this.tilebutton.setTooltipString('Tile', 'right');


    // Right side toolbar
    let spaceWidth = this.cameras.main.width;
    let rightSideToolbarPositionX = spaceWidth - 10 - buttonWidth / 2;
    this.interactbutton = new ToggleButton(controlscene, 'interact', rightSideToolbarPositionX, 35, buttonWidth, buttonHeight, 'button-default-background', 'button-hover-background', 'button-selected-background', 'interact-icon', onSwitchToggled, 'button-disabled-background');
    this.interactbutton.setButtonType('toggle');
    this.interactbutton.setTooltipString('Interact', 'left');
    this.movebutton = new ToggleButton(controlscene, 'move', rightSideToolbarPositionX, 35+75, buttonWidth, buttonHeight, 'button-default-background', 'button-hover-background', 'button-selected-background', 'move-icon', onSwitchToggled, 'button-disabled-background');
    this.movebutton.setButtonType('toggle');
    this.movebutton.setTooltipString('Reposition part', 'left');
    this.deletebutton = new ToggleButton(controlscene, 'delete', rightSideToolbarPositionX, 35+2*75, buttonWidth, buttonHeight, 'button-default-background', 'button-hover-background', 'button-selected-background', 'delete-icon', onSwitchToggled, 'button-disabled-background');
    this.deletebutton.setButtonType('toggle');
    this.deletebutton.setTooltipString('Remove part', 'left');
    this.editbutton = new ToggleButton(controlscene, 'edit', rightSideToolbarPositionX, 35+3*75, buttonWidth, buttonHeight, 'button-default-background', 'button-hover-background', 'button-selected-background', 'edit-icon', onSwitchToggled, 'button-disabled-background');
    this.editbutton.setButtonType('toggle');
    this.editbutton.setTooltipString('Change part properties', 'left');
    this.removeallbutton = new ToggleButton(controlscene, 'remove-all', rightSideToolbarPositionX, 35+4*75, buttonWidth, buttonHeight, 'button-default-background', 'button-hover-background', 'button-selected-background', 'remove-all-icon', onRemoveAllClicked, 'button-disabled-background');
    this.removeallbutton.setTooltipString('Remove all', 'left');
    this.zoominbutton = new ToggleButton(controlscene, 'zoom-in', rightSideToolbarPositionX, 35+4*75, buttonWidth, buttonHeight, 'button-default-background', 'button-hover-background', 'button-selected-background', 'zoom-in-icon', onZoomInClicked, 'button-disabled-background');
    this.zoominbutton.setTooltipString('Zoom in', 'left');
    this.zoomoutbutton = new ToggleButton(controlscene, 'zoom-out', rightSideToolbarPositionX, 35+5*75, buttonWidth, buttonHeight, 'button-default-background', 'button-hover-background', 'button-selected-background', 'zoom-out-icon', onZoomOutClicked, 'button-disabled-background');
    this.zoomoutbutton.setTooltipString('Zoom out', 'left');
    this.savebutton = new ToggleButton(controlscene, 'save', rightSideToolbarPositionX, 35+6*75, buttonWidth, buttonHeight, 'button-default-background', 'button-hover-background', 'button-selected-background', 'save-icon', onSaveClicked, 'button-disabled-background');
    this.savebutton.setTooltipString('Save circuit', 'left');
    this.loadbutton = new ToggleButton(controlscene, 'load', rightSideToolbarPositionX, 35+7*75, buttonWidth, buttonHeight, 'button-default-background', 'button-hover-background', 'button-selected-background', 'load-icon', onLoadClicked, 'button-disabled-background');
    this.loadbutton.setTooltipString('Load circuit', 'left');

    positionLeftSideButtons.bind(this)();
    positionRightSideButtons.bind(this)();

    this.input.mouse.capture = true;

    this.input.on('pointermove', (pointer) => onPointerMove.bind(this)(pointer));
    this.input.on('pointerdown', (pointer, currentlyOver) => onPointerDown.bind(this)(pointer, currentlyOver));

    this.dragZone.setInteractive({
       draggable: true
    });
    this.dragZone.on('dragstart', (pointer, dragX, dragY) => onDragStart(pointer, dragX, dragY));
    this.dragZone.on('dragend', (pointer, dragX, dragY) => onDragEnd(pointer, dragX, dragY));
    this.dragZone.on('drag', (pointer, dragX, dragY) => onDrag(pointer, dragX, dragY));

    this.input.on('wheel', (pointer, currentlyOver, deltaX, deltaY, deltaZ, event) => onPointerWheel.bind(this)(pointer, currentlyOver, deltaX, deltaY, deltaZ, event));

    this.input.keyboard.on('keydown-ESC', (event) => escapeKeyDown.bind(this)(event))

    this.scale.on('resize', resize, this);

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

    partManager = new PartManager(this, gridSpacing, mapWidth, mapHeight, this.world);
}

function update ()
{
    // advance the simulation by 1/30 seconds
    this.world.step(1 / 30);

    // clearForces method should be added at the end on each step
    this.world.clearForces();

    if (partManager != null)
        partManager.update();

    //console.log(objects.junctionbottom.body.angle);
/*    objects.junctionmiddle.setAngularVelocity(-objects.junctionbottom.body.angularVelocity);
    objects.junctiontop.setAngularVelocity(objects.junctionbottom.body.angularVelocity * 3 - objects.junctionmiddle.body.angularVelocity * 2);
    objects.junctioncap.setAngle(objects.junctionbottom.body.angle*(360/(Math.PI*2)));
    objects.junctionplanet1.setAngle((objects.junctionmiddle.body.angle - objects.junctionbottom.body.angle)*0.875 * (360/(Math.PI*2)) * (48/12));
    objects.junctionplanet2.setAngle((objects.junctionmiddle.body.angle - objects.junctionbottom.body.angle)*0.875 * (360/(Math.PI*2)) * (48/12));
    objects.junctionplanet3.setAngle((objects.junctionmiddle.body.angle - objects.junctionbottom.body.angle)*0.875 * (360/(Math.PI*2)) * (48/12));
*/
}

var mapDragging = true;
var startingDragCenter = {x: 0, y: 0};
var startingPointer = {x: 0, y: 0};
function onDragStart(pointer, dragX, dragY)
{
    if (self.interactbutton.getToggleState() || partManager.toolMode == 'move' || self.chainbutton.getToggleState() || self.deletebutton.getToggleState() || self.editbutton.getToggleState()) {
        startingDragCenter = self.cameras.main.getWorldPoint(self.cameras.main.centerX, self.cameras.main.centerY);
        startingPointer.x = pointer.x;
        startingPointer.y = pointer.y;
        mapDragging = true;
    }
}

function onDrag(pointer, dragX, dragY)
{
    if (self.interactbutton.getToggleState() || partManager.toolMode == 'move' || self.chainbutton.getToggleState() || self.deletebutton.getToggleState() || self.editbutton.getToggleState()) {
        let desiredCenterPosition = {x: 0, y: 0};
        desiredCenterPosition.x = startingDragCenter.x - (pointer.x - startingPointer.x) / self.cameras.main.zoom;
        desiredCenterPosition.y = startingDragCenter.y - (pointer.y - startingPointer.y) / self.cameras.main.zoom;
        self.cameras.main.centerOn(desiredCenterPosition.x, desiredCenterPosition.y);
    }
}

function onDragEnd(pointer, dragX, dragY)
{
    if (self.interactbutton.getToggleState() || partManager.toolMode == 'move' || self.chainbutton.getToggleState() || self.deletebutton.getToggleState() || self.editbutton.getToggleState()) {
        mapDragging = false;
        self.input.setDefaultCursor('default');
    }
}

function onSaveClicked (name, newToggleState)
{
    // Need to save
    // - Version
    // - Positions of all the parts
    // - Types of all the parts
    // - Other part properties
    // - Chains
    // - Each connection
    // - Each connection cw or ccw
    // - Each connection level
    // - Position of camera
    // - Zoom level of camera

    // First, update all the tile connectors so that they're at the end of the parts list.
    //partManager.updateTileConnectors();

    // Step 1: Create an object that contains all the information we want to save.
    let saveObject = {};
    // Save the version first
    saveObject.version = 1;

    // Save the zoom level and the position on the map we're looking at.
    let worldCenter = self.cameras.main.getWorldPoint(self.cameras.main.centerX, self.cameras.main.centerY);
    saveObject.centerPoint = {x: worldCenter.x, y: worldCenter.y};
    saveObject.zoom = self.cameras.main.zoom;

    // Save each of the parts
    saveObject.parts = partManager.serializeParts();

    // Save each of the chains
    saveObject.chains = partManager.serializeChains();

    // Step 2: Create a JSON string of the object we want to save.
    let jsonData = JSON.stringify(saveObject);

    // Step 3: Put the string in a file and download it.
    download("puzzlemap.spin", jsonData);

    /*// Convert the string to binary.
    let blob = new Blob([jsonData], {type : 'text/plain'});

    // Now save it to a file.
    let reader = new FileReader();
    reader.addEventListener('loadend', (e) => {
        //var thisPageURL = new URL(window.location.href).origin;
        //var binaryText = "b=" + e.target.result;
        //let newURL = thisPageURL + '/?' + binaryText;
        //console.log(newURL);
        //window.history.replaceState("object or string", "", newURL);

        download("puzzlemap.spin", e.target.result);
    });
    let dataURL = reader.readAsDataURL(blob);*/

}

function download (filename, text) {
    var pom = document.createElement('a');
    pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    pom.setAttribute('download', filename);

    if (document.createEvent) {
        var event = document.createEvent('MouseEvents');
        event.initEvent('click', true, true);
        pom.dispatchEvent(event);
    }
    else {
        pom.click();
    }
}

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}

function dataURItoBlob(dataURI) {
    // convert base64 to raw binary data held in a string
    var byteString = atob(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

    // write the bytes of the string to an ArrayBuffer
    var ab = new ArrayBuffer(byteString.length);

    // create a view into the buffer
    var ia = new Uint8Array(ab);

    // set the bytes of the buffer to the correct values
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    // write the ArrayBuffer to a blob, and you're done
    var blob = new Blob([ab], {type: mimeString});
    return blob;
}

function onLoadClicked(name, newToggleState)
{
    var input = document.createElement('input');
    input.type = 'file';
    input.accept = '.spin';

    input.onchange = e => {

        // getting a hold of the file reference
        var file = e.target.files[0];

        // Read the file
        var reader = new FileReader();
        reader.addEventListener("loadend", function() {

            let result = JSON.parse(reader.result);

            console.log("Loading file, version: " + result.version);

            // First, remove everything from the map.
            // Remove all the chains.
            partManager.deleteAllChains();

            // Remove all the parts.
            partManager.deleteAllParts();

            // Now add in all the parts
            for (let i = 0; i < result.parts.length; i++)
            {
                let partToAdd = result.parts[i];
                if (partToAdd.hasOwnProperty("value")) {
                    partManager.addPart(partToAdd.type, partToAdd.x, partToAdd.y, partToAdd.value);
                } else {
                    partManager.addPart(partToAdd.type, partToAdd.x, partToAdd.y);
                }
            }

            // Now add in all the chains
            for (let i = 0; i < result.chains.length; i++)
            {
                let chainToAdd = result.chains[i];
                partManager.addChain(chainToAdd.connections);
            }

            // Update all the tile connectors
            partManager.updateTileConnectors();

            // Now adjust the zoom level
            self.cameras.main.setZoom(result.zoom);
            self.cameras.main.centerOn(result.centerPoint.x, result.centerPoint.y);

            // Now read the blob into a JSON string.
            /*let blob = dataURItoBlob(reader.result);
            var reader2 = new FileReader();

            reader2.addEventListener("loadend", function() {

                // Now read the JSON string into an object.
                let result = JSON.parse(reader2.result);
                console.log(result.version);
            });
            reader2.readAsText(blob);*/

        });

        reader.readAsText(file,'UTF-8');
    }

    input.click();
}

function onPointerWheel(pointer, currentlyOver, deltaX, deltaY, deltaZ, event)
{
    /*if (deltaX > 0 || deltaY > 0 || deltaZ > 0)
    {
        zoomIn();
    }
    else if (deltaX < 0 || deltaY < 0 || deltaZ < 0)
    {
        zoomOut();
    }*/
    //event.preventDefault();
}

function zoomIn()
{
    let currentZoom = self.cameras.main.zoom;
    let newZoom = currentZoom + 0.1;
    if (newZoom > 1)
        newZoom = 1;

    self.cameras.main.setZoom(newZoom);
}

function zoomOut()
{
    let currentZoom = self.cameras.main.zoom;
    let newZoom = currentZoom - 0.1;

    // Check to see if the image is too small to fill the screen.
    let screenWidth = self.cameras.main.width;
    let screenHeight = self.cameras.main.height;

    if (mapWidth * newZoom < screenWidth || mapHeight * newZoom < screenHeight) {
        newZoom = currentZoom;
    }
    self.cameras.main.setZoom(newZoom);

/*    let newCenterX = self.cameras.main.centerX;
    let newCenterY = self.cameras.main.centerY;

    // Now check to see if the map edge is in the display area and move it over if it is.
    if (self.cameras.main.centerX - ((self.cameras.main.width/2)/newZoom) < -(mapWidth / 2)) {
        //Too far to left
        newCenterX = (-mapWidth / 2)+((self.cameras.main.width/2)/newZoom);
    } else if (self.cameras.main.centerX + ((self.cameras.main.width/2)/newZoom) > mapWidth / 2) {
        //Too far to right
        newCenterX = (mapWidth / 2) - ((self.cameras.main.width / 2) / newZoom);
    }

    if (self.cameras.main.centerY - ((self.cameras.main.height/2)/newZoom) < -(mapHeight / 2)) {
        //Too far up
        newCenterY = (-mapHeight / 2)+((self.cameras.main.height/2)/newZoom);
    } else if (self.cameras.main.centerY + ((self.cameras.main.height/2)/newZoom) > mapHeight / 2) {
        //Too far down
        newCenterY = (mapHeight / 2) - ((self.cameras.main.height / 2) / newZoom);
    }

    self.cameras.main.centerOn(newCenterX, newCenterY);*/
}

function onRemoveAllClicked(name, newToggleState)
{
    // Remove all the chains.
    partManager.deleteAllChains();

    // Remove all the parts.
    partManager.deleteAllParts();
}

function onZoomInClicked(name, newToggleState)
{
    zoomIn();
}

function onZoomOutClicked(name, newToggleState)
{
    zoomOut();
}

var objects = {};
function onSwitchToggled (name, newToggleState)
{
    self.chainbutton.setToggleState(false);
    self.junctionbutton.setToggleState(false);
    self.motorbutton.setToggleState(false);
    self.resistorbutton.setToggleState(false);
    self.capacitorbutton.setToggleState(false);
    self.inductorbutton.setToggleState(false);
    self.phonographbutton.setToggleState(false);
    self.diodebutton.setToggleState(false);
    self.buttonbutton.setToggleState(false);
    self.transistorbutton.setToggleState(false);
    self.levelchangerbutton.setToggleState(false);
    self.tilebutton.setToggleState(false);
    self.interactbutton.setToggleState(false);
    self.movebutton.setToggleState(false);
    self.deletebutton.setToggleState(false);
    self.editbutton.setToggleState(false);
    partManager.setToolMode('default');
    partManager.cancelChain();

    if (name == 'chain')
    {
        self.chainbutton.setToggleState(true);
        mouseImage.setVisible(false);
    }
    else if (name == 'junction')
    {
        self.junctionbutton.setToggleState(true);
        mouseImage.setTexture('junction');
        mouseImageOffset = PartBase.getPartImageOffsets(name);
        mouseImage.setVisible(true);
    }
    else if (name == 'motor')
    {
        self.motorbutton.setToggleState(true);
        mouseImage.setTexture('motor');
        mouseImageOffset = PartBase.getPartImageOffsets(name);
        mouseImage.setVisible(true);
    }
    else if (name == 'resistor')
    {
        self.resistorbutton.setToggleState(true);
        mouseImage.setTexture('resistor');
        mouseImageOffset = PartBase.getPartImageOffsets(name);
        mouseImage.setVisible(true);
    }
    else if (name == 'capacitor')
    {
        self.capacitorbutton.setToggleState(true);
        mouseImage.setTexture('capacitor');
        mouseImageOffset = PartBase.getPartImageOffsets(name);
        mouseImage.setVisible(true);
    }
    else if (name == 'inductor')
    {
        self.inductorbutton.setToggleState(true);
        mouseImage.setTexture('inductor');
        mouseImageOffset = PartBase.getPartImageOffsets(name);
        mouseImage.setVisible(true);
    }
    else if (name == 'phonograph')
    {
        self.phonographbutton.setToggleState(true);
        mouseImage.setTexture('phonograph');
        mouseImageOffset = PartBase.getPartImageOffsets(name);
        mouseImage.setVisible(true);
    }
    else if (name == 'diode')
    {
        self.diodebutton.setToggleState(true);
        mouseImage.setTexture('diode');
        mouseImageOffset = PartBase.getPartImageOffsets(name);
        mouseImage.setVisible(true);
    }
    else if (name == 'button')
    {
        self.buttonbutton.setToggleState(true);
        mouseImage.setTexture('button');
        mouseImageOffset = PartBase.getPartImageOffsets(name);
        mouseImage.setVisible(true);
    }
    else if (name == 'transistor')
    {
        self.transistorbutton.setToggleState(true);
        mouseImage.setTexture('transistor');
        mouseImageOffset = PartBase.getPartImageOffsets(name);
        mouseImage.setVisible(true);
    }
    else if (name == 'level-changer')
    {
        self.levelchangerbutton.setToggleState(true);
        mouseImage.setTexture('level-changer');
        mouseImageOffset = PartBase.getPartImageOffsets(name);
        mouseImage.setVisible(true);
    }
    else if (name == 'tile')
    {
        self.tilebutton.setToggleState(true);
        mouseImage.setTexture('tile');
        mouseImageOffset = PartBase.getPartImageOffsets(name);
        mouseImage.setVisible(true);
    }
    else if (name == 'interact') {
        self.interactbutton.setToggleState(true);
        mouseImage.setVisible(false);
        partManager.setToolMode.bind(partManager)('interact');
    }
    else if (name == 'move')
    {
        self.movebutton.setToggleState(true);
        mouseImage.setVisible(false);
        partManager.setToolMode.bind(partManager)('move');
    }
    else if (name == 'delete')
    {
        self.deletebutton.setToggleState(true);
        mouseImage.setVisible(false);
        partManager.setToolMode.bind(partManager)('delete');
    }
    else if (name == 'edit')
    {
        self.editbutton.setToggleState(true);
        mouseImage.setVisible(false);
        partManager.setToolMode.bind(partManager)('edit');
    }
}

function onPointerMove(pointer)
{
    if (disablePointerOverEvent)
        return;

    let worldPointer = this.cameras.main.getWorldPoint(pointer.x, pointer.y);

    var snapPosition;
    if (this.motorbutton.getToggleState() || this.tilebutton.getToggleState())
    {
        snapPosition = PartBase.getSnapPosition(worldPointer, tileSpacing/* * this.cameras.main.zoom*/);
    } else {
        snapPosition = PartBase.getSnapPosition(worldPointer, gridSpacing/* * this.cameras.main.zoom*/);
    }
    mouseImage.setPosition(snapPosition.snapPoint.x - mouseImageOffset.x, snapPosition.snapPoint.y - mouseImageOffset.y);
    clearHighlight.bind(this)();

    // Chain mode
    if (this.chainbutton.getToggleState())
    {
        if (partManager.isInTheMiddleOfBuildingAChain() == false)
        {
            // We haven't drawn any of the chain, yet. So when the mouse is over a part, draw arrows to choose which way the chain should go.
            // Search for a part that has a sprocket circle on which the cursor is over.

            var nearestSprocket = partManager.getSprocketAtPoint.bind(partManager)(worldPointer.x, worldPointer.y);
            if (nearestSprocket != null) {
                // Check to see if there are any levels without a chain on the sprocket.
                let availableLevels = partManager.getAllLevelsWithSameRadiusThatAreAvailableOnThisPart(nearestSprocket.partIndex, nearestSprocket.level)

                if (availableLevels.length > 0) {//partManager.isSprocketAvailable(nearestSprocket.partIndex, nearestSprocket.level)) {
                    // Draw a highlight circle where the sprocket is
                    var sprocketBounds = partManager.getSprocketBounds(nearestSprocket.partIndex, nearestSprocket.level);
                    if (worldPointer.x < sprocketBounds.x) {
                        drawHighlight.bind(this)(sprocketBounds.x, sprocketBounds.y, sprocketBounds.radius, sprocketBounds.thickness, 90, true);
                    } else {
                        drawHighlight.bind(this)(sprocketBounds.x, sprocketBounds.y, sprocketBounds.radius, sprocketBounds.thickness, 90, false);
                    }
                }
            }
        }
        else
        {
            // We have a chain started. Now we need to draw the next part highlighted.
            var nearestSprocket = partManager.getNextAllowedSprocketAtPoint.bind(partManager)(worldPointer.x, worldPointer.y);
            if (nearestSprocket != null) {
                // Draw a highlight circle where the sprocket is
                var sprocketBounds = partManager.getSprocketBounds(nearestSprocket.partIndex, nearestSprocket.level);

                // Is this the very first sprocket in this chain?
                let isFirstSprocket = false;
                let firstSprocket = partManager.getInfoAboutFirstSprocketInChainBeingBuilt();

                if (firstSprocket.partIndex == nearestSprocket.partIndex) {
                    // It IS the sprocket we began this chain on. We're going to end this chain now.
                    isFirstSprocket = true;
                }

                // Figure out which side of the line this part is on.
                // Determine angle between the current part and the next one
                var lastSprocketBounds = partManager.getLastSprocketBoundsOfChainBeingBuilt();
                let distance = Math.sqrt(Math.pow(lastSprocketBounds.x - sprocketBounds.x,2) + Math.pow(lastSprocketBounds.y - sprocketBounds.y,2));
                let ydiff = lastSprocketBounds.y - sprocketBounds.y;
                let angle = Phaser.Math.RadToDeg(Math.asin(ydiff/distance));
                if (lastSprocketBounds.x > sprocketBounds.x)
                    angle = 180 - angle;

                // Determine the angle to the pointer
                let distanceToPointer = Math.sqrt(Math.pow(sprocketBounds.x - worldPointer.x,2) + Math.pow(sprocketBounds.y - worldPointer.y,2));
                let ydiffToPointer = sprocketBounds.y - worldPointer.y;
                let angleToPointer = Phaser.Math.RadToDeg(Math.asin(ydiffToPointer/distanceToPointer));
                if (worldPointer.x < sprocketBounds.x)
                    angleToPointer = 180 - angleToPointer;

                let angleDiff = angleToPointer - angle;
                if (angleDiff < 0)
                    angleDiff += 360;

                if (angleDiff >= 0 && angleDiff < 180) {
                    // The clockwise arrow
                    if (!(isFirstSprocket && firstSprocket.cw == false))
                        drawHighlight.bind(this)(sprocketBounds.x, sprocketBounds.y, sprocketBounds.radius, sprocketBounds.thickness, angle, true);
                } else {
                    // The counterclockwise arrow
                    if (!(isFirstSprocket && firstSprocket.cw == true))
                        drawHighlight.bind(this)(sprocketBounds.x, sprocketBounds.y, sprocketBounds.radius, sprocketBounds.thickness, angle, false);
                }
            }
        }

        // Redraw the chain we're currently building.
        if (partManager.isInTheMiddleOfBuildingAChain() == true)
        {
            partManager.redrawChainBeingBuilt(worldPointer);
        }
    }
}

function drawHighlight(centerX, centerY, radius, thickness, angle, cw)
{
    const arrowOffset = 20;
    const arrowAngleExtents = 30;
    const arrowHeadThickness = 26;

    this.highlightGraphics = this.add.graphics(0, 0, true);
    // Set to the top-most depth
    this.highlightGraphics.setDepth(20);
    this.highlightGraphics.lineStyle(thickness, 0x00FF00, 0.65);
    this.highlightGraphics.fillStyle(0x00FF00, 0.65);

    if (cw)
    {
        this.highlightGraphics.beginPath();
        this.highlightGraphics.arc(centerX, centerY, radius, Phaser.Math.DegToRad(-angle-180), Phaser.Math.DegToRad(-angle), false);
        this.highlightGraphics.strokePath();

        // Now draw arrow
        this.highlightGraphics.beginPath();
        this.highlightGraphics.arc(centerX,
            centerY,
            radius + arrowOffset,
            Phaser.Math.DegToRad((-angle - 90) - arrowAngleExtents),
            Phaser.Math.DegToRad((-angle - 90) + arrowAngleExtents),
            false);
        this.highlightGraphics.strokePath();
        // We want a constant length of our arrow head: 18 px.
        // Find circumference:
        let circumference = 2 * Math.PI * (arrowOffset + radius);
        let fractionOfCircumference = (18 / circumference) * 360;
        let arrowTop = {
            x: centerX + Math.cos(Phaser.Math.DegToRad((-angle - 90) + arrowAngleExtents + fractionOfCircumference)) * (arrowOffset + radius),
            y: centerY + Math.sin(Phaser.Math.DegToRad((-angle - 90) + arrowAngleExtents + fractionOfCircumference)) * (arrowOffset + radius)
        };
        let arrowLeft = {
            x: centerX + Math.cos(Phaser.Math.DegToRad((-angle - 90) + arrowAngleExtents)) * (arrowOffset + radius + arrowHeadThickness / 2),
            y: centerY + Math.sin(Phaser.Math.DegToRad((-angle - 90) + arrowAngleExtents)) * (arrowOffset + radius + arrowHeadThickness / 2)
        };
        let arrowRight = {
            x: centerX + Math.cos(Phaser.Math.DegToRad((-angle - 90) + arrowAngleExtents)) * (arrowOffset + radius - arrowHeadThickness / 2),
            y: centerY + Math.sin(Phaser.Math.DegToRad((-angle - 90) + arrowAngleExtents)) * (arrowOffset + radius - arrowHeadThickness / 2)
        };
        this.highlightGraphics.fillTriangle(arrowTop.x, arrowTop.y, arrowLeft.x, arrowLeft.y, arrowRight.x, arrowRight.y);
    }
    else
    {
        this.highlightGraphics.beginPath();
        this.highlightGraphics.arc(centerX, centerY, radius, Phaser.Math.DegToRad(-angle), Phaser.Math.DegToRad(-angle + 180), false);
        this.highlightGraphics.strokePath();

        // Now draw arrow
        this.highlightGraphics.beginPath();
        this.highlightGraphics.arc(centerX,
            centerY,
            radius + arrowOffset,
            Phaser.Math.DegToRad((-angle + 90) - arrowAngleExtents),
            Phaser.Math.DegToRad((-angle + 90) + arrowAngleExtents),
            false);
        this.highlightGraphics.strokePath();
        // We want a constant length of our arrow head: 18 px.
        // Find circumference:
        let circumference = 2 * Math.PI * (arrowOffset + radius);
        let fractionOfCircumference = (18 / circumference) * 360;
        let arrowTop = {
            x: centerX + Math.cos(Phaser.Math.DegToRad((angle - 90) + arrowAngleExtents + fractionOfCircumference)) * (arrowOffset + radius),
            y: centerY - Math.sin(Phaser.Math.DegToRad((angle - 90) + arrowAngleExtents + fractionOfCircumference)) * (arrowOffset + radius)
        };
        let arrowLeft = {
            x: centerX + Math.cos(Phaser.Math.DegToRad((angle - 90) + arrowAngleExtents)) * (arrowOffset + radius + arrowHeadThickness / 2),
            y: centerY - Math.sin(Phaser.Math.DegToRad((angle - 90) + arrowAngleExtents)) * (arrowOffset + radius + arrowHeadThickness / 2)
        };
        let arrowRight = {
            x: centerX + Math.cos(Phaser.Math.DegToRad((angle - 90) + arrowAngleExtents)) * (arrowOffset + radius - arrowHeadThickness / 2),
            y: centerY - Math.sin(Phaser.Math.DegToRad((angle - 90) + arrowAngleExtents)) * (arrowOffset + radius - arrowHeadThickness / 2)
        };
        this.highlightGraphics.fillTriangle(arrowTop.x, arrowTop.y, arrowLeft.x, arrowLeft.y, arrowRight.x, arrowRight.y);
    }
}

function onPointerDown(pointer, currentlyOver)
{
    let worldPointer = this.cameras.main.getWorldPoint(pointer.x, pointer.y);
    // Drop a part if we've got a part selected
    if (this.junctionbutton.getToggleState())
    {
        var snapPosition = PartBase.getSnapPosition(worldPointer, gridSpacing);
        partManager.addPart('junction', snapPosition.snapPoint.x, snapPosition.snapPoint.y);
    }
    else if (this.buttonbutton.getToggleState())
    {
        var snapPosition = PartBase.getSnapPosition(worldPointer, gridSpacing);
        partManager.addPart('button', snapPosition.snapPoint.x, snapPosition.snapPoint.y);
    }
    else if (this.resistorbutton.getToggleState())
    {
        var snapPosition = PartBase.getSnapPosition(worldPointer, gridSpacing);
        partManager.addPart('resistor', snapPosition.snapPoint.x, snapPosition.snapPoint.y);
    }
    else if (this.capacitorbutton.getToggleState())
    {
        var snapPosition = PartBase.getSnapPosition(worldPointer, gridSpacing);
        partManager.addPart('capacitor', snapPosition.snapPoint.x, snapPosition.snapPoint.y);
    }
    else if (this.diodebutton.getToggleState())
    {
        var snapPosition = PartBase.getSnapPosition(worldPointer, gridSpacing);
        partManager.addPart('diode', snapPosition.snapPoint.x, snapPosition.snapPoint.y);
    }
    else if (this.transistorbutton.getToggleState())
    {
        var snapPosition = PartBase.getSnapPosition(worldPointer, gridSpacing);
        partManager.addPart('transistor', snapPosition.snapPoint.x, snapPosition.snapPoint.y);
    }
    else if (this.levelchangerbutton.getToggleState())
    {
        var snapPosition = PartBase.getSnapPosition(worldPointer, gridSpacing);
        partManager.addPart('level-changer', snapPosition.snapPoint.x, snapPosition.snapPoint.y);
    }
    else if (this.phonographbutton.getToggleState())
    {
        var snapPosition = PartBase.getSnapPosition(worldPointer, gridSpacing);
        partManager.addPart('phonograph', snapPosition.snapPoint.x, snapPosition.snapPoint.y);
    }
    else if (this.motorbutton.getToggleState())
    {
        var snapPosition = PartBase.getSnapPosition(worldPointer, tileSpacing);
        partManager.addPart('motor', snapPosition.snapPoint.x, snapPosition.snapPoint.y);
        // Update all the tile connectors
        partManager.updateTileConnectors();
    }
    else if (this.inductorbutton.getToggleState())
    {
        var snapPosition = PartBase.getSnapPosition(worldPointer, gridSpacing);
        partManager.addPart('inductor', snapPosition.snapPoint.x, snapPosition.snapPoint.y);
    }
    else if (this.tilebutton.getToggleState())
    {
        var snapPosition = PartBase.getSnapPosition(worldPointer, tileSpacing);
        partManager.addPart('tile', snapPosition.snapPoint.x, snapPosition.snapPoint.y);
        // Update all the tile connectors
        partManager.updateTileConnectors();

    }
    else if (this.chainbutton.getToggleState())
    {
        // Draw a chain if the chain button is selected
        if (partManager.isInTheMiddleOfBuildingAChain())
        {
            var nearestSprocket = partManager.getNextAllowedSprocketAtPoint.bind(partManager)(worldPointer.x, worldPointer.y);
            if (nearestSprocket != null) {
                // Draw a highlight circle where the sprocket is
                var sprocketBounds = partManager.getSprocketBounds(nearestSprocket.partIndex, nearestSprocket.level);

                // Is this the very first sprocket in this chain?
                let isFirstSprocket = false;
                let firstSprocket = partManager.getInfoAboutFirstSprocketInChainBeingBuilt();

                if (firstSprocket.partIndex == nearestSprocket.partIndex) {
                    // It IS the sprocket we began this chain on. We're going to end this chain now.
                    isFirstSprocket = true;
                }

                // Determine angle between the current part and the next one
                var lastSprocketBounds = partManager.getLastSprocketBoundsOfChainBeingBuilt();
                let distance = Math.sqrt(Math.pow(lastSprocketBounds.x - sprocketBounds.x,2) + Math.pow(lastSprocketBounds.y - sprocketBounds.y,2));
                let ydiff = lastSprocketBounds.y - sprocketBounds.y;
                let angle = Phaser.Math.RadToDeg(Math.asin(ydiff/distance));
                if (lastSprocketBounds.x > sprocketBounds.x)
                    angle = 180 - angle;

                // Determine the angle to the pointer
                let distanceToPointer = Math.sqrt(Math.pow(sprocketBounds.x - worldPointer.x,2) + Math.pow(sprocketBounds.y - worldPointer.y,2));
                let ydiffToPointer = sprocketBounds.y - worldPointer.y;
                let angleToPointer = Phaser.Math.RadToDeg(Math.asin(ydiffToPointer/distanceToPointer));
                if (worldPointer.x < sprocketBounds.x)
                    angleToPointer = 180 - angleToPointer;

                let angleDiff = angleToPointer - angle;
                if (angleDiff < 0)
                    angleDiff += 360;

                if (angleDiff >= 0 && angleDiff < 180) {
                    // Clockwise
                    if (!(isFirstSprocket && firstSprocket.cw == false)) {
                        if (!isFirstSprocket)
                            partManager.addChainConnection(nearestSprocket.partIndex, nearestSprocket.level, true);
                        else
                            partManager.closeChain();
                    }
                } else {
                    // Counterclockwise
                    if (!(isFirstSprocket && firstSprocket.cw == true)) {
                        if (!isFirstSprocket)
                            partManager.addChainConnection(nearestSprocket.partIndex, nearestSprocket.level, false);
                        else
                            partManager.closeChain();
                    }
                }

                clearHighlight.bind(this)();
            }
        }
        else
        {
            var nearestSprocket = partManager.getSprocketAtPoint.bind(partManager)(worldPointer.x, worldPointer.y);
            if (nearestSprocket != null)
            {
                let availableLevels = partManager.getAllLevelsWithSameRadiusThatAreAvailableOnThisPart(nearestSprocket.partIndex, nearestSprocket.level);
                if (availableLevels.length > 0) {
                    let chosenLevel = 0;
                    if (availableLevels.length == 1)
                    {
                        chosenLevel = availableLevels[0];
                    }
                    else
                    {
                        // Now, which level do we want to attach to? There are multiple possibilities.
                        // Bring up a menu so the user can choose
                        // Step 1: Create the items in the menu
                        let menuItems = [];
                        for (let i = 0; i < availableLevels.length; i++)
                        {
                            menuItems.push({name: 'Level ' + (availableLevels[i]+1)});
                        }

                        //Now create the popup menu.
                        // We'll need to store nearestSprocket.partIndex and cw somewhere so that we can start a chain with the chosen level once it's been picked.
                        // Once an item has been selected on the popup menu, we'll need to destroy the popup menu and the modalBackground, too.
                        partClickedForLevelSelect.partIndex = nearestSprocket.partIndex;
                        let sprocketBounds = partManager.getSprocketBounds(nearestSprocket.partIndex, availableLevels[0]);
                        if (worldPointer.x < sprocketBounds.x)
                            partClickedForLevelSelect.cw = true;
                        else
                            partClickedForLevelSelect.cw = false;

                        popupLevelChooser = new PopupLevelChooser(controlscene, pointer.x, pointer.y, 50, 35, partManager.getGetNumberOfLevelsOnThisPart(nearestSprocket.partIndex), availableLevels, popupLevelSelected);
                        disablePointerOverEvent = true;
                        // We haven't yet chosen a level, so -1
                        chosenLevel = -1;
                    }

                    if (chosenLevel >= 0) {
                        let sprocketBounds = partManager.getSprocketBounds(nearestSprocket.partIndex, chosenLevel);

                        partManager.startChain();
                        if (worldPointer.x < sprocketBounds.x) {
                            partManager.addChainConnection(nearestSprocket.partIndex, chosenLevel, true);
                        } else {
                            partManager.addChainConnection(nearestSprocket.partIndex, chosenLevel, false);
                        }
                    }

                    clearHighlight.bind(this)();
                }
            }
        }
    }
}

// Callback function for when the sprocket level is chosen from the popup menu list.
function popupLevelSelected(level)
{
    disablePointerOverEvent = false;
    popupLevelChooser = null;
    if (level >= 0) {
        let sprocketBounds = partManager.getSprocketBounds(partClickedForLevelSelect.partIndex, level);
        partManager.startChain();
        partManager.addChainConnection(partClickedForLevelSelect.partIndex, level, partClickedForLevelSelect.cw);
    }
}

function clearHighlight()
{
    if (this.highlightGraphics != null)
    {
        this.highlightGraphics.destroy();
        this.highlightGraphics = null;
    }
}

function drawBackgroundGrid ()
{
    //var height = mapHeight;//this.cameras.main.height;
    //var width = mapWidth;//this.cameras.main.width;
    let mapLeft = -mapWidth/2;
    let mapRight = mapWidth/2;
    let mapTop = -mapHeight/2;
    let mapBottom = mapHeight/2;

    this.backgroundGrid = this.add.graphics();
    this.backgroundGrid.lineStyle(1, 0x000000, 0.05);
    this.backgroundGrid.beginPath();
    this.backgroundGrid.arc(100, 100, 50, 45*(2*Math.PI/360), 90*(2*Math.PI/360), false);
    this.backgroundGrid.stroke();
    // First draw vertical lines
    // Middle to right
    for (var x = 0; x <= mapWidth; x += gridSpacing) {
        this.backgroundGrid.lineBetween(x, mapBottom, x, mapTop);
    }
    // Middle to left
    for (var x = 0 - gridSpacing; x >= -mapWidth; x -= gridSpacing) {
        this.backgroundGrid.lineBetween(x, mapBottom, x, mapTop);
    }

    // Where would we start on the left side of the map?
    // Up is negative, down is positive
    // m = 1/SQRT(3)
    // y = 1/SQRT(3) * x + intercept
    // intercept = 0
    // We're interested in where it crosses at x = mapLeft;
    // yAtMapLeft = 1/SQRT(3) * mapLeft + 0
    var yAtMapLeft = (1/Math.sqrt(3)) * mapLeft;//((-Math.sqrt(2)* mapLeft) / (2 * gridSpacing)) - Math.floor((-Math.sqrt(2)* mapLeft) / (2 * gridSpacing));
    // Going down
    for (var y = yAtMapLeft; y < mapBottom; y += gridSpacing * (2/Math.sqrt(3))) {
        this.backgroundGrid.lineBetween(mapLeft, y, mapRight, y + (1/Math.sqrt(3)) * mapWidth);
    }
    // Going up
    for (var y = yAtMapLeft - (gridSpacing * (2/Math.sqrt(3))); y > mapTop - mapWidth / Math.sqrt(3); y -= gridSpacing * (2/Math.sqrt(3))) {
        this.backgroundGrid.lineBetween(mapLeft, y, mapRight, y + (1/Math.sqrt(3)) * mapWidth);
    }

    // m = -1/SQRT(3)
    // yAtMapLeft = -1/SQRT(3) * mapLeft + 0
    yAtMapLeft = (-1/Math.sqrt(3)) * mapLeft;
    // Going down
    for (var y = yAtMapLeft; y < mapBottom + mapWidth / 2; y += gridSpacing * (2/Math.sqrt(3)))
    {
        this.backgroundGrid.lineBetween(mapLeft, y, mapRight, y - (1/Math.sqrt(3)) * mapWidth);
    }
    // Going up
    for (var y = yAtMapLeft - (gridSpacing * (2/Math.sqrt(3))); y > mapTop; y -= gridSpacing * (2/Math.sqrt(3)))
    {
        this.backgroundGrid.lineBetween(mapLeft, y, mapRight, y + (-1/Math.sqrt(3)) * mapWidth);
    }

    this.backgroundGrid.lineStyle(1, 0xFF0000, 0.35);
    this.backgroundGrid.lineBetween(-gridSpacing, 0, gridSpacing, 0);
    this.backgroundGrid.lineBetween(-gridSpacing*(1/2), -gridSpacing*(Math.sqrt(3)/2), gridSpacing*(1/2), gridSpacing*(Math.sqrt(3)/2));
    this.backgroundGrid.lineBetween(-gridSpacing*(1/2), gridSpacing*(Math.sqrt(3)/2), gridSpacing*(1/2), -gridSpacing*(Math.sqrt(3)/2));
    // Now draw lines at 120 deg
    /*var y = mapTop, x = mapLeft;
    while (y < (Math.sqrt(2) * mapWidth) + mapBottom)
    {
        this.backgroundGrid.lineBetween(mapLeft, y, mapRight, y - Math.sqrt(2) * mapWidth);
        y += 2 * gridSpacing;
    }
    y = mapTop;
    while (y < mapBottom)
    {
        this.backgroundGrid.lineBetween(mapLeft, y, mapRight, y + Math.sqrt(2) * mapWidth);
        y += 2 * gridSpacing;
    }
    y = mapTop + (-2 * gridSpacing);
    while (y > -(Math.sqrt(2) * mapWidth))
    {
        this.backgroundGrid.lineBetween(mapLeft, y, mapRight, y + Math.sqrt(2) * mapWidth);
        y -= 2 * gridSpacing;
    }*/
}

function drawBackgroundGridOld ()
{
    //var height = mapHeight;//this.cameras.main.height;
    //var width = mapWidth;//this.cameras.main.width;
    let mapLeft = -mapWidth/2;
    let mapRight = mapWidth/2;
    let mapTop = -mapHeight/2;
    let mapBottom = mapHeight/2;

    this.backgroundGrid = this.add.graphics();
    this.backgroundGrid.lineStyle(1, 0x000000, 0.15);

    // First draw horizontal lines
    for (var y = 0; y <= mapHeight; y += gridSpacing) {
        this.backgroundGrid.lineBetween(mapLeft, y, mapWidth, y);
    }
    for (var y = 0 - gridSpacing; y >= -mapHeight; y -= gridSpacing) {
        this.backgroundGrid.lineBetween(mapLeft, y, mapWidth, y);
    }

    // Where would we start on the left side of the map?
    // m = -SQRT(2)
    //y = -SQRT(2)* mapLeft
    var intercept = ((-Math.sqrt(2)* mapLeft) / (2 * gridSpacing)) - Math.floor((-Math.sqrt(2)* mapLeft) / (2 * gridSpacing));
    for (var y = intercept*(2 * gridSpacing); y < (Math.sqrt(2) * mapWidth) + mapBottom; y += 2 * gridSpacing) {
        this.backgroundGrid.lineBetween(mapLeft, y, mapRight, y - Math.sqrt(2) * mapWidth);
    }
    for (var y = intercept*(2 * gridSpacing) - 2 * gridSpacing; y > mapTop; y -= 2 * gridSpacing) {
        this.backgroundGrid.lineBetween(mapLeft, y, mapRight, y - Math.sqrt(2) * mapWidth);
    }

    intercept = ((Math.sqrt(2)* mapLeft) / (2 * gridSpacing)) - Math.floor((Math.sqrt(2)* mapLeft) / (2 * gridSpacing));
    for (var y = intercept*(2 * gridSpacing); y < mapBottom; y += 2 * gridSpacing)
    {
        this.backgroundGrid.lineBetween(mapLeft, y, mapRight, y + Math.sqrt(2) * mapWidth);
    }
    for (var y = intercept*(2 * gridSpacing) - 2 * gridSpacing; y > -(Math.sqrt(2) * mapWidth) - (mapHeight/2); y -= 2 * gridSpacing)
    {
        this.backgroundGrid.lineBetween(mapLeft, y, mapRight, y + Math.sqrt(2) * mapWidth);
    }

    this.backgroundGrid.lineStyle(1, 0xFF0000, 0.35);
    this.backgroundGrid.lineBetween(-gridSpacing, 0, gridSpacing, 0);
    this.backgroundGrid.lineBetween(-gridSpacing*(1/2), -gridSpacing*(Math.sqrt(2)/2), gridSpacing*(1/2), gridSpacing*(Math.sqrt(2)/2));
    this.backgroundGrid.lineBetween(-gridSpacing*(1/2), gridSpacing*(Math.sqrt(2)/2), gridSpacing*(1/2), -gridSpacing*(Math.sqrt(2)/2));
    // Now draw lines at 120 deg
    /*var y = mapTop, x = mapLeft;
    while (y < (Math.sqrt(2) * mapWidth) + mapBottom)
    {
        this.backgroundGrid.lineBetween(mapLeft, y, mapRight, y - Math.sqrt(2) * mapWidth);
        y += 2 * gridSpacing;
    }
    y = mapTop;
    while (y < mapBottom)
    {
        this.backgroundGrid.lineBetween(mapLeft, y, mapRight, y + Math.sqrt(2) * mapWidth);
        y += 2 * gridSpacing;
    }
    y = mapTop + (-2 * gridSpacing);
    while (y > -(Math.sqrt(2) * mapWidth))
    {
        this.backgroundGrid.lineBetween(mapLeft, y, mapRight, y + Math.sqrt(2) * mapWidth);
        y -= 2 * gridSpacing;
    }*/
}

function escapeKeyDown(event)
{
    if (partManager.isInTheMiddleOfBuildingAChain())
    {
        partManager.cancelChain();
    }
    if (popupLevelChooser != null)
    {
        popupLevelChooser.cancelPopup();
        popupLevelChooser = null;
        disablePointerOverEvent = false;
    }
}

function resize (gameSize, baseSize, displaySize, resolution)
{
    //var width = gameSize.width;
    //var height = gameSize.height;

    positionLeftSideButtons.bind(this)();
    positionRightSideButtons.bind(this)();

    //this.cameras.resize(width, height);

    //this.bg.setSize(width, height);
    //this.logo.setPosition(width / 2, height / 2);
}

function positionLeftSideButtons()
{
    let leftMargin = 6;
    let topMargin = 6;
    let spaceHeight = this.cameras.main.height;

    let buttons = [this.chainbutton,
        this.motorbutton,
        this.tilebutton,
        this.junctionbutton,
        this.resistorbutton,
        this.capacitorbutton,
        this.inductorbutton,
        this.phonographbutton,
        //this.diodebutton,
        this.buttonbutton,
        this.transistorbutton,
        this.levelchangerbutton
        ];

    let xPos = (buttonWidth /2) + leftMargin;
    let yPos = topMargin + (buttonHeight /2);
    for (let i = 0; i < buttons.length; i++)
    {
        buttons[i].setPosition(xPos, yPos);
        yPos += buttonHeight + 10;
        if (yPos > spaceHeight - (buttonHeight / 2) - topMargin)
        {
            yPos = topMargin + (buttonHeight / 2);
            xPos += buttonWidth + 10;
        }
    }
}

function positionRightSideButtons()
{
    let spaceWidth = this.cameras.main.width;
    let spaceHeight = this.cameras.main.height;
    let topMargin = 6;
    let rightMargin = 6;

    let buttons = [this.interactbutton,
        this.movebutton,
        this.deletebutton,
        this.editbutton,
        this.zoominbutton,
        this.zoomoutbutton,
        this.savebutton,
        this.loadbutton,
        this.removeallbutton];

    let buttonsPerColumn = Math.floor((spaceHeight - (topMargin * 2) - buttonHeight) / (buttonHeight + 10)) + 1;
    let numColumns = Math.ceil(buttons.length / buttonsPerColumn);
    let remainder = buttons.length - (buttonsPerColumn * (numColumns - 1));

    let xPos = spaceWidth - 6 - (buttonWidth / 2) - ((numColumns - 1) * (buttonWidth + 10));
    let yPos = topMargin + (buttonHeight /2);
    let firstColumn = true;
    for (let i = 0; i < buttons.length; i++)
    {
        buttons[i].setPosition(xPos, yPos);
        yPos += buttonHeight + 10;
        if ((firstColumn && i == (remainder - 1)) || (yPos > spaceHeight - (buttonHeight / 2) + topMargin))
        {
            firstColumn = false;
            yPos = topMargin + (buttonHeight /2);
            xPos += buttonWidth + 10;
        }
    }
}
