import { Component, OnInit } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { MyserviceService } from '../myservices.service';
import { Router } from '@angular/router';
import { StorageMap } from '@ngx-pwa/local-storage';
import { LoadingController, AlertController, Events, NavController } from '@ionic/angular';

import { AuthService } from 'angularx-social-login';
import { FacebookLoginProvider, GoogleLoginProvider } from 'angularx-social-login';
@Component({
  selector: 'app-waitingscreen',
  templateUrl: './waitingscreen.page.html',
  styleUrls: ['./waitingscreen.page.scss'],
})
export class WaitingscreenPage implements OnInit {
  loading;
  constructor(
    private http: Http,
    private router: Router,
    private events: Events,
    private storage: StorageMap,
    public navCtrl: NavController,
    private authService: AuthService,
    private serv: MyserviceService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    ) {
    this.loading = this.loadingController.create({
      message: 'Please Wait'
    }).then((res) => {
      // res.present();

      res.onDidDismiss().then((dis) => {
      });
    });
    setTimeout( () => {
      this.loadingController.dismiss();
      this.storage.get('isLogin').subscribe((val) => {
        if (val) {
          // this.router.navigateByUrl("/app/tabs/tab1");
          this.navCtrl.navigateRoot('/app/tabs/tab1');
          // this.navCtrl.navigateRoot("/login");
        } else {
          this.navCtrl.navigateRoot('/login');
        }
      });
    }, 1000);
  }

  ngOnInit() {
  }

}
