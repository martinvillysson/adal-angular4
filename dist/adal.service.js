import { Injectable } from '@angular/core';
import { bindCallback } from 'rxjs';
import * as lib from 'adal-angular';
var AdalService = /** @class */ (function () {
    function AdalService() {
        this.context = null;
        this.user = {
            authenticated: false,
            userName: '',
            error: '',
            token: '',
            profile: {}
        };
    }
    AdalService.prototype.init = function (configOptions) {
        if (!configOptions) {
            throw new Error('You must set config, when calling init.');
        }
        // redirect and logout_redirect are set to current location by default
        var existingHash = window.location.hash;
        var pathDefault = window.location.href;
        if (existingHash) {
            pathDefault = pathDefault.replace(existingHash, '');
        }
        configOptions.redirectUri = configOptions.redirectUri || pathDefault;
        configOptions.postLogoutRedirectUri = configOptions.postLogoutRedirectUri || pathDefault;
        // create instance with given config
        this.context = lib.inject(configOptions);
        window.AuthenticationContext = this.context.constructor;
        // loginresource is used to set authenticated status
        this.updateDataFromCache(this.context.config.loginResource);
    };
    Object.defineProperty(AdalService.prototype, "config", {
        get: function () {
            return this.context.config;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AdalService.prototype, "userInfo", {
        get: function () {
            return this.user;
        },
        enumerable: true,
        configurable: true
    });
    AdalService.prototype.login = function () {
        this.context.login();
    };
    AdalService.prototype.loginInProgress = function () {
        return this.context.loginInProgress();
    };
    AdalService.prototype.logOut = function () {
        this.context.logOut();
    };
    AdalService.prototype.handleWindowCallback = function () {
        var hash = window.location.hash;
        if (this.context.isCallback(hash)) {
            var requestInfo = this.context.getRequestInfo(hash);
            this.context.saveTokenFromHash(requestInfo);
            if (requestInfo.requestType === this.context.REQUEST_TYPE.LOGIN) {
                this.updateDataFromCache(this.context.config.loginResource);
            }
            else if (requestInfo.requestType === this.context.REQUEST_TYPE.RENEW_TOKEN) {
                this.context.callback = window.parent.callBackMappedToRenewStates[requestInfo.stateResponse];
            }
            if (requestInfo.stateMatch) {
                if (typeof this.context.callback === 'function') {
                    if (requestInfo.requestType === this.context.REQUEST_TYPE.RENEW_TOKEN) {
                        // Idtoken or Accestoken can be renewed
                        if (requestInfo.parameters['access_token']) {
                            this.context.callback(this.context._getItem(this.context.CONSTANTS.STORAGE.ERROR_DESCRIPTION), requestInfo.parameters['access_token']);
                        }
                        else if (requestInfo.parameters['id_token']) {
                            this.context.callback(this.context._getItem(this.context.CONSTANTS.STORAGE.ERROR_DESCRIPTION), requestInfo.parameters['id_token']);
                        }
                        else if (requestInfo.parameters['error']) {
                            this.context.callback(this.context._getItem(this.context.CONSTANTS.STORAGE.ERROR_DESCRIPTION), null);
                            this.context._renewFailed = true;
                        }
                    }
                }
            }
        }
        // Remove hash from url
        if (window.location.hash) {
            if (window.history.replaceState) {
                window.history.replaceState('', '/', window.location.pathname);
            }
            else {
                window.location.hash = '';
            }
        }
    };
    AdalService.prototype.getCachedToken = function (resource) {
        return this.context.getCachedToken(resource);
    };
    AdalService.prototype.acquireToken = function (resource) {
        var _this = this; // save outer this for inner function
        var errorMessage;
        return bindCallback(acquireTokenInternal, function (token) {
            if (!token && errorMessage) {
                throw (errorMessage);
            }
            return token;
        })();
        function acquireTokenInternal(cb) {
            var s = null;
            _this.context.acquireToken(resource, function (error, tokenOut) {
                if (error) {
                    _this.context.error('Error when acquiring token for resource: ' + resource, error);
                    errorMessage = error;
                    cb(null);
                }
                else {
                    cb(tokenOut);
                    s = tokenOut;
                }
            });
            return s;
        }
    };
    AdalService.prototype.getUser = function () {
        var _this = this;
        return bindCallback(function (cb) {
            _this.context.getUser(function (error, user) {
                if (error) {
                    this.context.error('Error when getting user', error);
                    cb(null);
                }
                else {
                    cb(user);
                }
            });
        })();
    };
    AdalService.prototype.clearCache = function () {
        this.context.clearCache();
    };
    AdalService.prototype.clearCacheForResource = function (resource) {
        this.context.clearCacheForResource(resource);
    };
    AdalService.prototype.info = function (message) {
        this.context.info(message);
    };
    AdalService.prototype.verbose = function (message) {
        this.context.verbose(message);
    };
    AdalService.prototype.GetResourceForEndpoint = function (url) {
        return this.context.getResourceForEndpoint(url);
    };
    AdalService.prototype.refreshDataFromCache = function () {
        this.updateDataFromCache(this.context.config.loginResource);
    };
    AdalService.prototype.updateDataFromCache = function (resource) {
        var token = this.context.getCachedToken(resource);
        this.user.authenticated = token !== null && token.length > 0;
        var user = this.context.getCachedUser() || { userName: '', profile: undefined };
        if (user) {
            this.user.userName = user.userName;
            this.user.profile = user.profile;
            this.user.token = token;
            this.user.error = this.context.getLoginError();
        }
        else {
            this.user.userName = '';
            this.user.profile = {};
            this.user.token = '';
            this.user.error = '';
        }
    };
    AdalService.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    AdalService.ctorParameters = function () { return []; };
    return AdalService;
}());
export { AdalService };
//# sourceMappingURL=adal.service.js.map