// Internationalization (i18n) module for Spintronics Simulator.
//
// Usage:
//   import { t, setLanguage, getLanguage, initI18n } from './i18n.js';
//   initI18n();              // detect language from URL ?lang=xx or browser
//   t('tooltip.junction')    // returns translated string
//   t('level.n', { n: 2 })   // interpolated: "Level 2" / "第 2 层"
//
// Adding a new language: add an entry to `translations` below with the same
// keys. If a key is missing for the current language, English is used as the
// fallback so the UI never breaks.

const translations = {
    en: {
        // HTML <head> / preloader
        'html.title': 'Spintronics Simulator',
        'html.description': 'Spintronics Simulator - Build and test spintronic circuits online.',
        'preloader.loading': 'Loading Spintronics Simulator v1.0...',

        // Phaser preloader
        'loading.text': 'Loading...',
        'loading.asset': 'Loading asset: {key}',

        // Left toolbar tooltips (parts)
        'tooltip.chain': 'Add chain loop',
        'tooltip.junction': 'Junction',
        'tooltip.motor': 'Battery',
        'tooltip.resistor': 'Resistor',
        'tooltip.capacitor': 'Capacitor',
        'tooltip.inductor': 'Inductor',
        'tooltip.phonograph': 'Ammeter',
        'tooltip.diode': 'Diode',
        'tooltip.button': 'Switch',
        'tooltip.transistor': 'Transistor',
        'tooltip.levelChanger': 'Level changer',
        'tooltip.tile': 'Tile',

        // Right toolbar tooltips (tools)
        'tooltip.interact': 'Interact',
        'tooltip.move': 'Reposition part',
        'tooltip.delete': 'Remove part',
        'tooltip.edit': 'Change part properties',
        'tooltip.removeAll': 'Remove all',
        'tooltip.zoomIn': 'Zoom in',
        'tooltip.zoomOut': 'Zoom out',
        'tooltip.link': 'Copy circuit to clipboard',
        'tooltip.save': 'Save circuit',
        'tooltip.load': 'Load circuit',
        'tooltip.fullEditor': 'Open in full simulator',

        // Generate link dialog: no parts
        'link.error.noPartsTitle': 'Cannot create link:',
        'link.error.noPartsBody': 'There are no parts in your circuit!',

        // Generate link dialog: success
        'link.success.title': 'Link created successfully!',
        'link.success.body': 'Copy the following link and paste it into a browser to load your circuit:',
        'link.success.copy': 'Copy',
        'link.success.done': 'Done',

        // Generate link dialog: failure
        'link.error.title': 'Error creating link:',
        'link.error.body': 'Unfortunately, a link could not be created. Please contact hello@upperstory.com so we can fix the problem.',

        // Shared dialog button
        'dialog.ok': 'OK',

        // Chain level chooser
        'level.n': 'Level {n}',

        // Part value unit suffixes
        'unit.farad': 'F',
        'unit.millifarad': 'mF',
        'unit.microfarad': 'μF',
        'unit.henry': 'H',
        'unit.millihenry': 'mH',
        'unit.microhenry': 'μH',
        'unit.kilohenry': 'kH',
        'unit.ohm': 'Ω',
        'unit.kiloohm': 'kΩ',
        'unit.megaohm': 'MΩ',
    },
    zh: {
        // HTML <head> / preloader
        'html.title': '自旋电子学模拟器',
        'html.description': '自旋电子学模拟器 - 在线搭建并测试自旋电子电路。',
        'preloader.loading': '正在加载自旋电子学模拟器 v1.0...',

        // Phaser preloader
        'loading.text': '加载中...',
        'loading.asset': '正在加载资源：{key}',

        // Left toolbar tooltips (parts)
        'tooltip.chain': '添加链条回路',
        'tooltip.junction': '连接节点',
        'tooltip.motor': '电池',
        'tooltip.resistor': '电阻',
        'tooltip.capacitor': '电容',
        'tooltip.inductor': '电感',
        'tooltip.phonograph': '电流表',
        'tooltip.diode': '二极管',
        'tooltip.button': '开关',
        'tooltip.transistor': '晶体管',
        'tooltip.levelChanger': '层级变换器',
        'tooltip.tile': '瓷砖',

        // Right toolbar tooltips (tools)
        'tooltip.interact': '交互',
        'tooltip.move': '重新定位元件',
        'tooltip.delete': '删除元件',
        'tooltip.edit': '修改元件属性',
        'tooltip.removeAll': '全部清除',
        'tooltip.zoomIn': '放大',
        'tooltip.zoomOut': '缩小',
        'tooltip.link': '复制电路到剪贴板',
        'tooltip.save': '保存电路',
        'tooltip.load': '加载电路',
        'tooltip.fullEditor': '在完整模拟器中打开',

        // Generate link dialog: no parts
        'link.error.noPartsTitle': '无法创建链接：',
        'link.error.noPartsBody': '电路中没有任何元件！',

        // Generate link dialog: success
        'link.success.title': '链接创建成功！',
        'link.success.body': '复制以下链接并粘贴到浏览器中以加载您的电路：',
        'link.success.copy': '复制',
        'link.success.done': '完成',

        // Generate link dialog: failure
        'link.error.title': '创建链接时出错：',
        'link.error.body': '很遗憾，无法创建链接。请联系 hello@upperstory.com 以便我们修复此问题。',

        // Shared dialog button
        'dialog.ok': '确定',

        // Chain level chooser
        'level.n': '第 {n} 层',

        // Part value unit suffixes (units are typically kept as-is; translated for completeness)
        'unit.farad': 'F',
        'unit.millifarad': 'mF',
        'unit.microfarad': 'μF',
        'unit.henry': 'H',
        'unit.millihenry': 'mH',
        'unit.microhenry': 'μH',
        'unit.kilohenry': 'kH',
        'unit.ohm': 'Ω',
        'unit.kiloohm': 'kΩ',
        'unit.megaohm': 'MΩ',
    },
};

