import { NavParams, ViewController } from 'ionic-angular';
import { Input, Component } from '@angular/core';

import { WidgetComponent } from './../widget/widget.component';

@Component({
    selector: 'domoticz-widget',
    templateUrl: 'domoticzwidget.component.html',

})
export class DomitczWidgetComponent { //extends WidgetComponent

    @Input() payload: Object;
   

    constructor(
        public viewCtrl: ViewController,
        public navParams: NavParams) {
        //super();
    }

    ngAfterContentInit() {
    }

}