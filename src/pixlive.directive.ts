import { Directive, ElementRef, OnInit, Renderer } from '@angular/core';
import { Platform, ViewController } from 'ionic-angular';

declare var window;

@Directive({
  selector: 'pixlive-camera-view'
})
export class PixliveDirective implements OnInit {

  /**
   * Cordova PixLive Camera AR view
   */
  private arView: PixliveARView;

  /**
   * HTML element displayed instead of the camera when serving the file on the browser for development
   */
  private fakeCamera: HTMLElement;

  constructor(private platform: Platform, private el: ElementRef, private renderer: Renderer, private viewCtrl: ViewController) {
  }

  /**
   * Initializes the AR view lifecycle
   */
  private initArViewLifeCycle() {
    this.viewCtrl.willEnter.subscribe(() => {
      if (this.arView) {
        this.arView.beforeEnter();
        this.onOrientationChange();
      }
    });
    this.viewCtrl.didEnter.subscribe(() => {
      if (this.arView) {
        this.arView.afterEnter();
      }
      if (this.fakeCamera) {
        this.renderer.setElementStyle(this.fakeCamera, 'display', 'block');
      }
    });
    this.viewCtrl.willLeave.subscribe(() => {
      if (this.arView) {
        this.arView.beforeLeave();
      }
      if (this.fakeCamera) {
        this.renderer.setElementStyle(this.fakeCamera, 'display', 'none');
      }
    });
    this.viewCtrl.didLeave.subscribe(() => {
      if (this.arView) {
        // we hide the view using resize. it avoids having the inverted camera
        // in some scenario. For example, on Android, if we open the scan page, go to another
        // tab, press the home button, go back to the app and go back to the scan, then
        // the camera preview is inverted. Calling this resize method, avoid this problem
        this.arView.resize(0, 0, 0, 0);
        this.arView.afterLeave();
      }
    });
  }

  /**
   * Call this method after an orientation change for resizing the AR view
   * @param element
   * @param view
   */
  private onOrientationChange() {
    setTimeout(() => {
      let rect = this.el.nativeElement.getBoundingClientRect();
      this.arView.resize(rect.left, rect.top, rect.width, rect.height);
    }, 300);
  }

  ngOnInit() {
    this.renderer.setElementStyle(this.el.nativeElement, 'display', 'inline-block');

    this.initArViewLifeCycle();

    this.platform.ready().then(() => {
      setTimeout(() => {
        let rect = this.el.nativeElement.getBoundingClientRect();
        if (window.cordova) {
          // Create the camera view
          this.arView = window.cordova.plugins.PixLive.createARView(rect.left, rect.top, rect.width, rect.height);
          window.addEventListener('orientationchange', () => this.onOrientationChange(), false);
        } else {
          // As a fallback, we create a grey element for replacing the camera view. Useful for dev purpose.
          let fakeCamera = document.createElement('DIV');
          document.body.appendChild(fakeCamera);
          this.renderer.setElementStyle(fakeCamera, 'position', 'fixed');
          this.renderer.setElementStyle(fakeCamera, 'background-color', 'gray');
          this.renderer.setElementStyle(fakeCamera, 'left', rect.left + 'px');
          this.renderer.setElementStyle(fakeCamera, 'top', rect.top + 'px');
          this.renderer.setElementStyle(fakeCamera, 'width', rect.width + 'px');
          this.renderer.setElementStyle(fakeCamera, 'height', rect.height + 'px');
          this.renderer.setElementStyle(fakeCamera, 'z-index', '-1000');
          this.fakeCamera = fakeCamera;
        }
      }, 300);
    });

    // The AR view is placed below the application so we set all views that are on top transparent.
    let node = this.el.nativeElement.parentElement;
    while (node) {
      this.renderer.setElementStyle(node, 'background-color', 'transparent');
      node = node.parentElement;
    }
  }

  /**
   * Defines whether the view is clickable. If the view is clickable, it will intercept the touch event.
   * If a view in on top of the component, then you must disable the click interception.
   * @param enabled true if the view is clickable and intercept all touch events, false otherwise.
   */
  public setTouchEnabled(enabled: boolean) {
    if (enabled) {
      this.arView.enableTouch();
    } else {
      this.arView.disableTouch();
    }
  }

}

interface PixliveARView {
  beforeEnter();
  afterEnter();
  enableTouch();
  disableTouch();
  beforeLeave();
  afterLeave();
  resize(left: number, top: number, width: number, height: number);
}
