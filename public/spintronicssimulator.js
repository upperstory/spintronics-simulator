import { ToggleButton } from './toggle-button.js';
import { PartBase } from './parts/partbase.js';
import { PartManager } from './part-manager.js';
import { PopupLevelChooser } from './popup-level-chooser.js';
import { PopupConfirmDeleteAll } from "./popup-confirm-delete-all.js";
import { version } from "./constants.js";
import { tileSpacing } from "./constants.js";
import { isMobile } from "./constants.js";
import { isTouchMobile } from "./constants.js";
import GesturesPlugin from "./phaser3-rex-plugins/plugins/gestures-plugin.js";


console.log("ON LOAD -- isMobile: ", isMobile, " isTouchMobile: ", isTouchMobile);
console.log("ON LOAD -- userAgent: ", navigator.userAgent);
// var w = window.innerWidth;
// var h = window.innerHeight;
// var x = document.getElementsByTagName("body");
// x.innerHTML = "Browser width: " + w + ", height: " + h + ".";
// console.log(x.innerHTML);

let dpr = window.devicePixelRatio;
let width = window.innerWidth * dpr;
let height = window.innerHeight * dpr;
// console.log("ON LOAD -- innerWidth: ", innerWidth, ", innerHeight: ", innerHeight, ", dpr: ", dpr);

let mapWidth = 4000;
let mapHeight = 4000;
let buttonWidth = 45;
let buttonHeight = 45;

// let buttonWidth = 70;
// let buttonHeight = 70;
// let window_ratio = ( (window.innerHeight/12) * 2 );
// console.log("window ratio: ", window_ratio);
// let buttonHeight = ((window.innerHeight - window_ratio ) / 12);
// let buttonWidth = ((window.innerHeight - window_ratio ) / 12);
let buttonContainerHeight = (window.innerHeight-20) / 12;
let buttonContainerWidth = (window.innerHeight-20) / 12;
// console.log("ON LOAD -- button container height is: ", buttonContainerHeight);

if ( window.innerHeight > 768 ) {
    // mapWidth = 1500;
    // mapHeight = 1500;
    buttonWidth = buttonContainerHeight * .85;
    buttonHeight = buttonContainerHeight * .85;
    // console.log("ON LOAD - if inner height more than 800, button height: ", buttonHeight);
} else if ( window.innerHeight > 600 && window.innerHeight <= 768 ) {
    // buttonWidth = buttonContainerHeight * .8;
    // buttonHeight = buttonContainerHeight * .8;
    buttonWidth = 50;
    buttonHeight = 50;
    // console.log("ON LOAD - if inner height is between 600 and 800, button height: ", buttonHeight);
} else if ( window.innerHeight <= 600 ) {
    buttonWidth = 45;
    buttonHeight = 45;
    // console.log("ON LOAD - if inner height is less than 600, button height: ", buttonHeight);
}

let config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.RESIZE,
        width: width,
        height: height,
        min: { // this is necessary so that it's never 0 x 0, which throws errors.
            width: 100,
            height: 100
        }
    },
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
    dom: {
        createContainer: true
    },
    parent: 'phaserparent',
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    plugins: {
        scene: [
            {
                plugin: GesturesPlugin,
                key: 'rexGestures',
                mapping: 'rexGestures'
            }
        ]
    }
};

// This scene goes over the top of the main scene. It contains buttons and controls that stay in a fixed position.
let sceneconfigcontrols = {
    type: Phaser.AUTO,
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
        //parent: 'phaser-example',
        width: 400,
        height: 400,
        min: {
            width: 100,
            height: 100
        }
    },
    backgroundColor: 'rgba(0,0,0,0)',
    parent: 'phaserparent',
    scene: {
        //preload: preload2,
        //create: create,
        //update: update
    }
};

// This kicks everything off...
let game = new Phaser.Game(config);

let self;
let mouseImage;
let mouseImageOffset = {x: 0, y: 0};
const gridSpacing = 15;
let drawn = 0;
let partClickedForLevelSelect = {partIndex: -1, cw: false};
let firstPartChainIsConnectedGoingCW = '';

let partManager = null;
let chainDots = [];
let chainArrows = [];
let allPartsOnBoard = [];
let chosenLevel = -1;
let getLastSprocketBounds = '';
let getThisSprocketBounds = '';
let chosenlevelsprocketonnextpartisopen = false;

// We have to have this variable because of an apparent bug in Phaser that sends POINTER_OVER events to the scene first when objects are in a container in the scene.
let disablePointerOverEvent = false;
let popupLevelChooser = null;
// let popupConfirmDeleteAll = null;
let controlscene = null;
let dynamicPartsListForTouchDots = null;
let addThisPartAndLeveltoConnectionsGrid = {};
let sprocketsWithConnectionsGridArray = [];

function preload ()
{
    self = this;
    this.scale.on('resize', preloaderResize, this);

    this.load.setBaseURL();

    // Make the prepreloader invisible
    let prepreloaderdiv = document.getElementById('prepreloader-box');
    prepreloaderdiv.setAttribute('style', 'display: none');

    // Preloader
    let width = this.cameras.main.width;
    let height = this.cameras.main.height;

    this.progressBox = this.add.graphics();
    this.progressBar = this.add.graphics();

    this.progressBox.fillStyle(0x3a3a3c, 1);
    this.progressBox.fillRect((width*0.2), (height/2), width*0.6, 50);

    this.loadingText = this.make.text({
        x: width / 2,
        y: height / 2 - 20,
        text: 'Loading...',
        style: {
            font: '20px Roboto',
            fill: '#3a3a3c'
        }
    });
    this.loadingText.setOrigin(0.5, 0.5);

    this.assetText = this.make.text({
        x: width / 2,
        y: height / 2 + 70,
        text: '',
        style: {
            font: '20px Roboto',
            fill: '#3a3a3c'
        }
    });
    this.assetText.setOrigin(0.5, 0.5);

    // Start by creating event handlers for the file loading.
    this.load.on('progress', function (value) {
        let width = this.cameras.main.width;
        let height = this.cameras.main.height;


        this.progressBar.clear();
        this.progressBar.fillStyle(0xffffff, 0.8);
        this.progressBar.fillRect((width*0.2) + 10, (height / 2) + 10, ((width*0.6)-20) * value, 30);

        //this.percentText.setText(parseInt(value * 100) + '%');

    }.bind(this));

    this.load.on('fileprogress', function (file) {
        this.assetText.setText('Loading asset: ' + file.key);
    }.bind(this));

    this.load.on('complete', function () {
        this.progressBar.destroy();
        this.progressBox.destroy();
        this.loadingText.destroy();
        //this.percentText.destroy();
        this.assetText.destroy();
    }.bind(this));

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

    this.load.image('help-icon', 'Images/help-icon.png');
    this.load.image('interact-icon', 'Images/hand-icon.png');
    this.load.image('move-icon', 'Images/move-icon.png');
    this.load.image('delete-icon', 'Images/remove-icon.png');
    this.load.image('remove-all-icon', 'Images/trash-icon.png')
    this.load.image('zoom-in-icon', 'Images/zoom-in-icon.png');
    this.load.image('zoom-out-icon', 'Images/zoom-out-icon.png');
    this.load.image('link-icon', 'Images/link-icon.png');
    this.load.image('save-icon', 'Images/save-icon.png');
    this.load.image('load-icon', 'Images/open-icon.png');
    this.load.image('edit-icon', 'Images/edit-icon.png');
    this.load.image('full-screen-icon', 'Images/full-screen-icon.png');

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

    this.load.image('yes-btn', 'Images/yes-btn.png');
    this.load.image('popup-question-btn', 'Images/popup-question-btn.png');
}

function preloaderResize (gameSize, baseSize, displaySize, resolution)
{
    let width = this.cameras.main.width;
    let height = this.cameras.main.height;

    if (this.progressBox != null)
        this.progressBox.clear();
    if (this.progressBar != null)
        this.progressBar.clear();

    if (this.assetText != null)
        this.assetText.setPosition(width / 2, height / 2 + 70);
    if (this.loadingText != null)
        this.loadingText.setPosition(width / 2, height / 2 - 20);
    if (this.progressBox != null)
    {
        this.progressBox.fillStyle(0x3a3a3c, 1);
        this.progressBox.fillRect((width*0.2), (height/2), width*0.6, 50);
    }
}

function create ()
{

    // Now check the url to see if there are parameters.
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    // console.log("CREATE FUNCTION -- buttonContainerHeight: ", buttonContainerHeight, " buttonHeight: ", buttonHeight);
    // Determine if this is a view-only editor.
    this.viewOnly = false;
    if (urlParams.has('viewOnly')) {
        const viewOnly = urlParams.get('viewOnly');
        if (viewOnly === 'true')
            this.viewOnly = true;
    }

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

    // Kelly Test Pinch to Zoom for mobile //
    if ( isMobile || isTouchMobile ) {
        let currentZoom = self.cameras.main.zoom;
        let newZoom = currentZoom / 2;

        // Check to see if the image is too small to fill the screen.
        let screenWidth = self.cameras.main.width;
        let screenHeight = self.cameras.main.height;

        if (mapWidth * newZoom < screenWidth || mapHeight * newZoom < screenHeight) {
            newZoom = currentZoom;
        }
        self.cameras.main.setZoom(newZoom);
    }
    // End Kelly Test

    // First is the background grid
    drawBackgroundGrid.bind(this)();

    mouseImage = this.add.image(400, 400,'junction');
    mouseImage.setScale(0.5);
    mouseImage.setAlpha(0.4);
    mouseImage.setVisible(false);
    // Always on top
    mouseImage.setDepth(100);

    // Create the debug text box. Used especially for debugging on mobile.
    this.debugText = controlscene.add.text(10, 10, "Debug output", {
        font: '20px Roboto',
        fontSize: '50px',
        color: "rgb(20,20,20)",
        fontStyle: 'strong'
    });
    // Make visible or invisible to see debugging output.
    this.debugText.setVisible(false);

    this.titleText = controlscene.add.text(10, 10, "Spintronics Simulator v" + version, {
        font: '16px Roboto',
        fontSize: '50px',
        color: "rgb(20,20,20)",
        fontStyle: 'strong',
        align: 'right'
    });
    this.titleText.setVisible(false);

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

    let buttonX = (buttonContainerWidth/2) + 6;
    let buttonYoffset = (buttonContainerHeight/2) + 6;
    // let topMargin = 6;
    this.chainbutton = new ToggleButton(controlscene, 'chain', buttonX, buttonYoffset, buttonWidth, buttonHeight, 'button-default-background', 'button-hover-background', 'button-selected-background', 'chain-icon', onSwitchToggled, 'button-disabled-background');
    this.chainbutton.setButtonType('toggle');
    this.chainbutton.setTooltipString('Add chain loop', 'right');
    this.junctionbutton = new ToggleButton(controlscene, 'junction', buttonX, buttonYoffset+buttonContainerHeight, buttonWidth, buttonHeight, 'button-default-background', 'button-hover-background', 'button-selected-background', 'junction-icon', onSwitchToggled, 'button-disabled-background');
    this.junctionbutton.setButtonType('toggle');
    this.junctionbutton.setTooltipString('Junction', 'right');
    this.motorbutton = new ToggleButton(controlscene, 'motor', buttonX, buttonYoffset+buttonContainerHeight*2, buttonWidth, buttonHeight, 'button-default-background', 'button-hover-background', 'button-selected-background', 'motor-icon', onSwitchToggled, 'button-disabled-background');
    this.motorbutton.setButtonType('toggle');
    this.motorbutton.setTooltipString('Battery', 'right');
    this.resistorbutton = new ToggleButton(controlscene, 'resistor', buttonX, buttonYoffset+buttonContainerHeight*3, buttonWidth, buttonHeight, 'button-default-background', 'button-hover-background', 'button-selected-background', 'resistor-icon', onSwitchToggled, 'button-disabled-background');
    this.resistorbutton.setButtonType('toggle');
    this.resistorbutton.setTooltipString('Resistor', 'right');
    this.capacitorbutton = new ToggleButton(controlscene, 'capacitor', buttonX, buttonYoffset+buttonContainerHeight*4, buttonWidth, buttonHeight, 'button-default-background', 'button-hover-background', 'button-selected-background', 'capacitor-icon', onSwitchToggled, 'button-disabled-background');
    this.capacitorbutton.setButtonType('toggle');
    this.capacitorbutton.setTooltipString('Capacitor', 'right');
    this.inductorbutton = new ToggleButton(controlscene, 'inductor', buttonX, buttonYoffset+buttonContainerHeight*5, buttonWidth, buttonHeight, 'button-default-background', 'button-hover-background', 'button-selected-background', 'inductor-icon', onSwitchToggled, 'button-disabled-background');
    this.inductorbutton.setButtonType('toggle');
    this.inductorbutton.setTooltipString('Inductor', 'right');
    this.phonographbutton = new ToggleButton(controlscene, 'phonograph', buttonX, buttonYoffset+buttonContainerHeight*6, buttonWidth, buttonHeight, 'button-default-background', 'button-hover-background', 'button-selected-background', 'phonograph-icon', onSwitchToggled, 'button-disabled-background');
    this.phonographbutton.setButtonType('toggle');
    this.phonographbutton.setTooltipString('Ammeter', 'right');
    this.diodebutton = new ToggleButton(controlscene, 'diode', buttonX, buttonYoffset+buttonContainerHeight*7, buttonWidth, buttonHeight, 'button-default-background', 'button-hover-background', 'button-selected-background', 'diode-icon', onSwitchToggled, 'button-disabled-background');
    this.diodebutton.setButtonType('toggle');
    this.diodebutton.setTooltipString('Diode', 'right');
    this.buttonbutton = new ToggleButton(controlscene, 'button', buttonX, buttonYoffset+buttonContainerHeight*8, buttonWidth, buttonHeight, 'button-default-background', 'button-hover-background', 'button-selected-background', 'button-icon', onSwitchToggled, 'button-disabled-background');
    this.buttonbutton.setButtonType('toggle');
    this.buttonbutton.setTooltipString('Switch', 'right');
    this.transistorbutton = new ToggleButton(controlscene, 'transistor', buttonX, buttonYoffset+buttonContainerHeight*9, buttonWidth, buttonHeight, 'button-default-background', 'button-hover-background', 'button-selected-background', 'transistor-icon', onSwitchToggled, 'button-disabled-background');
    this.transistorbutton.setButtonType('toggle');
    this.transistorbutton.setTooltipString('Transistor', 'right');
    this.levelchangerbutton = new ToggleButton(controlscene, 'level-changer', buttonX, buttonYoffset+buttonContainerHeight*10, buttonWidth, buttonHeight, 'button-default-background', 'button-hover-background', 'button-selected-background', 'level-changer-icon', onSwitchToggled, 'button-disabled-background');
    this.levelchangerbutton.setButtonType('toggle');
    this.levelchangerbutton.setTooltipString('Level changer', 'right');
    this.tilebutton = new ToggleButton(controlscene, 'tile', buttonX, buttonYoffset+buttonContainerHeight*11, buttonWidth, buttonHeight, 'button-default-background', 'button-hover-background', 'button-selected-background', 'tile-icon', onSwitchToggled, 'button-disabled-background');
    this.tilebutton.setButtonType('toggle');
    this.tilebutton.setTooltipString('Tile', 'right');

    // Right side toolbar
    let spaceWidth = this.cameras.main.width;
    let rightSideToolbarPositionX = spaceWidth - 13 - buttonWidth / 2;

    this.helpbutton = new ToggleButton(controlscene, 'inform', rightSideToolbarPositionX, 35, buttonWidth, buttonHeight, 'button-default-background', 'button-hover-background', 'button-selected-background', 'help-icon', onHelpBtnClicked, 'button-disabled-background');
    this.helpbutton.setTooltipString('Help', 'left');

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

    this.linkbutton = new ToggleButton(controlscene, 'link', rightSideToolbarPositionX, 35+6*75, buttonWidth, buttonHeight, 'button-default-background', 'button-hover-background', 'button-selected-background', 'link-icon', onGenerateLinkClicked, 'button-disabled-background');
    this.linkbutton.setTooltipString('Copy circuit to clipboard', 'left');

    this.savebutton = new ToggleButton(controlscene, 'save', rightSideToolbarPositionX, 35+7*75, buttonWidth, buttonHeight, 'button-default-background', 'button-hover-background', 'button-selected-background', 'save-icon', onSaveClicked, 'button-disabled-background');
    this.savebutton.setTooltipString('Save circuit', 'left');

    this.loadbutton = new ToggleButton(controlscene, 'load', rightSideToolbarPositionX, 35+8*75, buttonWidth, buttonHeight, 'button-default-background', 'button-hover-background', 'button-selected-background', 'load-icon', onLoadClicked, 'button-disabled-background');
    this.loadbutton.setTooltipString('Load circuit', 'left');

    this.fullscreenbutton = new ToggleButton(controlscene, 'full-editor', rightSideToolbarPositionX, 35+9*75, buttonWidth, buttonHeight, 'button-default-background', 'button-hover-background', 'button-selected-background', 'full-screen-icon', onFullEditorClicked, 'button-disabled-background');
    this.fullscreenbutton.setTooltipString('Open in full simulator', 'left');

    if (this.viewOnly)
    {
        this.chainbutton.setVisible(false);
        this.junctionbutton.setVisible(false);
        this.motorbutton.setVisible(false);
        this.resistorbutton.setVisible(false);
        this.capacitorbutton.setVisible(false);
        this.inductorbutton.setVisible(false);
        this.phonographbutton.setVisible(false);
        this.diodebutton.setVisible(false);
        this.buttonbutton.setVisible(false);
        this.transistorbutton.setVisible(false);
        this.levelchangerbutton.setVisible(false);
        this.tilebutton.setVisible(false);

        this.helpbutton.setVisible(false);
        this.interactbutton.setVisible(false);
        this.movebutton.setVisible(false);
        this.deletebutton.setVisible(false);
        this.editbutton.setVisible(false);
        this.removeallbutton.setVisible(false);
        this.linkbutton.setVisible(false);
        this.savebutton.setVisible(false);
        this.loadbutton.setVisible(false);
    }
    else
    {
        this.fullscreenbutton.setVisible(false);
    }

    positionLeftSideButtons.bind(this)();
    positionRightSideButtons.bind(this)();

    this.input.mouse.capture = true;

    this.input.on('pointermove', (pointer) => onPointerMove.bind(this)(pointer));
    this.input.on('pointerdown', (pointer, currentlyOver) => onPointerDown.bind(this)(pointer, currentlyOver));
    this.input.on('wheel', (pointer, gameObjects, deltaX, deltaY, deltaZ) => onMouseWheel.bind(this)(pointer, gameObjects, deltaX, deltaY, deltaZ));

    this.dragZone.setInteractive({
       draggable: true
    });
    this.dragZone.on('dragstart', (pointer, dragX, dragY) => onDragStart(pointer, dragX, dragY));
    this.dragZone.on('dragend', (pointer, dragX, dragY) => onDragEnd(pointer, dragX, dragY));
    this.dragZone.on('drag', (pointer, dragX, dragY) => onDrag(pointer, dragX, dragY));

    this.input.on('wheel', (pointer, currentlyOver, deltaX, deltaY, deltaZ, event) => onPointerWheel.bind(this)(pointer, currentlyOver, deltaX, deltaY, deltaZ, event));

    this.input.keyboard.on('keydown-ESC', (event) => escapeKeyDown.bind(this)(event))

    this.useZoomExtents = false;
    // console.log("In CREATE function, on resize pass in resize: ", resize);
    this.scale.on('resize', resize, this);

    // Kelly Test Pinch on Touch Screen //
    this.dragScale = this.rexGestures.add.pinch();
    let lastPinchCenterPoint = {x: 0, y: 0};

    this.dragScale
        .on('drag1', function (pinch) {
            //if (this.interactbutton.getToggleState() || partManager.toolMode === 'move' || self.chainbutton.getToggleState() || self.deletebutton.getToggleState() || self.editbutton.getToggleState()) {
                // Get the starting point for the drag.
                let camera = this.cameras.main;
                let startingDragCenter = camera.midPoint;
                let desiredCenterPosition = {x: 0, y: 0};
                desiredCenterPosition.x = startingDragCenter.x - (pinch.drag1Vector.x / this.cameras.main.zoom);
                desiredCenterPosition.y = startingDragCenter.y - (pinch.drag1Vector.y / this.cameras.main.zoom);

                camera.centerOn(desiredCenterPosition.x, desiredCenterPosition.y);

                // Stop resizing window to the zoom extents.
                this.useZoomExtents = false;
                //DEBUG:
                /*this.debugText.setText("Camera scroll x: " + camera.scrollX.toString() +
                    "\nCamera scroll y: " + camera.scrollY.toString());
                */
            //}


            // console.log("in dragscale on drag1.");
            // var drag1Vector = dragScale.drag1Vector;
            // camera.scrollX -= drag1Vector.x / camera.zoom;
            // camera.scrollY -= drag1Vector.y / camera.zoom;
         }, this)
        .on('pinchstart', function(pinch) {
            lastPinchCenterPoint = {
                x: (pinch.pointers[0].x + pinch.pointers[1].x) / 2,
                y: (pinch.pointers[0].y + pinch.pointers[1].y) / 2
            };
        }, this)
        .on('pinchend', function(pinch) {

        }, this)
        .on('pinch', function (pinch) {
            // console.log("In dragscale on pinch. Current parts: ", current_parts.parts);
            let camera = this.cameras.main;

            let zoomFactor = pinch.scaleFactor;
            // Find the center between the two pinch points - this is the point we want to zoom in and out of.
            // In screen units, not world units.
            let pinchCenterPoint = {
                x: (pinch.pointers[0].x + pinch.pointers[1].x) / 2,
                y: (pinch.pointers[0].y + pinch.pointers[1].y) / 2
            };
            let pinchCenterWorldPoint = camera.getWorldPoint(pinchCenterPoint.x, pinchCenterPoint.y);

            //this.backgroundGrid.fillStyle(0xFF0000, 0.35);
            //this.backgroundGrid.fillEllipse(pinchCenterWorldPoint.x, pinchCenterWorldPoint.y, 2, 2);

            let worldCenterPoint = camera.midPoint;

            //this.backgroundGrid.fillStyle(0x00FF00, 0.35);
            //this.backgroundGrid.fillEllipse(worldCenterPoint.x, worldCenterPoint.y, 2, 2);

            let distanceFromCenter = {
                x: pinchCenterWorldPoint.x - worldCenterPoint.x,
                y: pinchCenterWorldPoint.y - worldCenterPoint.y
            };

            let newDistanceFromCenter = {
                x: distanceFromCenter.x * zoomFactor,
                y: distanceFromCenter.y * zoomFactor
            };

            let currentZoom = camera.zoom;
            let newZoom = camera.zoom * zoomFactor;

            // Check to see if the image is too small to fill the screen.
            let screenWidth = camera.width;
            let screenHeight = camera.height;

            if (mapWidth * newZoom < screenWidth || mapHeight * newZoom < screenHeight) {
                newZoom = currentZoom;
            }

            // Limit zooming in too far
            if (newZoom > 10)
                newZoom = 10;

            camera.setZoom(newZoom);
            camera.centerOn(worldCenterPoint.x + (newDistanceFromCenter.x - distanceFromCenter.x) + (lastPinchCenterPoint.x - pinchCenterPoint.x), worldCenterPoint.y + (newDistanceFromCenter.y - distanceFromCenter.y) + (lastPinchCenterPoint.y - pinchCenterPoint.y));

            lastPinchCenterPoint.x = pinchCenterPoint.x;
            lastPinchCenterPoint.y = pinchCenterPoint.y;

            //DEBUG:
            /*this.debugText.setText("dragScale: " + dragScale.scaleFactor.toString() +
                "\nCamera zoom: " + camera.zoom.toString() +
                "\nWorld center point x: " + worldCenterPoint.x.toString() +
                "\nWorld center point y: " + worldCenterPoint.y.toString() +
                "\nWorld pinch point x: " + pinchCenterWorldPoint.x.toString() +
                "\nWorld pinch point y: " + pinchCenterWorldPoint.y.toString() +
                "\nPinch point x: " + pinchCenterPoint.x.toString() +
                "\nPinch point y: " + pinchCenterPoint.y.toString() +
                "\nShift x: " + (newDistanceFromCenter.x - distanceFromCenter.x).toString() +
                "\nShift y: " + (newDistanceFromCenter.y - distanceFromCenter.y).toString() +
                "\nCamera center x: " + camera.centerX.toString() +
                "\nCamera center y: " + camera.centerY.toString() +
                "\nCamera scroll x: " + camera.scrollX.toString() +
                "\nCamera scroll y: " + camera.scrollY.toString());
            */

            // Stop resizing window to the zoom extents.
            self.useZoomExtents = false;
        }, this)




    //let worldCenter = this.cameras.main.getWorldPoint(this.cameras.main.centerX, this.cameras.main.centerY);
    //let topleft = this.cameras.main.getWorldPoint(0,0);
    //let bottomright = this.cameras.main.getWorldPoint(this.cameras.main.width,this.cameras.main.height);
    //this.sceneDimensions = {centerX: worldCenter.x, centerY: worldCenter.y, width: bottomright.x - topleft.x, height: bottomright.y - topleft.y}

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
    // console.log("on load partManager.parts: ", partManager.parts);

    // Set the Interact button to ON so you can mess with the parts.
    onSwitchToggled('interact', true);

    this.linkID = null;
    if (urlParams.has('linkID')) {
        this.linkID = urlParams.get('linkID');
        loadCircuitFromDatabase(this.linkID);
    }
}

