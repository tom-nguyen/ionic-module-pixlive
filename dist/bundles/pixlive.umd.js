(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('ionic-angular'), require('rxjs/BehaviorSubject'), require('rxjs/Subject')) :
	typeof define === 'function' && define.amd ? define(['exports', '@angular/core', 'ionic-angular', 'rxjs/BehaviorSubject', 'rxjs/Subject'], factory) :
	(factory((global.pixlive = global.pixlive || {}),global.ng.core,global.ionicangular,global.Rx,global.Rx));
}(this, (function (exports,_angular_core,ionicAngular,rxjs_BehaviorSubject,rxjs_Subject) { 'use strict';

var PixliveDirective = (function () {
    function PixliveDirective(platform, el, renderer, viewCtrl) {
        this.platform = platform;
        this.el = el;
        this.renderer = renderer;
        this.viewCtrl = viewCtrl;
    }
    /**
     * Initializes the AR view lifecycle
     */
    PixliveDirective.prototype.initArViewLifeCycle = function () {
        var _this = this;
        this.viewCtrl.willEnter.subscribe(function () {
            if (_this.arView) {
                _this.arView.beforeEnter();
                _this.onOrientationChange();
            }
        });
        this.viewCtrl.didEnter.subscribe(function () {
            if (_this.arView) {
                _this.arView.afterEnter();
            }
            if (_this.fakeCamera) {
                _this.renderer.setElementStyle(_this.fakeCamera, 'display', 'block');
            }
        });
        this.viewCtrl.willLeave.subscribe(function () {
            if (_this.arView) {
                _this.arView.beforeLeave();
            }
            if (_this.fakeCamera) {
                _this.renderer.setElementStyle(_this.fakeCamera, 'display', 'none');
            }
        });
        this.viewCtrl.didLeave.subscribe(function () {
            if (_this.arView) {
                _this.arView.afterLeave();
            }
        });
    };
    /**
     * Call this method after an orientation change for resizing the AR view
     * @param element
     * @param view
     */
    PixliveDirective.prototype.onOrientationChange = function () {
        var _this = this;
        setTimeout(function () {
            var rect = _this.el.nativeElement.getBoundingClientRect();
            _this.arView.resize(rect.left, rect.top, rect.width, rect.height);
        }, 300);
    };
    PixliveDirective.prototype.ngOnInit = function () {
        var _this = this;
        this.renderer.setElementStyle(this.el.nativeElement, 'display', 'inline-block');
        this.initArViewLifeCycle();
        this.platform.ready().then(function () {
            setTimeout(function () {
                var rect = _this.el.nativeElement.getBoundingClientRect();
                if (window.cordova) {
                    // Create the camera view
                    _this.arView = window.cordova.plugins.PixLive.createARView(rect.left, rect.top, rect.width, rect.height);
                    window.addEventListener("orientationchange", function () { return _this.onOrientationChange(); }, false);
                }
                else {
                    // As a fallback, we create a grey element for replacing the camera view. Useful for dev purpose.
                    var fakeCamera = document.createElement("DIV");
                    document.body.appendChild(fakeCamera);
                    _this.renderer.setElementStyle(fakeCamera, 'position', 'fixed');
                    _this.renderer.setElementStyle(fakeCamera, 'background-color', 'gray');
                    _this.renderer.setElementStyle(fakeCamera, 'left', rect.left + 'px');
                    _this.renderer.setElementStyle(fakeCamera, 'top', rect.top + 'px');
                    _this.renderer.setElementStyle(fakeCamera, 'width', rect.width + 'px');
                    _this.renderer.setElementStyle(fakeCamera, 'height', rect.height + 'px');
                    _this.fakeCamera = fakeCamera;
                }
            }, 300);
        });
        // The AR view is placed below the application so we set all views that are on top transparent.
        var node = this.el.nativeElement.parentElement;
        while (node) {
            this.renderer.setElementStyle(node, 'background-color', 'transparent');
            node = node.parentElement;
        }
    };
    /**
     * Defines whether the view is clickable. If the view is clickable, it will intercept the touch event.
     * If a view in on top of the component, then you must disable the click interception.
     * @param enabled true if the view is clickable and intercept all touch events, false otherwise.
     */
    PixliveDirective.prototype.setTouchEnabled = function (enabled) {
        if (enabled) {
            this.arView.enableTouch();
        }
        else {
            this.arView.disableTouch();
        }
    };
    PixliveDirective.decorators = [
        { type: _angular_core.Directive, args: [{
                    selector: 'pixlive-camera-view'
                },] },
    ];
    /** @nocollapse */
    PixliveDirective.ctorParameters = function () { return [
        { type: ionicAngular.Platform, },
        { type: _angular_core.ElementRef, },
        { type: _angular_core.Renderer, },
        { type: ionicAngular.ViewController, },
    ]; };
    return PixliveDirective;
}());

/**
 * Service for interacting with the PixLive SDK.
 * Call the init() method when starting your application.
 */
var PixliveService = (function () {
    function PixliveService(ngZone, platform) {
        this.ngZone = ngZone;
        this.platform = platform;
        /**
         * BehaviorSubject keeping track of the synchronization progress.
         */
        this.synchronizationProgress = new rxjs_BehaviorSubject.BehaviorSubject(101);
        this.annotationPresence = new rxjs_Subject.Subject();
        this.eventFromContent = new rxjs_Subject.Subject();
        this.enterContext = new rxjs_Subject.Subject();
        this.qrCodeSynchronization = new rxjs_Subject.Subject();
        this.codeRecognition = new rxjs_Subject.Subject();
    }
    /**
     * Initializes the SDK. In particular, it registers several listeners for the PixLive events.
     * @param gcmSenderId the Google GCM sender ID for the push notifications. Leave it empty if you do not want to enable it.
     */
    PixliveService.prototype.init = function (gcmSenderId) {
        var _this = this;
        this.platform.ready().then(function () {
            if (window.cordova) {
                if (gcmSenderId) {
                    window.cordova.plugins.PixLive.setNotificationsSupport(true, gcmSenderId);
                }
                // Listen for different PixLive events
                window.cordova.plugins.PixLive.onEventReceived = function (event) {
                    console.log("PixLive new event: " + JSON.stringify(event));
                    if (event.type === "presentAnnotations") {
                        _this.ngZone.run(function () {
                            _this.annotationPresence.next(true);
                        });
                    }
                    else if (event.type === "hideAnnotations") {
                        _this.ngZone.run(function () {
                            _this.annotationPresence.next(false);
                        });
                    }
                    else if (event.type === "eventFromContent") {
                        //Example: {"type":"eventFromContent","eventName":"multipleChoice","eventParams":"{\"question\":\"Quel est la profondeur du lac de gruyere?\",\"answers\":[\"1m\",\"10m\",\"100m\"],\"correctAnswer\":2,\"hint\":\"On peut se noyer\"}"}
                        _this.ngZone.run(function () {
                            var eventFromContent = new EventFromContent();
                            eventFromContent.name = event.eventName;
                            eventFromContent.params = event.eventParams;
                            _this.eventFromContent.next(eventFromContent);
                        });
                    }
                    else if (event.type === "enterContext") {
                        //Example: {"type":"enterContext","context":"q7044o3xhfqkc7q"}
                        _this.enterContext.next(event.context);
                    }
                    else if (event.type === "syncProgress") {
                        _this.synchronizationProgress.next(parseInt("" + (event.progress * 100)));
                    }
                    else if (event.type === "codeRecognize") {
                        //Example: {"type":"codeRecognize","codeType":"qrcode","code":"pixliveplayer/default"}
                        var code = event.code;
                        if (code.indexOf('pixliveplayer/') === 0) {
                            var tag = code.substring(14);
                            _this.qrCodeSynchronization.next(tag);
                        }
                        else {
                            _this.codeRecognition.next(code);
                        }
                    }
                };
            }
        });
    };
    /**
     * Gets an observable for listening on synchronization progress. The last known
     * value is given when the listener subscribes to the observable.
     * A value of 100 means that the synchronization is over.
     * A value above 100 means that an error occured during the synchronization.
     */
    PixliveService.prototype.getSynchronizationProgress = function () {
        return this.synchronizationProgress.asObservable();
    };
    /**
     * Gets an observable that is called when the event "presentAnnotations" or
     * "hideAnnotations" (true/false respectively) is called. It informs that
     * an AR annotation is being displayed or not.
     */
    PixliveService.prototype.getAnnotationPresenceObservable = function () {
        return this.annotationPresence.asObservable();
    };
    /**
     * Gets an observable that is called when an event from content is triggered (e.g. coupon)
     */
    PixliveService.prototype.getEventFromContentObservable = function () {
        return this.eventFromContent.asObservable();
    };
    /**
     * Gets an observable that is called when a context is entered (i.e. activated). It gives
     * the public ID of the context.
     */
    PixliveService.prototype.getEnterContextObservable = function () {
        return this.enterContext.asObservable();
    };
    /**
     * Gets an observable that is called when a code (e.g. QR code) is recognized.
     * It gives the content of the code. See also getQrCodeSynchronizationRequest().
     */
    PixliveService.prototype.getCodeRecognition = function () {
        return this.codeRecognition.asObservable();
    };
    /**
     * Gets an observable that is called when a synchronization QR code is scanned.
     * It gives the tag to synchronize
     */
    PixliveService.prototype.getQrCodeSynchronizationRequest = function () {
        return this.qrCodeSynchronization.asObservable();
    };
    /**
     * Synchronize the PixLive SDK with the web platform.
     * The synchronization can be done in different ways.
     *
     * 1) The synchronization can be done without using the tags, in this case, an empty
     * array is given as parameter.
     *
     * 2) The syncronization can be done with one or more tags. Use an array of strings: ['tag1', 'tag2'].
     * In this case, all contents having one or more of the given tags will be synchronized.
     * Think of it as => (tag1 OR tag2).
     *
     * 3) The synchronization can be done with a combination of tags. Example: [['lang_en', 'tag1'], ['lang_en', 'tag2']].
     * In this case, the contents having tags 'lang_en' AND 'tag1' will be synchonized together with the contents having the 'lang_en' AND 'tag2'.
     * Think of it as => (lang_en AND tag1) OR (lang_en AND tag2).
     *
     * @param tags
     */
    PixliveService.prototype.sync = function (tags) {
        var _this = this;
        console.log("Synchronization with tags: " + JSON.stringify(tags));
        this.synchronizationProgress.next(0);
        this.platform.ready().then(function () {
            if (window.cordova) {
                window.cordova.plugins.PixLive.synchronize(tags, function (contexts) {
                    _this.ngZone.run(function () {
                        _this.synchronizationProgress.next(100);
                    });
                }, function (reason) {
                    _this.ngZone.run(function () {
                        _this.synchronizationProgress.next(102);
                    });
                });
            }
            else {
                // The plugin is not available, we simulate a synchronization for development.
                setTimeout(function () {
                    _this.synchronizationProgress.next(25);
                    setTimeout(function () {
                        _this.synchronizationProgress.next(50);
                        setTimeout(function () {
                            _this.synchronizationProgress.next(75);
                            setTimeout(function () {
                                _this.synchronizationProgress.next(103);
                            }, 500);
                        }, 500);
                    }, 500);
                }, 500);
            }
        });
    };
    /**
     * Gets the nearby GPS points
     * @param latitude the current latitude
     * @param longitude the current longitude
     */
    PixliveService.prototype.getNearbyGpsPoints = function (latitude, longitude) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (window.cordova) {
                window.cordova.plugins.PixLive.getNearbyGPSPoints(latitude, longitude, function (data) {
                    _this.ngZone.run(function () {
                        resolve(data);
                    });
                }, function () {
                    reject("getNearbyGpsPoints failed");
                });
            }
            else {
                reject("getNearbyGpsPoints failed: no cordova plugin");
            }
        });
    };
    /**
     * Gets all GPS points in the given bounding box.
     * @param minLat the minimum latitude
     * @param minLon the minimum longitude
     * @param maxLat the maximum latitude
     * @param maxLon the maximum longitude
     */
    PixliveService.prototype.getGpsPointsInBoundingBox = function (minLat, minLon, maxLat, maxLon) {
        return new Promise(function (resolve, reject) {
            if (window.cordova) {
                window.cordova.plugins.PixLive.getGPSPointsInBoundingBox(minLat, minLon, maxLat, maxLon, function (data) {
                    resolve(data);
                }, function () {
                    reject("Error");
                });
            }
            else {
                reject("No cordova plugin");
            }
        });
    };
    /**
     * Return the specified context
     * @param contextId the ID of the context
     */
    PixliveService.prototype.getContext = function (contextId) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (window.cordova) {
                window.cordova.plugins.PixLive.getContext(contextId, function (data) {
                    _this.ngZone.run(function () {
                        resolve(data);
                    });
                }, function () {
                    reject("getContext failed");
                });
            }
            else {
                reject("getContext failed: no cordova plugin");
            }
        });
    };
    /**
     * Opens the given context
     * @param contextId the ID of the context to open
     */
    PixliveService.prototype.activate = function (contextId) {
        this.getContext(contextId).then(function (context) { return context.activate(); });
    };
    /**
     * Computes the distance between to GPS points
     * @param latitude1 the latitude of the first point
     * @param longitude1 the longitude of the first point
     * @param latitude2 the latitude of the second point
     * @param longitude2 the longitude of the second point
     */
    PixliveService.prototype.computeDistanceBetweenGPSPoints = function (latitude1, longitude1, latitude2, longitude2) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (window.cordova) {
                window.cordova.plugins.PixLive.computeDistanceBetweenGPSPoints(latitude1, longitude1, latitude2, longitude2, function (data) {
                    _this.ngZone.run(function () {
                        resolve(data);
                    });
                }, function () {
                    reject("computeDistanceBetweenGPSPoints failed");
                });
            }
            else {
                reject("computeDistanceBetweenGPSPoints failed: no cordova plugin");
            }
        });
    };
    PixliveService.decorators = [
        { type: _angular_core.Injectable },
    ];
    /** @nocollapse */
    PixliveService.ctorParameters = function () { return [
        { type: _angular_core.NgZone, },
        { type: ionicAngular.Platform, },
    ]; };
    return PixliveService;
}());
/**
 * Class representing a Event triggered by a content
 */
