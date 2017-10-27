import { Storage } from '@ionic/storage';
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
    private domoticz: DomoticzProvider,
    private storage: Storage) {
    this.settings = this.domoticz.getSettings();
  }

  startObserving() {
    this.state = JSON.stringify(this.domoticz.getState(), null, 2);
    this.domoticz.changeSettings(this.settings);

    this.storage.set('domoticzConfig', this.settings);

    location.reload()
  }
}
