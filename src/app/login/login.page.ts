import { Component, OnInit } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { MyserviceService } from '../myservices.service';
import { Router } from '@angular/router';
import { StorageMap } from '@ngx-pwa/local-storage';
import { LoadingController, AlertController, Events, NavController, Platform } from '@ionic/angular';

import { AuthService } from 'angularx-social-login';
import { FacebookLoginProvider, GoogleLoginProvider } from 'angularx-social-login';

import { FCM } from 'cordova-plugin-fcm-with-dependecy-updated/ionic/ngx';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  bahasa; bahasa_name;
  login_title;
  login_form;
  login_input_telp;
  login_input_otp;
  login_button_login;
  login_text_belum_punya;
  login_button_register;

  loading;
  isRequestedOTP = false;
  isClicked = false;

  message;
  timer = 90;
  timerEnd = false;
  runTimer = false;
  hasStarted = false;
  hasFinished = false;
  isNotAktif = false;

  hp; otp;
  message_hp_not_found;

  fcm_token;

  constructor(
    private fcm: FCM,
    private http: Http,
    private router: Router,
    private events: Events,
    private storage: StorageMap,
    public navCtrl: NavController,
    private authService: AuthService,
    private serv: MyserviceService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private platform: Platform,
  ) {
    this.bahasa       = this.serv.bahasa;
    this.bahasa_name  = this.serv.bahasa_name;
    this.getSubtitle();

    setTimeout( () => {
      this.storage.get('isLogin').subscribe((val) => {
        if (val) {
          // this.router.navigateByUrl("/app/tabs/tab1");
          // this.navCtrl.navigateRoot("/app/tabs/tab1");
        } else {

        }
      });
    }, 1000);
  }


  getSubtitle() {
    this.http.get('assets/data/subtitles.json').subscribe(data => {
      const response = data.json();
      if (this.bahasa === 'id') {
        this.login_title            = response.id.login_title;
        this.login_form             = response.id.login_form;
        this.login_input_telp       = response.id.login_input_telp;
        this.login_button_login     = response.id.login_button_login;
        this.login_text_belum_punya = response.id.login_text_belum_punya;
        this.login_button_register  = response.id.login_button_register;
        this.login_input_otp        = response.id.login_input_otp;
        this.message_hp_not_found   = response.id.message_hp_not_found;
      } else if (this.bahasa === 'en') {
        this.login_title            = response.en.login_title;
        this.login_form             = response.en.login_form;
        this.login_input_telp       = response.en.login_input_telp;
        this.login_button_login     = response.en.login_button_login;
        this.login_text_belum_punya = response.en.login_text_belum_punya;
        this.login_button_register  = response.en.login_button_register;
        this.login_input_otp        = response.en.login_input_otp;
        this.message_hp_not_found   = response.en.message_hp_not_found;
      } else if (this.bahasa === 'ch') {
        this.login_title            = response.ch.login_title;
        this.login_form             = response.ch.login_form;
        this.login_input_telp       = response.ch.login_input_telp;
        this.login_button_login     = response.ch.login_button_login;
        this.login_text_belum_punya = response.ch.login_text_belum_punya;
        this.login_button_register  = response.ch.login_button_register;
        this.login_input_otp        = response.ch.login_input_otp;
        this.message_hp_not_found   = response.ch.message_hp_not_found;
      }
    });
  }

  resend() {
    this.isRequestedOTP = false;
    this.hasFinished = false;
    this.requestOtp();
  }
  startTimer() {
    this.runTimer = true;
    this.hasStarted = true;
    this.timerTick();
  }
  timerTick() {
    setTimeout(() => {
      if (!this.runTimer) { return; }
      this.timer--;
      if (this.timer > 0) {
        this.timerTick();
      } else {
        this.hasFinished = true;
        // this.isRequestedOTP = false;

        this.otp = '';
        // this.hp  = "";
      }
    }, 1000);
  }
  backLogin() {
    this.isRequestedOTP = false;
    this.hasFinished = false;
  }
  requestOtp() {
    this.loading = this.loadingController.create({
      message: 'Please Wait'
    }).then((res) => {
      // res.present();

      res.onDidDismiss().then((dis) => {
      });
    });

    const headers = new Headers();
    // headers.append("Authorization", this.serv.header_key);
    const requestOptions = new RequestOptions({ headers });
    const body = new FormData();

    body.append('hp', this.hp);
    body.append('token', this.serv.header_key);

    this.http.post(this.serv.base_url + 'request_otp', body, requestOptions)
    .subscribe(data => {
      this.loadingController.dismiss();
      const response = data.json();

      if (response.status === 'Failed') {
          if (response.reason === 'not_found') {
            const alert = this.alertController.create({
            header: response.status,
            message: this.message_hp_not_found,
            buttons: ['Ok']}).then(alert => alert.present());
          } else {
            const alert = this.alertController.create({
            header: response.status,
            message: this.message,
            buttons: ['Ok']}).then(alert => alert.present());
          }
        } else {
          // const alert = this.alertController.create({
          // header: response.status,
          // message: this.message,
          // buttons: ['Ok']}).then(alert=> alert.present());

          this.timer = 90;
          this.startTimer();
          this.isRequestedOTP = true;
        }
      }, error => {
        this.loadingController.dismiss();
    });
  }
  login() {
    this.loading = this.loadingController.create({
      message: 'Please Wait'
    }).then((res) => {
      res.present();

      res.onDidDismiss().then((dis) => {
      });
    });

    const headers = new Headers();
    // headers.append("Authorization", this.serv.header_key);
    const requestOptions = new RequestOptions({ headers });
    const body = new FormData();

    body.append('hp', this.hp);
    body.append('otp', this.otp);
    body.append('token', this.serv.header_key);
    body.append('fcm_token', this.fcm_token);

    this.http.post(this.serv.base_url + 'login', body, requestOptions)
    .subscribe(data => {
      this.loadingController.dismiss();
      const response = data.json();

      if (response.status === 'Failed') {
          const alert = this.alertController.create({
          header: response.status,
          message: response.message,
          buttons: ['Ok']}).then(alert => alert.present());

        } else {

          // const alert = this.alertController.create({
          // header: response.status,
          // message: response.message,
          // buttons: ['Ok']}).then(alert=> alert.present());

          const user = response.pelanggan;
          this.events.publish('user:created', user, Date.now());

          this.storage.set('isLogin', true).subscribe(() => {
            this.storage.set('user', user).subscribe(() => {
              this.navCtrl.navigateRoot('/app/tabs/tab1');
            });
          });
        }
      }, error => {
        this.loadingController.dismiss();
    });

  }
  goToHome() {
    this.events.publish('subtitle_menu', 'yes', Date.now());
    this.navCtrl.navigateRoot('/app/tabs/tab1');
  }
  goToRegister() {
    this.router.navigateByUrl('/register');
  }
  // signInWithGoogle(): void {
  //   this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
  // }
  // doGoogleLogin() {
  //   this.googlePlus.login({})
  //   .then(res => {
  //     this.registerGoogle(res);
  //   });
  // }
  // registerGoogle(data) {
  //   const val = data;
  //   // this.loading = this.loadingController.create({
  //   //   message: 'Please Wait'
  //   // }).then((res) => {
  //   //   res.present();

  //   //   res.onDidDismiss().then((dis) => {
  //   //   });
  //   // });

  //   const headers = new Headers();
  //   const requestOptions = new RequestOptions({ headers });
  //   const body = new FormData();

  //   body.append('nama', val.displayName);
  //   body.append('googleId', val.userId);
  //   body.append('idToken', '');
  //   body.append('authToken', val.accessToken);
  //   body.append('email', val.email);

  //   // body.append('alamat', this.alamat);
  //   // body.append('tempat', this.tempat);
  //   // body.append('tgl', this.tgl);

  //   this.http.post(this.serv.base_url + 'register_google', body, requestOptions)
  //   .subscribe(data => {
  //     this.loadingController.dismiss();
  //     const response = data.json();

  //     if (response.status === 'Failed') {
  //         const alert = this.alertController.create({
  //         header: response.status,
  //         message: response.message,
  //         buttons: ['Ok']}).then(alert => alert.present());
  //       } else {
  //         const user = response.pelanggan;
  //         this.storage.set('isLogin', true).subscribe(() => {
  //           this.storage.set('user', user).subscribe(() => {
  //             this.navCtrl.navigateRoot('/app/tabs/tab1');
  //           });
  //         });
  //       }
  //     }, error => {
  //       this.loadingController.dismiss();
  //   });
  // }
  // async doGoogleLoginX() {
  //   this.loading = this.loadingController.create({
  //     message: 'Please Wait'
  //   }).then((res) => {
  //     res.present();

  //     res.onDidDismiss().then((dis) => {
  //     });
  //   });

  //   this.googlePlus.login({
  //     scopes: '', // optional, space-separated list of scopes, If not included or empty, defaults to `profile` and `email`.
  //     webClientId: '778519906246-f241el728i36ud2rjvsj685ujpvhguj5.apps.googleusercontent.com', // optional clientId of your Web application from Credentials settings of your project - On Android, this MUST be included to get an idToken. On iOS, it is not required.
  //     offline: false // Optional, but requires the webClientId - if set to true the plugin will also return a serverAuthCode, which can be used to grant offline access to a non-Google server
  //   })
  //   .then(user => {
  //     this.loadingController.dismiss();
  //     // alert(user.displayName);
  //   }, err => {
  //     // doGoogleLoginalert("error");
  //     this.loadingController.dismiss();
  //   });
  // }
  ngOnInit() {
    if (this.platform.is('cordova')) {
      setTimeout(() => {
        this.fcm.getToken().then(token => {
          this.fcm_token = (token);
        });
      }, 1000);
    }
  }

}
