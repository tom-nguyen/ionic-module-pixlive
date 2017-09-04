import { Component, ViewChild } from '@angular/core';
import { PixliveService } from './pixlive-service';
import { PixliveDirective } from './pixlive.directive';
var PixliveComponent = (function () {
    function PixliveComponent(pixliveService) {
        this.pixliveService = pixliveService;
    }
    PixliveComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.pixliveService.getAnnotationPresenceObservable().subscribe(function (visible) { return _this.cameraView.setTouchEnabled(visible); });
    };
    /**
     * Defines whether the view is clickable. If the view is clickable, it will intercept the touch event.
     * If a view in on top of the component, then you must disable the click interception.
     * @param clickable true if the view is clickable and intercept all touch events, false otherwise.
     */
    PixliveComponent.prototype.setClickable = function (clickable) {
        this.cameraView.setTouchEnabled(clickable);
    };
    PixliveComponent.decorators = [
        { type: Component, args: [{
                    selector: 'pixlive',
                    template: '<pixlive-camera-view style="width: 100%; height: 100%;"></pixlive-camera-view>'
                },] },
    ];
    /** @nocollapse */
    PixliveComponent.ctorParameters = function () { return [
        { type: PixliveService, },
    ]; };
    PixliveComponent.propDecorators = {
        'cameraView': [{ type: ViewChild, args: [PixliveDirective,] },],
    };
    return PixliveComponent;
}());
export { PixliveComponent };
//# sourceMappingURL=pixlive.component.js.map