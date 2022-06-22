// import * as Phaser from 'phaser';

import AnchorFactory from './anchor/Factory.js';
import BadgeLabelFactory from './badgelabel/Factory';
import BBCodeTextFactory from './bbcodetext/Factory';
import ButtonsFactory from './buttons/Factory';
import CanvasFactory from './canvas/Factory';
import CircleMaskImageFactory from './circlemaskimage/Factory';
import CircularProgressCanvasFactory from './circularprogresscanvas/Factory';
import CircularProgressFactory from './circularprogress/Factory';
import ClickFactory from './click/Factory';
import ClickOutsideFactory from './clickoutside/Factory';
import ContainerFactory from './container/Factory';
import CoverFactory from './cover/Factory';
import CustomProgressFactory from './customprogress/Factory';
import CustomShapesFactory from './customshapes/Factory';
import DialogFactory from './dialog/Factory';
import DragFactory from './drag/Factory';
import DropDownListFactory from './dropdownlist/Factory';
import DynamicTextFactory from './dynamictext/Factory';
import FlipFactory from './flip/Factory';
import FixWidthButtonsFactory from './fixwidthbuttons/Factory';
import FixWidthSizerFactory from './fixwidthsizer/Factory';
import FullWindowRectangleFactory from './fullwindowrectangle/Factory.js';
import GridButtonsFactory from './gridbuttons/Factory';
import GridSizerFactory from './gridsizer/Factory';
import GridTableFactory from './gridtable/Factory';
import HiddenEditFactory from './hiddenedit/Factory';
import HolyGrailFactory from './holygrail/Factory';
import KnobFactory from './knob/Factory';
import LabelFactory from './label/Factory';
import MakerFactory from './maker/Factory';
import MenuFactory from './menu/Factory';
import NinePatchFactory from './ninepatch/Factory';
import NinePatch2Factory from './ninepatch2/Factory';
import NumberBarFactory from './numberbar/Factory';
import OverlapSizerFactory from './overlapsizer/Factory';
import PagesFactory from './pages/Factory';
import PanFactory from './pan/Factory';
import PerspectiveFactory from './perspective/Factory';
import PinchFactory from './pinch/Factory';
import PressFactory from './press/Factory';
import RotateFactory from './rotate/Factory';
import RoundRectangleCanvasFactory from './roundrectanglecanvas/Factory';
import RoundRectangleFactory from './roundrectangle/Factory';
import ScrollablePanelFactory from './scrollablepanel/Factory';
import ScrollBarFactory from './scrollbar/Factory';
import SizerFactory from './sizer/Factory';
import ShakeFactory from './shake/Factory';
import SliderFactory from './slider/Factory';
import SpaceFactory from './space/Factory';
import SwipeFactory from './swipe/Factory';
import TabsFactory from './tabs/Factory';
import TabPagesFactory from './tabpages/Factory';
import TagTextFactory from './tagtext/Factory';
import TapFactory from './tap/Factory';
import TextAreaFactory from './textarea/Factory';
import TextBoxFactory from './textbox/Factory';
import TextPlayerFactory from './textplayer/Factory';
import ToastFactory from './toast/Factory';
import TouchEventStopFactory from './toucheventstop/Factory';

import { EaseMoveTo, EaseMoveFrom } from './easemove/EaseMove';
import { Edit } from '../../plugins/textedit';
import { FadeIn, FadeOutDestroy } from './fade/Fade';
import { Modal, ModalPromise, ModalClose } from './modal/Modal';
import { GetParentSizer, GetTopmostSizer } from './utils/GetParentSizer';
import { Show, Hide, IsShown, } from './utils/Hide';
import SetChildrenInteractive from './utils/setchildreninteractive/SetChildrenInteractive';
import { WaitEvent, WaitComplete } from './utils/WaitEvent';
import Delay from '../../plugins/utils/promise/Delay';
import WrapExpandText from './utils/wrapexpandtext/WrapExpandText';
import RequestDrag from '../../plugins/utils/input/RequestDrag';
import Make from './maker/YAMLMake';
import MakerClass from './maker/Maker';
import yaml from './yaml/yaml';

export default UIPlugins;

