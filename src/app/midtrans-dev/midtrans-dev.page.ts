import { Component, OnInit } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { MyserviceService } from '../myservices.service';
import { Router } from '@angular/router';
import { StorageMap } from '@ngx-pwa/local-storage';
import { LoadingController, AlertController, Events, NavController } from '@ionic/angular';

import { AuthService } from 'angularx-social-login';
import { FacebookLoginProvider, GoogleLoginProvider } from 'angularx-social-login';

declare var snap;

@Component({
  selector: 'app-midtrans-dev',
  templateUrl: './midtrans-dev.page.html',
  styleUrls: ['./midtrans-dev.page.scss'],
})
export class MidtransDevPage {
  snap_token: any;
  result_midtrans;
  total; id;
  data; loader; toast;
  channel;

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
    this.get_detail(1755319164);
    this.serv.base = 'https://dev5.novatama.com/';
  }

  get_detail(order_id) {
    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    const options = new RequestOptions({ headers});
    const link = this.serv.base + 'midtrans2/examples/core-api/transaction-process.php?order_id=' + order_id;
    this.http.get(link, options)
    .subscribe((data) => {
    }, error => {
    });
  }
  get_token() {
    const headers = new Headers();
    const datapost = JSON.stringify(
      {
        amount: 100000,
        channel : this.channel
      }
    );
    const link = this.serv.base + 'midtrans2/examples/snap/api-mobile.php';
    const options = new RequestOptions({ headers});
    this.http.post(link, datapost, options)
    .subscribe((data) => {
      const response = data.json();
      this.snap_token = response.snap_token;
      // this.pay();
      this.serv.payment(response.snap_token, res => {
        this.createOrder(res);
      });
    }, error => {
    });
  }
  pay() {
    const self = this;
    snap.pay(this.snap_token, {
      gopayMode: 'deeplink',
      onSuccess(result) {
        self.createOrder(result);
      },
      onPending(result) {
        self.createOrder(result);
      },
      onError(result) {
      },
      onClose() {
        alert('You close the popup without finishing the payment !');
      },
    });
  }
  createOrder(data) {

  }
  getToken() {
    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    const options = new RequestOptions({ headers});
    this.http.get('https://api.sandbox.midtrans.com/v2/token?client_key=SB-Mid-client-IoSFpINpk3QZdjLm&gross_amount=10000&card_number=4811111111111114&card_exp_month=12&card_exp_year=24&card_cvv=123&secure=true', options)
    .subscribe((data) => {
    }, error => {
    });
  }
}
