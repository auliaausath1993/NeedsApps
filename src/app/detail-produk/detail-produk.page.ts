import { StorageMap } from '@ngx-pwa/local-storage';
import { Component, OnInit } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { MyserviceService } from '../myservices.service';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadingController, AlertController, Events, ToastController } from '@ionic/angular';
import { Location } from '@angular/common';

@Component({
  selector: 'app-detail-produk',
  templateUrl: './detail-produk.page.html',
  styleUrls: ['./detail-produk.page.scss'],
})
export class DetailProdukPage {
  bahasa; bahasa_name;
  loading;
  detail_produk_beli;
  detail_produk_varian;
  detail_produk_keranjang;

  status  = 'ongoing';
  banners = [1, 1, 1, 1, 1, 1];

  id; produk;
  qty = 1;
  nama; harga; harga_diskon;
  varian;

  pelanggan_id = '0';
  varian_id = 0;
  produk_id;

  foto;
  wishlist;

  disabled = false;
  deskripsi;

  max_order = 0;
  cabang_id;
  cabang_selected;

  constructor(
    private http: Http,
    private router: Router,
    private events: Events,
    private location: Location,
    private storage: StorageMap,
    private route: ActivatedRoute,
    private serv: MyserviceService,
    private toastCtrl: ToastController,
    private alertController: AlertController,
    private loadingController: LoadingController,
  ) {
    this.bahasa       = this.serv.bahasa;
    this.bahasa_name  = this.serv.bahasa_name;

    this.yuk();
  }
  doRefresh(event) {
    this.yuk();

    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }
  yuk() {
    this.loading = this.loadingController.create({duration: 5000, message: 'Please Wait'}).then((res) => {res.present(); res.onDidDismiss().then((dis) => {}); });


    this.storage.get('cabang_id').subscribe((val) => { this.cabang_id = val; });
    this.storage.get('cabang_selected').subscribe((val) => { this.cabang_selected = val; });
    setTimeout( () => {
      this.storage.get('user').subscribe((val) => {
        if (val) {
          const data: any = val;
          this.pelanggan_id = data.id;
        }
        this.id = this.route
          .queryParams
          .subscribe(params => {
            // Defaults to 0 if no query param provided.
            this.id = +params.id || 0;
            this.getData();
        });
      });
    }, 1000);
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
  }

  getSubtitle() {
    this.http.get('assets/data/subtitles.json').subscribe(data => {
      const response = data.json();
      if (this.bahasa === 'id') {
        this.detail_produk_beli       = response.id.detail_produk_beli;
        this.detail_produk_varian     = response.id.detail_produk_varian;
        this.detail_produk_keranjang  = response.id.detail_produk_keranjang;
      } else if (this.bahasa === 'en') {
        this.detail_produk_beli       = response.en.detail_produk_beli;
        this.detail_produk_varian     = response.en.detail_produk_varian;
        this.detail_produk_keranjang  = response.en.detail_produk_keranjang;
      } else if (this.bahasa === 'ch') {
        this.detail_produk_beli       = response.ch.detail_produk_beli;
        this.detail_produk_varian     = response.ch.detail_produk_varian;
        this.detail_produk_keranjang  = response.ch.detail_produk_keranjang;
      }
    });
  }

