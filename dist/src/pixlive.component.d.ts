import { ElementRef, OnInit, Renderer } from '@angular/core';
import { Platform, ViewController } from 'ionic-angular';
import { PixliveDirective } from './pixlive.directive';
import { PixliveService } from './pixlive-service';
export declare class PixliveComponent implements OnInit {
    private platform;
    private el;
    private renderer;
    private viewCtrl;
    private pixliveService;
    cameraView: PixliveDirective;
    constructor(platform: Platform, el: ElementRef, renderer: Renderer, viewCtrl: ViewController, pixliveService: PixliveService);
    ngOnInit(): void;
    ngAfterViewInit(): void;
    ngDoCheck(): void;
    ngAfterViewChecked(): void;
}
