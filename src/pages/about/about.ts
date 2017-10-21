import { DomoticzProvider } from './../../providers/domoticz.provider';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {

  settings: any;
  deviceList: Array<Object> = [];
  state: string = "";

  constructor(public navCtrl: NavController,
    private domoticz: DomoticzProvider) {
    this.settings = this.domoticz.getSettings();
  }

  startObserving() {
    this.state = JSON.stringify(this.domoticz.getSate(), null, 2);
  }
}
