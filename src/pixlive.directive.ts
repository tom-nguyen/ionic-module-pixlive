import { Directive, ElementRef, OnInit, Renderer }      from '@angular/core';
import { Platform, ViewController } from 'ionic-angular';

declare var window;

@Directive({
  //moduleId: module.id,
  selector: 'pixlive-camera-view'
  //templateUrl: 'pixlive.component.html'
})
export class PixliveDirective implements OnInit {

  private arView;
  private fakeCamera;

  constructor(private platform: Platform, private el: ElementRef, private renderer: Renderer, private viewCtrl: ViewController) {

  }

  public getNativeElement() {
    return this.el.nativeElement;
  }

  private initArViewLifeCycle() {
    this.viewCtrl.willEnter.subscribe(() => {
      console.log("will enter");
      if (this.arView) {
        console.log("XXXXXX Opening - beforeEnter");
        this.arView.beforeEnter();
        this.onOrientationChange(this.el, this.arView);
      }
    });
    this.viewCtrl.didEnter.subscribe(() => {
      console.log("did enter");
      if (this.arView) {
        console.log("XXXXXX Opening - afterEnter");
        this.arView.afterEnter();
      }
      if (this.fakeCamera) {
        this.renderer.setElementStyle(this.fakeCamera, 'display', 'block');
      }
    });
    this.viewCtrl.willLeave.subscribe(() => {
      console.log("will leave");
      if (this.arView) {
        console.log("XXXXXX Closing - beforeLeave");
        this.arView.beforeLeave();
      }
      if (this.fakeCamera) {
        this.renderer.setElementStyle(this.fakeCamera, 'display', 'none');
      }
    });
    this.viewCtrl.willUnload.subscribe(() => {
      console.log("will unload");
    });
    this.viewCtrl.didLeave.subscribe(() => {
      console.log("did leave");
      if (this.arView) {
        console.log("XXXXXX Closing - afterLeave");
        this.arView.afterLeave();
      }
    });
  }

  private onOrientationChange(element, view) {
    console.log("orientation change");
    console.log(JSON.stringify(element.nativeElement.getBoundingClientRect()));
    setTimeout(() => {
      let rect = element.nativeElement.getBoundingClientRect();
      console.log(JSON.stringify(rect));
      view.resize(rect.left, rect.top, rect.width, rect.height);
    }, 300);
  }

  ngOnInit() {
    this.renderer.setElementStyle(this.el.nativeElement, 'display', 'inline-block');

    this.initArViewLifeCycle();

    this.platform.ready().then(() => {
      console.log("platform ready");
      setTimeout(() => {
        let rect = this.el.nativeElement.getBoundingClientRect();
        if (window.cordova) {
          console.log("creating AR view");
          this.arView = window.cordova.plugins.PixLive.createARView(rect.left, rect.top, rect.width, rect.height);
          console.log("AR view created");

          let element = this.el;
          let view = this.arView;
          let fct = this.onOrientationChange;
          window.addEventListener("orientationchange", function () {
            fct(element, view);
          }, false);
        } else {
          let fakeCamera = document.createElement("DIV");
          document.body.appendChild(fakeCamera);
          this.renderer.setElementStyle(fakeCamera, 'position', 'fixed');
          this.renderer.setElementStyle(fakeCamera, 'background-color', 'gray');
          this.renderer.setElementStyle(fakeCamera, 'left', rect.left + 'px');
          this.renderer.setElementStyle(fakeCamera, 'top', rect.top + 'px');
          this.renderer.setElementStyle(fakeCamera, 'width', rect.width + 'px');
          this.renderer.setElementStyle(fakeCamera, 'height', rect.height + 'px');
          this.fakeCamera = fakeCamera;
        }
      }, 300);
    });


    let node = this.el.nativeElement.parentElement;
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
  }

  ngAfterViewInit() {
    console.log("ng after view init");
  }

  ngDoCheck() {
    console.log("ng do check");
  }

  ngAfterViewChecked() {
    console.log("ng after view checked");
  }

  public setTouchEnabled(enabled: boolean) {
    if (enabled) {
      this.arView.enableTouch();
    } else {
      this.arView.disableTouch();
    }
  }

}
