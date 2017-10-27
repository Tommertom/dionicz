import { Observable } from 'rxjs/Observable';
import { NavParams, ViewController } from 'ionic-angular';
import { Input, Component } from '@angular/core';

import { WidgetComponent } from './../widget/widget.component';

@Component({
    selector: 'domoticz-widget',
    templateUrl: 'domoticzwidget.component.html',
    //   styles:['domoticz-device-widget {width:100px}']
})
export class DomitczWidgetComponent { //extends WidgetComponent

    @Input() state: Object;
    itemtype: string = '';

   @Input() itemid: Object;

    constructor() { }

    ngAfterContentInit() {
        this.itemtype = this.state['_type'];

        //uid.replace(/[0-9]/g, '')
        //   console.log('DomitczWidgetComponent  ngAfterContentInit', this.state, this.itemtype)
    }

}