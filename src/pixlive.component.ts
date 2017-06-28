import { Component, ElementRef, OnInit, Renderer, ViewChild }      from '@angular/core';
import { Platform, ViewController } from 'ionic-angular';
import { PixliveDirective } from './pixlive.directive';
import { PixliveService } from './pixlive-service';

declare var window;

@Component({
  selector: 'pixlive',
  template : '<pixlive-camera-view style="width: 100%; height: 100%;"></pixlive-camera-view>'
})
export class PixliveComponent implements OnInit {

  @ViewChild(PixliveDirective) cameraView: PixliveDirective;

  constructor(private platform: Platform, private el: ElementRef, private renderer: Renderer, private viewCtrl: ViewController, private pixliveService: PixliveService) {

  }

  ngOnInit() {
    this.pixliveService.getAnnotationPresenceObservable().subscribe(visible => this.cameraView.setTouchEnabled(visible));
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
  }

  ngAfterViewInit() {
    //console.log("comp ng after view init");
  }

  ngDoCheck() {
    // console.log("comp ng do check");
  }

  ngAfterViewChecked() {
    // console.log("comp ng after view checked");
  }


}
