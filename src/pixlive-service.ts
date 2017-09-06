import { Injectable, NgZone } from '@angular/core';
import { Platform } from 'ionic-angular';

import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';

declare var window;

/**
 * Service for interacting with the PixLive SDK.
 * Call the init() method when starting your application.
 */
@Injectable()
export class PixliveService {

  /**
   * BehaviorSubject keeping track of the synchronization progress.
   */
  private synchronizationProgress: BehaviorSubject<number> = new BehaviorSubject(101);

  private annotationPresence: Subject<boolean> = new Subject();
  private eventFromContent: Subject<EventFromContent> = new Subject();
  private enterContext: Subject<string> = new Subject();
  private exitContext: Subject<string> = new Subject();
  private qrCodeSynchronization: Subject<string> = new Subject();
  private codeRecognition: Subject<string> = new Subject();
  private generatedCoupon: Subject<GeneratedCoupon> = new Subject();
  private synchronizationRequest: Subject<string[]> = new Subject();

  constructor(
    private ngZone: NgZone,
    private platform: Platform
  ) { }

  /**
   * Initializes the SDK. In particular, it registers several listeners for the PixLive events.
   * @param gcmSenderId the Google GCM sender ID for the push notifications. Leave it empty if you do not want to enable it.
   */
  public init(gcmSenderId?: string) {
    this.platform.ready().then(() => {
      if (window.cordova) {
        if (gcmSenderId) {
          window.cordova.plugins.PixLive.setNotificationsSupport(true, gcmSenderId);
        }
        // Listen for different PixLive events
        window.cordova.plugins.PixLive.onEventReceived = (event) => {
          this.ngZone.run(() => {
            if (event.type === 'presentAnnotations') {
              this.annotationPresence.next(true);
            } else if (event.type === 'hideAnnotations') {
              this.annotationPresence.next(false);
            } else if (event.type === 'eventFromContent') {
              this.onNewEventFromContent(event);
            } else if (event.type === 'enterContext') {
              //Example: {"type":"enterContext","context":"q7044o3xhfqkc7q"}
              this.enterContext.next(event.context);
            } else if (event.type === 'exitContext') {
              //Example: {"type":"exitContext","context":"q7044o3xhfqkc7q"}
              this.exitContext.next(event.context);
            } else if (event.type === 'syncProgress') {
              this.synchronizationProgress.next(parseInt('' + (event.progress * 100)));
            } else if (event.type === 'codeRecognize') {
              //Example: {"type":"codeRecognize","codeType":"qrcode","code":"pixliveplayer/default"}
              let code: string = event.code;
              if (code.indexOf('pixliveplayer/') === 0) {
                let tag = code.substring(14);
                this.qrCodeSynchronization.next(tag);
              } else {
                this.codeRecognition.next(code);
              }
            } else if (event.type === 'requireSync') {
              let tags: string[] = event.tags;
              this.synchronizationRequest.next(tags);
            }
          });
        }
      }
    });
  }

  private onNewEventFromContent(event: any) {
    //Example: {"type":"eventFromContent","eventName":"multipleChoice","eventParams":"{\"question\":\"Quel est la profondeur du lac de gruyere?\",\"answers\":[\"1m\",\"10m\",\"100m\"],\"correctAnswer\":2,\"hint\":\"On peut se noyer\"}"}
    let eventFromContent = new EventFromContent();
    eventFromContent.name = event.eventName;
    eventFromContent.params = event.eventParams;
    this.eventFromContent.next(eventFromContent);

    if (event.eventName === 'couponGenerated') {
      let params = JSON.parse(event.eventParams);
      let coupon = new GeneratedCoupon(params.contextId, params.url);
      this.generatedCoupon.next(coupon);
    }
  }

  /**
   * Gets an observable that is called when a content requests a synchronization with
   * a list of tags (Context synchronization trigger)
   */
  public getSynchronizationRequestObservable(): Observable<string[]> {
    return this.synchronizationRequest.asObservable();
  }

