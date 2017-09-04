import { Component, OnInit, ViewChild } from '@angular/core';

import { PixliveService } from './pixlive-service';
import { PixliveDirective } from './pixlive.directive';

@Component({
  selector: 'pixlive',
  template: '<pixlive-camera-view style="width: 100%; height: 100%;"></pixlive-camera-view>'
})
export class PixliveComponent implements OnInit {

  @ViewChild(PixliveDirective) cameraView: PixliveDirective;

  constructor(private pixliveService: PixliveService) {

  }

  ngOnInit() {
    this.pixliveService.getAnnotationPresenceObservable().subscribe(visible => this.cameraView.setTouchEnabled(visible));
  }

  /**
   * Defines whether the view is clickable. If the view is clickable, it will intercept the touch event.
   * If a view in on top of the component, then you must disable the click interception.
   * @param clickable true if the view is clickable and intercept all touch events, false otherwise.
   */
  public setClickable(clickable: boolean) {
    this.cameraView.setTouchEnabled(clickable);
  }


}
