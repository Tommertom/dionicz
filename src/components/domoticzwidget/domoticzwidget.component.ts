import { DomoticzProvider } from './../../providers/domoticz.provider';
import { Observable } from 'rxjs/Observable';
import { NavParams, ViewController } from 'ionic-angular';
import { Input, Component } from '@angular/core';

@Component({
    selector: 'domoticz-widget',
    templateUrl: 'domoticzwidget.component.html',
    //   styles:['domoticz-device-widget {width:100px}']
})
export class DomitczWidgetComponent { //extends WidgetComponent

    itemtype: string = '';

    @Input() state: Object;

    @Input() uid: Object;

    constructor() {
        
    }

    ngAfterContentInit() {

        console.log('GETTING somtiing', this.state, this.uid, typeof this.state)

        if (this.state)
            if (this.state['_type'])
                this.itemtype = this.state['_type']


        //uid.replace(/[0-9]/g, '')
        //console.log('DomitczWidgetComponent  ngAfterContentInit', this.state, this.itemtype)
    }

}