declare class Factories {
    anchor: typeof AnchorFactory;
    badgeLabel: typeof BadgeLabelFactory;
    BBCodeText: typeof BBCodeTextFactory;
    buttons: typeof ButtonsFactory;
    canvas: typeof CanvasFactory;
    circleMaskImage: typeof CircleMaskImageFactory;
    circularProgressCanvas: typeof CircularProgressCanvasFactory;
    circularProgress: typeof CircularProgressFactory;
    click: typeof ClickFactory;
    clickOutside: typeof ClickOutsideFactory;
    container: typeof ContainerFactory;
    cover: typeof CoverFactory;
    customProgress: typeof CustomProgressFactory;
    customShapes: typeof CustomShapesFactory;
    dialog: typeof DialogFactory;
    drag: typeof DragFactory;
    dropDownList: typeof DropDownListFactory;
    dynamicTextFactory: typeof DynamicTextFactory;
    flip: typeof FlipFactory;
    fixWidthButtons: typeof FixWidthButtonsFactory;
    fixWidthSizer: typeof FixWidthSizerFactory;
    fullWindowRectangle: typeof FullWindowRectangleFactory;
    gridButtons: typeof GridButtonsFactory;
    gridSizer: typeof GridSizerFactory;
    gridTable: typeof GridTableFactory;
    hiddenEdit: typeof HiddenEditFactory;
    HolyGrail: typeof HolyGrailFactory;
    knob: typeof KnobFactory;
    label: typeof LabelFactory;
    maker: typeof MakerFactory;
    menu: typeof MenuFactory;
    ninePatch: typeof NinePatchFactory;
    ninePatch2: typeof NinePatch2Factory;
    numberBar: typeof NumberBarFactory;
    overlapSizer: typeof OverlapSizerFactory;
    pages: typeof PagesFactory;
    pan: typeof PanFactory;
    perspective: typeof PerspectiveFactory;
    pinch: typeof PinchFactory;
    press: typeof PressFactory;
    rotate: typeof RotateFactory;
    roundRectangleCanvas: typeof RoundRectangleCanvasFactory;
    roundRectangle: typeof RoundRectangleFactory;
    scrollablePanel: typeof ScrollablePanelFactory;
    scrollBar: typeof ScrollBarFactory;
    sizer: typeof SizerFactory;
    shake: typeof ShakeFactory;
    slider: typeof SliderFactory;
    space: typeof SpaceFactory;
    swipe: typeof SwipeFactory;
    tabs: typeof TabsFactory;
    TabPages: typeof TabPagesFactory;
    tagText: typeof TagTextFactory;
    tap: typeof TapFactory;
    textArea: typeof TextAreaFactory;
    textBox: typeof TextBoxFactory;
    textPlayer: typeof TextPlayerFactory;
    toast: typeof ToastFactory;
    touchEventStop: typeof TouchEventStopFactory;
}

declare class UIPlugins extends Phaser.Plugins.ScenePlugin {
    add: Factories;


    easeMoveTo: typeof EaseMoveTo;
    easeMoveFrom: typeof EaseMoveFrom;
    edit: typeof Edit;
    fadeIn: typeof FadeIn;
    fadeOutDestroy: typeof FadeOutDestroy;
    modal: typeof Modal;
    modalPromise: typeof ModalPromise;
    modalClose: typeof ModalClose;
    getParentSizer: typeof GetParentSizer;
    getTopmostSizer: typeof GetTopmostSizer;
    hide: typeof Hide;
    show: typeof Show;
    isShown: typeof IsShown;
    setChildrenInteractive: typeof SetChildrenInteractive;
    waitEvent: typeof WaitEvent;
    waitComplete: typeof WaitComplete;
    delayPromise: typeof Delay;
    wrapExpandText: typeof WrapExpandText;
    requestDrag: typeof RequestDrag;

    isInTouching(
        gameObject: Phaser.GameObjects.GameObject,
        pointer?: Phaser.Input.Pointer,
        preTest?: (gameObject: Phaser.GameObjects.GameObject, x: number, y: number) => boolean,
        postTest?: (gameObject: Phaser.GameObjects.GameObject, x: number, y: number) => boolean,
    ): boolean;

    readonly viewport: Phaser.Geom.Rectangle;

    make(
        data: Object | string,
        view?: Object | string,
        styles?: Object | string,
        customBuilders?: Make.CustomBuildersType
    ): Phaser.GameObjects.GameObject;

    readonly maker: MakerClass;

    yaml: yaml;
}