  /**
   * Gets an observable that is called every time a new coupon is generated
   * via a coupon content.
   */
  public getGeneratedCouponObservable(): Observable<GeneratedCoupon> {
    return this.generatedCoupon.asObservable();
  }

  /**
   * Gets an observable for listening on synchronization progress. The last known
   * value is given when the listener subscribes to the observable.
   * A value of 100 means that the synchronization is over.
   * A value above 100 means that an error occured during the synchronization.
   */
  public getSynchronizationProgress(): Observable<number> {
    return this.synchronizationProgress.asObservable();
  }

  /**
   * Gets an observable that is called when the event "presentAnnotations" or
   * "hideAnnotations" (true/false respectively) is called. It informs that
   * an AR annotation is being displayed or not.
   */
  public getAnnotationPresenceObservable(): Observable<boolean> {
    return this.annotationPresence.asObservable();
  }

  /**
   * Gets an observable that is called when an event from content is triggered (e.g. coupon)
   */
  public getEventFromContentObservable(): Observable<EventFromContent> {
    return this.eventFromContent.asObservable();
  }

  /**
   * Gets an observable that is called when a context is entered (i.e. activated). It gives
   * the public ID of the context.
   */
  public getEnterContextObservable(): Observable<string> {
    return this.enterContext.asObservable();
  }

  /**
   * Gets an observable that is called when a context is exited. It gives
   * the public ID of the context.
   */
  public getExitContextObservable(): Observable<string> {
    return this.exitContext.asObservable();
  }

  /**
   * Gets an observable that is called when a code (e.g. QR code) is recognized.
   * It gives the content of the code. See also getQrCodeSynchronizationRequest().
   */
  public getCodeRecognition(): Observable<string> {
    return this.codeRecognition.asObservable();
  }

  /**
   * Gets an observable that is called when a synchronization QR code is scanned.
   * It gives the tag to synchronize
   */
  public getQrCodeSynchronizationRequest() {
    return this.qrCodeSynchronization.asObservable();
  }

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
  public sync(tags) {
    this.synchronizationProgress.next(0);
    this.platform.ready().then(() => {
      if (window.cordova) {
        window.cordova.plugins.PixLive.synchronize(tags, (contexts) => {
          this.ngZone.run(() => {
            this.synchronizationProgress.next(100);
          });
        }, (reason) => {
          this.ngZone.run(() => {
            this.synchronizationProgress.next(102);
          });
        });
      } else {
        // The plugin is not available, we simulate a synchronization for development.
        setTimeout(() => {
          this.synchronizationProgress.next(25);
          setTimeout(() => {
            this.synchronizationProgress.next(50);
            setTimeout(() => {
              this.synchronizationProgress.next(75);
              setTimeout(() => {
                this.synchronizationProgress.next(103);
              }, 500);
            }, 500);
          }, 500);
        }, 500);
      }
    });
  }

  /**
   * Gets the nearby GPS points
   * @param latitude the current latitude
   * @param longitude the current longitude
   */
  public getNearbyGpsPoints(latitude: number, longitude: number): Promise<GPSPoint[]> {
    return new Promise((resolve, reject) => {
      if (window.cordova) {
        window.cordova.plugins.PixLive.getNearbyGPSPoints(latitude, longitude,
          (data) => {
            this.ngZone.run(() => {
              resolve(data as GPSPoint[]);
            });
          },
          () => {
            reject('getNearbyGpsPoints failed');
          });
      } else {
        reject('getNearbyGpsPoints failed: no cordova plugin');
      }
    });
  }