function onFullEditorClicked (name, newToggleState)
{
    // Needs to open a new tab with the already loaded file. No need to save the file - it was loaded in the minimal
    // editor from a link to begin with.

    if (self.linkID != null && self.linkID > 0)
        window.open("https://simulator.spintronics.com?linkID=" + self.linkID, '_blank');
    else
        window.open("https://simulator.spintronics.com", '_blank');
}

function fallbackCopyTextToClipboard(text) {
    var textArea = document.createElement("textarea");
    textArea.value = text;

    // Avoid scrolling to bottom
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        var successful = document.execCommand('copy');
        var msg = successful ? 'successful' : 'unsuccessful';
        console.log('Fallback: Copying text command was ' + msg);
    } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
    }

    document.body.removeChild(textArea);
}
function copyTextToClipboard(text) {
    if (!navigator.clipboard) {
        fallbackCopyTextToClipboard(text);
        return;
    }
    navigator.clipboard.writeText(text).then(function() {
        console.log('Async: Copying to clipboard was successful!');
    }, function(err) {
        console.error('Async: Could not copy text: ', err);
    });
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

//var startingDragCenter = {x: 0, y: 0};
//var startingPointer = {x: 0, y: 0};

// Used to detect when dragging the entire workspace
function onDragStart(pointer, dragX, dragY)
{
    // The rexGestures pinch gesture doesn't take into account objects
    // above it that take priority for dragging. This enables pinch
    // and drag when a regular drag is started.
    self.dragScale.setEnable(true);
    // console.log("In onDragStart function, passed in pointer: ", pointer);
    /*if (self.interactbutton.getToggleState() || partManager.toolMode === 'move' || self.chainbutton.getToggleState() || self.deletebutton.getToggleState() || self.editbutton.getToggleState()) {
        // Get the starting point for the drag.
        startingDragCenter = self.cameras.main.getWorldPoint(self.cameras.main.centerX, self.cameras.main.centerY);
        startingPointer.x = pointer.x;
        startingPointer.y = pointer.y;

        // Stop resizing window to the zoom extents.
        self.useZoomExtents = false;
    }*/

}

function onDrag(pointer, dragX, dragY)
{
    // console.log("In onDrag function, passed in pointer: ", pointer);
    /*if (self.interactbutton.getToggleState() || partManager.toolMode === 'move' || self.chainbutton.getToggleState() || self.deletebutton.getToggleState() || self.editbutton.getToggleState()) {
        let desiredCenterPosition = {x: 0, y: 0};
        desiredCenterPosition.x = startingDragCenter.x - (pointer.x - startingPointer.x) / self.cameras.main.zoom;
        desiredCenterPosition.y = startingDragCenter.y - (pointer.y - startingPointer.y) / self.cameras.main.zoom;
        self.cameras.main.centerOn(desiredCenterPosition.x, desiredCenterPosition.y);
    }*/
}

function onDragEnd(pointer, dragX, dragY)
{
    // console.log("In onDragEnd function, passed in pointer: ", pointer);
    if (self.interactbutton.getToggleState() || partManager.toolMode === 'move' || self.chainbutton.getToggleState() || self.deletebutton.getToggleState() || self.editbutton.getToggleState()) {
        self.input.setDefaultCursor('default');
    }
    self.dragScale.setEnable(false);
}

async function loadCircuitFromDatabase (linkID)
{
    let code = null;
    for (let i = 0; i < 5; i++)
    {
        code = await getCode();
        if (code != null)
            break;
    }

    if (code != null && code !== '') {
        let result = await fetchCircuit(code, linkID);
        if (result === "Circuit is loading.") {
            for (let tries = 1; tries <= 3; tries++) {
                result = await getCircuit(code, linkID);
                if (result['status'] === 'success')
                    break;
            }

            if (result['status'] === 'success')
            {
                // We've got our circuit, now load it.
                //console.log(JSON.parse(result['circuitJSON']));
                loadJSONCircuit(JSON.parse(result['circuitJSON']['circuitJSON']));
            }
        }
        else {
            // TODO: Handle this error.
        }
    }
}

async function fetchCircuit(code, linkID)
{
    const controller = new AbortController();

    // Create an abort button
    //document.querySelector("button.cancel").addEventListener("click", () => controller.abort());

    return fetchTimeout("/loadcircuit", 2000, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        signal: controller.signal,
        body: JSON.stringify({code: code, linkID: linkID})
    })
        .then(function(response) {
            if(response.ok) {
                console.log('Server received loadcircuit POST.');
                return response.json();
            }
            throw new Error('Server did not receive loadcircuit POST.');
            // ERROR here!
        })
        .then(function(data){
            return data['result'];
        })
        .catch(error => {
            if (error.name === "AbortError") {
                console.log("Fetch aborted due to timeout or user abort.");// fetch aborted either due to timeout or due to user clicking the cancel button
            } else {
                console.log("Fetch failed due to network error.");// network error or json parsing error
            }
        });
}

async function getCircuit(code, linkID)
{
    const controller = new AbortController();

    // Create an abort button
    //document.querySelector("button.cancel").addEventListener("click", () => controller.abort());

    return fetchTimeout("/getcircuit", 3000, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        signal: controller.signal,
        body: JSON.stringify({code: code, linkID: linkID})
    })
        .then(function(response) {
            if(response.ok) {
                console.log('Server provided circuit.');
                return response.json();
            }
            throw new Error('Server did not provide circuit.');
            // ERROR here!
        })
        .then(function(data){
            return data;
        })
        .catch(error => {
            if (error.name === "AbortError") {
                console.log("Fetch aborted due to timeout or user abort.");// fetch aborted either due to timeout or due to user clicking the cancel button
            } else {
                console.log("Fetch failed due to network error.");// network error or json parsing error
            }

            return {status: 'failed'};
        });
}

async function onGenerateLinkClicked (name, newToggleState)
{
    // Save the circuit to the online database, then give a link to it.

    // First, make a JSON of it.
    let jsonData = createCircuitJSON();

    if (partManager.parts.length === 0)
    {
        // There are no parts in this circuit!
        let graybackground = controlscene.add.dom().createElement('div', 'background-color: rgba(0, 0, 0, 0.2); position: absolute; left: ' + controlscene.cameras.main.width / 2 + 'px; top: ' + controlscene.cameras.main.height / 2 + 'px; width: ' + controlscene.cameras.main.width + 'px; height: ' + controlscene.cameras.main.height + 'px', '');

        let form = `
                    <div style="font-family: 'Roboto'; font-size: 16px; position: absolute; transform: translate(-50%, -50%); box-sizing: border-box; background-color: rgba(255, 255, 255, 1); border-color: black; border-width: 1px; border-style: solid; border-radius: 10px; width: 300px; padding-top: 10px; padding-bottom: 10px; padding-left: 10px; padding-right: 10px;" >
                        <p style="margin-top: 0px; margin-bottom: 10px; font-family: 'Roboto'"><b>Cannot create link:</b></p>
                        <p style="margin-top: 0px; margin-bottom: 10px; font-family: 'Roboto'">There are no parts in your circuit!</p>
                        <div style="width: 100%; text-align: right;">
                            <input style="box-sizing: border-box; display: inline-block; font-family: 'Roboto'; font-size: 16px;" type="button" name="doneButton" value="OK">
                        </div>
                    </div>
                   `;
        let element = controlscene.add.dom().createFromHTML(form);
        element.setPosition(controlscene.cameras.main.width / 2, controlscene.cameras.main.height / 2);

        element.addListener('click');
        element.on('click', (event) => {
            if (event.target.name === 'doneButton') {
                element.destroy();
                graybackground.destroy();
            }

            event.stopPropagation();
        });

        // Stop anything underneath the background from getting clicks.
        graybackground.addListener('click');
        graybackground.on('click', (event) => {
            element.destroy();
            graybackground.destroy();
        });
        graybackground.setInteractive();
        graybackground.on('pointerdown', (pointer, localx, localy, event) => {
            event.stopPropagation();
        });
        graybackground.on('pointerup', (pointer, localx, localy, event) => {
            event.stopPropagation();
        });
        graybackground.on('pointerover', (pointer, localx, localy, event) => {
            event.stopPropagation();
        });
    }
    else
    {

        let code = null;
        for (let i = 0; i < 5; i++)
        {
            code = await getCode();
            if (code != null)
                break;
        }

        if (code != null && code !== '') {
            let result = await submitCircuit(code, jsonData);
            console.log(result);
            if (result === "Circuit accepted.") {

                for (let tries = 1; tries < 5; tries++) {
                    result = await getLink(code);
                    if (result['status'] === 'success')
                        break;
                }

                if (result['status'] === 'success') {
                    // We got our link.
                    // Show text box with button to copy to clipboard. Text shows value of: "https://simulator.spintronics.comlinkID=" + result['link'];
                    let linkText = "https://simulator.spintronics.com?linkID=" + result['link'];
                    let graybackground = controlscene.add.dom().createElement('div', 'background-color: rgba(0, 0, 0, 0.2); position: absolute; left: ' + controlscene.cameras.main.width / 2 + 'px; top: ' + controlscene.cameras.main.height / 2 + 'px; width: ' + controlscene.cameras.main.width + 'px; height: ' + controlscene.cameras.main.height + 'px', '');

                    let form = `
                        <div style="font-family: 'Roboto'; font-size: 16px; position: absolute; transform: translate(-50%, -50%); box-sizing: border-box; background-color: rgba(255, 255, 255, 1); border-color: black; border-width: 1px; border-style: solid; border-radius: 10px; width: 300px; padding-top: 10px; padding-bottom: 10px; padding-left: 10px; padding-right: 10px;" >
                            <p style="margin-top: 0px; margin-bottom: 10px; font-family: 'Roboto'"><b>Link created successfully!</b></p>
                            <p style="margin-top: 0px; margin-bottom: 10px; font-family: 'Roboto'">Copy the following link and paste it into a browser to load your circuit:</p>
                            <div style="width:100%; display:flex">
                                <input style="flex: 2; box-sizing: border-box; margin-bottom: 10px; font-family: 'Roboto'; font-size: 16px" type="text" name="linkField" placeholder="" value="" disabled>
                            </div>
                            <div style="width: 100%; text-align: right;">
                                <input style="box-sizing: border-box; display: inline-block; font-family: 'Roboto'; font-size: 16px;" type="button" name="copyButton" value="Copy">
                                <input style="box-sizing: border-box; display: inline-block; font-family: 'Roboto'; font-size: 16px;" type="button" name="doneButton" value="Done">
                            </div>
                        </div>
                       `;
                    let element = controlscene.add.dom().createFromHTML(form);
                    element.setPosition(controlscene.cameras.main.width / 2, controlscene.cameras.main.height / 2);

                    let linkInput = element.getChildByName('linkField');
                    linkInput.value = linkText;

                    //let doneButton = document.getElementsByName('doneButton');
                    element.addListener('click');
                    element.on('click', (event) => {
                        if (event.target.name === 'doneButton') {
                            element.destroy();
                            graybackground.destroy();
                        }
                        if (event.target.name === 'copyButton') {
                            copyTextToClipboard(linkInput.value);
                        }
                        event.stopPropagation();
                    });

                    // Stop anything underneath the background from getting clicks.
                    graybackground.addListener('click');
                    graybackground.on('click', (event) => {
                        element.destroy();
                        graybackground.destroy();
                    });
                    graybackground.setInteractive();
                    graybackground.on('pointerdown', (pointer, localx, localy, event) => {
                        event.stopPropagation();
                    });
                    graybackground.on('pointerup', (pointer, localx, localy, event) => {
                        event.stopPropagation();
                    });
                    graybackground.on('pointerover', (pointer, localx, localy, event) => {
                        event.stopPropagation();
                    });
                }

            } else {
                // Not sure what's wrong, but we can't save the circuit.
                let graybackground = controlscene.add.dom().createElement('div', 'background-color: rgba(0, 0, 0, 0.2); position: absolute; left: ' + controlscene.cameras.main.width / 2 + 'px; top: ' + controlscene.cameras.main.height / 2 + 'px; width: ' + controlscene.cameras.main.width + 'px; height: ' + controlscene.cameras.main.height + 'px', '');

                let form = `
                        <div style="font-family: 'Roboto'; font-size: 16px; position: absolute; transform: translate(-50%, -50%); box-sizing: border-box; background-color: rgba(255, 255, 255, 1); border-color: black; border-width: 1px; border-style: solid; border-radius: 10px; width: 300px; padding-top: 10px; padding-bottom: 10px; padding-left: 10px; padding-right: 10px;" >
                            <p style="margin-top: 0px; margin-bottom: 10px; font-family: 'Roboto'"><b>Error creating link:</b></p>
                            <p style="margin-top: 0px; margin-bottom: 10px; font-family: 'Roboto'">Unfortunately, a link could not be created. Please contact hello@upperstory.com so we can fix the problem.</p>
                            <div style="width: 100%; text-align: right;">
                                <input style="box-sizing: border-box; display: inline-block; font-family: 'Roboto'; font-size: 16px;" type="button" name="doneButton" value="OK">
                            </div>
                        </div>
                       `;
                let element = controlscene.add.dom().createFromHTML(form);
                element.setPosition(controlscene.cameras.main.width / 2, controlscene.cameras.main.height / 2);

                element.addListener('click');
                element.on('click', (event) => {
                    if (event.target.name === 'doneButton') {
                        element.destroy();
                        graybackground.destroy();
                    }

                    event.stopPropagation();
                });

                // Stop anything underneath the background from getting clicks.
                graybackground.addListener('click');
                graybackground.on('click', (event) => {
                    element.destroy();
                    graybackground.destroy();
                });
                graybackground.setInteractive();
                graybackground.on('pointerdown', (pointer, localx, localy, event) => {
                    event.stopPropagation();
                });
                graybackground.on('pointerup', (pointer, localx, localy, event) => {
                    event.stopPropagation();
                });
                graybackground.on('pointerover', (pointer, localx, localy, event) => {
                    event.stopPropagation();
                });
            }
        }
    }
}

