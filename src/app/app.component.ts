import { DomoticzProvider } from './../providers/domoticz.provider';
import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TabsPage } from '../pages/tabs/tabs';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = TabsPage;

  constructor(
    platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen,
    private domoticz: DomoticzProvider
  ) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });

    this.domoticz.initDomoticzService({
      server: '192.168.178.73',             // IP adress
      port: '8080',              // number as a string, with no colon ('8080')
      protocol: 'http://',           // https:// or http://
      refreshdelay: '5000'       // the ms to wait before a full refresh
    });
 
  }
}
