/* Asset cache responsible for loading and storing images for further access.
 * Implemented as a singleton for global access.
 */
class AssetCache {
    #cache = {};

    constructor() {
        if(AssetCache.exists) {
            return AssetCache.instance;
        }
        AssetCache.exists = true;
        AssetCache.instance = this;
        return this;
    }

    // Find and cache the image with given filename
    cacheImage(filename) {
        this.#cache[filename] = loadImage("/images/" + filename);
    }

    // Access the image data with given filename
    getImage(filename) {
        return this.#cache[filename];
    }
}
