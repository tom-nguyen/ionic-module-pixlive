import { Component, ElementRef, Renderer, ViewChild } from '@angular/core';
import { Platform, ViewController } from 'ionic-angular';
import { PixliveDirective } from './pixlive.directive';
import { PixliveService } from './pixlive-service';
var PixliveComponent = (function () {
    function PixliveComponent(platform, el, renderer, viewCtrl, pixliveService) {
        this.platform = platform;
        this.el = el;
        this.renderer = renderer;
        this.viewCtrl = viewCtrl;
        this.pixliveService = pixliveService;
    }
    PixliveComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.pixliveService.getAnnotationPresenceObservable().subscribe(function (visible) { return _this.cameraView.setTouchEnabled(visible); });
        // this.renderer.setElementStyle(this.el.nativeElement, 'display', 'inline-block');
        // let node = this.el.nativeElement.parentElement;
        // while (node) {
        //   this.renderer.setElementStyle(node, 'background-color', 'transparent');
        //   node = node.parentElement;
        // }
        // let rect = this.el.nativeElement.getBoundingClientRect();
        // console.log(this.el);
        // console.log(rect);
        // // this.viewCtrl..subscribe(() => {
        // //   console.log("did enter");
        // //   let rect = this.el.nativeElement.getBoundingClientRect();
        // //   console.log(rect);
        // //   console.log(window.scrollX + " " + window.scrollY);
        // // });
    };
    PixliveComponent.prototype.ngAfterViewInit = function () {
        //console.log("comp ng after view init");
    };
    PixliveComponent.prototype.ngDoCheck = function () {
        // console.log("comp ng do check");
    };
    PixliveComponent.prototype.ngAfterViewChecked = function () {
        // console.log("comp ng after view checked");
    };
    PixliveComponent.decorators = [
        { type: Component, args: [{
                    selector: 'pixlive',
                    template: '<pixlive-camera-view style="width: 100%; height: 100%;"></pixlive-camera-view>'
                },] },
    ];
    /** @nocollapse */
    PixliveComponent.ctorParameters = function () { return [
        { type: Platform, },
        { type: ElementRef, },
        { type: Renderer, },
        { type: ViewController, },
        { type: PixliveService, },
    ]; };
    PixliveComponent.propDecorators = {
        'cameraView': [{ type: ViewChild, args: [PixliveDirective,] },],
    };
    return PixliveComponent;
}());
export { PixliveComponent };
//# sourceMappingURL=pixlive.component.js.map