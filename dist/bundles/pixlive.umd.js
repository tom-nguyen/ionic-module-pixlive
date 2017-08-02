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
    PixliveDirective.prototype.getNativeElement = function () {
        return this.el.nativeElement;
    };
    PixliveDirective.prototype.initArViewLifeCycle = function () {
        var _this = this;
        this.viewCtrl.willEnter.subscribe(function () {
            console.log("will enter");
            if (_this.arView) {
                console.log("XXXXXX Opening - beforeEnter");
                _this.arView.beforeEnter();
                _this.onOrientationChange(_this.el, _this.arView);
            }
        });
        this.viewCtrl.didEnter.subscribe(function () {
            console.log("did enter");
            if (_this.arView) {
                console.log("XXXXXX Opening - afterEnter");
                _this.arView.afterEnter();
            }
            if (_this.fakeCamera) {
                _this.renderer.setElementStyle(_this.fakeCamera, 'display', 'block');
            }
        });
        this.viewCtrl.willLeave.subscribe(function () {
            console.log("will leave");
            if (_this.arView) {
                console.log("XXXXXX Closing - beforeLeave");
                _this.arView.beforeLeave();
            }
            if (_this.fakeCamera) {
                _this.renderer.setElementStyle(_this.fakeCamera, 'display', 'none');
            }
        });
        this.viewCtrl.willUnload.subscribe(function () {
            console.log("will unload");
        });
        this.viewCtrl.didLeave.subscribe(function () {
            console.log("did leave");
            if (_this.arView) {
                console.log("XXXXXX Closing - afterLeave");
                _this.arView.afterLeave();
            }
        });
    };
    PixliveDirective.prototype.onOrientationChange = function (element, view) {
        console.log("orientation change");
        console.log(JSON.stringify(element.nativeElement.getBoundingClientRect()));
        setTimeout(function () {
            var rect = element.nativeElement.getBoundingClientRect();
            console.log(JSON.stringify(rect));
            view.resize(rect.left, rect.top, rect.width, rect.height);
        }, 300);
    };
    PixliveDirective.prototype.ngOnInit = function () {
        var _this = this;
        this.renderer.setElementStyle(this.el.nativeElement, 'display', 'inline-block');
        this.initArViewLifeCycle();
        this.platform.ready().then(function () {
            console.log("platform ready");
            setTimeout(function () {
                var rect = _this.el.nativeElement.getBoundingClientRect();
                if (window.cordova) {
                    console.log("creating AR view");
                    _this.arView = window.cordova.plugins.PixLive.createARView(rect.left, rect.top, rect.width, rect.height);
                    console.log("AR view created");
                    var element_1 = _this.el;
                    var view_1 = _this.arView;
                    var fct_1 = _this.onOrientationChange;
                    window.addEventListener("orientationchange", function () {
                        fct_1(element_1, view_1);
                    }, false);
                }
                else {
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
        var node = this.el.nativeElement.parentElement;
        while (node) {
            this.renderer.setElementStyle(node, 'background-color', 'transparent');
            node = node.parentElement;
        }
        // let rect = this.el.nativeElement.getBoundingClientRect();
        // console.log(this.el);
        // console.log(rect);
        // this.viewCtrl..subscribe(() => {
        //   console.log("did enter");
        //   let rect = this.el.nativeElement.getBoundingClientRect();
        //   console.log(rect);
        //   console.log(window.scrollX + " " + window.scrollY);
        // });
    };
    PixliveDirective.prototype.ngAfterViewInit = function () {
        console.log("ng after view init");
    };
    PixliveDirective.prototype.ngDoCheck = function () {
        console.log("ng do check");
    };
    PixliveDirective.prototype.ngAfterViewChecked = function () {
        console.log("ng after view checked");
    };
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
                    //moduleId: module.id,
                    selector: 'pixlive-camera-view'
                    //templateUrl: 'pixlive.component.html'
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

var PixliveService = (function () {
    function PixliveService(platform) {
        this.platform = platform;
        /**
         * BehaviorSubject keeping track of the synchronization progress.
         */
        this.synchronizationProgress = new rxjs_BehaviorSubject.BehaviorSubject(101);
        this.annotationPresence = new rxjs_Subject.Subject();
        this.eventFromContent = new rxjs_Subject.Subject();
        this.enterContext = new rxjs_Subject.Subject();
    }
    PixliveService.prototype.init = function () {
        var _this = this;
        this.platform.ready().then(function () {
            if (window.cordova) {
                window.cordova.plugins.PixLive.onEventReceived = function (event) {
                    console.log("New event " + JSON.stringify(event));
                    if (event.type === "presentAnnotations") {
                        _this.annotationPresence.next(true);
                    }
                    else if (event.type === "hideAnnotations") {
                        _this.annotationPresence.next(false);
                    }
                    else if (event.type === "eventFromContent") {
                        //Example: {"type":"eventFromContent","eventName":"multipleChoice","eventParams":"{\"question\":\"Quel est la profondeur du lac de gruyere?\",\"answers\":[\"1m\",\"10m\",\"100m\"],\"correctAnswer\":2,\"hint\":\"On peut se noyer\"}"}
                        var eventFromContent = new EventFromContent();
                        eventFromContent.name = event.eventName;
                        eventFromContent.params = event.eventParams;
                        _this.eventFromContent.next(eventFromContent);
                    }
                    else if (event.type === "enterContext") {
                        //Example: {"type":"enterContext","context":"q7044o3xhfqkc7q"}
                        _this.enterContext.next(event.context);
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
    // public sync() : void {
    //   this.syncWithTags();
    // }
    /**
     * Requests a synchronization with PixLive Maker
     */
    PixliveService.prototype.syncWithTags = function (tagsObs) {
        var _this = this;
        this.synchronizationProgress.next(0);
        this.platform.ready().then(function () {
            if (window.cordova) {
                _this.synchronizationProgress.next(1);
                tagsObs.forEach(function (tags) {
                    console.log("Sync tags: " + JSON.stringify(tags));
                    window.cordova.plugins.PixLive.synchronize(tags, function (contexts) {
                        _this.synchronizationProgress.next(100);
                        console.log("Sync success");
                        console.log(contexts);
                    }, function (reason) {
                        _this.synchronizationProgress.next(102);
                        console.log("Sync failure");
                        console.log(reason);
                    });
                });
            }
            else {
                _this.synchronizationProgress.next(103);
            }
        });
    };
    /**
     * Gets the nearby GPS points
     * @param latitude the current latitude
     * @param longitude the current longitude
     */
    PixliveService.prototype.getGpsPoints = function (latitude, longitude) {
        return new Promise(function (resolve, reject) {
            if (window.cordova) {
                window.cordova.plugins.PixLive.getNearbyGPSPoints(latitude, longitude, function (data) {
                    console.log("Get gps success");
                    resolve(data);
                }, function () {
                    reject("getGpsPoints failed");
                });
            }
            else {
                reject("getGpsPoints failed: no cordova plugin");
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
     * return the specified context
     * @param contextId the ID of the context
     */
    PixliveService.prototype.getContext = function (contextId) {
        return new Promise(function (resolve, reject) {
            if (window.cordova) {
                window.cordova.plugins.PixLive.getContext(contextId, function (data) {
                    console.log("Get context success");
                    resolve(data);
                }, function () {
                    reject("getContext failed");
                });
            }
            else {
                reject("getContext failed: no cordova plugin");
            }
        });
    };
    PixliveService.decorators = [
        { type: _angular_core.Injectable },
    ];
    /** @nocollapse */
    PixliveService.ctorParameters = function () { return [
        { type: ionicAngular.Platform, },
    ]; };
    return PixliveService;
}());
var EventFromContent = (function () {
    function EventFromContent() {
    }
    return EventFromContent;
}());

var PixliveComponent = (function () {
    function PixliveComponent(platform, el, renderer, viewCtrl, pixliveService) {
        this.platform = platform;
        this.el = el;
        this.renderer = renderer;
        this.viewCtrl = viewCtrl;
        this.pixliveService = pixliveService;
    }
    PixliveComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.pixliveService.getAnnotationPresenceObservable().subscribe(function (visible) { return _this.cameraView.setTouchEnabled(visible); });
        // this.renderer.setElementStyle(this.el.nativeElement, 'display', 'inline-block');
        // let node = this.el.nativeElement.parentElement;
        // while (node) {
        //   this.renderer.setElementStyle(node, 'background-color', 'transparent');
        //   node = node.parentElement;
        // }
        // let rect = this.el.nativeElement.getBoundingClientRect();
        // console.log(this.el);
        // console.log(rect);
        // // this.viewCtrl..subscribe(() => {
        // //   console.log("did enter");
        // //   let rect = this.el.nativeElement.getBoundingClientRect();
        // //   console.log(rect);
        // //   console.log(window.scrollX + " " + window.scrollY);
        // // });
    };
    PixliveComponent.prototype.ngAfterViewInit = function () {
        //console.log("comp ng after view init");
    };
    PixliveComponent.prototype.ngDoCheck = function () {
        // console.log("comp ng do check");
    };
    PixliveComponent.prototype.ngAfterViewChecked = function () {
        // console.log("comp ng after view checked");
    };
    PixliveComponent.decorators = [
        { type: _angular_core.Component, args: [{
                    selector: 'pixlive',
                    template: '<pixlive-camera-view style="width: 100%; height: 100%;"></pixlive-camera-view>'
                },] },
    ];
    /** @nocollapse */
    PixliveComponent.ctorParameters = function () { return [
        { type: ionicAngular.Platform, },
        { type: _angular_core.ElementRef, },
        { type: _angular_core.Renderer, },
        { type: ionicAngular.ViewController, },
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