const fetchTimeout = (url, ms, { signal, ...options } = {}) => {
    const controller = new AbortController();
    const promise = fetch(url, { signal: controller.signal, ...options });
    if (signal)
        signal.addEventListener("abort", () => controller.abort());
    const timeout = setTimeout(() => controller.abort(), ms);
    return promise.finally(() => clearTimeout(timeout));
};

async function getCode()
{
    const controller = new AbortController();

    // Create an abort button
    //document.querySelector("button.cancel").addEventListener("click", () => controller.abort());

    return fetchTimeout("/getcode", 2000, {
    //return fetchTimeout("https://spintronics-simulator.herokuapp.com/getcode", 2000, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            signal: controller.signal
        })
        .then(function(response) {
            if(response.ok) {
                console.log('Server responded to request for code.');
                return response.json();
            }
            throw new Error('Request failed.');
            // ERROR here!
        })
        .then(function(data){
            let code = data['code'];
            return code;
        })
        .catch(error => {
            if (error.name === "AbortError") {
                console.log("Fetch aborted due to timeout or user abort.");// fetch aborted either due to timeout or due to user clicking the cancel button
            } else {
                console.log("Fetch failed due to network error.");// network error or json parsing error
            }
            return null;
        });
}

async function submitCircuit(code, circuitToSave)
{
    const controller = new AbortController();

    // Create an abort button
    //document.querySelector("button.cancel").addEventListener("click", () => controller.abort());

    return fetchTimeout("/savecircuit", 2000, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        signal: controller.signal,
        body: JSON.stringify({code: code, circuit: circuitToSave})
    })
        .then(function(response) {
            if(response.ok) {
                console.log('Server accepted circuit.');
                return response.json();
            }
            throw new Error('Server did not accept circuit.');
            // ERROR here!
        })
        .then(function(data){
            return data['result'];
        })
        .catch(error => {
            if (error.name === "AbortError") {
                console.log("Fetch aborted due to timeout or user abort.");// fetch aborted either due to timeout or due to user clicking the cancel button
            } else {
                console.log("Fetch failed due to network error.");// network error or json parsing error
            }
        });
}

async function getLink(code)
{
    const controller = new AbortController();

    // Create an abort button
    //document.querySelector("button.cancel").addEventListener("click", () => controller.abort());

    return fetchTimeout("/getlink", 500, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        signal: controller.signal,
        body: JSON.stringify({code: code})
    })
        .then(function(response) {
            if(response.ok) {
                console.log('Server provided link.');
                return response.json();
            }
            throw new Error('Server did not provide link.');
            // ERROR here!
        })
        .then(function(data){
            return data;
        })
        .catch(error => {
            if (error.name === "AbortError") {
                console.log("Fetch aborted due to timeout or user abort.");// fetch aborted either due to timeout or due to user clicking the cancel button
            } else {
                console.log("Fetch failed due to network error.");// network error or json parsing error
            }
        });
}

function createCircuitJSON ()
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

    // Also save the view dimensions - we'll try and match them when we reload the circuit.
    let topleft = self.cameras.main.getWorldPoint(0,0);
    let bottomright = self.cameras.main.getWorldPoint(self.cameras.main.width,self.cameras.main.height);
    saveObject.viewDimensions = {width: bottomright.x - topleft.x, height: bottomright.y - topleft.y};

    // Save each of the parts
    saveObject.parts = partManager.serializeParts();

    // Save each of the chains
    saveObject.chains = partManager.serializeChains();

    // Step 2: Create a JSON string of the object we want to save.
    let jsonData = JSON.stringify(saveObject);

    return jsonData;
}

