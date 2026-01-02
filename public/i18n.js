/**
 * Internationalization (i18n) Manager for Spintronics Simulator
 * Handles loading and switching between languages for tooltips and UI text.
 */

class I18nManager {
    constructor() {
        this.currentLang = 'en';
        this.translations = {};
        this.availableLanguages = [];
        this.listeners = [];
        this.initialized = false;
    }

    /**
     * Initialize the i18n system
     * Loads saved language preference or detects from browser
     */
    async init() {
        // Load saved preference, or detect from browser, or default to English
        const savedLang = localStorage.getItem('spintronics-lang');
        const browserLang = navigator.language?.split('-')[0];

        // Load available languages list
        try {
            const response = await fetch('i18n/index.json');
            const index = await response.json();
            this.availableLanguages = index.languages;
        } catch (e) {
            console.warn('Could not load language index, using defaults');
            this.availableLanguages = [
                { code: 'en', name: 'English', flag: 'GB' },
                { code: 'nl', name: 'Nederlands', flag: 'NL' },
                { code: 'fr', name: 'Francais', flag: 'FR' },
                { code: 'de', name: 'Deutsch', flag: 'DE' }
            ];
        }

        // Determine which language to use
        let langToLoad = 'en';
        if (savedLang && this.isLanguageAvailable(savedLang)) {
            langToLoad = savedLang;
        } else if (browserLang && this.isLanguageAvailable(browserLang)) {
            langToLoad = browserLang;
        }

        await this.loadLanguage(langToLoad);
        this.initialized = true;
    }

    /**
     * Check if a language code is available
     */
    isLanguageAvailable(langCode) {
        return this.availableLanguages.some(l => l.code === langCode);
    }

    /**
     * Load a language file
     */
    async loadLanguage(langCode) {
        try {
            const response = await fetch(`i18n/${langCode}.json`);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            this.translations = await response.json();
            this.currentLang = langCode;
            localStorage.setItem('spintronics-lang', langCode);

            // Notify listeners of language change
            this.listeners.forEach(callback => callback(langCode));

            return true;
        } catch (e) {
            console.warn(`Could not load language '${langCode}':`, e.message);
            // Fallback to English if not already trying English
            if (langCode !== 'en') {
                return this.loadLanguage('en');
            }
            return false;
        }
    }

    /**
     * Register a callback for language changes
     */
    onLanguageChange(callback) {
        this.listeners.push(callback);
    }

    /**
     * Remove a language change listener
     */
    offLanguageChange(callback) {
        this.listeners = this.listeners.filter(cb => cb !== callback);
    }

    /**
     * Get the current language code
     */
    getCurrentLanguage() {
        return this.currentLang;
    }

    /**
     * Get list of available languages
     */
    getAvailableLanguages() {
        return this.availableLanguages;
    }

    /**
     * Get a rich tooltip for a component (for toolbar buttons)
     * Returns object with name, shortcut, description, equivalent
     */
    getComponentInfo(componentId) {
        const comp = this.translations.components?.[componentId];
        if (!comp) {
            return {
                name: componentId,
                shortcut: '',
                description: '',
                equivalent: ''
            };
        }
        return {
            name: comp.name,
            shortcut: comp.shortcut,
            description: comp.description,
            equivalent: comp.electronic_equivalent
        };
    }

    /**
     * Get a formatted tooltip string for a component
     */
    getComponentTooltip(componentId) {
        const info = this.getComponentInfo(componentId);
        if (!info.description) {
            return info.shortcut ? `${info.name} [${info.shortcut}]` : info.name;
        }
        return info;
    }

    /**
     * Get tool info (interact, move, delete, edit)
     */
    getToolInfo(toolId) {
        const tool = this.translations.tools?.[toolId];
        if (!tool) {
            return { name: toolId, shortcut: '', description: '' };
        }
        return {
            name: tool.name,
            shortcut: tool.shortcut || '',
            description: tool.description
        };
    }

    /**
     * Generic translation lookup
     * Usage: i18n.t('ui.loading') -> "Loading..."
     */
    t(key, fallback = null) {
        const value = key.split('.').reduce((obj, k) => obj?.[k], this.translations);
        return value ?? fallback ?? key;
    }
}

// Export singleton instance
export const i18n = new I18nManager();
