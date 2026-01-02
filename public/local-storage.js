/**
 * Local Storage Manager for Spintronics Simulator
 * Handles saving and loading circuits to browser localStorage
 */

const STORAGE_KEY = 'spintronics_circuits';
const AUTOSAVE_KEY = 'spintronics_autosave';

/**
 * Get all saved circuits from localStorage
 * @returns {Object} Object with circuit names as keys and circuit data as values
 */
export function getSavedCircuits() {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : {};
    } catch (e) {
        console.error('Error reading saved circuits:', e);
        return {};
    }
}

/**
 * Save a circuit to localStorage
 * @param {string} name - The name for this circuit
 * @param {string} circuitJSON - The circuit data as JSON string
 * @returns {boolean} True if save was successful
 */
export function saveCircuit(name, circuitJSON) {
    try {
        const circuits = getSavedCircuits();
        circuits[name] = {
            data: circuitJSON,
            savedAt: new Date().toISOString()
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(circuits));
        return true;
    } catch (e) {
        console.error('Error saving circuit:', e);
        return false;
    }
}

/**
 * Load a circuit from localStorage
 * @param {string} name - The name of the circuit to load
 * @returns {string|null} The circuit JSON string or null if not found
 */
export function loadCircuit(name) {
    try {
        const circuits = getSavedCircuits();
        return circuits[name]?.data || null;
    } catch (e) {
        console.error('Error loading circuit:', e);
        return null;
    }
}

/**
 * Delete a circuit from localStorage
 * @param {string} name - The name of the circuit to delete
 * @returns {boolean} True if delete was successful
 */
export function deleteCircuit(name) {
    try {
        const circuits = getSavedCircuits();
        if (circuits[name]) {
            delete circuits[name];
            localStorage.setItem(STORAGE_KEY, JSON.stringify(circuits));
            return true;
        }
        return false;
    } catch (e) {
        console.error('Error deleting circuit:', e);
        return false;
    }
}

/**
 * Rename a circuit in localStorage
 * @param {string} oldName - The current name of the circuit
 * @param {string} newName - The new name for the circuit
 * @returns {boolean} True if rename was successful
 */
export function renameCircuit(oldName, newName) {
    try {
        const circuits = getSavedCircuits();
        if (circuits[oldName] && !circuits[newName]) {
            circuits[newName] = circuits[oldName];
            delete circuits[oldName];
            localStorage.setItem(STORAGE_KEY, JSON.stringify(circuits));
            return true;
        }
        return false;
    } catch (e) {
        console.error('Error renaming circuit:', e);
        return false;
    }
}

/**
 * Auto-save the current circuit (overwrites previous autosave)
 * @param {string} circuitJSON - The circuit data as JSON string
 */
export function autoSave(circuitJSON) {
    try {
        localStorage.setItem(AUTOSAVE_KEY, JSON.stringify({
            data: circuitJSON,
            savedAt: new Date().toISOString()
        }));
    } catch (e) {
        console.error('Error auto-saving circuit:', e);
    }
}

/**
 * Get the auto-saved circuit
 * @returns {Object|null} Object with data and savedAt, or null if none exists
 */
export function getAutoSave() {
    try {
        const data = localStorage.getItem(AUTOSAVE_KEY);
        return data ? JSON.parse(data) : null;
    } catch (e) {
        console.error('Error reading autosave:', e);
        return null;
    }
}

/**
 * Clear the auto-save
 */
export function clearAutoSave() {
    try {
        localStorage.removeItem(AUTOSAVE_KEY);
    } catch (e) {
        console.error('Error clearing autosave:', e);
    }
}

/**
 * Get list of saved circuit names with metadata
 * @returns {Array} Array of {name, savedAt} objects sorted by date (newest first)
 */
export function getCircuitList() {
    const circuits = getSavedCircuits();
    return Object.entries(circuits)
        .map(([name, info]) => ({
            name,
            savedAt: info.savedAt
        }))
        .sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt));
}

/**
 * Check if localStorage is available
 * @returns {boolean} True if localStorage is available
 */
export function isStorageAvailable() {
    try {
        const test = '__storage_test__';
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
    } catch (e) {
        return false;
    }
}

/**
 * Get total storage used by circuits (approximate)
 * @returns {number} Bytes used
 */
export function getStorageUsed() {
    try {
        const circuits = localStorage.getItem(STORAGE_KEY) || '';
        const autosave = localStorage.getItem(AUTOSAVE_KEY) || '';
        return new Blob([circuits, autosave]).size;
    } catch (e) {
        return 0;
    }
}
