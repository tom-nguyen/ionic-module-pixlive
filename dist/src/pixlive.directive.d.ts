import { ElementRef, OnInit, Renderer } from '@angular/core';
import { Platform, ViewController } from 'ionic-angular';
export declare class PixliveDirective implements OnInit {
    private platform;
    private el;
    private renderer;
    private viewCtrl;
    private arView;
    private fakeCamera;
    constructor(platform: Platform, el: ElementRef, renderer: Renderer, viewCtrl: ViewController);
    getNativeElement(): any;
    private initArViewLifeCycle();
    private onOrientationChange(element, view);
    ngOnInit(): void;
    ngAfterViewInit(): void;
    ngDoCheck(): void;
    ngAfterViewChecked(): void;
    setTouchEnabled(enabled: boolean): void;
}