const supportedLanguages = Object.keys(translations);
let currentLang = 'en';
let initialized = false;

function detectLanguage() {
    // 1. Explicit override via URL query: ?lang=zh
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const langParam = urlParams.get('lang');
        if (langParam && translations[langParam]) {
            return langParam;
        }
    } catch (e) {
        // window may not be available in some contexts
    }

    // 2. Previously stored preference
    try {
        const stored = window.localStorage.getItem('spin_lang');
        if (stored && translations[stored]) {
            return stored;
        }
    } catch (e) {
        // localStorage may be unavailable
    }

    // 3. Browser language
    try {
        const browserLang = (navigator.language || navigator.userLanguage || 'en').slice(0, 2).toLowerCase();
        if (translations[browserLang]) {
            return browserLang;
        }
    } catch (e) {
        // navigator may be unavailable
    }

    // 4. Fallback
    return 'en';
}

export function initI18n() {
    if (initialized) return currentLang;
    currentLang = detectLanguage();
    initialized = true;
    return currentLang;
}

export function getLanguage() {
    return currentLang;
}

export function setLanguage(lang) {
    if (!translations[lang]) {
        return false;
    }
    currentLang = lang;
    try {
        window.localStorage.setItem('spin_lang', lang);
    } catch (e) {
        // ignore storage errors
    }
    return true;
}

export function getSupportedLanguages() {
    return supportedLanguages.slice();
}

// Translate a key, with optional {param} interpolation.
// Falls back to English, then to the key itself, so a missing translation
// never produces an empty UI.
export function t(key, params = {}) {
    const table = translations[currentLang] || translations.en;
    let str = table[key];
    if (str === undefined) {
        str = translations.en[key];
    }
    if (str === undefined) {
        return key;
    }
    if (params && typeof str === 'string') {
        str = str.replace(/\{(\w+)\}/g, (match, name) =>
            (params[name] !== undefined ? String(params[name]) : match)
        );
    }
    return str;
}
