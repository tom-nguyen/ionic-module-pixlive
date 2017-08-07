import { OnInit } from '@angular/core';
import { PixliveDirective } from './pixlive.directive';
import { PixliveService } from './pixlive-service';
export declare class PixliveComponent implements OnInit {
    private pixliveService;
    cameraView: PixliveDirective;
    constructor(pixliveService: PixliveService);
    ngOnInit(): void;
    /**
     * Defines whether the view is clickable. If the view is clickable, it will intercept the touch event.
     * If a view in on top of the component, then you must disable the click interception.
     * @param clickable true if the view is clickable and intercept all touch events, false otherwise.
     */
    setClickable(clickable: boolean): void;
}
