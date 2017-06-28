import { Platform } from 'ionic-angular';
import { Observable } from 'rxjs';
export declare class PixliveService {
    private platform;
    /**
     * BehaviorSubject keeping track of the synchronization progress.
     */
    private synchronizationProgress;
    private annotationPresence;
    private eventFromContent;
    private enterContext;
    constructor(platform: Platform);
    init(): void;
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
     * Requests a synchronization with PixLive Maker
     */
    syncWithTags(tagsObs: Observable<string[][]>): void;
    /**
     * Gets the nearby GPS points
     * @param latitude the current latitude
     * @param longitude the current longitude
     */
    getGpsPoints(latitude: number, longitude: number): Promise<GPSPoint[]>;
    /**
     * Gets all GPS points in the given bounding box.
     * @param minLat the minimum latitude
     * @param minLon the minimum longitude
     * @param maxLat the maximum latitude
     * @param maxLon the maximum longitude
     */
    getGpsPointsInBoundingBox(minLat: any, minLon: any, maxLat: any, maxLon: any): Promise<GPSPoint[]>;
    /**
     * return the specified context
     * @param contextId the ID of the context
     */
    getContext(contextId: string): Promise<Context>;
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
export declare class EventFromContent {
    name: string;
    params: string;
}
