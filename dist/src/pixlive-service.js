import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
var PixliveService = (function () {
    function PixliveService(platform) {
        this.platform = platform;
        /**
         * BehaviorSubject keeping track of the synchronization progress.
         */
        this.synchronizationProgress = new BehaviorSubject(101);
        this.annotationPresence = new Subject();
        this.eventFromContent = new Subject();
        this.enterContext = new Subject();
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
        { type: Injectable },
    ];
    /** @nocollapse */
    PixliveService.ctorParameters = function () { return [
        { type: Platform, },
    ]; };
    return PixliveService;
}());
export { PixliveService };
/**
 * Class representing a PixLive Maker GPS point.
 */
var GPSPoint = (function () {
    function GPSPoint() {
    }
    return GPSPoint;
}());
export { GPSPoint };
var Context = (function () {
    function Context() {
    }
    return Context;
}());
export { Context };
var EventFromContent = (function () {
    function EventFromContent() {
    }
    return EventFromContent;
}());
export { EventFromContent };
//# sourceMappingURL=pixlive-service.js.map