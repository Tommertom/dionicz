import { WidgetSelectorPage } from './../pages/widgetselector/widgetselector';
import { HttpModule } from '@angular/http';
import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { HomePage } from '../pages/home/home';

import { IonicStorageModule } from '@ionic/storage';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { DomitczWidgetComponent } from './../components/domoticzwidget/domoticzwidget.component';
import { DomitczDeviceWidgetComponent } from './../components/domoticzwidget/domoticzdevicewidget.component';

import { DomoticzProvider } from './../providers/domoticz.provider';
import { WeatherProvider } from './../providers/weather.provider';


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    DomitczWidgetComponent,
    DomitczDeviceWidgetComponent,
    WidgetSelectorPage
  ],
  imports: [
    BrowserModule,HttpModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot({
      name: '__mydb',
         driverOrder: ['sqlite','indexeddb',  'websql']
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    WidgetSelectorPage
  ],
  providers: [
    StatusBar,
    SplashScreen,DomoticzProvider,WeatherProvider,

    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
