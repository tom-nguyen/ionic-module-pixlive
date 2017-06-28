import { NgModule }           from '@angular/core';
import { PixliveComponent }   from './pixlive.component';
import { PixliveDirective }   from './pixlive.directive';
import { PixliveService }     from './pixlive-service';

@NgModule({
  declarations: [ PixliveComponent, PixliveDirective ],
  exports:      [ PixliveComponent ],
  providers:    [ PixliveService ]
})
export class PixliveModule { }
