/// <reference path="./adal-angular.d.ts" />
import { Observable } from 'rxjs';
export declare class AdalService {
    private context;
    private user;
    constructor();
    init(configOptions: adal.Config): void;
    readonly config: adal.Config;
    readonly userInfo: adal.User;
    login(): void;
    loginInProgress(): boolean;
    logOut(): void;
    handleWindowCallback(): void;
    getCachedToken(resource: string): string;
    acquireToken(resource: string): Observable<any>;
    getUser(): Observable<any>;
    clearCache(): void;
    clearCacheForResource(resource: string): void;
    info(message: string): void;
    verbose(message: string): void;
    GetResourceForEndpoint(url: string): string;
    refreshDataFromCache(): void;
    private updateDataFromCache(resource);
}
