import { Component, OnInit } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { MyserviceService } from '../myservices.service';
import { Router } from '@angular/router';
import { StorageMap } from '@ngx-pwa/local-storage';
import { LoadingController, AlertController, Events, NavController } from '@ionic/angular';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage implements OnInit {
  bahasa; bahasa_name;
  menu1; menu2; menu3; menu4; menu5;
  cart = 0;
  banners = [1, 1, 1, 1, 1, 1];
  tabIndex = 1;

  constructor(
    private http: Http,
    private router: Router,
    private events: Events,
    private storage: StorageMap,
    private navCtrl: NavController,
    private serv: MyserviceService,
    private alertController: AlertController
  ) {
    this.bahasa       = this.serv.bahasa;
    this.bahasa_name  = this.serv.bahasa_name;

    this.cek();
    events.subscribe('language_changed', (user, time) => {
      this.cek();
    });
  }
  cek() {
    this.storage.get('bahasa').subscribe((data) => {
      if (data) {
        this.bahasa = data;
        this.storage.get('bahasa_name').subscribe((data) => {
          if (data) {
            this.bahasa_name = data;
            this.getSubtitle();
          }
        });
      } else {
        this.bahasa         = this.serv.bahasa;
        this.bahasa_name    = this.serv.bahasa_name;
        this.storage.set('bahasa', this.bahasa).subscribe(() => {
          this.storage.set('bahasa_name', this.bahasa_name).subscribe(() => {
            this.getSubtitle();
          });
        });
      }
    });
  }
  ionViewWillEnter() {
    this.getSubtitle();
  }
  ngOnInit() {
    this.events.subscribe('update_cart', (data, time) => {
      this.cart += parseInt(data);
    });
    this.events.subscribe('update_cart_total', (cart, time) => {
      this.cart = cart;
    });
  }
  getSubtitle() {
    this.http.get('assets/data/subtitles.json').subscribe(data => {
      const response = data.json();
      if (this.bahasa === 'id') {
        this.menu1         = response.id.menu1;
        this.menu2         = response.id.menu2;
        this.menu3         = response.id.menu3;
        this.menu4         = response.id.menu4;
        this.menu5         = response.id.menu5;
      } else if (this.bahasa === 'en') {
        this.menu1         = response.en.menu1;
        this.menu2         = response.en.menu2;
        this.menu3         = response.en.menu3;
        this.menu4         = response.en.menu4;
        this.menu5         = response.en.menu5;
      } else if (this.bahasa === 'ch') {
        this.menu1         = response.ch.menu1;
        this.menu2         = response.ch.menu2;
        this.menu3         = response.ch.menu3;
        this.menu4         = response.ch.menu4;
        this.menu5         = response.ch.menu5;
      }
    });
  }

  goToHome() {
    this.router.navigateByUrl('/app/tabs/tab1');
  }
  tab1() {
    this.tabIndex = 1;
    this.navCtrl.navigateRoot('/app/tabs/tab1');
    // this.storage.get('user').subscribe((data) => {
    //   if(data){
    //     this.tabIndex = 1;
    //     this.navCtrl.navigateRoot('/app/tabs/tab1');
    //   }else{
    //     this.alertController.create({
    //       header: 'Please Login to continue',
    //       buttons: [
    //         {
    //           text: 'Cancel',
    //           role: 'cancel'
    //         }, {
    //           text: 'Ok',
    //           handler: () => {
    //             this.router.navigateByUrl("");
    //           }
    //         }
    //       ]
    //     }).then((res) => {res.present();res.onDidDismiss().then((dis) => {});});
    //   }
    // });
  }
  tab2() {
    this.tabIndex = 2;
    this.navCtrl.navigateRoot('/app/tabs/tab2');
    // this.storage.get('user').subscribe((data) => {
    //   if(data){
    //     this.tabIndex = 2;
    //     this.navCtrl.navigateRoot('/app/tabs/tab2');
    //   }else{
    //     this.alertController.create({
    //       header: 'Please Login to continue',
    //       buttons: [
    //         {
    //           text: 'Cancel',
    //           role: 'cancel'
    //         }, {
    //           text: 'Ok',
    //           handler: () => {
    //             this.router.navigateByUrl("");
    //           }
    //         }
    //       ]
    //     }).then((res) => {res.present();res.onDidDismiss().then((dis) => {});});
    //   }
    // });
  }
  tab3() {
    this.storage.get('user').subscribe((data) => {
      if (data) {
        this.tabIndex = 3;
        this.navCtrl.navigateRoot('/app/tabs/tab3');
      } else {
        this.alertController.create({
          header: 'Please Login to continue',
          buttons: [
            {
              text: 'Cancel',
              role: 'cancel'
            }, {
              text: 'Ok',
              handler: () => {
                this.router.navigateByUrl('');
              }
            }
          ]
        }).then((res) => {res.present(); res.onDidDismiss().then((dis) => {}); });
      }
    });
  }
  tab4() {
    this.storage.get('user').subscribe((data) => {
      if (data) {
        this.tabIndex = 4;
        this.navCtrl.navigateRoot('/app/tabs/tab4');
      } else {
        this.alertController.create({
          header: 'Please Login to continue',
          buttons: [
            {
              text: 'Cancel',
              role: 'cancel'
            }, {
              text: 'Ok',
              handler: () => {
                this.router.navigateByUrl('');
              }
            }
          ]
        }).then((res) => {res.present(); res.onDidDismiss().then((dis) => {}); });
      }
    });
  }
  tab5() {
    this.storage.get('user').subscribe((data) => {
      if (data) {
        this.tabIndex = 5;
        this.navCtrl.navigateRoot('/app/tabs/tab5');
      } else {
        this.alertController.create({
          header: 'Please Login to continue',
          buttons: [
            {
              text: 'Cancel',
              role: 'cancel'
            }, {
              text: 'Ok',
              handler: () => {
                this.router.navigateByUrl('');
              }
            }
          ]
        }).then((res) => {res.present(); res.onDidDismiss().then((dis) => {}); });
      }
    });
  }
}
