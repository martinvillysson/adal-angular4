import { Injectable } from '@angular/core';
import { AdalService } from './adal.service';
var AdalGuard = /** @class */ (function () {
    function AdalGuard(adalService) {
        this.adalService = adalService;
    }
    AdalGuard.prototype.canActivate = function (next, state) {
        return this.adalService.userInfo.authenticated;
    };
    AdalGuard.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    AdalGuard.ctorParameters = function () { return [
        { type: AdalService, },
    ]; };
    return AdalGuard;
}());
export { AdalGuard };
//# sourceMappingURL=adal.guard.js.map