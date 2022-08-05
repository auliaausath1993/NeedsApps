import { StorageMap } from '@ngx-pwa/local-storage';
import { LoadingController, Events, ToastController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { MyserviceService } from '../myservices.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { DatePipe } from '@angular/common';

declare var snap;

@Component({
  selector: 'app-detail-order',
  templateUrl: './detail-order.page.html',
  styleUrls: ['./detail-order.page.scss'],
  providers: [DatePipe],
})
export class DetailOrderPage {
  bahasa; bahasa_name;
  detail_order_title;
  detail_order_tgl;
  detail_order_total;
  detail_order_total_belanja;
  detail_order_biaya_kirim;
  detail_order_pembayaran;
  detail_order_konfirmasi;
  detail_order_alamat;
  detail_order_item;
  subtitle_bayar;

  status  = 'ongoing';
  banners = [1, 1, 1, 1, 1, 1];
  list    = [];
  pelanggan_id;
  id;
  data = [];

  no_order;
  total;
  subtotal;
  ongkir;
  pembayaran;
  status_bayar;
  status_order;
  alamat;
  tgl;
  waktu;
  diskon = 0;

  base_url_image;
  snap_token;
  order;
  pelanggan;

  payment;
  order_log = [];

  bank; masked_card; transaction_time;
  diskon_product;

  poin = 0;

  hari;
  paymentMethod = {
    bank_transfer: 'Bank Transfer',
  };

  constructor(
    private http: Http,
    private router: Router,
    private events: Events,
    private storage: StorageMap,
    private route: ActivatedRoute,
    private serv: MyserviceService,
    private clipboard: Clipboard,
    private toastCtrl: ToastController,
    private loadingController: LoadingController,
    private datePipe: DatePipe,
  ) {

    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.id        = this.router.getCurrentNavigation().extras.state.id;
      }
    });
    this.base_url_image = this.serv.base_url_image;
    this.bahasa       = this.serv.bahasa;
    this.bahasa_name  = this.serv.bahasa_name;
  }


  ionViewWillEnter() {
    this.yuk();
  }
  doRefresh(event) {
    this.yuk();

    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }
  async copy() {
    this.clipboard.copy(this.masked_card);
    const toast = await this.toastCtrl.create({
      message: 'Copied',
      duration: 2000
    });
    toast.present();
  }
  yuk() {

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
        this.detail_order_title                = response.id.detail_order_title;
        this.detail_order_tgl                  = response.id.detail_order_tgl;
        this.detail_order_total                = response.id.detail_order_total;
        this.detail_order_total_belanja        = response.id.detail_order_total_belanja;
        this.detail_order_biaya_kirim          = response.id.detail_order_biaya_kirim;
        this.detail_order_pembayaran           = response.id.detail_order_pembayaran;
        this.detail_order_konfirmasi           = response.id.detail_order_konfirmasi;
        this.detail_order_alamat               = response.id.detail_order_alamat;
        this.detail_order_item                 = response.id.detail_order_item;
        this.subtitle_bayar                    = response.id.subtitle_bayar;
      } else if (this.bahasa === 'en') {
        this.detail_order_title                = response.en.detail_order_title;
        this.detail_order_tgl                  = response.en.detail_order_tgl;
        this.detail_order_total                = response.en.detail_order_total;
        this.detail_order_total_belanja        = response.en.detail_order_total_belanja;
        this.detail_order_biaya_kirim          = response.en.detail_order_biaya_kirim;
        this.detail_order_pembayaran           = response.en.detail_order_pembayaran;
        this.detail_order_konfirmasi           = response.en.detail_order_konfirmasi;
        this.detail_order_alamat               = response.en.detail_order_alamat;
        this.detail_order_item                 = response.en.detail_order_item;
        this.subtitle_bayar                    = response.en.subtitle_bayar;
      } else if (this.bahasa === 'ch') {
        this.detail_order_title                = response.ch.detail_order_title;
        this.detail_order_tgl                  = response.ch.detail_order_tgl;
        this.detail_order_total                = response.ch.detail_order_total;
        this.detail_order_total_belanja        = response.ch.detail_order_total_belanja;
        this.detail_order_biaya_kirim          = response.ch.detail_order_biaya_kirim;
        this.detail_order_pembayaran           = response.ch.detail_order_pembayaran;
        this.detail_order_konfirmasi           = response.ch.detail_order_konfirmasi;
        this.detail_order_alamat               = response.ch.detail_order_alamat;
        this.detail_order_item                 = response.ch.detail_order_item;
        this.subtitle_bayar                    = response.ch.subtitle_bayar;
      }
    });
  }
  async getToken() {
    const loading = await this.loadingController.create({ message: 'Please Wait' });
    await loading.present();
    // this.serv.base = "https://dev5.novatama.com/";
    this.serv.base      = 'https://needsmarket.id/';
    const headers = new Headers();
    const datapost = JSON.stringify(
      {
        order_id: this.order.id,
        total: this.order.total - this.order.diskon - this.order.poin,
        email: this.pelanggan.email,
        nama: this.order.nama_customer,
        phone: this.order.telp_customer,
        alamat: this.order.alamat_customer,
      }
    );
    const link = this.serv.base + 'midtrans2/examples/snap/api-mobile.php';
    const options = new RequestOptions({ headers});
    this.http.post(link, datapost, options)
    .subscribe((data) => {
      loading.dismiss();
      const response = data.json();
      this.snap_token = response.snap_token;
      // this.pay();
      this.serv.payment(response.snap_token, res => {
        this.doCheckout(res);
      });
    }, error => {
      loading.dismiss();
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
      onError(result) {},
      onClose() {
        alert('You close the popup without finishing the payment !');
      },
    });
  }
  doCheckout(result) {
    if (result.transaction_status === 'settlement' || result.transaction_status === 'capture' || result.transaction_status === 'pending') {
      const headers = new Headers();
      // headers.append("Authorization", this.serv.header_key);
      const requestOptions = new RequestOptions({ headers });
      const body = new FormData();

      body.append('order_id', this.order.id);
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


      this.http.post(this.serv.base_url + 'update_midtrans_order', body, requestOptions)
      .subscribe(data => {
        this.loadingController.dismiss();
        const response = data.json();

          // alert(response.status);
        if (response.status === 'Failed') {

          } else {
            this.order            = response.data;
            this.getData();
          }
        }, error => {
          this.loadingController.dismiss();
      });
    }
  }
  getData() {
    this.list = [];
    const headers = new Headers();
    // headers.append("Authorization", this.serv.header_key);
    const requestOptions = new RequestOptions({ headers });
    const body = new FormData();

    body.append('pelanggan_id', this.pelanggan_id);
    body.append('token', this.serv.header_key);
    body.append('id', this.id);

    this.http.post(this.serv.base_url + 'detail_order', body, requestOptions)
    .subscribe(data => {
      this.loadingController.dismiss();
      const response = data.json();
      if (response.status === 'Failed') {
          alert(response.status);
        } else {
          this.list           = response.item;
          this.data           = response.data[0];
          this.order          = response.data[0];
          this.pelanggan      = response.pelanggan;

          this.no_order       = response.data[0].no_order;
          this.total          = response.data[0].total;
          this.subtotal       = response.data[0].subtotal;
          this.ongkir         = response.data[0].ongkir;
          this.pembayaran     = response.data[0].pembayaran;
          this.status_bayar   = response.data[0].status_order;
          this.status_order   = response.data[0].status;
          this.alamat         = response.data[0].alamat_customer;
          this.tgl            = this.formatDate(response.data[0].created_at);
          this.diskon         = response.data[0].diskon;
          this.diskon_product = response.data[0].diskon_product;
          this.waktu          = response.data[0].waktu;
          this.hari           = response.data[0].hari;

          this.poin          = response.data[0].poin;

          this.order_log      = response.log;

          if (this.status_bayar === 'paid' || this.status_bayar === 'waiting') {
            this.payment              = response.midtrans.payment_type;
            this.bank                 = response.midtrans.bank;
            this.masked_card          = response.midtrans.masked_card;
            this.transaction_time = this.datePipe.transform(response.midtrans.transaction_time.replace(' ', 'T'), 'd-MMM-y h:m');
          }
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
  toRp(val) {
    return this.serv.toRp(val);
  }

  formatDate(date: string) {
    return this.datePipe.transform(date.replace(' ', 'T'), 'd-MMM-y');
  }

  ucfirst(text: string) {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }
}