function onSaveClicked (name, newToggleState)
{
    // Save the circuit to file

    // First, make the JSON of it.
    let jsonData = createCircuitJSON();

    // Next, put the string in a file and download it.
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

function loadJSONCircuit(jsonCircuit)
{
    console.log("Loading file, version: " + jsonCircuit.version);

    // First, remove everything from the map.
    // Remove all the chains.
    partManager.deleteAllChains();

    // Remove all the parts.
    partManager.deleteAllParts();

    // Now add in all the parts
    for (let i = 0; i < jsonCircuit.parts.length; i++)
    {
        let partToAdd = jsonCircuit.parts[i];
        if (partToAdd.hasOwnProperty("value")) {
            partManager.addPart(partToAdd.type, partToAdd.x, partToAdd.y, partToAdd.value);
        } else {
            partManager.addPart(partToAdd.type, partToAdd.x, partToAdd.y);
        }
    }

    // Now add in all the chains
    for (let i = 0; i < jsonCircuit.chains.length; i++)
    {
        let chainToAdd = jsonCircuit.chains[i];
        partManager.addChain(chainToAdd.connections);
    }

    // Update all the tile connectors
    partManager.updateTileConnectors();

    // Now set the view area (using what's in the json circuit)
    /*if ('viewDimensions' in jsonCircuit)
    {
        self.cameras.main.centerOn(jsonCircuit.centerPoint.x, jsonCircuit.centerPoint.y);
        // Get the current view dimensions
        let topleft = self.cameras.main.getWorldPoint(0,0);
        let bottomright = self.cameras.main.getWorldPoint(self.cameras.main.width,self.cameras.main.height);
        let currentViewDimensions = {width: bottomright.x - topleft.x, height: bottomright.y - topleft.y};

        // Get aspect ratio of each:
        let currentAspectRatio = currentViewDimensions.width / currentViewDimensions.height;
        let jsonAspectRatio = jsonCircuit.viewDimensions.width / jsonCircuit.viewDimensions.height;

        let neededZoom = 1;
        if (currentAspectRatio >= jsonAspectRatio)
        {
            // Our current width is greater than in the json. We're going to have to match height to get it to fit correctly.
            neededZoom = (currentViewDimensions.height / jsonCircuit.viewDimensions.height);// * jsonCircuit.zoom;
        }
        else
        {
            // Our current height is greater than in the json. We're going to have to match width to get it to fit correctly.
            neededZoom = (currentViewDimensions.width / jsonCircuit.viewDimensions.width);// * jsonCircuit.zoom;
        }

        self.cameras.main.setZoom(neededZoom * self.cameras.main.zoom);
    }
    else {
        // We don't have a viewDimensions in this file, so we'll just set the zoom and center to the same positions.
        self.cameras.main.setZoom(jsonCircuit.zoom);
        self.cameras.main.centerOn(jsonCircuit.centerPoint.x, jsonCircuit.centerPoint.y);
    }*/

    // Now set the view area (using zoom extents)
    let zoomExtents = getZoomExtents();
    // Find the center of the extents;
    let extentsCenter = {x: (zoomExtents.right + zoomExtents.left) / 2, y: (zoomExtents.top + zoomExtents.bottom) / 2};
    let extentsDimensions = {width: zoomExtents.right - zoomExtents.left, height: zoomExtents.bottom - zoomExtents.top};
    self.cameras.main.centerOn(extentsCenter.x, extentsCenter.y);

    // Get the current view dimensions
    let topleft = self.cameras.main.getWorldPoint(0,0);
    let bottomright = self.cameras.main.getWorldPoint(self.cameras.main.width,self.cameras.main.height);
    let currentViewDimensions = {width: bottomright.x - topleft.x, height: bottomright.y - topleft.y};

    // Get aspect ratio of each:
    let currentAspectRatio = currentViewDimensions.width / currentViewDimensions.height;
    let extentsAspectRatio = extentsDimensions.width / extentsDimensions.height;

    let neededZoom = 1;
    if (currentAspectRatio >= extentsAspectRatio)
    {
        // Our current width is greater than in the json. We're going to have to match height to get it to fit correctly.
        neededZoom = (currentViewDimensions.height / extentsDimensions.height);
    }
    else
    {
        // Our current height is greater than in the json. We're going to have to match width to get it to fit correctly.
        neededZoom = (currentViewDimensions.width / extentsDimensions.width);
    }

    self.cameras.main.setZoom(neededZoom * self.cameras.main.zoom * 0.9);

    self.useZoomExtents = true;
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

            loadJSONCircuit(result);
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
    let newZoom = currentZoom * 1.1;
    if (newZoom > 10)
        newZoom = 10;

    self.cameras.main.setZoom(newZoom);
}

function zoomOut()
{
    let currentZoom = self.cameras.main.zoom;
    let newZoom = currentZoom / 1.1;

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

// Kelly added button and function for an info/instructions screen overlay
function onHelpBtnClicked(name, newToggleState) {

    window.open("https://www.upperstory.com/spintronics/simulator", '_blank');
    /*let graybackground = controlscene.add.dom().createElement('div', 'background-color: rgba(0, 0, 0, 0.2); position: absolute; left: ' + controlscene.cameras.main.width / 2 + 'px; top: ' + controlscene.cameras.main.height / 2 + 'px; width: ' + controlscene.cameras.main.width + 'px; height: ' + controlscene.cameras.main.height + 'px', '');
    let form = `
            <div style="font-family: 'Roboto', Arial, sans-serif; font-size: 14px; position: absolute; transform: translate(-50%, -50%); box-sizing: border-box; background-color: rgba(255, 255, 255, 1); border-color: black; border-width: 1px; border-style: solid; border-radius: 10px; width: 80vw; padding: 20px; margin: 20px;" >
                <h3 style="margin: 0 auto 10px auto; font-family: 'Roboto', Arial, sans-serif;">Simulator Info and Tips</h3>
                <div style="width: 100%; text-align: left;">
                    <p> Instructions on how to play will go in this box. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam nibh magna, faucibus non velit ac, varius gravida felis. Maecenas neque metus, condimentum at mi in, vehicula interdum nulla. Duis pellentesque at tortor lobortis mattis. Aliquam sollicitudin lorem quis turpis ultricies, id placerat ex faucibus. Maecenas porta arcu nisl, et sollicitudin quam auctor id. Cras eget vestibulum eros. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.</p>
                    <p>Duis vitae nisl posuere, egestas sapien ac, pulvinar sapien. Integer ullamcorper accumsan dui, nec malesuada nulla molestie sit amet. Suspendisse sed urna non sem lacinia lobortis vel eu odio. Integer maximus consequat leo et scelerisque. Morbi vel est et mi gravida sodales. Pellentesque feugiat libero id dui luctus, et rutrum elit porta. </p>
                    <p>Nulla ante dolor, pretium id ultricies non, efficitur venenatis tortor. Nam mattis sed quam non ultricies. Sed fringilla elit faucibus, fermentum nisi vitae, porttitor sapien. Fusce aliquam maximus felis in vulputate. Fusce molestie elementum purus eu lobortis. Phasellus elementum ultricies enim at volutpat. Vivamus imperdiet quam neque, at efficitur odio imperdiet id.</p>
                </div>
            
                <div style="width: 100%; text-align: center;">
                    <div id="okcloseinfo" style="box-sizing: border-box; display: inline-block; font-family: 'Roboto', Arial, sans-serif; font-size: 16px; border: 1px solid darkgray; border-radius: 5px; cursor: pointer; padding: 5px 10px;">Ok</div>
                    </div>
                </div>
            </div>
        `;
    let element = controlscene.add.dom().createFromHTML(form);
    element.setPosition(controlscene.cameras.main.width / 2, controlscene.cameras.main.height / 2);
    element.addListener('click');
    element.on('click', (event) => {
        if (event.target.id === 'okcloseinfo') {
            element.destroy();
            graybackground.destroy();
        }
        event.stopPropagation();
    });

    // Stop anything underneath the background from getting clicks.
    graybackground.addListener('click');
    graybackground.on('click', (event) => {
        element.destroy();
        graybackground.destroy();
        event.stopPropagation();
    });
    graybackground.setInteractive();
    graybackground.on('pointerdown', (pointer, localx, localy, event) => {
        event.stopPropagation();
    });
    graybackground.on('pointerup', (pointer, localx, localy, event) => {
        event.stopPropagation();
    });
    graybackground.on('pointerover', (pointer, localx, localy, event) => {
        event.stopPropagation();
    });*/
}

function onRemoveAllClicked(name, newToggleState) {
    // toggle off other tools that may be on
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

    //    Kelly new popup with HTML overlay to confirm remove all
    let graybackground = controlscene.add.dom().createElement('div', 'background-color: rgba(0, 0, 0, 0.2); position: absolute; left: ' + controlscene.cameras.main.width / 2 + 'px; top: ' + controlscene.cameras.main.height / 2 + 'px; width: ' + controlscene.cameras.main.width + 'px; height: ' + controlscene.cameras.main.height + 'px', '');

    let form = `
            <div style="font-family: 'Roboto', Arial, sans-serif; font-size: 16px; position: absolute; transform: translate(-50%, -50%); box-sizing: border-box; background-color: rgba(255, 255, 255, 1); border-color: black; border-width: 1px; border-style: solid; border-radius: 10px; width: 300px; padding-top: 10px; padding-bottom: 10px; padding-left: 10px; padding-right: 10px;" >
            <p style="margin-top: 0; margin-bottom: 10px; font-family: 'Roboto', Arial, sans-serif;">Are you sure you want to remove all parts?</p>
            <div style="width: 100%; text-align: right;">
                <div id="exitRemoveAll" style="box-sizing: border-box; display: inline-block; font-family: 'Roboto', Arial, sans-serif; font-size: 16px; margin-right: 20px; border: 1px solid darkgray; border-radius: 5px; cursor: pointer; padding: 5px 10px;">Cancel</div>
                <div id="yesRemoveAll" style="box-sizing: border-box; display: inline-block; font-family: 'Roboto', Arial, sans-serif; font-size: 16px; border: 1px solid darkgray; border-radius: 5px; cursor: pointer; padding: 5px 10px;">Yes</div>
            </div>
       </div>
       `;

    let element = controlscene.add.dom().createFromHTML(form);
    element.setPosition(controlscene.cameras.main.width / 2, controlscene.cameras.main.height / 2);
    element.addListener('click');
    element.on('click', (event) => {
        if (event.target.id === 'exitRemoveAll') {
            element.destroy();
            graybackground.destroy();
        }
        if (event.target.id === 'yesRemoveAll') {
            element.destroy();
            graybackground.destroy();
            // Remove all the chains.
            partManager.deleteAllChains();
            // Remove all the parts and tiles.
            partManager.deleteAllParts();
            // clearHighlight.bind(self)();
            clearChainDots(chainDots.length);
        }
        event.stopPropagation();
    });

    // Stop anything underneath the background from getting clicks.
    graybackground.addListener('click');
    graybackground.on('click', (event) => {
        element.destroy();
        graybackground.destroy();
    });
    graybackground.setInteractive();
    graybackground.on('pointerdown', (pointer, localx, localy, event) => {
        event.stopPropagation();
    });
    graybackground.on('pointerup', (pointer, localx, localy, event) => {
        event.stopPropagation();
    });
    graybackground.on('pointerover', (pointer, localx, localy, event) => {
        event.stopPropagation();
    });
}

function onZoomInClicked(name, newToggleState)
{
    zoomIn();
    // Stop resizing to the zoom extents.
    self.useZoomExtents = false;
}

function onZoomOutClicked(name, newToggleState)
{
    zoomOut();
    // Stop resizing to the zoom extents.
    self.useZoomExtents = false;
}

function setToInteractMode() {
    clearAllToggleButtons();
    mouseImage.setVisible(false);
    self.interactbutton.setToggleState(true);
    partManager.setToolMode.bind(partManager)('interact');
}

function clearAllToggleButtons() {
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
}

// Intended behavior: The interact button is the default button. It is selected when nothing else is.
// After dropping a part, always switch back to interact button.
// Start with the interact button toggled.
function onSwitchToggled(name, newToggleState)
{
    clearChainDots(chainDots.length);

    // console.log("in on switch toggled function: ", name);
    // console.log("IN ON TOGGLE, is mobile?", isMobile, " or is touch device? ", isTouchMobile);

    partManager.setToolMode('default');
    partManager.cancelChain();

    // console.log("In onSwitchToggled function, passed in name: ", name);
    if (name === 'chain')
    {
        if (!self.chainbutton.getToggleState()) {
            dynamicPartsListForTouchDots = [...partManager.parts];
            // reset parts list
            for ( let k = 0; k < dynamicPartsListForTouchDots.length; k++ ) {
                if ( dynamicPartsListForTouchDots[k].hasChainConnection === 'first' || dynamicPartsListForTouchDots[k].hasChainConnection === 'taken' )
                {
                    dynamicPartsListForTouchDots[k].hasChainConnection = 'open';
                }
                // console.log("CHAIN TOGGLE BUTTON - part has connection: ", dynamicPartsListForTouchDots[k].partType, " ", dynamicPartsListForTouchDots[k].hasChainConnection);
            }
            // reset chain connection object
            sprocketsWithConnectionsGridArray = [];

            clearAllToggleButtons();
            self.chainbutton.setToggleState(true);
            mouseImage.setVisible(false);

            // if mobile device or touch screen then call function to draw chain connection areas
            if ( isMobile || isTouchMobile ) {
                showPossibleChainConnections();   // call function to draw touch dots on chain button clicked
            }
        }
        else {
            setToInteractMode();
        }
    }
    else if (name === 'junction')
    {
        if (!self.junctionbutton.getToggleState()) {
            clearAllToggleButtons();
            self.junctionbutton.setToggleState(true);
            mouseImage.setTexture('junction');
            mouseImageOffset = PartBase.getPartImageOffsets(name);
            if (isMobile || isTouchMobile) {
                mouseImage.setVisible(false);
            } else {
                mouseImage.setVisible(true);
            }
        }
        else {
            setToInteractMode();
        }
    }
    else if (name === 'motor')
    {
        if (!self.motorbutton.getToggleState()) {
            clearAllToggleButtons();
            self.motorbutton.setToggleState(true);
            mouseImage.setTexture('motor');
            mouseImageOffset = PartBase.getPartImageOffsets(name);
            if (isMobile || isTouchMobile) {
                mouseImage.setVisible(false);
            } else {
                mouseImage.setVisible(true);
            }
        }
        else {
            setToInteractMode();
        }
    }
    else if (name === 'resistor')
    {
        if (!self.resistorbutton.getToggleState()) {
            clearAllToggleButtons();
            self.resistorbutton.setToggleState(true);
            mouseImage.setTexture('resistor');
            mouseImageOffset = PartBase.getPartImageOffsets(name);
            if (isMobile || isTouchMobile) {
                mouseImage.setVisible(false);
            } else {
                mouseImage.setVisible(true);
            }
        }
        else {
            setToInteractMode();
        }
    }
    else if (name === 'capacitor')
    {
        if (!self.capacitorbutton.getToggleState()) {
            clearAllToggleButtons();
            self.capacitorbutton.setToggleState(true);
            mouseImage.setTexture('capacitor');
            mouseImageOffset = PartBase.getPartImageOffsets(name);
            if (isMobile || isTouchMobile) {
                mouseImage.setVisible(false);
            } else {
                mouseImage.setVisible(true);
            }
        }
        else {
            setToInteractMode();
        }
    }
    else if (name === 'inductor')
    {
        if (!self.inductorbutton.getToggleState()) {
            clearAllToggleButtons();
            self.inductorbutton.setToggleState(true);
            mouseImage.setTexture('inductor');
            mouseImageOffset = PartBase.getPartImageOffsets(name);
            if (isMobile || isTouchMobile) {
                mouseImage.setVisible(false);
            } else {
                mouseImage.setVisible(true);
            }
        }
        else {
            setToInteractMode();
        }
    }
    else if (name === 'phonograph')
    {
        if (!self.phonographbutton.getToggleState()) {
            clearAllToggleButtons();
            self.phonographbutton.setToggleState(true);
            mouseImage.setTexture('phonograph');
            mouseImageOffset = PartBase.getPartImageOffsets(name);
            if (isMobile || isTouchMobile) {
                mouseImage.setVisible(false);
            } else {
                mouseImage.setVisible(true);
            }
        }
        else {
            setToInteractMode();
        }
    }
    else if (name === 'diode')
    {
        if (!self.diodebutton.getToggleState()) {
            clearAllToggleButtons();
            self.diodebutton.setToggleState(true);
            mouseImage.setTexture('diode');
            mouseImageOffset = PartBase.getPartImageOffsets(name);
            if (isMobile || isTouchMobile) {
                mouseImage.setVisible(false);
            } else {
                mouseImage.setVisible(true);
            }
        }
        else {
            setToInteractMode();
        }
    }
    else if (name === 'button')
    {
        if (!self.buttonbutton.getToggleState()) {
            clearAllToggleButtons();
            self.buttonbutton.setToggleState(true);
            mouseImage.setTexture('button');
            mouseImageOffset = PartBase.getPartImageOffsets(name);
            if (isMobile || isTouchMobile) {
                mouseImage.setVisible(false);
            } else {
                mouseImage.setVisible(true);
            }
        }
        else {
            setToInteractMode();
        }
    }
    else if (name === 'transistor')
    {
        if (!self.transistorbutton.getToggleState()) {
            clearAllToggleButtons();
            self.transistorbutton.setToggleState(true);
            mouseImage.setTexture('transistor');
            mouseImageOffset = PartBase.getPartImageOffsets(name);
            if (isMobile || isTouchMobile) {
                mouseImage.setVisible(false);
            } else {
                mouseImage.setVisible(true);
            }
        }
        else {
            setToInteractMode();
        }
    }
    else if (name === 'level-changer')
    {
        if (!self.levelchangerbutton.getToggleState()) {
            clearAllToggleButtons();
            self.levelchangerbutton.setToggleState(true);
            mouseImage.setTexture('level-changer');
            mouseImageOffset = PartBase.getPartImageOffsets(name);
            if (isMobile || isTouchMobile) {
                mouseImage.setVisible(false);
            } else {
                mouseImage.setVisible(true);
            }
        }
        else {
            setToInteractMode();
        }
    }
    else if (name === 'tile')
    {
        if (!self.tilebutton.getToggleState()) {
            clearAllToggleButtons();
            self.tilebutton.setToggleState(true);
            mouseImage.setTexture('tile');
            mouseImageOffset = PartBase.getPartImageOffsets(name);
            if (isMobile || isTouchMobile) {
                mouseImage.setVisible(false);
            } else {
                mouseImage.setVisible(true);
            }
        }
        else {
            setToInteractMode();
        }
    }
    else if (name === 'interact') {
        // Can't deselect this one by clicking on it twice.
        setToInteractMode();
    }
    else if (name === 'move')
    {
        if (!self.movebutton.getToggleState()) {
            clearAllToggleButtons();
            self.movebutton.setToggleState(true);
            mouseImage.setVisible(false);
            partManager.setToolMode.bind(partManager)('move');
        }
        else {
            setToInteractMode();
        }
    }
    else if (name === 'delete')
    {
        if (!self.deletebutton.getToggleState()) {
            clearAllToggleButtons();
            self.deletebutton.setToggleState(true);
            mouseImage.setVisible(false);
            partManager.setToolMode.bind(partManager)('delete');
        }
        else {
            setToInteractMode();
        }
    }
    else if (name === 'edit')
    {
        if (!self.editbutton.getToggleState()) {
            clearAllToggleButtons();
            self.editbutton.setToggleState(true);
            mouseImage.setVisible(false);
            partManager.setToolMode.bind(partManager)('edit');
        }
        else {
            setToInteractMode();
        }
    }
}

//Kelly added this function - called when clicking on chain tool button (mobile or touch screen only)
function showPossibleChainConnections() {
    // find all parts placed in the simulator circuit

    // now loop through the sprockets on this part - if different, then draw another dot
    let thisRadius = '';
    let sprocketBounds = [];
    let checkavailablelevels = [];

    // allPartsOnBoard = partManager.parts;

    for (let i = 0; i < dynamicPartsListForTouchDots.length; i++) {
        checkavailablelevels = [];   // empty array before finding the part's used sprockets
        let thispartname = dynamicPartsListForTouchDots[i].partType;  // need to find any junctions, which are checked differently
        // checkavailablelevels = partManager.getAllLevelsWithSameRadiusThatAreAvailableOnThisPart(i, 0);
        if (thispartname === 'junction') {
            // found a part that is a junction
            for (let j=0; j < 3; j++ ) {  // loop through the 3 levels of sprockets
                // for each junction sprocket level, find out if it is available
                let junctionavailablelevels = partManager.getAllLevelsWithSameRadiusThatAreAvailableOnThisPart(i, j);
                // console.log("junction level index: ", j, " junction available levels: ", junctionavailablelevels[0]);
                // now if the sprocket level is used, check for type of undefined. If not undefined...
                if ( typeof junctionavailablelevels[0] !== 'undefined' ) {
                    // console.log("type of is NOT undefined match.");
                    // we know there is only one array element per junction sprocket - if it has a value, push to checkavailable levels array
                    checkavailablelevels.push(junctionavailablelevels[0]);
                    // console.log("junction loop, check available levels array: ", checkavailablelevels);
                }
            }
            if (checkavailablelevels.length > 0 ) {
                // loop through the checkavailablelevels array which only stores unused sprockets on the junction
                // then for each available sprocket on each part, draw the mobile touch dots for connecting chain
                for (let n=0; n < checkavailablelevels.length; n++ ) {
                    sprocketBounds[i] = partManager.getSprocketBounds(i, checkavailablelevels[n]);
                    drawTouchDots.bind(self)(sprocketBounds[i].x, sprocketBounds[i].y, sprocketBounds[i].radius, 0, sprocketBounds[i].cw, false, null, false);
                }
            }
        } else {
            // found a part that is not a junction
            // get available sprockets for this part that is not a junction (all others) by sending in level 0
            checkavailablelevels = partManager.getAllLevelsWithSameRadiusThatAreAvailableOnThisPart(i, 0);
            if (checkavailablelevels.length > 0 ) {
                sprocketBounds[i] = partManager.getSprocketBounds(i, checkavailablelevels[0]);
                // console.log("In SHOWPOSSIBLE function, sprocket bounds: ", sprocketBounds[i].cw);
                drawTouchDots.bind(self)(sprocketBounds[i].x, sprocketBounds[i].y, sprocketBounds[i].radius, 0, sprocketBounds[i].cw, false, null, false);
            }
        }
    } // end of each part on board loop
} // end of show possible chain connections function

// ---------------------------------------- ON POINTER MOVE ---------------------------------------------------- //
function onPointerMove(pointer) {

    if (disablePointerOverEvent)
        return;

    let worldPointer = this.cameras.main.getWorldPoint(pointer.x, pointer.y);

    var snapPosition;
    if (this.motorbutton.getToggleState() || this.tilebutton.getToggleState()) {
        snapPosition = PartBase.getSnapPosition(worldPointer, tileSpacing/* * this.cameras.main.zoom*/);
    } else {
        snapPosition = PartBase.getSnapPosition(worldPointer, gridSpacing/* * this.cameras.main.zoom*/);
    }
    mouseImage.setPosition(snapPosition.snapPoint.x - mouseImageOffset.x, snapPosition.snapPoint.y - mouseImageOffset.y);

    clearHighlight.bind(this)();

    // Chain mode
    if (this.chainbutton.getToggleState()) {            // on POINTER MOVE
        if (partManager.isInTheMiddleOfBuildingAChain() === false) {
            // We haven't drawn any of the chain, yet. So when the mouse is over a part, draw highlighted arrows to choose which way the chain should go.
            // Search for a part that has a sprocket circle on which the cursor is over.
            var nearestSprocket = partManager.getSprocketAtPoint.bind(partManager)(worldPointer.x, worldPointer.y);
            if (nearestSprocket != null) {    // only null if cursor not over a sprocket edge
                // Check to see if there are any levels without a chain on the sprocket.
                let availableLevels = partManager.getAllLevelsWithSameRadiusThatAreAvailableOnThisPart(nearestSprocket.partIndex, nearestSprocket.level);
                // console.log("available levels: ", availableLevels);
                if (availableLevels.length > 0) { //partManager.isSprocketAvailable(nearestSprocket.partIndex, nearestSprocket.level)) {
                    // Draw a highlight circle where the sprocket is
                    var sprocketBounds = partManager.getSprocketBounds(nearestSprocket.partIndex, nearestSprocket.level);

                    //Kelly added don't draw any highlight arrows if on mobile or touchscreen (no hover)
                    if ( !(isMobile || isTouchMobile) ) {
                    // if (!isMobile || !isTouchMobile) {
                        if (worldPointer.x < sprocketBounds.x) {
                            // console.log("in is not mobile or is not touch.");
                            drawHighlight.bind(this)(sprocketBounds.x, sprocketBounds.y, sprocketBounds.radius, sprocketBounds.thickness, 90, true);
                        } else {
                            drawHighlight.bind(this)(sprocketBounds.x, sprocketBounds.y, sprocketBounds.radius, sprocketBounds.thickness, 90, false);
                        }
                    }
                }
            }
        } else {    // ON MOVE - MIDCHAIN
            // We have a chain started. Now we need to draw the next part highlighted.
            var nearestSprocket = partManager.getNextAllowedSprocketAtPoint.bind(partManager)(worldPointer.x, worldPointer.y, true, null);

            if (nearestSprocket != null) {
                // Draw a highlight circle where the sprocket is
                var sprocketBounds = partManager.getSprocketBounds(nearestSprocket.partIndex, nearestSprocket.level);

                // Is this the very first sprocket in this chain?
                let isFirstSprocket = false;
                let firstSprocket = partManager.getInfoAboutFirstSprocketInChainBeingBuilt();

                if (firstSprocket.partIndex === nearestSprocket.partIndex) {
                    // It IS the sprocket we began this chain on. We're going to end this chain now.
                    isFirstSprocket = true;
                }

                // Figure out which side of the line this part is on.
                // Determine angle between the current part and the next one
                var lastSprocketBounds = partManager.getLastSprocketBoundsOfChainBeingBuilt();

                let distance = Math.sqrt(Math.pow(lastSprocketBounds.x - sprocketBounds.x, 2) + Math.pow(lastSprocketBounds.y - sprocketBounds.y, 2));
                let ydiff = lastSprocketBounds.y - sprocketBounds.y;
                let angle = Phaser.Math.RadToDeg(Math.asin(ydiff / distance));
                if (lastSprocketBounds.x > sprocketBounds.x) {
                    angle = 180 - angle;
                }

                // Determine the angle to the pointer
                let distanceToPointer = Math.sqrt(Math.pow(sprocketBounds.x - worldPointer.x, 2) + Math.pow(sprocketBounds.y - worldPointer.y, 2));
                let ydiffToPointer = sprocketBounds.y - worldPointer.y;
                let angleToPointer = Phaser.Math.RadToDeg(Math.asin(ydiffToPointer / distanceToPointer));
                if (worldPointer.x < sprocketBounds.x) {
                    angleToPointer = 180 - angleToPointer;
                }
                let angleDiff = angleToPointer - angle;
                if (angleDiff < 0) {
                    angleDiff += 360;
                }

                if (angleDiff >= 0 && angleDiff < 180) {
                    // The clockwise arrow
                    if (!(isFirstSprocket && firstSprocket.cw === false)) {
                        if ( !(isMobile || isTouchMobile) ) {
                            drawHighlight.bind(this)(sprocketBounds.x, sprocketBounds.y, sprocketBounds.radius, sprocketBounds.thickness, angle, true);
                        }
                    }
                } else {
                    // The counterclockwise arrow
                    if (!(isFirstSprocket && firstSprocket.cw === true)) {
                        if ( !(isMobile || isTouchMobile) ) {
                            drawHighlight.bind(this)(sprocketBounds.x, sprocketBounds.y, sprocketBounds.radius, sprocketBounds.thickness, angle, false);
                        }
                    }
                }
            }
        }

        // Redraw the chain we're currently building.
        // Kelly testing this for mobile chain drawing when touching random place Oct 28
        if ( !(isMobile || isTouchMobile) ) {
            if (partManager.isInTheMiddleOfBuildingAChain() === true) {
                partManager.redrawChainBeingBuilt(worldPointer);
            }
        }
    }
}
    // Kelly added function to show touch dots where to connect chain (on mobile)
    // pass in part center x point, part center y point, part sprocket radius, angle to last part or 0, if it is midchain (meaning dots get turned for
    // the angle from last part to new part), islevel (?? being used ??), and isfirstconnection (only draw the one dot instead of two)
    function drawTouchDots(centerX, centerY, radius, angle, cw, ismidchain, islevel, isfirstconnection) {

        if (ismidchain) {

            angle = Phaser.Math.DegToRad(angle);
            // these points are the first new points to show where to attach the chain
            let myPointX = centerX + radius * Math.cos(angle);
            let myPointY = centerY + radius * Math.sin(angle);

            // these points are the opposite side points to show where to attach the chain
            let myOppositePointX;
            let myOppositePointY;

            let myXDistanceToCenter = myPointX - centerX;
            let myYDistanceToCenter = myPointY - centerY;
            myOppositePointX = centerX - myXDistanceToCenter;
            myOppositePointY = centerY - myYDistanceToCenter;

            chainDots[drawn] = this.add.graphics();
            // Set to the top-most depth
            chainDots[drawn].setDepth(20);

            if (isfirstconnection) {
                // the part with the first connected chain will only show one remaining connection point
                if (firstPartChainIsConnectedGoingCW && !cw) {
                    chainDots[drawn].fillStyle(0x00FF00, 1.0);
                    chainDots[drawn].fillCircle(myOppositePointX, myOppositePointY, 15);
                } else if (!firstPartChainIsConnectedGoingCW && !cw) {
                    chainDots[drawn].fillStyle(0x00FF00, 1.0);
                    chainDots[drawn].fillCircle(myPointX, myPointY, 15);
                } else if (firstPartChainIsConnectedGoingCW && cw) {
                    chainDots[drawn].fillStyle(0x00FF00, 1.0);
                    chainDots[drawn].fillCircle(myPointX, myPointY, 15);
                } else if (!firstPartChainIsConnectedGoingCW && cw ) {
                    chainDots[drawn].fillStyle(0x00FF00, 1.0);
                    chainDots[drawn].fillCircle(myOppositePointX, myOppositePointY, 15);
                }
            } else {
                chainDots[drawn].fillStyle(0x00FF00, 1.0);
                chainDots[drawn].fillCircle(myPointX, myPointY, 15);
                chainDots[drawn].fillCircle(myOppositePointX, myOppositePointY, 15);
                // }
                // Kelly adding to try a touch arrow -------------------------------------------------------->
                let thickness = 6;
                const arrowOffset = 0;
                const arrowAngleExtents = 30;
                const arrowHeadThickness = 26;
                let arrowangle = Phaser.Math.RadToDeg(angle);

                chainArrows[drawn] = this.add.graphics(0, 0, true);
                // Set to the top-most depth
                chainArrows[drawn].setDepth(20);
                chainArrows[drawn].lineStyle(thickness, 0x00FF00, 1.0);
                chainArrows[drawn].fillStyle(0x00FF00, 1.0);

                chainArrows[drawn].beginPath();
                chainArrows[drawn].arc(centerX,
                    centerY,
                    radius + arrowOffset,
                    Phaser.Math.DegToRad((arrowangle) - arrowAngleExtents),
                    Phaser.Math.DegToRad((arrowangle) + arrowAngleExtents),
                    false);
                chainArrows[drawn].strokePath();

                // draw opposite side arc and arrow head
                chainArrows[drawn].beginPath();
                chainArrows[drawn].arc(centerX,
                    centerY,
                    radius + arrowOffset,
                    Phaser.Math.DegToRad((arrowangle + 180) - arrowAngleExtents),
                    Phaser.Math.DegToRad((arrowangle + 180) + arrowAngleExtents),
                    false);
                chainArrows[drawn].strokePath();

                if (cw) {
                    // We want a constant length of our arrow head: 18 px.
                    // Find circumference:
                    let circumference = 2 * Math.PI * (arrowOffset + radius);
                    let fractionOfCircumference = (18 / circumference) * 360;

                    let arrowTop = {
                        x: centerX + Math.cos(Phaser.Math.DegToRad((-arrowangle - 180) + arrowAngleExtents + fractionOfCircumference)) * (arrowOffset + radius),
                        y: centerY - Math.sin(Phaser.Math.DegToRad((-arrowangle - 180) + arrowAngleExtents + fractionOfCircumference)) * (arrowOffset + radius)
                    };
                    let arrowLeft = {
                        x: centerX + Math.cos(Phaser.Math.DegToRad((-arrowangle - 180) + arrowAngleExtents)) * (arrowOffset + radius + arrowHeadThickness / 2),
                        y: centerY - Math.sin(Phaser.Math.DegToRad((-arrowangle - 180) + arrowAngleExtents)) * (arrowOffset + radius + arrowHeadThickness / 2)
                    };
                    let arrowRight = {
                        x: centerX + Math.cos(Phaser.Math.DegToRad((-arrowangle - 180) + arrowAngleExtents)) * (arrowOffset + radius - arrowHeadThickness / 2),
                        y: centerY - Math.sin(Phaser.Math.DegToRad((-arrowangle - 180) + arrowAngleExtents)) * (arrowOffset + radius - arrowHeadThickness / 2)
                    };
                    chainArrows[drawn].fillTriangle(arrowTop.x, arrowTop.y, arrowLeft.x, arrowLeft.y, arrowRight.x, arrowRight.y);

                    let oppositeArrowTop = {
                        x: centerX + Math.cos(Phaser.Math.DegToRad((arrowangle) + arrowAngleExtents + fractionOfCircumference)) * (arrowOffset + radius),
                        y: centerY + Math.sin(Phaser.Math.DegToRad((arrowangle) + arrowAngleExtents + fractionOfCircumference)) * (arrowOffset + radius)
                    };
                    let oppositeArrowLeft = {
                        x: centerX + Math.cos(Phaser.Math.DegToRad((arrowangle) + arrowAngleExtents)) * (arrowOffset + radius + arrowHeadThickness / 2),
                        y: centerY + Math.sin(Phaser.Math.DegToRad((arrowangle) + arrowAngleExtents)) * (arrowOffset + radius + arrowHeadThickness / 2)
                    };
                    let oppositeArrowRight = {
                        x: centerX + Math.cos(Phaser.Math.DegToRad((arrowangle) + arrowAngleExtents)) * (arrowOffset + radius - arrowHeadThickness / 2),
                        y: centerY + Math.sin(Phaser.Math.DegToRad((arrowangle) + arrowAngleExtents)) * (arrowOffset + radius - arrowHeadThickness / 2)
                    };
                    chainArrows[drawn].fillTriangle(oppositeArrowTop.x, oppositeArrowTop.y, oppositeArrowLeft.x, oppositeArrowLeft.y, oppositeArrowRight.x, oppositeArrowRight.y);

                } else {

                    let circumference = 2 * Math.PI * (arrowOffset + radius);
                    let fractionOfCircumference = (18 / circumference) * 360;

                    let arrowTop = {
                        x: centerX + Math.cos(Phaser.Math.DegToRad((-arrowangle) + arrowAngleExtents + fractionOfCircumference)) * (arrowOffset + radius),
                        y: centerY - Math.sin(Phaser.Math.DegToRad((-arrowangle) + arrowAngleExtents + fractionOfCircumference)) * (arrowOffset + radius)
                    };
                    let arrowLeft = {
                        x: centerX + Math.cos(Phaser.Math.DegToRad((-arrowangle) + arrowAngleExtents)) * (arrowOffset + radius + arrowHeadThickness / 2),
                        y: centerY - Math.sin(Phaser.Math.DegToRad((-arrowangle) + arrowAngleExtents)) * (arrowOffset + radius + arrowHeadThickness / 2)
                    };
                    let arrowRight = {
                        x: centerX + Math.cos(Phaser.Math.DegToRad((-arrowangle) + arrowAngleExtents)) * (arrowOffset + radius - arrowHeadThickness / 2),
                        y: centerY - Math.sin(Phaser.Math.DegToRad((-arrowangle) + arrowAngleExtents)) * (arrowOffset + radius - arrowHeadThickness / 2)
                    };
                    chainArrows[drawn].fillTriangle(arrowTop.x, arrowTop.y, arrowLeft.x, arrowLeft.y, arrowRight.x, arrowRight.y);

                    let oppositeArrowTop = {
                        x: centerX + Math.cos(Phaser.Math.DegToRad((arrowangle - 180) + arrowAngleExtents + fractionOfCircumference)) * (arrowOffset + radius),
                        y: centerY + Math.sin(Phaser.Math.DegToRad((arrowangle - 180) + arrowAngleExtents + fractionOfCircumference)) * (arrowOffset + radius)
                    };
                    let oppositeArrowLeft = {
                        x: centerX + Math.cos(Phaser.Math.DegToRad((arrowangle - 180) + arrowAngleExtents)) * (arrowOffset + radius + arrowHeadThickness / 2),
                        y: centerY + Math.sin(Phaser.Math.DegToRad((arrowangle - 180) + arrowAngleExtents)) * (arrowOffset + radius + arrowHeadThickness / 2)
                    };
                    let oppositeArrowRight = {
                        x: centerX + Math.cos(Phaser.Math.DegToRad((arrowangle - 180) + arrowAngleExtents)) * (arrowOffset + radius - arrowHeadThickness / 2),
                        y: centerY + Math.sin(Phaser.Math.DegToRad((arrowangle - 180) + arrowAngleExtents)) * (arrowOffset + radius - arrowHeadThickness / 2)
                    };
                    chainArrows[drawn].fillTriangle(oppositeArrowTop.x, oppositeArrowTop.y, oppositeArrowLeft.x, oppositeArrowLeft.y, oppositeArrowRight.x, oppositeArrowRight.y);

                }
                // Kelly end of touch arrows -------------------------------------------------------------------------------->
            }
        // drawing first dot connection points on chain button clicked
        } else {

            chainDots[drawn] = this.add.graphics();
            // Set to the top-most depth
            chainDots[drawn].setDepth(20);
            // chainDots[thispart].lineStyle(thickness, 0x00FF00, 0.65);
            chainDots[drawn].fillStyle(0x00FF00, 1.0);
            chainDots[drawn].fillCircle(centerX + radius, centerY, 15);
            chainDots[drawn].fillCircle(centerX - radius, centerY, 15);

            // console.log("...breaking here?");

            let thickness = 6;
            const arrowOffset = 0;
            const arrowAngleExtents = 30;
            const arrowHeadThickness = 26;
            let arrowangle = Phaser.Math.RadToDeg(angle);

            chainArrows[drawn] = this.add.graphics(0, 0, true);
            // Set to the top-most depth
            chainArrows[drawn].setDepth(20);
            chainArrows[drawn].lineStyle(thickness, 0x00FF00, 1.0);
            chainArrows[drawn].fillStyle(0x00FF00, 1.0);

            // draw first side arc and arrow head
            chainArrows[drawn].beginPath();
            chainArrows[drawn].arc(centerX,
                centerY,
                radius + arrowOffset,
                Phaser.Math.DegToRad((0) - arrowAngleExtents),
                Phaser.Math.DegToRad((0) + arrowAngleExtents),
                false);
            chainArrows[drawn].strokePath();

            // draw opposite side arc and arrow head
            chainArrows[drawn].beginPath();
            chainArrows[drawn].arc(centerX,
                centerY,
                radius + arrowOffset,
                Phaser.Math.DegToRad((180) - arrowAngleExtents),
                Phaser.Math.DegToRad((180) + arrowAngleExtents),
                false);
            chainArrows[drawn].strokePath();

            let circumference = 2 * Math.PI * (arrowOffset + radius);
            let fractionOfCircumference = (18 / circumference) * 360;

            let arrowTop = {
                x: centerX + Math.cos(Phaser.Math.DegToRad((0) + arrowAngleExtents + fractionOfCircumference)) * (arrowOffset + radius),
                y: centerY - Math.sin(Phaser.Math.DegToRad((0) + arrowAngleExtents + fractionOfCircumference)) * (arrowOffset + radius)
            };
            let arrowLeft = {
                x: centerX + Math.cos(Phaser.Math.DegToRad((0) + arrowAngleExtents)) * (arrowOffset + radius + arrowHeadThickness / 2),
                y: centerY - Math.sin(Phaser.Math.DegToRad((0) + arrowAngleExtents)) * (arrowOffset + radius + arrowHeadThickness / 2)
            };
            let arrowRight = {
                x: centerX + Math.cos(Phaser.Math.DegToRad((0) + arrowAngleExtents)) * (arrowOffset + radius - arrowHeadThickness / 2),
                y: centerY - Math.sin(Phaser.Math.DegToRad((0) + arrowAngleExtents)) * (arrowOffset + radius - arrowHeadThickness / 2)
            };
            chainArrows[drawn].fillTriangle(arrowTop.x, arrowTop.y, arrowLeft.x, arrowLeft.y, arrowRight.x, arrowRight.y);
            // console.log("FIRST ELSE arrow: ", arrowTop, arrowLeft, arrowRight);

            let oppositeArrowTop = {
                x: centerX + Math.cos(Phaser.Math.DegToRad((0 - 180) + arrowAngleExtents + fractionOfCircumference)) * (arrowOffset + radius),
                y: centerY + Math.sin(Phaser.Math.DegToRad((0 - 180) + arrowAngleExtents + fractionOfCircumference)) * (arrowOffset + radius)
            };
            let oppositeArrowLeft = {
                x: centerX + Math.cos(Phaser.Math.DegToRad((0 - 180) + arrowAngleExtents)) * (arrowOffset + radius + arrowHeadThickness / 2),
                y: centerY + Math.sin(Phaser.Math.DegToRad((0 - 180) + arrowAngleExtents)) * (arrowOffset + radius + arrowHeadThickness / 2)
            };
            let oppositeArrowRight = {
                x: centerX + Math.cos(Phaser.Math.DegToRad((0 - 180) + arrowAngleExtents)) * (arrowOffset + radius - arrowHeadThickness / 2),
                y: centerY + Math.sin(Phaser.Math.DegToRad((0 - 180) + arrowAngleExtents)) * (arrowOffset + radius - arrowHeadThickness / 2)
            };
            chainArrows[drawn].fillTriangle(oppositeArrowTop.x, oppositeArrowTop.y, oppositeArrowLeft.x, oppositeArrowLeft.y, oppositeArrowRight.x, oppositeArrowRight.y);
            // console.log("FIRST ELSE opposite arrow: ", oppositeArrowTop, oppositeArrowLeft, oppositeArrowRight);
        }

        drawn++;
    }
// ---------------------------------------- DRAW CHAIN CONNECTION POINT ARROWS ---------------------------------------------------- //
    function drawHighlight(centerX, centerY, radius, thickness, angle, cw) {
        thickness = 10;
        const arrowOffset = 20;
        const arrowAngleExtents = 30;
        const arrowHeadThickness = 26;
        this.highlightGraphics = this.add.graphics(0, 0, true);
        // Set to the top-most depth
        this.highlightGraphics.setDepth(20);
        this.highlightGraphics.lineStyle(thickness, 0x00FF00, 0.65);
        this.highlightGraphics.fillStyle(0x00FF00, 0.65);

        if (cw) {
            // console.log("centerx: ", centerX, " centerY: ", centerY, " ", angle, " ", Phaser.Math.DegToRad((-angle - 90) - arrowAngleExtents));
            // var r1 = this.add.circle(centerX, centerY, 30, 0x6666ff);
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
        } else {
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
            //     // We want a constant length of our arrow head: 18 px.
            //     // Find circumference:
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

// ---------------------------------------- ON MOUSE WHEEL ---------------------------------------------------- //
    function onMouseWheel(pointer, gameObjects, deltaX, deltaY, deltaZ)
    {
        let camera = this.cameras.main;

        let zoomFactor = Math.pow(10, -deltaY/2000);
        // Find the center between the two pinch points - this is the point we want to zoom in and out of.
        // In screen units, not world units.
        let pinchCenterPoint = {
            x: pointer.x,
            y: pointer.y
        };
        let pinchCenterWorldPoint = camera.getWorldPoint(pinchCenterPoint.x, pinchCenterPoint.y);

        //this.backgroundGrid.fillStyle(0xFF0000, 0.35);
        //this.backgroundGrid.fillEllipse(pinchCenterWorldPoint.x, pinchCenterWorldPoint.y, 2, 2);

        let worldCenterPoint = camera.midPoint;

        //this.backgroundGrid.fillStyle(0x00FF00, 0.35);
        //this.backgroundGrid.fillEllipse(worldCenterPoint.x, worldCenterPoint.y, 2, 2);

        let distanceFromCenter = {
            x: pinchCenterWorldPoint.x - worldCenterPoint.x,
            y: pinchCenterWorldPoint.y - worldCenterPoint.y
        };

        let newDistanceFromCenter = {
            x: distanceFromCenter.x * zoomFactor,
            y: distanceFromCenter.y * zoomFactor
        };

        let currentZoom = camera.zoom;
        let newZoom = camera.zoom * zoomFactor;

        // Check to see if the image is too small to fill the screen.
        let screenWidth = self.cameras.main.width;
        let screenHeight = self.cameras.main.height;

        if (mapWidth * newZoom < screenWidth || mapHeight * newZoom < screenHeight) {
            newZoom = currentZoom;
        }

        // Limit zooming in too far
        if (newZoom > 10)
            newZoom = 10;

        camera.setZoom(newZoom);
        camera.centerOn(worldCenterPoint.x + (newDistanceFromCenter.x - distanceFromCenter.x), worldCenterPoint.y + (newDistanceFromCenter.y - distanceFromCenter.y));

        // Stop resizing window to the zoom extents.
        self.useZoomExtents = false;
    }

// ---------------------------------------- ON POINTER DOWN ---------------------------------------------------- //
    function onPointerDown(pointer, currentlyOver) {
        let worldPointer = this.cameras.main.getWorldPoint(pointer.x, pointer.y);

        // console.log("isMobile: ", isMobile);
        // console.log("isTouchMobile: ", isTouchMobile);
        // console.log("isMobile || isTouchMobile: ", isMobile || isTouchMobile);
        // console.log("isMobile && isTouchMobile: ", isMobile && isTouchMobile);
        // console.log("!isMobile || !isTouchMobile: ", !isMobile || !isTouchMobile);
        // console.log("!isMobile && !isTouchMobile: ", !isMobile && !isTouchMobile);
        // console.log("!(isMobile || isTouchMobile): ", !(isMobile || isTouchMobile));

        // Drop a part if we've got a part selected
        if (this.junctionbutton.getToggleState()) {
            var snapPosition = PartBase.getSnapPosition(worldPointer, gridSpacing);
            partManager.addPart('junction', snapPosition.snapPoint.x, snapPosition.snapPoint.y);
            // Turn the button off after placing a part
            setToInteractMode();
        } else if (this.buttonbutton.getToggleState()) {
            var snapPosition = PartBase.getSnapPosition(worldPointer, gridSpacing);
            partManager.addPart('button', snapPosition.snapPoint.x, snapPosition.snapPoint.y);
            setToInteractMode();
        } else if (this.resistorbutton.getToggleState()) {
            var snapPosition = PartBase.getSnapPosition(worldPointer, gridSpacing);
            partManager.addPart('resistor', snapPosition.snapPoint.x, snapPosition.snapPoint.y);
            setToInteractMode();
        } else if (this.capacitorbutton.getToggleState()) {
            var snapPosition = PartBase.getSnapPosition(worldPointer, gridSpacing);
            partManager.addPart('capacitor', snapPosition.snapPoint.x, snapPosition.snapPoint.y);
            setToInteractMode();
        } else if (this.diodebutton.getToggleState()) {
            var snapPosition = PartBase.getSnapPosition(worldPointer, gridSpacing);
            partManager.addPart('diode', snapPosition.snapPoint.x, snapPosition.snapPoint.y);
            setToInteractMode();
        } else if (this.transistorbutton.getToggleState()) {
            var snapPosition = PartBase.getSnapPosition(worldPointer, gridSpacing);
            partManager.addPart('transistor', snapPosition.snapPoint.x, snapPosition.snapPoint.y);
            setToInteractMode();
        } else if (this.levelchangerbutton.getToggleState()) {
            var snapPosition = PartBase.getSnapPosition(worldPointer, gridSpacing);
            partManager.addPart('level-changer', snapPosition.snapPoint.x, snapPosition.snapPoint.y);
            setToInteractMode();
        } else if (this.phonographbutton.getToggleState()) {
            var snapPosition = PartBase.getSnapPosition(worldPointer, gridSpacing);
            partManager.addPart('phonograph', snapPosition.snapPoint.x, snapPosition.snapPoint.y);
            setToInteractMode();
        } else if (this.motorbutton.getToggleState()) {
            var snapPosition = PartBase.getSnapPosition(worldPointer, tileSpacing);
            partManager.addPart('motor', snapPosition.snapPoint.x, snapPosition.snapPoint.y);
            // Update all the tile connectors
            partManager.updateTileConnectors();
            setToInteractMode();
        } else if (this.inductorbutton.getToggleState()) {
            var snapPosition = PartBase.getSnapPosition(worldPointer, gridSpacing);
            partManager.addPart('inductor', snapPosition.snapPoint.x, snapPosition.snapPoint.y);
            setToInteractMode();
        } else if (this.tilebutton.getToggleState()) {
            var snapPosition = PartBase.getSnapPosition(worldPointer, tileSpacing);
            partManager.addPart('tile', snapPosition.snapPoint.x, snapPosition.snapPoint.y);
            // Update all the tile connectors
            partManager.updateTileConnectors();
            setToInteractMode();
        } else if (this.chainbutton.getToggleState()) {         // on POINTER DOWN - BUILDING CHAIN
            // Draw a chain if the chain button is selected
            if (partManager.isInTheMiddleOfBuildingAChain()) {
                console.log("--------*****MIDDLE OF CHAIN*****---------");
                // console.log("MIDCHAIN - part clicked for level select cw (not being set here): ", partClickedForLevelSelect.cw);
                var nearestSprocket = partManager.getNextAllowedSprocketAtPoint.bind(partManager)(worldPointer.x, worldPointer.y);
                // console.log("MIDCHAIN - IN DOWN, nearest sprocket: ", nearestSprocket);
                if (nearestSprocket != null) {
                    // Draw a highlight circle where the sprocket is
                    var sprocketBounds = partManager.getSprocketBounds(nearestSprocket.partIndex, nearestSprocket.level);

                    // Is this the very first sprocket in this chain?
                    let isFirstSprocket = false;
                    let firstSprocket = partManager.getInfoAboutFirstSprocketInChainBeingBuilt();
                    // console.log("first sprocket: ", firstSprocket);
                    dynamicPartsListForTouchDots[firstSprocket.partIndex].hasChainConnection = 'first';

                    if (firstSprocket.partIndex === nearestSprocket.partIndex) {
                        // It IS the sprocket we began this chain on. We're going to end this chain now.
                        isFirstSprocket = true;
                    }

                    // Determine angle between the current part and the next one
                    var lastSprocketBounds = partManager.getLastSprocketBoundsOfChainBeingBuilt();
                    let distance = Math.sqrt(Math.pow(lastSprocketBounds.x - sprocketBounds.x, 2) + Math.pow(lastSprocketBounds.y - sprocketBounds.y, 2));
                    let ydiff = lastSprocketBounds.y - sprocketBounds.y;
                    let angle = Phaser.Math.RadToDeg(Math.asin(ydiff / distance));
                    if (lastSprocketBounds.x > sprocketBounds.x) {
                        angle = 180 - angle;
                    }
                    // Determine the angle to the pointer
                    let distanceToPointer = Math.sqrt(Math.pow(sprocketBounds.x - worldPointer.x, 2) + Math.pow(sprocketBounds.y - worldPointer.y, 2));
                    let ydiffToPointer = sprocketBounds.y - worldPointer.y;
                    let angleToPointer = Phaser.Math.RadToDeg(Math.asin(ydiffToPointer / distanceToPointer));
                    if (worldPointer.x < sprocketBounds.x) {
                        angleToPointer = 180 - angleToPointer;
                    }

                    let angleDiff = angleToPointer - angle;
                    if (angleDiff < 0) {
                        angleDiff += 360;
                    }

                    if (angleDiff >= 0 && angleDiff < 180) {
                        // console.log("chosen level is: ", chosenLevel);
                        // console.log("sprockets with connections grid: ", sprocketsWithConnectionsGridArray);
                        // Kelly added Oct 25
                        partClickedForLevelSelect.cw = true;
                        // Clockwise
                        if (!(isFirstSprocket && firstSprocket.cw === false)) {

                            if (!isFirstSprocket) {
                                partManager.addChainConnection(nearestSprocket.partIndex, nearestSprocket.level, true);
                                //    Kelly added here to test finding connections
                                addThisPartAndLeveltoConnectionsGrid = { 'pindex': nearestSprocket.partIndex, 'usedlevel': nearestSprocket.level };
                                sprocketsWithConnectionsGridArray.push(addThisPartAndLeveltoConnectionsGrid);

                                for (let m = 0; m < sprocketsWithConnectionsGridArray.length; m++ ) {
                                    if ( sprocketsWithConnectionsGridArray[m].usedlevel === chosenLevel ) {
                                        dynamicPartsListForTouchDots[sprocketsWithConnectionsGridArray[m].pindex].hasChainConnection = 'taken';
                                    }
                                }
                                dynamicPartsListForTouchDots[nearestSprocket.partIndex].hasChainConnection = 'taken';
                            } else {
                                partManager.closeChain();
                                // Kelly added for array grid
                                addThisPartAndLeveltoConnectionsGrid = { 'pindex': nearestSprocket.partIndex, 'usedlevel': nearestSprocket.level };
                                sprocketsWithConnectionsGridArray.push(addThisPartAndLeveltoConnectionsGrid);
                                setToInteractMode();
                            }
                        }
                    } else {
                        // console.log("MIDCHAIN - POINTER DOWN, in ELSE angle to add or close chain...");
                        // Kelly added oct 25
                        // console.log("chosen level is: ", chosenLevel);
                        // console.log("sprockets with connections grid: ", sprocketsWithConnectionsGridArray);
                        partClickedForLevelSelect.cw = false;
                        // Counterclockwise
                        if (!(isFirstSprocket && firstSprocket.cw === true)) {
                            if (!isFirstSprocket) {
                                partManager.addChainConnection(nearestSprocket.partIndex, nearestSprocket.level, false);

                                addThisPartAndLeveltoConnectionsGrid = { 'pindex': nearestSprocket.partIndex, 'usedlevel': nearestSprocket.level };
                                sprocketsWithConnectionsGridArray.push(addThisPartAndLeveltoConnectionsGrid);

                                for (let m = 0; m < sprocketsWithConnectionsGridArray.length; m++ ) {
                                        if ( sprocketsWithConnectionsGridArray[m].usedlevel === chosenLevel ) {
                                            dynamicPartsListForTouchDots[sprocketsWithConnectionsGridArray[m].pindex].hasChainConnection = 'taken';
                                        }
                                }

                                dynamicPartsListForTouchDots[nearestSprocket.partIndex].hasChainConnection = 'taken';

                            } else {
                                partManager.closeChain();

                                // Kelly added for array grid
                                addThisPartAndLeveltoConnectionsGrid = { 'pindex': nearestSprocket.partIndex, 'usedlevel': nearestSprocket.level };
                                sprocketsWithConnectionsGridArray.push(addThisPartAndLeveltoConnectionsGrid);
                                setToInteractMode();
                            }
                        }
                    }

                    clearHighlight.bind(this)();
                    // Kelly added delete drawn dots for each part level
                    let numofdotpairs = chainDots.length;
                    clearChainDots(numofdotpairs);
                    // Kelly testing the next drawing of touch dots when building the chain

                    let nextSprocketBounds = [];
                    let getFirstChainPointx = [];
                    let getFirstChainPointy = [];
                    let thisavailablelevels = [];

                    getLastSprocketBounds = partManager.getLastSprocketBoundsOfChainBeingBuilt();
                    // console.log("MIDCHAIN - IN DOWN, get last sprocket bounds: ", getLastSprocketBounds);

                    if ( getLastSprocketBounds != null ) {

                        for (let m = 0; m < dynamicPartsListForTouchDots.length; m++) {
                            // console.log("MIDCHAIN - dynamic parts list: ", dynamicPartsListForTouchDots[m].partType, dynamicPartsListForTouchDots[m].hasChainConnection);
                            thisavailablelevels = [];   // empty array before finding the part's used sprockets
                            if ( dynamicPartsListForTouchDots[m].hasChainConnection !== 'na' ) {
                                nextSprocketBounds[m] = partManager.getSprocketBounds(m, chosenLevel);
                                // console.log("part: ", dynamicPartsListForTouchDots[m].partType);
                                if (dynamicPartsListForTouchDots[m].partType === 'junction') {

                                    // found a part that is a junction
                                    for (let j = 0; j < 3; j++) {  // loop through the 3 levels of sprockets
                                        // for each junction sprocket level, find out if it is available
                                        let junctionavailablelevels = partManager.getAllLevelsWithSameRadiusThatAreAvailableOnThisPart(m, j);
                                        // now if the sprocket level is used, check for type of undefined. If not undefined...
                                        if (typeof junctionavailablelevels[0] !== 'undefined') {
                                            // we know there is only one array element per junction sprocket - if it has a value, push to checkavailable levels array
                                            thisavailablelevels.push(junctionavailablelevels[0]);
                                        }
                                    }
                                } else {
                                    // get available sprockets for this part that is not a junction (all others) by sending in level 0
                                    thisavailablelevels = partManager.getAllLevelsWithSameRadiusThatAreAvailableOnThisPart(m, 0);
                                }
                                // console.log("available levels on this part: ", thisavailablelevels);
                                let getDistance = Math.sqrt(Math.pow(getLastSprocketBounds.x - nextSprocketBounds[m].x, 2) + Math.pow(getLastSprocketBounds.y - nextSprocketBounds[m].y, 2));
                                let getYdiff = getLastSprocketBounds.y - nextSprocketBounds[m].y;
                                let getAngle = Phaser.Math.RadToDeg(Math.asin(getYdiff / getDistance));

                                // Kelly - this seems to be working to find the chain point to draw a new angle between the next part
                                if (getLastSprocketBounds.x > nextSprocketBounds[m].x) {
                                    // console.log("partclickedforlevelselect.cw: ", partClickedForLevelSelect.cw);
                                    // console.log("last sprocket bounds greater than next sprocket bounds");
                                    if (partClickedForLevelSelect.cw) {
                                        // console.log("getting new angle, cw is true");
                                        getAngle = getAngle + 90;
                                    } else {
                                        // console.log("getting new angle, cw is false");
                                        getAngle = getAngle - 90;
                                    }
                                } else {
                                    // console.log("partclickedforlevelselect.cw: ", partClickedForLevelSelect.cw);
                                    // console.log("last sprocket bounds NOT greater than next sprocket bounds");
                                    if (partClickedForLevelSelect.cw) {
                                        // console.log("getting new angle, cw is true");
                                        getAngle = 270 - getAngle;
                                    } else {
                                        // console.log("getting new angle, cw is false");
                                        getAngle = 90 - getAngle;
                                    }
                                }

                                getAngle = Phaser.Math.DegToRad(getAngle);
                                getFirstChainPointx[m] = getLastSprocketBounds.x + getLastSprocketBounds.radius * Math.cos(getAngle);
                                getFirstChainPointy[m] = getLastSprocketBounds.y + getLastSprocketBounds.radius * Math.sin(getAngle);

                                let newdistance = Math.sqrt(Math.pow(getFirstChainPointx[m] - nextSprocketBounds[m].x, 2) + Math.pow(getFirstChainPointy[m] - nextSprocketBounds[m].y, 2));
                                let newydiff = getFirstChainPointy[m] - nextSprocketBounds[m].y;
                                let newangle = Phaser.Math.RadToDeg(Math.asin(newydiff / newdistance));

                                if (getFirstChainPointx[m] > nextSprocketBounds[m].x) {
                                    if (partClickedForLevelSelect.cw) {
                                        newangle = newangle + 90;
                                    } else {
                                        newangle = newangle - 90;
                                    }
                                } else {
                                    if (partClickedForLevelSelect.cw) {
                                        newangle = 270 - newangle;
                                    } else {
                                        newangle = 90 - newangle;
                                    }
                                }

                                for (let n = 0; n < thisavailablelevels.length; n++) {
                                    // console.log("Checking if the chosen level matches available level loop.", chosenLevel, thisavailablelevels[n]);
                                    // console.log("ORIGINAL - level is open?", chosenlevelsprocketonnextpartisopen);
                                    if (thisavailablelevels[n] === chosenLevel) {
                                        chosenlevelsprocketonnextpartisopen = true;
                                    }
                                    // console.log("AFTER CHECK - level is open?", chosenlevelsprocketonnextpartisopen);
                                    // else {
                                    //     chosenlevelsprocketonnextpartisopen = false;
                                    // }
                                // }

                                    if (dynamicPartsListForTouchDots[m].hasChainConnection === 'first' && thisavailablelevels.length > 0) {
                                        if (isMobile || isTouchMobile) {
                                            drawTouchDots.bind(self)(nextSprocketBounds[m].x, nextSprocketBounds[m].y, nextSprocketBounds[m].radius, newangle, partClickedForLevelSelect.cw, true, chosenLevel, true);
                                        }
                                        // chosenlevelsprocketonnextpartisopen = false;

                                    } else if (chosenlevelsprocketonnextpartisopen && thisavailablelevels.length > 0 && dynamicPartsListForTouchDots[m].hasChainConnection !== 'taken') {
                                        if (isMobile || isTouchMobile) {
                                            drawTouchDots.bind(self)(nextSprocketBounds[m].x, nextSprocketBounds[m].y, nextSprocketBounds[m].radius, newangle, partClickedForLevelSelect.cw, true, chosenLevel, false);
                                        }
                                        // chosenlevelsprocketonnextpartisopen = false;
                                    } // end of if to draw touch dots
                                    chosenlevelsprocketonnextpartisopen = false;
                                } // end of check for open sprocket on each level of each part
                            }  // end of check for tile and connector parts
                        } // end of loop to check each available part to draw touch dots
                    } // end of get last sprocket is not null
                }  else { // end of if nearest sprocket is not null
                    console.log("nearest sprocket ELSE: ", nearestSprocket);
                }
            } else {   // FIRST CHAIN CONNECTION
                console.log("--------***FIRST CONNECTION***--------");
                // console.log("on pointer down, adding chain to first or last level part");
                var nearestSprocket = partManager.getSprocketAtPoint.bind(partManager)(worldPointer.x, worldPointer.y);
                // console.log("FIRST CONNECTION - IN DOWN, nearest sprocket: ", nearestSprocket);
                chosenLevel = 0;
                if (nearestSprocket != null) {

                    let availableLevels = partManager.getAllLevelsWithSameRadiusThatAreAvailableOnThisPart(nearestSprocket.partIndex, nearestSprocket.level);

                    if (availableLevels.length > 0) {

                        // this is for the last sprocket available or a junction level
                        if (availableLevels.length === 1) {
                            chosenLevel = availableLevels[0];
                        } else {
                            // Now, which level do we want to attach to? There are multiple possibilities.
                            // Bring up a menu so the user can choose
                            // Step 1: Create the items in the menu
                            let menuItems = [];
                            for (let i = 0; i < availableLevels.length; i++) {
                                menuItems.push({name: 'Level ' + (availableLevels[i] + 1)});
                            }

                            //Now create the popup menu.
                            // We'll need to store nearestSprocket.partIndex and cw somewhere so that we can start a chain with the chosen level once it's been picked.
                            // Once an item has been selected on the popup menu, we'll need to destroy the popup menu and the modalBackground, too.
                            partClickedForLevelSelect.partIndex = nearestSprocket.partIndex;

                            let sprocketBounds = partManager.getSprocketBounds(nearestSprocket.partIndex, availableLevels[0]);

                            if (worldPointer.x < sprocketBounds.x) {
                                partClickedForLevelSelect.cw = true;
                                firstPartChainIsConnectedGoingCW = true;
                            } else {
                                partClickedForLevelSelect.cw = false;
                                firstPartChainIsConnectedGoingCW = false;
                            }

                            // Kelly commented out Oct 27 - want to keep green arrows showing as level is picked from popup
                            // let numofdotpairs = chainDots.length;
                            // clearChainDots(numofdotpairs);

                            // Show the popup menu and use callback function to get chosen level
                            popupLevelChooser = new PopupLevelChooser(controlscene, pointer.x, pointer.y, 50, 35, partManager.getGetNumberOfLevelsOnThisPart(nearestSprocket.partIndex), availableLevels, popupLevelSelected);
                            disablePointerOverEvent = true;
                            // We haven't yet chosen a level, so -1
                            chosenLevel = -1;
                        }

                        // this is for the junction and only level of a part where you don't need the popup level selector menu
                        if (chosenLevel >= 0) {
                            console.log("--------***ONLY LEVEL FOR CHAIN***--------");
                            // Kelly added delete drawn dots for each part level
                            let numofdotpairs = chainDots.length;
                            clearChainDots(numofdotpairs);

                            var thisnearestSprocket = partManager.getSprocketAtPoint.bind(partManager)(worldPointer.x, worldPointer.y);
                            // console.log("ONLY LEVEL - IN DOWN, nearest sprocket: ", thisnearestSprocket);

                            var getonlysprocketbounds = partManager.getSprocketBounds(thisnearestSprocket.partIndex, chosenLevel);

                            if (worldPointer.x < getonlysprocketbounds.x) {
                                partClickedForLevelSelect.cw = true;
                                firstPartChainIsConnectedGoingCW = true;
                            } else {
                                partClickedForLevelSelect.cw = false;
                                firstPartChainIsConnectedGoingCW = false;
                            }
                            // console.log("IN ONLY LEVEL FOR CHAIN, part clicked for level select: ", partClickedForLevelSelect);
                            partClickedForLevelSelect.partIndex = thisnearestSprocket.partIndex;

                            partManager.startChain();
                            partManager.addChainConnection(partClickedForLevelSelect.partIndex, chosenLevel, partClickedForLevelSelect.cw);

                            let toNextSprocketBoundsOfPart = [];
                            let thisavailablelevels = [];
                            let junctionChainPointx = '';
                            let junctionChainPointy = '';

                            drawn = 0;

                            getThisSprocketBounds = partManager.getLastSprocketBoundsOfChainBeingBuilt();

                            for (var i = 0; i < dynamicPartsListForTouchDots.length; i++) {
                                thisavailablelevels = [];
                                if (dynamicPartsListForTouchDots[i].hasChainConnection !== 'na') {

                                    toNextSprocketBoundsOfPart[i] = partManager.getSprocketBounds(i, chosenLevel);

                                    if (dynamicPartsListForTouchDots[i].partType === 'junction') {

                                        // found a part that is a junction
                                        for (let j=0; j < 3; j++ ) {  // loop through the 3 levels of sprockets
                                            // for each junction sprocket level, find out if it is available
                                            let junctionavailablelevels = partManager.getAllLevelsWithSameRadiusThatAreAvailableOnThisPart(i, j);
                                            // now if the sprocket level is used, check for type of undefined. If not undefined...
                                            if ( typeof junctionavailablelevels[0] !== 'undefined' ) {
                                                // we know there is only one array element per junction sprocket - if it has a value, push to checkavailable levels array
                                                thisavailablelevels.push(junctionavailablelevels[0]);
                                                }
                                        }
                                    } else {
                                        thisavailablelevels = partManager.getAllLevelsWithSameRadiusThatAreAvailableOnThisPart(i, 0);
                                    }
                                    // Determine angle between the current part and the next one

                                    let thisdistance = Math.sqrt(Math.pow(getThisSprocketBounds.x - toNextSprocketBoundsOfPart[i].x, 2) + Math.pow(getThisSprocketBounds.y - toNextSprocketBoundsOfPart[i].y, 2));
                                    let thisydiff = getThisSprocketBounds.y - toNextSprocketBoundsOfPart[i].y;
                                    let thisangle = Phaser.Math.RadToDeg(Math.asin(thisydiff / thisdistance));

                                    // Kelly - this seems to be working to find the chain point to draw a new angle between the next part
                                    if (getThisSprocketBounds.x > toNextSprocketBoundsOfPart[i].x) {
                                        if (partClickedForLevelSelect.cw) {
                                            thisangle = thisangle + 90;
                                        } else {
                                            thisangle = thisangle - 90;
                                        }
                                    } else {
                                        if (partClickedForLevelSelect.cw) {
                                            thisangle = 270 - thisangle;
                                        } else {
                                            thisangle = 90 - thisangle;
                                        }
                                    }

                                    thisangle = Phaser.Math.DegToRad(thisangle);
                                    junctionChainPointx = getThisSprocketBounds.x + getThisSprocketBounds.radius * Math.cos(thisangle);
                                    junctionChainPointy = getThisSprocketBounds.y + getThisSprocketBounds.radius * Math.sin(thisangle);

                                    let thisnewdistance = Math.sqrt(Math.pow(junctionChainPointx - toNextSprocketBoundsOfPart[i].x, 2) + Math.pow(junctionChainPointy - toNextSprocketBoundsOfPart[i].y, 2));
                                    let thisnewydiff = junctionChainPointy - toNextSprocketBoundsOfPart[i].y;
                                    let thisnewangle = Phaser.Math.RadToDeg(Math.asin(thisnewydiff / thisnewdistance));

                                    if (junctionChainPointx > toNextSprocketBoundsOfPart[i].x) {
                                        if (partClickedForLevelSelect.cw) {
                                            thisnewangle = thisnewangle + 90;
                                        } else {
                                            thisnewangle = thisnewangle - 90;
                                        }
                                    } else {
                                        if (partClickedForLevelSelect.cw) {
                                            thisnewangle = 270 - thisnewangle;
                                        } else {
                                            thisnewangle = 90 - thisnewangle;
                                        }
                                    }

                                    for ( let n = 0; n < thisavailablelevels.length; n++ ) {

                                        if (thisavailablelevels[n] === chosenLevel) {
                                            chosenlevelsprocketonnextpartisopen = true;
                                        }
                                        // }
                                        if (chosenlevelsprocketonnextpartisopen && thisavailablelevels.length > 0) {
                                            if (isMobile || isTouchMobile) {
                                                drawTouchDots.bind(self)(toNextSprocketBoundsOfPart[i].x, toNextSprocketBoundsOfPart[i].y, toNextSprocketBoundsOfPart[i].radius, thisnewangle, partClickedForLevelSelect.cw, true, chosenLevel, false);
                                            }
                                            // chosenlevelsprocketonnextpartisopen = false;
                                        }
                                        chosenlevelsprocketonnextpartisopen = false;
                                    }
                                }
                            }
                        }
                        clearHighlight.bind(this)();
                    }   // end of if available levels greater than 0
                }   // end of if nearest sprocket not null
            }   // end of else, first chain connection
        }  // end of is chain
    }  // end of onPointerDown function

// ------------------------------- FUNCTION FOR POPUP SPROCKET LEVEL CHOOSER (callback) --------------------------------------------- //
// Callback function for when the sprocket level is chosen from the popup menu list.
    function popupLevelSelected(level) {
        console.log("-------***POPUP***-------");

        // Kelly added Oct 28
        let numofdotpairs = chainDots.length;
        clearChainDots(numofdotpairs);

        let sprocketBounds = [];
        let firstChainPointx = [];
        let firstChainPointy = [];
        let thisavailablelevels = [];

        drawn = 0;
        chosenLevel = level;

        disablePointerOverEvent = false;
        popupLevelChooser = null;

        if (level >= 0) {

            partManager.startChain();
            partManager.addChainConnection(partClickedForLevelSelect.partIndex, level, partClickedForLevelSelect.cw);

            // Kelly testing finding used levels
            for (let m = 0; m < sprocketsWithConnectionsGridArray.length; m++ ) {
                if ( sprocketsWithConnectionsGridArray[m].usedlevel === chosenLevel ) {
                    dynamicPartsListForTouchDots[sprocketsWithConnectionsGridArray[m].pindex].hasChainConnection = 'taken';
                }
            }

            // // Kelly added loop to draw new touch dots after choosing level
            let lastSprocketBounds = partManager.getLastSprocketBoundsOfChainBeingBuilt();
            for (var i = 0; i < dynamicPartsListForTouchDots.length; i++) {
                thisavailablelevels = [];

                if ( dynamicPartsListForTouchDots[i].partType !== 'tile' && dynamicPartsListForTouchDots[i].partType !== 'tile-connector' ) {
                    // console.log("dynamic parts list: ", dynamicPartsListForTouchDots[i].hasChainConnection);
                    if (i !== partClickedForLevelSelect.partIndex) {
                        sprocketBounds[i] = partManager.getSprocketBounds(i, level);

                        if (dynamicPartsListForTouchDots[i].partType === 'junction') {

                            // found a part that is a junction
                            for (let j=0; j < 3; j++ ) {  // loop through the 3 levels of sprockets
                                // for each junction sprocket level, find out if it is available
                                let junctionavailablelevels = partManager.getAllLevelsWithSameRadiusThatAreAvailableOnThisPart(i, j);
                                // now if the sprocket level is used, check for type of undefined. If not undefined...
                                if ( typeof junctionavailablelevels[0] !== 'undefined' ) {
                                    // we know there is only one array element per junction sprocket - if it has a value, push to checkavailable levels array
                                    thisavailablelevels.push(junctionavailablelevels[0]);
                                }
                            }
                        } else {
                            // get available sprockets for this part that is not a junction (all others) by sending in level 0
                            thisavailablelevels = partManager.getAllLevelsWithSameRadiusThatAreAvailableOnThisPart(i, 0);
                        }

                        // Determine angle between the current part and the next one
                        let distance = Math.sqrt(Math.pow(lastSprocketBounds.x - sprocketBounds[i].x, 2) + Math.pow(lastSprocketBounds.y - sprocketBounds[i].y, 2));
                        let ydiff = lastSprocketBounds.y - sprocketBounds[i].y;
                        let angle = Phaser.Math.RadToDeg(Math.asin(ydiff / distance));

                        // Kelly - this seems to be working to find the chain point to draw a new angle between the next part
                        if (lastSprocketBounds.x > sprocketBounds[i].x) {
                            if (partClickedForLevelSelect.cw) {
                                angle = angle + 90;
                            } else {
                                angle = angle - 90;
                            }
                        } else {
                            if (partClickedForLevelSelect.cw) {
                                angle = 270 - angle;
                            } else {
                                angle = 90 - angle;
                            }
                        }

                        angle = Phaser.Math.DegToRad(angle);
                        firstChainPointx[i] = lastSprocketBounds.x + lastSprocketBounds.radius * Math.cos(angle);
                        firstChainPointy[i] = lastSprocketBounds.y + lastSprocketBounds.radius * Math.sin(angle);

                        let newdistance = Math.sqrt(Math.pow(firstChainPointx[i] - sprocketBounds[i].x, 2) + Math.pow(firstChainPointy[i] - sprocketBounds[i].y, 2));
                        let newydiff = firstChainPointy[i] - sprocketBounds[i].y;
                        let newangle = Phaser.Math.RadToDeg(Math.asin(newydiff / newdistance));

                        if (firstChainPointx[i] > sprocketBounds[i].x) {
                            if (partClickedForLevelSelect.cw) {

                                newangle = newangle + 90;
                            } else {

                                newangle = newangle - 90;
                            }
                        } else {
                            if (partClickedForLevelSelect.cw) {
                                newangle = 270 - newangle;
                            } else {
                                newangle = 90 - newangle;
                            }
                        }
                        for ( let n = 0; n < thisavailablelevels.length; n++ ) {
                            if (thisavailablelevels[n] === chosenLevel) {
                                chosenlevelsprocketonnextpartisopen = true;
                            }
                            // }

                            if (chosenlevelsprocketonnextpartisopen && thisavailablelevels.length > 0) {
                                if (isMobile || isTouchMobile) {
                                    drawTouchDots.bind(self)(sprocketBounds[i].x, sprocketBounds[i].y, sprocketBounds[i].radius, newangle, partClickedForLevelSelect.cw, true, level, false);
                                }
                                // chosenlevelsprocketonnextpartisopen = false;
                            }
                            chosenlevelsprocketonnextpartisopen = false;
                        }
                    }
                }
            }
        }
    }

// ---------------------------------------- DELETE THE ARROW HIGHLIGHTS ---------------------------------------------------- //
    function clearHighlight() {

        if (this.highlightGraphics != null ) {

            this.highlightGraphics.destroy();
            this.highlightGraphics = null;
        }
    }

// ---------------------------------------- DELETE THE MOBILE CHAIN TOUCH DOTS ---------------------------------------------------- //
    function clearChainDots(activedots) {

        for (let l = 0; l < activedots; l++ ) {
            if (chainDots[l] != null) {
                chainDots[l].destroy();
            }
            if (chainArrows[l] != null) {
                chainArrows[l].destroy();
            }
        }
    }

// ---------------------------------------- DRAW THE BACKGROUND GRID ---------------------------------------------------- //
    function drawBackgroundGrid() {
        //var height = mapHeight;//this.cameras.main.height;
        //var width = mapWidth;//this.cameras.main.width;
        let mapLeft = -mapWidth / 2;
        let mapRight = mapWidth / 2;
        let mapTop = -mapHeight / 2;
        let mapBottom = mapHeight / 2;

        this.backgroundGrid = this.add.graphics();

        this.backgroundGrid.lineStyle(1, 0x000000, 0.05);

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
        var yAtMapLeft = (1 / Math.sqrt(3)) * mapLeft;//((-Math.sqrt(2)* mapLeft) / (2 * gridSpacing)) - Math.floor((-Math.sqrt(2)* mapLeft) / (2 * gridSpacing));
        // Going down
        for (var y = yAtMapLeft; y < mapBottom; y += gridSpacing * (2 / Math.sqrt(3))) {
            this.backgroundGrid.lineBetween(mapLeft, y, mapRight, y + (1 / Math.sqrt(3)) * mapWidth);
        }
        // Going up
        for (var y = yAtMapLeft - (gridSpacing * (2 / Math.sqrt(3))); y > mapTop - mapWidth / Math.sqrt(3); y -= gridSpacing * (2 / Math.sqrt(3))) {
            this.backgroundGrid.lineBetween(mapLeft, y, mapRight, y + (1 / Math.sqrt(3)) * mapWidth);
        }

        // m = -1/SQRT(3)
        // yAtMapLeft = -1/SQRT(3) * mapLeft + 0
        yAtMapLeft = (-1 / Math.sqrt(3)) * mapLeft;
        // Going down
        for (var y = yAtMapLeft; y < mapBottom + mapWidth / 2; y += gridSpacing * (2 / Math.sqrt(3))) {
            this.backgroundGrid.lineBetween(mapLeft, y, mapRight, y - (1 / Math.sqrt(3)) * mapWidth);
        }
        // Going up
        for (var y = yAtMapLeft - (gridSpacing * (2 / Math.sqrt(3))); y > mapTop; y -= gridSpacing * (2 / Math.sqrt(3))) {
            this.backgroundGrid.lineBetween(mapLeft, y, mapRight, y + (-1 / Math.sqrt(3)) * mapWidth);
        }

        // red asterik star in middle of background
        this.backgroundGrid.lineStyle(1, 0xFF0000, 0.35);
        this.backgroundGrid.lineBetween(-gridSpacing, 0, gridSpacing, 0);
        this.backgroundGrid.lineBetween(-gridSpacing * (1 / 2), -gridSpacing * (Math.sqrt(3) / 2), gridSpacing * (1 / 2), gridSpacing * (Math.sqrt(3) / 2));
        this.backgroundGrid.lineBetween(-gridSpacing * (1 / 2), gridSpacing * (Math.sqrt(3) / 2), gridSpacing * (1 / 2), -gridSpacing * (Math.sqrt(3) / 2));
        // Now draw lines at 120 deg

    }


    function escapeKeyDown(event) {
        if (partManager.isInTheMiddleOfBuildingAChain()) {
            partManager.cancelChain();
        }
        if (popupLevelChooser != null) {
            popupLevelChooser.cancelPopup();
            popupLevelChooser = null;
            disablePointerOverEvent = false;
        }
        setToInteractMode();
    }

    function getZoomExtents() {
        let zoomExtents = {left: 0, right: 0, top: 0, bottom: 0};
        if (partManager != null) {
            for (let i = 0; i < partManager.parts.length; i++) {
                let partExtents = partManager.parts[i].getPartExtents();
                if (partExtents.left < zoomExtents.left)
                    zoomExtents.left = partExtents.left;
                if (partExtents.right > zoomExtents.right)
                    zoomExtents.right = partExtents.right;
                if (partExtents.top < zoomExtents.top)
                    zoomExtents.top = partExtents.top;
                if (partExtents.bottom > zoomExtents.bottom)
                    zoomExtents.bottom = partExtents.bottom;
            }
        }
        return zoomExtents;
    }

// ---------------------------------------- WINDOW RESIZE ---------------------------------------------------- //
// Kelly Test to add responsive button sizes
    function resize(gameSize, baseSize, displaySize, previousWidth, previousHeight) {
        // console.log("isMobile: ", isMobile, " isTouchMobile: ", isTouchMobile);
        dpr = window.devicePixelRatio;
        width = window.innerWidth * dpr;
        height = window.innerHeight * dpr;

        this.titleText.setX(this.cameras.main.width - (this.titleText.width + 20));
        this.titleText.setY(this.cameras.main.height - (this.titleText.height + 20));
        // console.log("RESIZED -- width: ", window.innerWidth, ", height: ", window.innerHeight, ", dpr: ", dpr);

        buttonContainerHeight = (window.innerHeight - 20) / 12;
        buttonContainerWidth = (window.innerHeight - 20) / 12;
        // console.log("RESIZED - now button container height is: ", buttonContainerHeight);

        if (window.innerHeight > 768) {
            buttonWidth = buttonContainerHeight * .85;
            buttonHeight = buttonContainerHeight * .85;
            // console.log("RESIZED - if inner height more than 800, button height: ", buttonHeight);
        } else if (window.innerHeight > 600 && window.innerHeight <= 768) {
            buttonWidth = 50;
            buttonHeight = 50;
            // console.log("RESIZED - if inner height is between 600 and 800, button height: ", buttonHeight);
        } else if (window.innerHeight <= 600) {
            buttonWidth = 45;
            buttonHeight = 45;
            // console.log("RESIZED - if inner height is less than 600, button height: ", buttonHeight);
        }

        // Kelly Test recreate part buttons with new size
        let buttonX = (buttonContainerWidth / 2) + 6;
        let buttonYoffset = (buttonContainerHeight / 2) + 6;

        this.chainbutton.destroy();
        this.junctionbutton.destroy();
        this.motorbutton.destroy();
        this.resistorbutton.destroy();
        this.capacitorbutton.destroy();
        this.inductorbutton.destroy();
        this.phonographbutton.destroy();
        this.diodebutton.destroy();
        this.buttonbutton.destroy();
        this.transistorbutton.destroy();
        this.levelchangerbutton.destroy();
        this.tilebutton.destroy();
        this.helpbutton.destroy();
        this.interactbutton.destroy();
        this.tilebutton.destroy();
        this.movebutton.destroy();
        this.deletebutton.destroy();
        this.editbutton.destroy();
        this.removeallbutton.destroy();
        this.zoominbutton.destroy();
        this.zoomoutbutton.destroy();
        this.linkbutton.destroy();
        this.savebutton.destroy();
        this.loadbutton.destroy();
        // this.fullscreenbutton.destroy();

        // left side part buttons
        this.chainbutton = new ToggleButton(controlscene, 'chain', buttonX, buttonYoffset, buttonWidth, buttonHeight, 'button-default-background', 'button-hover-background', 'button-selected-background', 'chain-icon', onSwitchToggled, 'button-disabled-background');
        this.chainbutton.setButtonType('toggle');
        this.chainbutton.setTooltipString('Add chain loop', 'right');
        this.junctionbutton = new ToggleButton(controlscene, 'junction', buttonX, buttonYoffset + buttonContainerHeight, buttonWidth, buttonHeight, 'button-default-background', 'button-hover-background', 'button-selected-background', 'junction-icon', onSwitchToggled, 'button-disabled-background');
        this.junctionbutton.setButtonType('toggle');
        this.junctionbutton.setTooltipString('Junction', 'right');
        this.motorbutton = new ToggleButton(controlscene, 'motor', buttonX, buttonYoffset + buttonContainerHeight * 2, buttonWidth, buttonHeight, 'button-default-background', 'button-hover-background', 'button-selected-background', 'motor-icon', onSwitchToggled, 'button-disabled-background');
        this.motorbutton.setButtonType('toggle');
        this.motorbutton.setTooltipString('Battery', 'right');
        this.resistorbutton = new ToggleButton(controlscene, 'resistor', buttonX, buttonYoffset + buttonContainerHeight * 3, buttonWidth, buttonHeight, 'button-default-background', 'button-hover-background', 'button-selected-background', 'resistor-icon', onSwitchToggled, 'button-disabled-background');
        this.resistorbutton.setButtonType('toggle');
        this.resistorbutton.setTooltipString('Resistor', 'right');
        this.capacitorbutton = new ToggleButton(controlscene, 'capacitor', buttonX, buttonYoffset + buttonContainerHeight * 4, buttonWidth, buttonHeight, 'button-default-background', 'button-hover-background', 'button-selected-background', 'capacitor-icon', onSwitchToggled, 'button-disabled-background');
        this.capacitorbutton.setButtonType('toggle');
        this.capacitorbutton.setTooltipString('Capacitor', 'right');
        this.inductorbutton = new ToggleButton(controlscene, 'inductor', buttonX, buttonYoffset + buttonContainerHeight * 5, buttonWidth, buttonHeight, 'button-default-background', 'button-hover-background', 'button-selected-background', 'inductor-icon', onSwitchToggled, 'button-disabled-background');
        this.inductorbutton.setButtonType('toggle');
        this.inductorbutton.setTooltipString('Inductor', 'right');
        this.phonographbutton = new ToggleButton(controlscene, 'phonograph', buttonX, buttonYoffset + buttonContainerHeight * 6, buttonWidth, buttonHeight, 'button-default-background', 'button-hover-background', 'button-selected-background', 'phonograph-icon', onSwitchToggled, 'button-disabled-background');
        this.phonographbutton.setButtonType('toggle');
        this.phonographbutton.setTooltipString('Ammeter', 'right');
        this.diodebutton = new ToggleButton(controlscene, 'diode', buttonX, buttonYoffset + buttonContainerHeight * 7, buttonWidth, buttonHeight, 'button-default-background', 'button-hover-background', 'button-selected-background', 'diode-icon', onSwitchToggled, 'button-disabled-background');
        this.diodebutton.setButtonType('toggle');
        this.diodebutton.setTooltipString('Diode', 'right');
        this.buttonbutton = new ToggleButton(controlscene, 'button', buttonX, buttonYoffset + buttonContainerHeight * 8, buttonWidth, buttonHeight, 'button-default-background', 'button-hover-background', 'button-selected-background', 'button-icon', onSwitchToggled, 'button-disabled-background');
        this.buttonbutton.setButtonType('toggle');
        this.buttonbutton.setTooltipString('Switch', 'right');
        this.transistorbutton = new ToggleButton(controlscene, 'transistor', buttonX, buttonYoffset + buttonContainerHeight * 9, buttonWidth, buttonHeight, 'button-default-background', 'button-hover-background', 'button-selected-background', 'transistor-icon', onSwitchToggled, 'button-disabled-background');
        this.transistorbutton.setButtonType('toggle');
        this.transistorbutton.setTooltipString('Transistor', 'right');
        this.levelchangerbutton = new ToggleButton(controlscene, 'level-changer', buttonX, buttonYoffset + buttonContainerHeight * 10, buttonWidth, buttonHeight, 'button-default-background', 'button-hover-background', 'button-selected-background', 'level-changer-icon', onSwitchToggled, 'button-disabled-background');
        this.levelchangerbutton.setButtonType('toggle');
        this.levelchangerbutton.setTooltipString('Level changer', 'right');
        this.tilebutton = new ToggleButton(controlscene, 'tile', buttonX, buttonYoffset + buttonContainerHeight * 11, buttonWidth, buttonHeight, 'button-default-background', 'button-hover-background', 'button-selected-background', 'tile-icon', onSwitchToggled, 'button-disabled-background');
        this.tilebutton.setButtonType('toggle');
        this.tilebutton.setTooltipString('Tile', 'right');

        // Right side toolbar
        let spaceWidth = this.cameras.main.width;
        let rightSideToolbarPositionX = spaceWidth - 10 - buttonWidth / 2;

        this.helpbutton = new ToggleButton(controlscene, 'inform', rightSideToolbarPositionX, 35, buttonWidth, buttonHeight, 'button-default-background', 'button-hover-background', 'button-selected-background', 'help-icon', onHelpBtnClicked, 'button-disabled-background');
        this.helpbutton.setTooltipString('Instructions', 'left');
        this.interactbutton = new ToggleButton(controlscene, 'interact', rightSideToolbarPositionX, 35, buttonWidth, buttonHeight, 'button-default-background', 'button-hover-background', 'button-selected-background', 'interact-icon', onSwitchToggled, 'button-disabled-background');
        this.interactbutton.setButtonType('toggle');
        this.interactbutton.setTooltipString('Interact', 'left');
        this.movebutton = new ToggleButton(controlscene, 'move', rightSideToolbarPositionX, 35 + 75, buttonWidth, buttonHeight, 'button-default-background', 'button-hover-background', 'button-selected-background', 'move-icon', onSwitchToggled, 'button-disabled-background');
        this.movebutton.setButtonType('toggle');
        this.movebutton.setTooltipString('Reposition part', 'left');
        this.deletebutton = new ToggleButton(controlscene, 'delete', rightSideToolbarPositionX, 35 + 2 * 75, buttonWidth, buttonHeight, 'button-default-background', 'button-hover-background', 'button-selected-background', 'delete-icon', onSwitchToggled, 'button-disabled-background');
        this.deletebutton.setButtonType('toggle');
        this.deletebutton.setTooltipString('Remove part', 'left');
        this.editbutton = new ToggleButton(controlscene, 'edit', rightSideToolbarPositionX, 35 + 3 * 75, buttonWidth, buttonHeight, 'button-default-background', 'button-hover-background', 'button-selected-background', 'edit-icon', onSwitchToggled, 'button-disabled-background');
        this.editbutton.setButtonType('toggle');
        this.editbutton.setTooltipString('Change part properties', 'left');
        this.removeallbutton = new ToggleButton(controlscene, 'remove-all', rightSideToolbarPositionX, 35 + 4 * 75, buttonWidth, buttonHeight, 'button-default-background', 'button-hover-background', 'button-selected-background', 'remove-all-icon', onRemoveAllClicked, 'button-disabled-background');
        this.removeallbutton.setTooltipString('Remove all', 'left');
        this.zoominbutton = new ToggleButton(controlscene, 'zoom-in', rightSideToolbarPositionX, 35 + 4 * 75, buttonWidth, buttonHeight, 'button-default-background', 'button-hover-background', 'button-selected-background', 'zoom-in-icon', onZoomInClicked, 'button-disabled-background');
        this.zoominbutton.setTooltipString('Zoom in', 'left');
        this.zoomoutbutton = new ToggleButton(controlscene, 'zoom-out', rightSideToolbarPositionX, 35 + 5 * 75, buttonWidth, buttonHeight, 'button-default-background', 'button-hover-background', 'button-selected-background', 'zoom-out-icon', onZoomOutClicked, 'button-disabled-background');
        this.zoomoutbutton.setTooltipString('Zoom out', 'left');
        this.linkbutton = new ToggleButton(controlscene, 'link', rightSideToolbarPositionX, 35 + 6 * 75, buttonWidth, buttonHeight, 'button-default-background', 'button-hover-background', 'button-selected-background', 'link-icon', onGenerateLinkClicked, 'button-disabled-background');
        this.linkbutton.setTooltipString('Copy circuit to clipboard', 'left');
        this.savebutton = new ToggleButton(controlscene, 'save', rightSideToolbarPositionX, 35 + 7 * 75, buttonWidth, buttonHeight, 'button-default-background', 'button-hover-background', 'button-selected-background', 'save-icon', onSaveClicked, 'button-disabled-background');
        this.savebutton.setTooltipString('Save circuit', 'left');
        this.loadbutton = new ToggleButton(controlscene, 'load', rightSideToolbarPositionX, 35 + 8 * 75, buttonWidth, buttonHeight, 'button-default-background', 'button-hover-background', 'button-selected-background', 'load-icon', onLoadClicked, 'button-disabled-background');
        this.loadbutton.setTooltipString('Load circuit', 'left');
        // this.fullscreenbutton = new ToggleButton(controlscene, 'full-editor', rightSideToolbarPositionX, 35+9*75, buttonWidth, buttonHeight, 'button-default-background', 'button-hover-background', 'button-selected-background', 'full-screen-icon', onFullEditorClicked, 'button-disabled-background');
        // this.fullscreenbutton.setTooltipString('Open in full simulator', 'left');

        positionLeftSideButtons.bind(this)();
        positionRightSideButtons.bind(this)();

        // this.sceneDimensions has the last dimensions of the view before the resize.

        //let worldCenter = this.cameras.main.getWorldPoint(this.cameras.main.centerX, this.cameras.main.centerY);
        //let topleft = this.cameras.main.getWorldPoint(0,0);
        //let bottomright = this.cameras.main.getWorldPoint(this.cameras.main.width,this.cameras.main.height);

        if (this.useZoomExtents) {
            // Now set the view area (using zoom extents)
            let zoomExtents = getZoomExtents();
            // Find the center of the extents;
            let extentsCenter = {
                x: (zoomExtents.right + zoomExtents.left) / 2,
                y: (zoomExtents.top + zoomExtents.bottom) / 2
            };
            let extentsDimensions = {
                width: zoomExtents.right - zoomExtents.left,
                height: zoomExtents.bottom - zoomExtents.top
            };
            this.cameras.main.centerOn(extentsCenter.x, extentsCenter.y);

            // Get the current view dimensions
            let topleft = self.cameras.main.getWorldPoint(0, 0);
            let bottomright = self.cameras.main.getWorldPoint(self.cameras.main.width, self.cameras.main.height);
            let currentViewDimensions = {width: bottomright.x - topleft.x, height: bottomright.y - topleft.y};

            // Get aspect ratio of each:
            let currentAspectRatio = currentViewDimensions.width / currentViewDimensions.height;
            let extentsAspectRatio = extentsDimensions.width / extentsDimensions.height;

            let neededZoom = 1;
            if (currentAspectRatio >= extentsAspectRatio) {
                // Our current width is greater than in the json. We're going to have to match height to get it to fit correctly.
                neededZoom = (currentViewDimensions.height / extentsDimensions.height);
            } else {
                // Our current height is greater than in the json. We're going to have to match width to get it to fit correctly.
                neededZoom = (currentViewDimensions.width / extentsDimensions.width);
            }

            this.cameras.main.setZoom(neededZoom * this.cameras.main.zoom * 0.9);
        } else {
            // Determine the old center
            let oldCenterX = this.cameras.main.centerX - ((gameSize.width - previousWidth) / 2);
            let oldCenterY = this.cameras.main.centerY - ((gameSize.height - previousHeight) / 2);
            let newPoint = this.cameras.main.getWorldPoint(oldCenterX, oldCenterY);

            this.cameras.main.centerOn(newPoint.x, newPoint.y);

            let neededZoom = (gameSize.width / previousWidth);


            this.cameras.main.setZoom(neededZoom * this.cameras.main.zoom);
        }

    }

// ---------------------------------------- SET UP THE LEFT SIDE PART BUTTONS ---------------------------------------------------- //
    function positionLeftSideButtons() {
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
            this.diodebutton,
            this.buttonbutton,
            this.transistorbutton,
            this.levelchangerbutton
        ];

        let buttonsPerColumn = Math.floor((spaceHeight - (topMargin * 2) - buttonHeight) / (buttonHeight + 10)) + 1;
        let numColumns = Math.ceil(buttons.length / buttonsPerColumn);
        let remainder = buttons.length - (buttonsPerColumn * (numColumns - 1));

        let xPos = (buttonWidth / 2) + leftMargin;
        let yPos = topMargin + (buttonHeight /2);


        for (let i = 0; i < buttons.length; i++) {
            buttons[i].setPosition(xPos, yPos);
            yPos += buttonHeight + 10;
            if (yPos > spaceHeight - (buttonHeight / 2) + topMargin) {
                yPos = topMargin + (buttonHeight / 2);
                xPos += buttonWidth + 10;
            }
        }
    }

// ---------------------------------------- SET UP THE RIGHT SIDE TOOL BUTTONS ---------------------------------------------------- //
    function positionRightSideButtons() {
        let spaceWidth = this.cameras.main.width;
        let spaceHeight = this.cameras.main.height;
        let topMargin = 6;
        let rightMargin = 6;


        let buttons;
        if (!this.viewOnly) {
            buttons = [this.interactbutton,
                this.movebutton,
                this.deletebutton,
                this.editbutton,
                this.zoominbutton,
                this.zoomoutbutton,
                this.linkbutton,
                this.savebutton,
                this.loadbutton,
                this.removeallbutton,
                this.helpbutton];
        } else {
            buttons = [this.zoominbutton,
                this.zoomoutbutton,
                this.fullscreenbutton]
        }

        let buttonsPerColumn = Math.floor((spaceHeight - (topMargin * 2) - buttonHeight) / (buttonHeight + 10)) + 1;
        let numColumns = Math.ceil(buttons.length / buttonsPerColumn);
        let remainder = buttons.length - (buttonsPerColumn * (numColumns - 1));

        let xPos = spaceWidth - 6 - (buttonWidth / 2) - ((numColumns - 1) * (buttonWidth + 10));
        let yPos = topMargin + (buttonHeight / 2);
        let firstColumn = true;
        // console.log("buttons per column: ", buttonsPerColumn, " numColumns: ", numColumns, " remainder: ", remainder);
        // console.log("x position: ", xPos, " y position: ", yPos);
        for (let i = 0; i < buttons.length; i++) {
            buttons[i].setPosition(xPos, yPos);
            yPos += buttonHeight + 10;
            if ((firstColumn && i === (remainder - 1)) || (yPos > spaceHeight - (buttonHeight / 2) + topMargin)) {
                firstColumn = false;
                yPos = topMargin + (buttonHeight / 2);
                xPos += buttonWidth + 10;
            }
        }
    }