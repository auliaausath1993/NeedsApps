import { Component, OnInit } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { MyserviceService } from '../myservices.service';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';

import { StorageMap } from '@ngx-pwa/local-storage';
import { LoadingController, AlertController } from '@ionic/angular';

declare var snap;

@Component({
  selector: 'app-pembayaran',
  templateUrl: './pembayaran.page.html',
  styleUrls: ['./pembayaran.page.scss'],
})
export class PembayaranPage {
  base_url_image;
  bahasa; bahasa_name;
  pembayaran_title;
  pembayaran_pilihan;
  pembayaran_transfer_ke;
  pembayaran_opsi;

  status  = 'ongoing';
  banners = [1, 1, 1, 1, 1, 1];

  data = [];
  pelanggan_id;
  pelanggan;

  cart = [];
  form_alamat;

  order;
  ongkir = 0;

  diskon = 0;
  waktu;

  lat; lng;

  snap_token; nama; no_hp; email;
  total = 0;

  constructor(
    private http: Http,
    private router: Router,
    private storage: StorageMap,
    private route: ActivatedRoute,
    private serv: MyserviceService,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) {
    this.base_url_image = this.serv.base_url_image;
    this.bahasa         = this.serv.bahasa;
    this.bahasa_name    = this.serv.bahasa_name;
    this.serv.base = 'https://dev5.novatama.com/';


    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.cart        = this.router.getCurrentNavigation().extras.state.cart;
        this.diskon      = this.router.getCurrentNavigation().extras.state.diskon;
        this.ongkir      = this.router.getCurrentNavigation().extras.state.ongkir;
        this.form_alamat = this.router.getCurrentNavigation().extras.state.form_alamat;
        this.waktu       = this.router.getCurrentNavigation().extras.state.waktu;
        this.lat         = this.router.getCurrentNavigation().extras.state.lat;
        this.lng         = this.router.getCurrentNavigation().extras.state.lng;

      }
    });
  }
  ionViewWillEnter() {

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

    this.storage.get('user').subscribe((val) => {
      const data: any = val;
      this.pelanggan_id = data.id;
      this.getData();
    });
  }


  getSubtitle() {
    this.http.get('assets/data/subtitles.json').subscribe(data => {
      const response = data.json();
      if (this.bahasa === 'id') {
        this.pembayaran_title       = response.id.pembayaran_title;
        this.pembayaran_opsi        = response.id.pembayaran_opsi;
        this.pembayaran_pilihan     = response.id.pembayaran_pilihan;
        this.pembayaran_transfer_ke = response.id.pembayaran_transfer_ke;
      } else if (this.bahasa === 'en') {
        this.pembayaran_title       = response.en.pembayaran_title;
        this.pembayaran_opsi        = response.en.pembayaran_opsi;
        this.pembayaran_pilihan     = response.en.pembayaran_pilihan;
        this.pembayaran_transfer_ke = response.en.pembayaran_transfer_ke;
      } else if (this.bahasa === 'ch') {
        this.pembayaran_title       = response.ch.pembayaran_title;
        this.pembayaran_opsi        = response.ch.pembayaran_opsi;
        this.pembayaran_pilihan     = response.ch.pembayaran_pilihan;
        this.pembayaran_transfer_ke = response.ch.pembayaran_transfer_ke;
      }
    });
  }
  getData() {
    this.data = [];
    const headers = new Headers();
    // headers.append("Authorization", this.serv.header_key);
    const requestOptions = new RequestOptions({ headers });
    const body = new FormData();

    body.append('pelanggan_id', this.pelanggan_id);
    body.append('token', this.serv.header_key);

    this.http.post(this.serv.base_url + 'get_pembayaran', body, requestOptions)
    .subscribe(data => {
      this.loadingController.dismiss();
      const response = data.json();

      if (response.status === 'Failed') {
          alert(response.status);
        } else {
          // this.data         = response.data;
          this.pelanggan      = response.pelanggan[0];

          let total = 0;
          for (let x = 0; x < this.cart.length; x++) {
            total += this.cart[x].qty * this.cart[x].harga;
          }
          this.getToken(total + this.ongkir, this.pelanggan.nama, this.pelanggan.email, this.pelanggan.no_hp);
        }
      }, error => {
        this.loadingController.dismiss();
    });
  }
  checkout() {
    const alert = this.alertController.create({
      header: '',
      message: 'confirm order ? ',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        }, {
          text: 'Ok',
          handler: () => {
            // this.doCheckout();
          }
        }
      ]
    }).then((res) => {
      res.present();

      res.onDidDismiss().then((dis) => {
      });
    });
  }
  getToken(total, nama, email, hp) {
    const headers = new Headers();
    const datapost = JSON.stringify(
      {
        total,
        nama,
        phone: hp,
        email,
        alamat: this.form_alamat,
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
        this.doCheckout(res);
      });
    }, error => {
    });
  }
  pay() {
    const self = this;
    snap.pay(this.snap_token, {
      gopayMode: 'deeplink',
      onSuccess(result) {
        self.doCheckout(result);
      },
      onPending(result) {
        self.doCheckout(result);
      },
      onError(result) {
      },
      onClose() {
        alert('You close the popup without finishing the payment !');
      }
    });
  }
  temporaryOrder(result) {
    const headers = new Headers();
    // headers.append("Authorization", this.serv.header_key);
    const requestOptions = new RequestOptions({ headers });
    const body = new FormData();

    body.append('midtrans_id', result.order_id);

    body.append('diskon', this.diskon.toString());
    body.append('pelanggan_id', this.pelanggan_id);
    body.append('voucher_id', this.serv.voucher_id.toString());
    body.append('form_alamat', this.form_alamat);
    body.append('waktu', this.waktu);
    body.append('lat', this.lat);
    body.append('lng', this.lng);
    body.append('token', this.serv.header_key);
    body.append('ongkir', this.ongkir.toString());
    body.append('cart', JSON.stringify(this.cart));

    this.http.post(this.serv.base_url + 'checkout_temporary', body, requestOptions)
    .subscribe(data => {
      this.loadingController.dismiss();
      const response = data.json();

        // alert(response.status);
      if (response.status === 'Failed') {

        } else {
          this.order            = response.data;
          this.serv.voucher_id  = 0;
          this.goToBerhasil();
        }
      }, error => {
        this.loadingController.dismiss();
    });
  }
  doCheckout(result) {
    const headers = new Headers();
    // headers.append("Authorization", this.serv.header_key);
    const requestOptions = new RequestOptions({ headers });
    const body = new FormData();

    body.append('diskon', this.diskon.toString());
    body.append('pelanggan_id', this.pelanggan_id);
    body.append('voucher_id', this.serv.voucher_id.toString());
    body.append('form_alamat', this.form_alamat);
    body.append('waktu', this.waktu);
    body.append('lat', this.lat);
    body.append('lng', this.lng);
    body.append('token', this.serv.header_key);
    body.append('ongkir', this.ongkir.toString());
    body.append('cart', JSON.stringify(this.cart));

    // midtrans param
    if (result.payment_type === 'bank_transfer') {
      result.masked_card = result.va_numbers[0].va_number;
      result.bank        = result.va_numbers[0].bank;
    }
    body.append('transaction_id', result.transaction_id);
    body.append('redirect_url', result.redirect_url);
    body.append('gross_amount', result.gross_amount);
    body.append('payment_type', result.payment_type);
    body.append('transaction_time', result.transaction_time);
    body.append('transaction_status', result.transaction_status);
    body.append('fraud_status', result.fraud_status);
    body.append('masked_card', result.masked_card);
    body.append('bank', result.bank);
    body.append('card_type', result.card_type);


    this.http.post(this.serv.base_url + 'checkout_2', body, requestOptions)
    .subscribe(data => {
      this.loadingController.dismiss();
      const response = data.json();

        // alert(response.status);
      if (response.status === 'Failed') {

        } else {
          this.order            = response.data;
          this.serv.voucher_id  = 0;
          this.goToBerhasil();
        }
      }, error => {
        this.loadingController.dismiss();
    });
  }
  goToDetail(x) {
    this.router.navigateByUrl('/detail-order');
  }
  goToHome() {
    this.router.navigateByUrl('/app/tabs/tab1');
  }
  goToPengiriman() {
    this.router.navigateByUrl('/detail-pengiriman');
  }
  goToBerhasil() {
    const navigationExtras: NavigationExtras = {
      state: {
        order : this.order,
      },
      skipLocationChange: true,
    };
    this.router.navigate(['berhasil'], navigationExtras);
  }
}
