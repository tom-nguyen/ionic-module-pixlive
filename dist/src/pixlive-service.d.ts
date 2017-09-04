import { NgZone } from '@angular/core';
import { Platform } from 'ionic-angular';
import { Observable } from 'rxjs';
/**
 * Service for interacting with the PixLive SDK.
 * Call the init() method when starting your application.
 */
export declare class PixliveService {
    private ngZone;
    private platform;
    /**
     * BehaviorSubject keeping track of the synchronization progress.
     */
    private synchronizationProgress;
    private annotationPresence;
    private eventFromContent;
    private enterContext;
    private exitContext;
    private qrCodeSynchronization;
    private codeRecognition;
    constructor(ngZone: NgZone, platform: Platform);
    /**
     * Initializes the SDK. In particular, it registers several listeners for the PixLive events.
     * @param gcmSenderId the Google GCM sender ID for the push notifications. Leave it empty if you do not want to enable it.
     */
    init(gcmSenderId?: string): void;
    /**
     * Gets an observable for listening on synchronization progress. The last known
     * value is given when the listener subscribes to the observable.
     * A value of 100 means that the synchronization is over.
     * A value above 100 means that an error occured during the synchronization.
     */
    getSynchronizationProgress(): Observable<number>;
    /**
     * Gets an observable that is called when the event "presentAnnotations" or
     * "hideAnnotations" (true/false respectively) is called. It informs that
     * an AR annotation is being displayed or not.
     */
    getAnnotationPresenceObservable(): Observable<boolean>;
    /**
     * Gets an observable that is called when an event from content is triggered (e.g. coupon)
     */
    getEventFromContentObservable(): Observable<EventFromContent>;
    /**
     * Gets an observable that is called when a context is entered (i.e. activated). It gives
     * the public ID of the context.
     */
    getEnterContextObservable(): Observable<string>;
    /**
     * Gets an observable that is called when a context is exited. It gives
     * the public ID of the context.
     */
    getExitContextObservable(): Observable<string>;
    /**
     * Gets an observable that is called when a code (e.g. QR code) is recognized.
     * It gives the content of the code. See also getQrCodeSynchronizationRequest().
     */
    getCodeRecognition(): Observable<string>;
    /**
     * Gets an observable that is called when a synchronization QR code is scanned.
     * It gives the tag to synchronize
     */
    getQrCodeSynchronizationRequest(): Observable<string>;
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
    sync(tags: any): void;
    /**
     * Gets the nearby GPS points
     * @param latitude the current latitude
     * @param longitude the current longitude
     */
    getNearbyGpsPoints(latitude: number, longitude: number): Promise<GPSPoint[]>;
    /**
     * Checks whether there are beacon contexts.
     */
    isContainingBeacons(): Promise<boolean>;
    /**
     * Checks whether there are GPS contexts.
     */
    isContainingGPSPoints(): Promise<boolean>;
    /**
     * Gets the nearby beacons
     */
    getNearbyBeacons(): Promise<Context[]>;
    /**
     * Retrieves the nearby status.
     */
    getNearbyStatus(): Promise<NearbyStatus>;
    /**
     * Gets all GPS points in the given bounding box.
     * @param minLat the minimum latitude
     * @param minLon the minimum longitude
     * @param maxLat the maximum latitude
     * @param maxLon the maximum longitude
     */
    getGpsPointsInBoundingBox(minLat: any, minLon: any, maxLat: any, maxLon: any): Promise<GPSPoint[]>;
    /**
     * Return the specified context
     * @param contextId the ID of the context
     */
    getContext(contextId: string): Promise<Context>;
    /**
     * Opens the given context
     * @param contextId the ID of the context to open
     */
    activate(contextId: string): void;
    /**
     * Computes the distance between to GPS points
     * @param latitude1 the latitude of the first point
     * @param longitude1 the longitude of the first point
     * @param latitude2 the latitude of the second point
     * @param longitude2 the longitude of the second point
     */
    computeDistanceBetweenGPSPoints(latitude1: number, longitude1: number, latitude2: number, longitude2: number): Promise<number>;
}
/**
 * Class representing a PixLive Maker GPS point.
 */
export declare class GPSPoint {
    lat: number;
    lon: number;
    detectionRadius: number;
    distanceFromCurrentPos: number;
    category: string;
    label: string;
    contextId: string;
}
/**
 * Class representing a Context.
 */
export declare class Context {
    activate: () => void;
    contextId: string;
    name: string;
    description: string;
    imageHiResURL: string;
    imageThumbnailURL: string;
    notificationTitle: string;
    notificationMessage: string;
}
/**
 * Class representing a Event triggered by a content
 */
export declare class EventFromContent {
    name: string;
    params: string;
}
/**
 * Class containing the status of nearby (location permission and location/bluetooth on/off)
 */
export declare class NearbyStatus {
    /**
     * If value is "disabled", the location permission has not been granted.
     */
    authorizationStatus?: string;
    /**
     * If value is "disabled", the location is disabled.
     */
    locationStatus?: string;
    /**
     * If value is "disabled", the bluetooth is off.
     */
    bluetoothStatus?: string;
}