  /**
   * Checks whether there are beacon contexts.
   */
  public isContainingBeacons(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (window.cordova) {
        window.cordova.plugins.PixLive.isContainingBeacons(
          (data) => {
            this.ngZone.run(() => {
              resolve(data as boolean);
            });
          },
          () => {
            reject('isContainingBeacons failed');
          });
      } else {
        reject('isContainingBeacons failed: no cordova plugin');
      }
    });
  }

  /**
   * Checks whether there are GPS contexts.
   */
  public isContainingGPSPoints(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (window.cordova) {
        window.cordova.plugins.PixLive.isContainingGPSPoints(
          (data) => {
            this.ngZone.run(() => {
              resolve(data as boolean);
            });
          },
          () => {
            reject('isContainingGPSPoints failed');
          });
      } else {
        reject('isContainingGPSPoints failed: no cordova plugin');
      }
    });
  }

  /**
   * Gets the nearby beacons
   */
  public getNearbyBeacons(): Promise<Context[]> {
    return new Promise((resolve, reject) => {
      if (window.cordova) {
        window.cordova.plugins.PixLive.getNearbyBeacons(
          (data) => {
            this.ngZone.run(() => {
              resolve(data as Context[]);
            });
          },
          () => {
            reject('getNearbyBeacons failed');
          });
      } else {
        reject('getNearbyBeacons failed: no cordova plugin');
      }
    });
  }

  /**
   * Retrieves the nearby status.
   */
  public getNearbyStatus(): Promise<NearbyStatus> {
    return new Promise((resolve, reject) => {
      if (window.cordova) {
        window.cordova.plugins.PixLive.getNearbyStatus(
          (data) => {
            this.ngZone.run(() => {
              resolve(data as NearbyStatus);
            });
          },
          () => {
            reject('getNearbyStatus failed');
          });
      } else {
        reject('getNearbyStatus failed: no cordova plugin');
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
            reject('Error');
          });
      } else {
        reject('No cordova plugin');
      }
    });
  }


  /**
   * Return the specified context
   * @param contextId the ID of the context
   */
  public getContext(contextId: string): Promise<Context> {
    return new Promise((resolve, reject) => {
      if (window.cordova) {
        window.cordova.plugins.PixLive.getContext(contextId,
          (data) => {
            this.ngZone.run(() => {
              resolve(data as Context);
            });
          },
          () => {
            reject('getContext failed');
          });
      } else {
        reject('getContext failed: no cordova plugin');
      }
    });
  }

  /**
   * Opens the given context
   * @param contextId the ID of the context to open
   */
  public activate(contextId: string) {
    this.getContext(contextId).then(context => context.activate());
  }

  /**
   * Opens the given URL using the SDK browser
   * @param url a link
   */
  public openURLInInternalBrowser(url: string) {
    if (window.cordova) {
      window.cordova.plugins.PixLive.openURLInInternalBrowser(url);
    }
  }

  /**
   * Computes the distance between to GPS points
   * @param latitude1 the latitude of the first point
   * @param longitude1 the longitude of the first point
   * @param latitude2 the latitude of the second point
   * @param longitude2 the longitude of the second point
   */
  public computeDistanceBetweenGPSPoints(latitude1: number, longitude1: number, latitude2: number, longitude2: number): Promise<number> {
    return new Promise((resolve, reject) => {
      if (window.cordova) {
        window.cordova.plugins.PixLive.computeDistanceBetweenGPSPoints(latitude1, longitude1, latitude2, longitude2,
          (data) => {
            this.ngZone.run(() => {
              resolve(data);
            });
          },
          () => {
            reject('computeDistanceBetweenGPSPoints failed');
          });
      } else {
        reject('computeDistanceBetweenGPSPoints failed: no cordova plugin');
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

/**
 * Class representing a Context.
 */
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

/**
 * Class representing a Event triggered by a content
 */
export class EventFromContent {
  name: string;
  params: string;
}

/**
 * Class containing the status of nearby (location permission and location/bluetooth on/off)
 */
export class NearbyStatus {
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

/**
 * Coupon received via an "eventFromContent" event
 */
export class GeneratedCoupon {
  constructor(public contextId: string, public couponUrl: string) {}
}