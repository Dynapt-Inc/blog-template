let runtimeConfig = null;
let warnedAboutMissingConfig = false;
function cloneConfig(config) {
    try {
        return structuredClone(config);
    }
    catch {
        return JSON.parse(JSON.stringify(config));
    }
}
export function initializeBrandConfig(config) {
    runtimeConfig = cloneConfig(config);
    warnedAboutMissingConfig = false;
}
function defaultBrandConfig() {
    return {
        site: {},
    };
}
export function getBrandConfig() {
    if (!runtimeConfig) {
        if (!warnedAboutMissingConfig) {
            console.warn("[brand-config] No runtime brand configuration detected; falling back to defaults.");
            warnedAboutMissingConfig = true;
        }
        runtimeConfig = defaultBrandConfig();
    }
    return runtimeConfig;
}
export function defineBrandConfig(config) {
    return config;
}
