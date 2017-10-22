import { Observable } from 'rxjs/Observable';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { DomoticzProvider } from './../../providers/domoticz.provider';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  widgetList: Array<Object> = [];
  domoticzStateSubscription: any;
  domoticzState: any;

  constructor(public navCtrl: NavController,
    private domoticz: DomoticzProvider) {
    this.domoticzStateSubscription =
      this.domoticz.getDomoticzStateObservable().subscribe(state => {
        this.widgetList = Object.keys(state);
        this.domoticzState = state;
      })
  }
}

