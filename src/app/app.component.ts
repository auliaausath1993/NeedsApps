import { FCM } from 'cordova-plugin-fcm-with-dependecy-updated/ionic/ngx';
import { MyserviceService } from './myservices.service';
import { Component, ViewChildren, QueryList } from '@angular/core';
import {
  Platform,
  ModalController,
  ActionSheetController,
  PopoverController,
  IonRouterOutlet,
  MenuController,
  AlertController,
  ToastController
} from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { CodePush } from '@ionic-native/code-push/ngx';
import { Router } from '@angular/router';
import { MobileAccessibility } from '@ionic-native/mobile-accessibility/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})

export class AppComponent {

  lastTimeBackPress = 0;
  timePeriodToExit = 2000;
  @ViewChildren(IonRouterOutlet) routerOutlets: QueryList<IonRouterOutlet>;

  constructor(
    private fcm: FCM,
    private platform: Platform,
    private splashScreen: SplashScreen,
    public modalCtrl: ModalController,
    private menu: MenuController,
    private actionSheetCtrl: ActionSheetController,
    private popoverCtrl: PopoverController,
    private router: Router,
    private alertController: AlertController,
    private serv: MyserviceService,
    private codePush: CodePush,
    private mobileAccessibility: MobileAccessibility,
  ) {
    this.initializeApp();
    this.platform.ready().then(() => {

      if (this.platform.is('cordova')) {
        this.fcm.onNotification().subscribe(data => {
          if (data.wasTapped) {
          } else {
            this.alertController.create({
              header: 'Notification',
              message: data.body,
              buttons: [{
                  text: 'Ok',
                  cssClass: 'btn-center',
                  handler: () => {

                  }
                }
              ]
            }).then((res) => {res.present(); res.onDidDismiss().then((dis) => {}); });
          }
        });

        this.mobileAccessibility.usePreferredTextZoom(false);
        this.mobileAccessibility.setTextZoom(85);

        const downloadProgress = progress => {
          console.log(`Downloaded ${progress.receivedBytes} of ${progress.totalBytes}`);
        };
        this.codePush.sync({}, downloadProgress).subscribe(syncStatus => console.log(syncStatus));
      }

      document.addEventListener('backbutton', (event) => {
        if (this.router.isActive('/app/tabs/tab1', true) && this.router.url === '/app/tabs/tab1') {
          if (this.serv.canGoBack) {
            this.showAlert();
          }
        } else if (this.router.isActive('/login', true) && this.router.url === '/login') {
          if (this.serv.canGoBack) {
            this.showAlert();
          }
        } else if (this.router.isActive('/berhasil', true) && this.router.url === '/berhasil') {
          if (this.serv.canGoBack) {
            event.preventDefault();
            event.stopPropagation();
          }
        } else if (this.router.isActive('/app/tabs/tab2', true) && this.router.url === '/app/tabs/tab2') {
          this.router.navigateByUrl('/app/tabs/tab1');
        } else if (this.router.isActive('/app/tabs/tab3', true) && this.router.url === '/app/tabs/tab3') {
          this.router.navigateByUrl('/app/tabs/tab1');
        } else if (this.router.isActive('/app/tabs/tab4', true) && this.router.url === '/app/tabs/tab4') {
          this.router.navigateByUrl('/app/tabs/tab1');
        } else if (this.router.isActive('/app/tabs/tab5', true) && this.router.url === '/app/tabs/tab5') {
          this.router.navigateByUrl('/app/tabs/tab1');
        }
      });
    });
  }

// active hardware back button
backButtonEvent() {
  this.platform.backButton.subscribe(async () => {
      // close action sheet
      try {
          const element = await this.actionSheetCtrl.getTop();
          if (element) {
              element.dismiss();
              return;
          }
      } catch (error) {
      }

      // close popover
      try {
          const element = await this.popoverCtrl.getTop();
          if (element) {
              element.dismiss();
              return;
          }
      } catch (error) {
      }

      // close modal
      try {
          const element = await this.modalCtrl.getTop();
          if (element) {
              element.dismiss();
              return;
          }
      } catch (error) {

      }

      // close side menua
      try {
          const element = await this.menu.getOpen();
          if (element !== null) {
              this.menu.close();
              return;

          }

      } catch (error) {

      }

      this.routerOutlets.forEach((outlet: IonRouterOutlet) => {
          if (outlet && outlet.canGoBack()) {
              outlet.pop();
          } else if (this.router.url === '/app/tabs/tab1') {
            this.showAlert();
          } else if (this.router.url === '/login') {
            this.showAlert();
          } else if (this.router.url === 'berhasil') {

          } else if (this.router.url === '/app/tabs/tab2') {
            this.router.navigateByUrl('/app/tabs/tab1');
          } else if (this.router.url === '/app/tabs/tab3') {
            this.router.navigateByUrl('/app/tabs/tab1');
          } else if (this.router.url === '/app/tabs/tab4') {
            this.router.navigateByUrl('/app/tabs/tab1');
          } else if (this.router.url === '/app/tabs/tab5') {
            this.router.navigateByUrl('/app/tabs/tab1');
          }
      });
  });
  }
  async showAlert() {
    const alert = await this.alertController.create({
      header: 'Close app?',
      buttons: [
        {
          text: 'Cancel',
          cssClass: 'btn-red',
          role: 'cancel'
        }, {
          text: 'Close',
          cssClass: 'btn-green',
          handler: () => {
            const newNavigator: any = window.navigator;
            if (newNavigator && newNavigator.app) {
              newNavigator.app.exitApp();
            }
          }
        }
      ]
    });

    await alert.present();
  }
  initializeApp() {
    this.platform.ready().then(() => {
      setTimeout(() => {
        this.splashScreen.hide();
      }, 500);
    });
  }
}
