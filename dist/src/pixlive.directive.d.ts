import { ElementRef, OnInit, Renderer } from '@angular/core';
import { Platform, ViewController } from 'ionic-angular';
export declare class PixliveDirective implements OnInit {
    private platform;
    private el;
    private renderer;
    private viewCtrl;
    /**
     * Cordova PixLive Camera AR view
     */
    private arView;
    /**
     * HTML element displayed instead of the camera when serving the file on the browser for development
     */
    private fakeCamera;
    constructor(platform: Platform, el: ElementRef, renderer: Renderer, viewCtrl: ViewController);
    /**
     * Initializes the AR view lifecycle
     */
    private initArViewLifeCycle();
    /**
     * Call this method after an orientation change for resizing the AR view
     * @param element
     * @param view
     */
    private onOrientationChange();
    ngOnInit(): void;
    /**
     * Defines whether the view is clickable. If the view is clickable, it will intercept the touch event.
     * If a view in on top of the component, then you must disable the click interception.
     * @param enabled true if the view is clickable and intercept all touch events, false otherwise.
     */
    setTouchEnabled(enabled: boolean): void;
}
