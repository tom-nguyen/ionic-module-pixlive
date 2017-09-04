import { NgModule } from '@angular/core';

import { PixliveService } from './pixlive-service';
import { PixliveComponent } from './pixlive.component';
import { PixliveDirective } from './pixlive.directive';

@NgModule({
  declarations: [PixliveComponent, PixliveDirective],
  exports: [PixliveComponent],
  providers: [PixliveService]
})
export class PixliveModule { }
