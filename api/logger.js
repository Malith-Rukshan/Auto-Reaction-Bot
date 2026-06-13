/*!
 * © [2026] Malith-Rukshan. All rights reserved.
 * Repository: https://github.com/Malith-Rukshan/Auto-Reaction-Bot
 *
 * Tiny level-based logger. Controlled by the LOG_LEVEL env var.
 * Levels (most to least verbose): debug > info > warn > error > silent
 * Anything below the active level is dropped, so set LOG_LEVEL=warn (or
 * error) to quiet things down, or LOG_LEVEL=debug to see full details.
 */

const LEVELS = { silent: 0, error: 1, warn: 2, info: 3, debug: 4 };

// Default keeps info/warn/error, hides the noisy per-request debug details.
let currentLevel = LEVELS.info;

/**
 * Set the active log level. Unknown values are ignored (level stays as-is).
 * @param {string} level - one of: silent, error, warn, info, debug
 */
export function setLogLevel(level) {
    if (level === undefined || level === null) return;
    const normalized = String(level).toLowerCase().trim();
    if (normalized in LEVELS) {
        currentLevel = LEVELS[normalized];
    }
}

// Initialize from process.env when running under Node (Express/VPS/Docker).
// Cloudflare Workers don't expose `process`, so guard the access — there the
// level is applied from `env.LOG_LEVEL` via setLogLevel() in worker.js.
if (typeof process !== 'undefined' && process.env && process.env.LOG_LEVEL) {
    setLogLevel(process.env.LOG_LEVEL);
}

function emit(level, method, args) {
    if (LEVELS[level] <= currentLevel) {
        console[method](...args);
    }
}

export const logger = {
    error: (...args) => emit('error', 'error', args),
    warn: (...args) => emit('warn', 'warn', args),
    info: (...args) => emit('info', 'log', args),
    debug: (...args) => emit('debug', 'log', args),
};