var EventFromContent = (function () {
    function EventFromContent() {
    }
    return EventFromContent;
}());

var PixliveComponent = (function () {
    function PixliveComponent(pixliveService) {
        this.pixliveService = pixliveService;
    }
    PixliveComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.pixliveService.getAnnotationPresenceObservable().subscribe(function (visible) { return _this.cameraView.setTouchEnabled(visible); });
    };
    /**
     * Defines whether the view is clickable. If the view is clickable, it will intercept the touch event.
     * If a view in on top of the component, then you must disable the click interception.
     * @param clickable true if the view is clickable and intercept all touch events, false otherwise.
     */
    PixliveComponent.prototype.setClickable = function (clickable) {
        this.cameraView.setTouchEnabled(clickable);
    };
    PixliveComponent.decorators = [
        { type: _angular_core.Component, args: [{
                    selector: 'pixlive',
                    template: '<pixlive-camera-view style="width: 100%; height: 100%;"></pixlive-camera-view>'
                },] },
    ];
    /** @nocollapse */
    PixliveComponent.ctorParameters = function () { return [
        { type: PixliveService, },
    ]; };
    PixliveComponent.propDecorators = {
        'cameraView': [{ type: _angular_core.ViewChild, args: [PixliveDirective,] },],
    };
    return PixliveComponent;
}());

var PixliveModule = (function () {
    function PixliveModule() {
    }
    PixliveModule.decorators = [
        { type: _angular_core.NgModule, args: [{
                    declarations: [PixliveComponent, PixliveDirective],
                    exports: [PixliveComponent],
                    providers: [PixliveService]
                },] },
    ];
    /** @nocollapse */
    PixliveModule.ctorParameters = function () { return []; };
    return PixliveModule;
}());

/**
 * @module
 * @description
 * Entry point for all public APIs of the async local storage package.
 */

exports.PixliveModule = PixliveModule;
exports.PixliveComponent = PixliveComponent;
exports.PixliveService = PixliveService;

Object.defineProperty(exports, '__esModule', { value: true });

})));
