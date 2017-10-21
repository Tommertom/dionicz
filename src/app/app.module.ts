
import { HttpModule } from '@angular/http';
import { DomoticzProvider } from './../providers/domoticz.provider';
import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { WidgetComponent } from './../components/widget/widget.component';
import { DomitczWidgetComponent } from './../components/domoticzwidget/domoticzwidget.component';
import { DomitczDeviceWidgetComponent } from './../components/domoticzwidget/domoticzdevicewidget.component';


@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    WidgetComponent,
    DomitczWidgetComponent,
    DomitczDeviceWidgetComponent
  ],
  imports: [
    BrowserModule,HttpModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,DomoticzProvider,

    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
