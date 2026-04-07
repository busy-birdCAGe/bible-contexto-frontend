import { BACKEND_BUCKET } from "./env";
import { errorMessages, backendApiCacheKey } from "./constants";


type CacheItem = {
    value: any,
    timestamp: number
}

type Cache = Record<string, CacheItem>

export default class BackendApi {

    private localStorageCache: Cache
    private static memoryCache: Cache = {};

    constructor() {
        this.localStorageCache = JSON.parse(localStorage.getItem(backendApiCacheKey) || "{}");
    }

    async get(
        key: string,
        memoryOnly: boolean = false,
        maxAge: number | null = 0,
    ): Promise<string> {
        const currentTime = Date.now() / 1000;
        const cache: Cache = memoryOnly ? BackendApi.memoryCache : this.localStorageCache;
        const cachedItem = cache[key];
        const cacheMiss = cachedItem === undefined;
        const expired = !cacheMiss && maxAge !== null && currentTime - cachedItem.timestamp > maxAge
        if (!cacheMiss && !expired) {
            return cachedItem.value;
        }
        const response = await fetch(`${BACKEND_BUCKET}/${key}`);
        if (!response.ok) {
            throw new Error(errorMessages.backend.any);
        }
        const value = await response.text();
        cache[key] = { value, timestamp: currentTime };
        if (!memoryOnly) {
            localStorage.setItem(backendApiCacheKey, JSON.stringify(this.localStorageCache));
        }
        return value;
    }

}