import BadgeLabelClass from './badgelabel/BadgeLabel';
import BBCodeTextClass from './bbcodetext/BBCodeText';
import ButtonsClass from './buttons/Buttons';
import CanvasClass from './canvas/Canvas';
import CircleMaskImageClass from './circlemaskimage/CircleMaskImage';
import CircularProgressCanvasClass from './circularprogresscanvas/CircularProgressCanvas';
import CircularProgressClass from './circularprogress/CircularProgress';
import ClickClass from './click/Click';
import ClickOutsideClass from './clickoutside/ClickOutside';
import ContainerClass from './container/Container';
import CoverClass from './cover/Cover';
import CustomProgressClass from './customprogress/CustomProgress';
import CustomShapesClass from './customshapes/CustomShapes';
import DialogClass from './dialog/Dialog';
import DragClass from './drag/Drag';
import DropDownListClass from './dropdownlist/DropDownList';
import DynamicTextClass from './dynamictext/DynamicText';
import { EaseMove as EaseMoveClass } from './easemove/EaseMove'
import { Fade as FadeClass } from './fade/Fade.js';
import FlipClass from './flip/Flip';
import FixWidthButtonsClass from './fixwidthbuttons/FixWidthButtons';
import FullWindowRectangleClass from './fullwindowrectangle/FullWindowRectangle';
import FixWidthSizerClass from './fixwidthsizer/FixWidthSizer';
import GridButtonsClass from './gridbuttons/GridButtons';
import GridSizerClass from './gridsizer/GridSizer';
import GridTableClass from './gridtable/GridTable';
import HiddenTextEditClass from './hiddenedit/HiddenEdit.js';
import HolyGrailClass from './holygrail/HolyGrail';
import KnobClass from './knob/Knob';
import LabelClass from './label/Label';
import MenuClass from './menu/Menu';
import NinePatchClass from './ninepatch/NinePatch';
import NumberBarClass from './numberbar/NumberBar';
import OverlapSizerClass from './overlapsizer/OverlapSizer';
import PagesClass from './pages/Pages';
import PanClass from './pan/Pan';
import PerspectiveClass from './perspective/Perspective';
import PinchClass from './pinch/Pinch';
import PressClass from './press/Press';
import RotateClass from './rotate/Rotate';
import RoundRectangleCanvasClass from './roundrectanglecanvas/RoundRectangleCanvas';
import RoundRectangleClass from './roundrectangle/RoundRectangle';
import ScrollablePanelClass from './scrollablepanel/ScrollablePanel';
import ScrollBarClass from './scrollbar/ScrollBar';
import SizerClass from './sizer/Sizer';
import ShakeClass from './shake/Shake';
import SliderClass from './slider/Slider';
import SpaceClass from './space/Space';
import SwipeClass from './swipe/Swipe';
import TabsClass from './tabs/Tabs';
import TabPagesClass from './tabpages/TabPages';
import TagTextClass from './tagtext/TagText';
import TapClass from './tap/Tap';
import TextAreaClass from './textarea/TextArea';
import TextBoxClass from './textbox/TextBox';
import TextPlayerClass from './textplayer/TextPlayer';
import ToastClass from './toast/Toast';
import TouchEventStopClass from './toucheventstop/TouchEventStop';

declare namespace UIPlugins {
    type BadgeLabel = BadgeLabelClass;
    type BBCodeText = BBCodeTextClass;
    type Buttons = ButtonsClass;
    type Canvas = CanvasClass;
    type CircleMaskImage = CircleMaskImageClass;
    type CircularProgressCanvas = CircularProgressCanvasClass;
    type CircularProgress = CircularProgressClass;
    type Click = ClickClass;
    type ClickOutside = ClickOutsideClass;
    type Container = ContainerClass;
    type Cover = CoverClass;
    type CustomProgress = CustomProgressClass;
    type CustomShapes = CustomShapesClass;
    type Dialog = DialogClass;
    type Drag = DragClass;
    type DropDownList = DropDownListClass;
    type DynamicText = DynamicTextClass;
    type EaseMove = EaseMoveClass;
    type Fade = FadeClass;
    type Flip = FlipClass;
    type FixWidthButtons = FixWidthButtonsClass;
    type FullWindowRectangle = FullWindowRectangleClass;
    type FixWidthSizer = FixWidthSizerClass;
    type GridButtons = GridButtonsClass;
    type GridSizer = GridSizerClass;
    type GridTable = GridTableClass;
    type HiddenEdit = HiddenTextEditClass;
    type HolyGrail = HolyGrailClass;
    type Knob = KnobClass;
    type Label = LabelClass;
    type maker = MakerClass;
    type Menu = MenuClass;
    type NinePatch = NinePatchClass;
    type NumberBar = NumberBarClass;
    type OverlapSizer = OverlapSizerClass;
    type Pages = PagesClass;
    type Pan = PanClass;
    type Perspective = PerspectiveClass;
    type Pinch = PinchClass;
    type Press = PressClass;
    type Rotate = RotateClass;
    type RoundRectangleCanvas = RoundRectangleCanvasClass;
    type RoundRectangle = RoundRectangleClass;
    type ScrollablePanel = ScrollablePanelClass;
    type ScrollBar = ScrollBarClass;
    type Sizer = SizerClass;
    type shake = ShakeClass;
    type Slider = SliderClass;
    type Swipe = SwipeClass;
    type Space = SpaceClass;
    type Tabs = TabsClass;
    type TabPages = TabPagesClass;
    type TagText = TagTextClass;
    type Tap = TapClass;
    type TextArea = TextAreaClass;
    type TextBox = TextBoxClass;
    type TextPlayer = TextPlayerClass;
    type Toast = ToastClass;
    type TouchEventStop = TouchEventStopClass;
}