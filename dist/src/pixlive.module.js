import { NgModule } from '@angular/core';
import { PixliveService } from './pixlive-service';
import { PixliveComponent } from './pixlive.component';
import { PixliveDirective } from './pixlive.directive';
var PixliveModule = (function () {
    function PixliveModule() {
    }
    PixliveModule.decorators = [
        { type: NgModule, args: [{
                    declarations: [PixliveComponent, PixliveDirective],
                    exports: [PixliveComponent],
                    providers: [PixliveService]
                },] },
    ];
    /** @nocollapse */
    PixliveModule.ctorParameters = function () { return []; };
    return PixliveModule;
}());
export { PixliveModule };
//# sourceMappingURL=pixlive.module.js.map