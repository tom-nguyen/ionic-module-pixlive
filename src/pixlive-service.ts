import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';

import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';

declare var window;

@Injectable()
export class PixliveService {

  /**
   * BehaviorSubject keeping track of the synchronization progress.
   */
  private synchronizationProgress: BehaviorSubject<number> = new BehaviorSubject(101);

  private annotationPresence: Subject<boolean> = new Subject();
  private eventFromContent: Subject<EventFromContent> = new Subject();
  private enterContext: Subject<string> = new Subject();

  constructor(
    private platform: Platform
  ) {}

  public init() {
    this.platform.ready().then(() => {
      if (window.cordova) {
         window.cordova.plugins.PixLive.onEventReceived = (event) => {
          console.log("New event " + JSON.stringify(event));
          if (event.type === "presentAnnotations") {
            this.annotationPresence.next(true);
          } else if (event.type === "hideAnnotations") {
            this.annotationPresence.next(false);
          } else if (event.type === "eventFromContent") {
            //Example: {"type":"eventFromContent","eventName":"multipleChoice","eventParams":"{\"question\":\"Quel est la profondeur du lac de gruyere?\",\"answers\":[\"1m\",\"10m\",\"100m\"],\"correctAnswer\":2,\"hint\":\"On peut se noyer\"}"}
            let eventFromContent = new EventFromContent();
            eventFromContent.name = event.eventName;
            eventFromContent.params = event.eventParams;
            this.eventFromContent.next(eventFromContent);
          } else if (event.type === "enterContext") {
            //Example: {"type":"enterContext","context":"q7044o3xhfqkc7q"}
            this.enterContext.next(event.context);
          }
        }
      }
    });
  }

  /**
   * Gets an observable for listening on synchronization progress. The last known
   * value is given when the listener subscribes to the observable.
   * A value of 100 means that the synchronization is over.
   * A value above 100 means that an error occured during the synchronization.
   */
  public getSynchronizationProgress() : Observable<number> {
    return this.synchronizationProgress.asObservable();
  }

  /**
   * Gets an observable that is called when the event "presentAnnotations" or
   * "hideAnnotations" (true/false respectively) is called. It informs that
   * an AR annotation is being displayed or not.
   */
  public getAnnotationPresenceObservable() : Observable<boolean> {
    return this.annotationPresence.asObservable();
  }

  /**
   * Gets an observable that is called when an event from content is triggered (e.g. coupon)
   */
  public getEventFromContentObservable() : Observable<EventFromContent> {
    return this.eventFromContent.asObservable();
  }

  /**
   * Gets an observable that is called when a context is entered (i.e. activated). It gives
   * the public ID of the context.
   */
  public getEnterContextObservable() : Observable<string> {
    return this.enterContext.asObservable();
  }

  // public sync() : void {
  //   this.syncWithTags();
  // }

  /**
   * Requests a synchronization with PixLive Maker
   */
  public syncWithTags(tagsObs: Observable<string[][]>) : void {
    this.synchronizationProgress.next(0);
    this.platform.ready().then(() => {
      if (window.cordova) {
        this.synchronizationProgress.next(1);

        tagsObs.forEach( tags => {
          console.log("Sync tags: " + JSON.stringify(tags));
          window.cordova.plugins.PixLive.synchronize(tags, (contexts) => {
            this.synchronizationProgress.next(100);
            console.log("Sync success");
            console.log(contexts);
          }, (reason) => {
            this.synchronizationProgress.next(102);
            console.log("Sync failure");
            console.log(reason);
          });
        });

      } else {
        this.synchronizationProgress.next(103);
      }
    });
  }

  /**
   * Gets the nearby GPS points
   * @param latitude the current latitude
   * @param longitude the current longitude
   */
  public getGpsPoints(latitude: number, longitude: number): Promise<GPSPoint[]> {
    return new Promise((resolve, reject) => {
      if (window.cordova) {
        window.cordova.plugins.PixLive.getNearbyGPSPoints(latitude, longitude,
          (data) => {
            console.log("Get gps success");
            resolve(data as GPSPoint[]);
          },
          () => {
            reject("getGpsPoints failed");
          });
      } else {
        reject("getGpsPoints failed: no cordova plugin");
      }
    });
  }

  /**
   * Gets all GPS points in the given bounding box.
   * @param minLat the minimum latitude
   * @param minLon the minimum longitude
   * @param maxLat the maximum latitude
   * @param maxLon the maximum longitude
   */
  public getGpsPointsInBoundingBox(minLat, minLon, maxLat, maxLon): Promise<GPSPoint[]> {
    return new Promise((resolve, reject) => {
      if (window.cordova) {
        window.cordova.plugins.PixLive.getGPSPointsInBoundingBox(minLat, minLon, maxLat, maxLon,
          (data) => {
            resolve(data as GPSPoint[]);
          },
          () => {
            reject("Error");
          });
      } else {
        reject("No cordova plugin");
      }
    });
  }


  /**
   * return the specified context
   * @param contextId the ID of the context
   */
  public getContext(contextId: string): Promise<Context> { //TODO context
    return new Promise((resolve, reject) => {
      if (window.cordova) {
        window.cordova.plugins.PixLive.getContext(contextId,
          (data) => {
            console.log("Get context success");
            resolve(data as Context);
          },
          () => {
            reject("getContext failed");
          });
      } else {
        reject("getContext failed: no cordova plugin");
      }
    });
  }

}

/**
 * Class representing a PixLive Maker GPS point.
 */
export class GPSPoint {
  lat: number;
  lon: number;
  detectionRadius: number;
  distanceFromCurrentPos: number;
  category: string;
  label: string;
  contextId: string;
}

export class Context {
  activate: () => void;
  contextId: string;
  name: string;
  description: string;
  imageHiResURL: string;
  imageThumbnailURL: string;
  notificationTitle: string;
  notificationMessage: string;
}

export class EventFromContent {
  name: string;
  params: string;
}
