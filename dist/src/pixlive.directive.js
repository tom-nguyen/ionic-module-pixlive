import { Directive, ElementRef, Renderer } from '@angular/core';
import { Platform, ViewController } from 'ionic-angular';
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
        { type: Directive, args: [{
                    //moduleId: module.id,
                    selector: 'pixlive-camera-view'
                    //templateUrl: 'pixlive.component.html'
                },] },
    ];
    /** @nocollapse */
    PixliveDirective.ctorParameters = function () { return [
        { type: Platform, },
        { type: ElementRef, },
        { type: Renderer, },
        { type: ViewController, },
    ]; };
    return PixliveDirective;
}());
export { PixliveDirective };
//# sourceMappingURL=pixlive.directive.js.map