  getData() {
    const headers = new Headers();
    const requestOptions = new RequestOptions({ headers });
    const body = new FormData();

    body.append('id', this.id);
    body.append('pelanggan_id', this.pelanggan_id);
    body.append('token', this.serv.header_key);

    this.http.post(this.serv.base_url + 'get_detail_produk', body, requestOptions)
    .subscribe(data => {
      this.loadingController.dismiss();
      const response = data.json();

      if (response.status === 'Failed') {

        } else {
          this.produk         = response.produk;
          this.produk_id      = response.produk[0].id;
          this.harga_diskon   = response.produk[0].harga_diskon;
          this.harga          = response.produk[0].harga;
          this.nama           = response.produk[0].nama;
          this.wishlist       = response.produk[0].wishlist;
          this.max_order      = response.produk[0].max_order;
          this.varian         = response.varian;
          this.foto           = this.serv.base_url_image + '' + response.produk[0].foto;

          this.deskripsi      = response.produk[0].detail;

          if (this.varian.length === 0) {
            this.disabled = true;
          }

        }
      }, error => {
        this.loadingController.dismiss();
    });
  }
  async addToWishlist() {
    const data = this.produk;
    const headers = new Headers();
    // headers.append("Authorization", this.serv.header_key);
    const requestOptions = new RequestOptions({ headers });
    const body = new FormData();

    body.append('id', this.produk_id);
    body.append('pelanggan_id', this.pelanggan_id.toString());
    body.append('token', this.serv.header_key);

    this.http.post(this.serv.base_url + 'add_to_wishlist', body, requestOptions)
    .subscribe(async data => {
      this.loadingController.dismiss();
      const response = data.json();

      if (response.status === 'Failed') {
          // alert(response.message);
          const toast = await this.toastCtrl.create({
            message: response.message,
            duration: 2000
          });
          toast.present();
        } else {
          const toast = await this.toastCtrl.create({
            message: 'Wishlist Updated',
            duration: 2000
          });
          toast.present();
          const headers = new Headers();
          const requestOptions = new RequestOptions({ headers });
          const body = new FormData();

          body.append('id', this.produk_id);
          body.append('pelanggan_id', this.pelanggan_id);
          body.append('token', this.serv.header_key);

          this.http.post(this.serv.base_url + 'get_detail_produk', body, requestOptions)
          .subscribe(data => {
            this.loadingController.dismiss();
            const response = data.json();

            if (response.status === 'Failed') {

              } else {
                this.produk         = response.produk;
                this.produk_id      = response.produk[0].id;
                this.harga_diskon   = response.produk[0].harga_diskon;
                this.harga          = response.produk[0].harga;
                this.nama           = response.produk[0].nama;
                this.wishlist       = response.produk[0].wishlist;
                this.max_order      = response.produk[0].max_order;
                this.varian         = response.varian;
                this.foto           = this.serv.base_url_image + '' + response.produk[0].foto;

              }
            }, error => {
              this.loadingController.dismiss();
          });
        }
      }, error => {
        this.loadingController.dismiss();
    });
  }
  addToCart() {
    if (this.pelanggan_id !== '0') {
      this.goAddToCart();
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
  }
  async goAddToCart() {
    // if(this.varian_id==0){
    //   alert("Pilih Varian terlebih dahulu !");
    // }else{
      this.loading = this.loadingController.create({duration: 5000, message: 'Please Wait'}).then((res) => {res.present(); res.onDidDismiss().then((dis) => {}); });

      const headers = new Headers();
      // headers.append("Authorization", this.serv.header_key);
      const requestOptions = new RequestOptions({ headers });
      const body = new FormData();

      if (this.harga_diskon !== 0 && this.harga_diskon !== '' && this.harga_diskon !== ' ' && this.harga_diskon != null) {
        this.harga = this.harga_diskon;
      }

      body.append('produk_id', this.produk_id);
      body.append('pelanggan_id', this.pelanggan_id);
      body.append('cabang_id', this.cabang_id
      );
      // body.append('varian_id', this.varian_id.toString());
      body.append('varian_id', '0');
      body.append('qty', this.qty.toString());
      body.append('nama', this.nama);
      body.append('harga', this.harga);
      body.append('token', this.serv.header_key);

      this.http.post(this.serv.base_url + 'add_to_cart', body, requestOptions)
      .subscribe(async data => {
        this.loadingController.dismiss();
        const response = data.json();
        const toast = await this.toastCtrl.create({
          message: response.message,
          duration: 2000
        });
        // toast.present();

        if (response.status === 'Failed') {

          } else {
            this.events.publish('update_cart', this.varian_id, Date.now());
            this.events.publish('update_cart', this.qty.toString(), Date.now());
            this.location.back();
          }
        }, error => {
          this.loadingController.dismiss();
      });
    // }
  }
  kurang() {
    if (this.qty > 1) {
    this.qty -= 1;
    }
  }
  tambah() {
    if ((this.qty + 1) <= this.max_order) {
      this.qty += 1;
    }
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


  toRp(val) {
    return this.serv.toRp(val);
  }
  limitText(val, limit) {
    return this.serv.limitText(val, limit);
  }
}
