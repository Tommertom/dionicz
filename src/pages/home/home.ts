import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs/Observable';
import { Component, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';

import { DomoticzProvider } from './../../providers/domoticz.provider';

import * as Packery from 'packery';
import * as Draggabilly from 'draggabilly';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  @ViewChild('gridPackery') gridPackery;

  draggies = [];
  pckry: any;
  stuff: any;

  dashboardLayout: Object = {
    widgetList: [],
    domoticzState: {}
  }

  domoticzSubscription: any;


  constructor(public navCtrl: NavController,
    private domoticz: DomoticzProvider,
    private storage: Storage) {

    this.dashboardLayout = {
      widgetList: [],
      domoticzState: {}
    }

    //this.storage.remove('dashboardLayout');

    // try to find a state, and if found, load it or create it
    this.storage.ready()
      .then(() => { return this.storage.get('dashboardLayout') })
      .then(value => {

        if (value)
          if (value['widgetList']) {
            console.log('Found dashboard', value);
            this.dashboardLayout = value;
            //   this.domoticzState = value['lastState'];

            this.domoticzSubscription =
              this.domoticz.getDomoticzPoller()
                .subscribe(data => {
                  // console.log('RECEIVING STUFF1', data)
                  let uid = data['_uid'];
                  this.dashboardLayout['domoticzState'][uid] = data;
                })

          } else {

            console.log('Trying to find stuff');

            // get initial state of domoticz widgets
            let s = this.domoticz.getDomoticzPoller().subscribe((item) => {

              console.log('FOUND item', item);

              let uid = item['_uid'];
              if (this.dashboardLayout['widgetList'].indexOf(uid) < 0) {

                if (uid) {
                  this.dashboardLayout['widgetList'].push(item['_uid'])
                  this.dashboardLayout['domoticzState'][uid] = item;
                } else console.log('RECEIVED UNDEFINED????', item);
              }
            })

            // we will listen 5 seconds for widgets
            setTimeout(() => {
              console.log('SAVING dashboard', this.dashboardLayout)
              s.unsubscribe();
              this.storage.set('dashboardLayout', this.dashboardLayout);


              this.domoticzSubscription =
                this.domoticz.getDomoticzPoller()
                  .subscribe(data => {
                    //  console.log('RECEIVING STUFF2', data)
                    let uid = data['_uid'];
                    this.dashboardLayout['domoticzState'][uid] = data;
                  })

            }, 10000);
          }
      })
  }

  ionViewDidEnter() {

    setTimeout(_ => {

      this.pckry = new Packery(this.gridPackery.nativeElement, {
        itemSelector: ".grid-item",
        gutter: 10,
        columnWidth: 60
      });

      this.pckry.getItemElements().forEach(item => {
        let draggie = new Draggabilly(item, { grid: [20, 20] });
        this.pckry.bindDraggabillyEvents(draggie);
        this.draggies.push(draggie);

        draggie.enable();
        draggie.bindHandles();
      })

      console.log('SDAHSDKJSAHDJSH', this.pckry);
      /*
     this.items.map( function( item ) {
         return {
           attr: item.element.getAttribute( attrName ),
           x: item.rect.x / _this.packer.width
         }
     
      */
    }, 500);

  }

  showStuff() {
    console.log(' PACKERY', this.pckry);

    let attrName = 'id';
    let items = this.pckry.items;
    items.map(item => {
      console.log('ITEMSSAD attr x', item.element.getAttribute(attrName), item.rect.x / this.pckry.packer.width)
    })


    this.stuff = this.pckry.items.map((item) => {
      return {
        attr: item.element.getAttribute(attrName),
        x: item.rect.x / this.pckry.packer.width
      }
    })
    console.log('STUFFFFF', this.stuff);


    this.storage.set('PACKERY', this.stuff);
  }

  //https://github.com/metafizzy/packery/issues/337

  setPosition() {

    let positions;

    this.storage.get('PACKERY')
      .then(value => {

        if (value) {
          positions = value;
          console.log('GETTING VLAUE', positions);

          //    this.pckry._resetLayout();
          let attrName = 'id';
          this.pckry._resetLayout();

          let element = this.gridPackery.nativeElement;
          console.log('ELEMENT', element)
          // set item order and horizontal position from saved positions
          this.pckry.items = positions.map(function (itemPosition) {

            let selector = '[' + attrName + '="' + itemPosition.attr + '"]'
            let itemElem = element.querySelector(selector);
            let item = this.pckry.getItem(itemElem);

            console.log('SETTING PCKR', selector, itemElem, item);

            item.rect.x = itemPosition.x * this.pckry.packer.width;
            return item;
          }, this);
          this.pckry.shiftLayout();
        }
      })
  }

}

/*

Initialize Packery, but disable initLayout. Then get saved position data, in this case from localStorage. initShiftLayout requires position object and the HTML attribute (data-item-id).

// init Packery
var $grid = $('.grid').packery({
  itemSelector: '.grid-item',
  columnWidth: '.grid-sizer',
  percentPosition: true,
  initLayout: false // disable initial layout
});

// get saved dragged positions
var initPositions = localStorage.getItem('dragPositions');
// init layout with saved positions
$grid.packery( 'initShiftLayout', initPositions, 'data-item-id' );
Make items draggable. On dragItemPositioned, save item position to localStorage. The custom getShiftPositions requires that HTML attribute.

// make draggable
$grid.find('.grid-item').each( function( i, itemElem ) {
  var draggie = new Draggabilly( itemElem );
  $grid.packery( 'bindDraggabillyEvents', draggie );
});

// save drag positions on event
$grid.on( 'dragItemPositioned', function() {
  // save drag positions
  var positions = $grid.packery( 'getShiftPositions', 'data-item-id' );
  localStorage.setItem( 'dragPositions', JSON.stringify( positions ) );
});
*/

