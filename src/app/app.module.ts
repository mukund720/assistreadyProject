import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HelloComponent } from './hello.component';
import { AgmCoreModule } from '@agm/core';
import { AgmDirectionModule } from 'agm-direction';

@NgModule({
  imports:      [ BrowserModule, FormsModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCr17JyBUkudCa6BTxniFNWPeADAGPXcIo'
    }),
    AgmDirectionModule 
  ],
  declarations: [ AppComponent, HelloComponent ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
