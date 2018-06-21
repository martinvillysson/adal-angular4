import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { mergeMap } from 'rxjs/operators';
import { AdalService } from './adal.service';
var AdalInterceptor = /** @class */ (function () {
    function AdalInterceptor(adal) {
        this.adal = adal;
    }
    AdalInterceptor.prototype.intercept = function (req, next) {
        // if the endpoint is not registered then pass
        // the request as it is to the next handler
        var resource = this.adal.GetResourceForEndpoint(req.url);
        if (!resource) {
            return next.handle(req.clone());
        }
        // if the user is not authenticated then drop the request
        if (!this.adal.userInfo.authenticated) {
            throw new Error('Cannot send request to registered endpoint if the user is not authenticated.');
        }
        // if the endpoint is registered then acquire and inject token
        var headers = req.headers || new HttpHeaders();
        return this.adal.acquireToken(resource).pipe(mergeMap(function (token) {
            // inject the header
            headers = headers.append('Authorization', 'Bearer ' + token);
            return next.handle(req.clone({ headers: headers }));
        }));
    };
    AdalInterceptor.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    AdalInterceptor.ctorParameters = function () { return [
        { type: AdalService, },
    ]; };
    return AdalInterceptor;
}());
export { AdalInterceptor };
//# sourceMappingURL=adal.interceptor.js.map