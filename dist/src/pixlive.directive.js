import { Directive, ElementRef, Renderer } from '@angular/core';
import { Platform, ViewController } from 'ionic-angular';
var PixliveDirective = (function () {
    function PixliveDirective(platform, el, renderer, viewCtrl) {
        this.platform = platform;
        this.el = el;
        this.renderer = renderer;
        this.viewCtrl = viewCtrl;
    }
    /**
     * Initializes the AR view lifecycle
     */
    PixliveDirective.prototype.initArViewLifeCycle = function () {
        var _this = this;
        this.viewCtrl.willEnter.subscribe(function () {
            if (_this.arView) {
                _this.arView.beforeEnter();
                _this.onOrientationChange();
            }
        });
        this.viewCtrl.didEnter.subscribe(function () {
            if (_this.arView) {
                _this.arView.afterEnter();
            }
            if (_this.fakeCamera) {
                _this.renderer.setElementStyle(_this.fakeCamera, 'display', 'block');
            }
        });
        this.viewCtrl.willLeave.subscribe(function () {
            if (_this.arView) {
                _this.arView.beforeLeave();
            }
            if (_this.fakeCamera) {
                _this.renderer.setElementStyle(_this.fakeCamera, 'display', 'none');
            }
        });
        this.viewCtrl.didLeave.subscribe(function () {
            if (_this.arView) {
                _this.arView.afterLeave();
            }
        });
    };
    /**
     * Call this method after an orientation change for resizing the AR view
     * @param element
     * @param view
     */
    PixliveDirective.prototype.onOrientationChange = function () {
        var _this = this;
        setTimeout(function () {
            var rect = _this.el.nativeElement.getBoundingClientRect();
            _this.arView.resize(rect.left, rect.top, rect.width, rect.height);
        }, 300);
    };
    PixliveDirective.prototype.ngOnInit = function () {
        var _this = this;
        this.renderer.setElementStyle(this.el.nativeElement, 'display', 'inline-block');
        this.initArViewLifeCycle();
        this.platform.ready().then(function () {
            setTimeout(function () {
                var rect = _this.el.nativeElement.getBoundingClientRect();
                if (window.cordova) {
                    // Create the camera view
                    _this.arView = window.cordova.plugins.PixLive.createARView(rect.left, rect.top, rect.width, rect.height);
                    window.addEventListener('orientationchange', function () { return _this.onOrientationChange(); }, false);
                }
                else {
                    // As a fallback, we create a grey element for replacing the camera view. Useful for dev purpose.
                    var fakeCamera = document.createElement('DIV');
                    document.body.appendChild(fakeCamera);
                    _this.renderer.setElementStyle(fakeCamera, 'position', 'fixed');
                    _this.renderer.setElementStyle(fakeCamera, 'background-color', 'gray');
                    _this.renderer.setElementStyle(fakeCamera, 'left', rect.left + 'px');
                    _this.renderer.setElementStyle(fakeCamera, 'top', rect.top + 'px');
                    _this.renderer.setElementStyle(fakeCamera, 'width', rect.width + 'px');
                    _this.renderer.setElementStyle(fakeCamera, 'height', rect.height + 'px');
                    _this.renderer.setElementStyle(fakeCamera, 'z-index', '-1000');
                    _this.fakeCamera = fakeCamera;
                }
            }, 300);
        });
        // The AR view is placed below the application so we set all views that are on top transparent.
        var node = this.el.nativeElement.parentElement;
        while (node) {
            this.renderer.setElementStyle(node, 'background-color', 'transparent');
            node = node.parentElement;
        }
    };
    /**
     * Defines whether the view is clickable. If the view is clickable, it will intercept the touch event.
     * If a view in on top of the component, then you must disable the click interception.
     * @param enabled true if the view is clickable and intercept all touch events, false otherwise.
     */
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
                    selector: 'pixlive-camera-view'
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