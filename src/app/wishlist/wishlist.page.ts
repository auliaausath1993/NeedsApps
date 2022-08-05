import { Component, OnInit } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { MyserviceService } from '../myservices.service';
import { Router, ActivatedRoute } from '@angular/router';
import { StorageMap } from '@ngx-pwa/local-storage';
import { LoadingController, AlertController, Events, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.page.html',
  styleUrls: ['./wishlist.page.scss'],
})
export class WishlistPage {
  bahasa; bahasa_name;
  home_button_beli;
  home_input_cari;

  produk = [];
  produk_all = [];
  favorit = [];
  banners = [1, 1, 1, 1, 1, 1];
  loading;
  page = 1;

  keyword = ' ';
  kategori;
  id;

  pelanggan_id;
  base_url_image;


  constructor(
    private http: Http,
    private router: Router,
    private events: Events,
    private storage: StorageMap,
    private route: ActivatedRoute,
    private toastCtrl: ToastController,
    private serv: MyserviceService,
    private alertController: AlertController,
    private loadingController: LoadingController,
  ) {
    this.base_url_image = this.serv.base_url_image;
    this.bahasa         = this.serv.bahasa;
    this.bahasa_name    = this.serv.bahasa_name;
    this.yuk();

  }
  doRefresh(event) {
    this.yuk();

    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }
  yuk() {
    this.loading = this.loadingController.create({
      message: 'Please Wait',
      duration: 10000
    }).then((res) => {
      this.getSubtitle();
      res.present();



      this.storage.get('user').subscribe((val) => {
          if (val) {
            const data: any = val;
            this.pelanggan_id = data.id;
            this.getData();
          }
        });


      res.onDidDismiss().then((dis) => {
      });
    });
  }

  getSubtitle() {
    this.http.get('assets/data/subtitles.json').subscribe(data => {
      const response = data.json();
      if (this.bahasa === 'id') {
        this.home_input_cari            = response.id.home_input_cari;
        this.home_button_beli           = response.id.home_button_beli;
      } else if (this.bahasa === 'en') {
        this.home_input_cari            = response.en.home_input_cari;
        this.home_button_beli           = response.en.home_button_beli;
      } else if (this.bahasa === 'ch') {
        this.home_input_cari            = response.ch.home_input_cari;
        this.home_button_beli           = response.ch.home_button_beli;
      }
    });
  }
  doSearch(evt) {
    if (evt.detail.value.length >= 4) {
      this.getDataSearch();
    } else {
      this.produk = this.produk_all;
    }
  }
  getData() {
    const headers = new Headers();
    // headers.append("Authorization", this.serv.header_key);
    const requestOptions = new RequestOptions({ headers });
    const body = new FormData();

    body.append('page', this.page.toString());
    body.append('token', this.serv.header_key);
    body.append('user_id', this.pelanggan_id);
    if (this.keyword !== ' ') {
      body.append('keyword', this.keyword.toString());
    }

    this.http.post(this.serv.base_url + 'get_wishlist', body, requestOptions)
    .subscribe(data => {
      this.loadingController.dismiss();
      const response = data.json();

      if (response.status === 'Failed') {

        } else {
          this.produk  = response.produk;
          this.produk_all  = response.produk;
        }
      }, error => {
        this.loadingController.dismiss();
    });
  }
  getDataSearch() {
    const headers = new Headers();
    // headers.append("Authorization", this.serv.header_key);
    const requestOptions = new RequestOptions({ headers });
    const body = new FormData();

    body.append('page', this.page.toString());
    body.append('token', this.serv.header_key);
    body.append('kategori', this.id);
    if (this.keyword !== ' ') {
      body.append('keyword', this.keyword.toString());
    }

    this.http.post(this.serv.base_url + 'get_list_produk', body, requestOptions)
    .subscribe(data => {
      this.loadingController.dismiss();
      const response = data.json();

      if (response.status === 'Failed') {

        } else {
          this.produk  = response.produk;
        }
      }, error => {
        this.loadingController.dismiss();
    });
  }
  goToHome() {
    this.router.navigateByUrl('/app/tabs/tab1');
  }
  addToWishlist(data) {
    if (this.pelanggan_id) {
      const headers = new Headers();
      // headers.append("Authorization", this.serv.header_key);
      const requestOptions = new RequestOptions({ headers });
      const body = new FormData();

      body.append('id', data.id);
      body.append('pelanggan_id', this.pelanggan_id.toString());
      body.append('token', this.serv.header_key);

      this.http.post(this.serv.base_url + 'add_to_wishlist', body, requestOptions)
      .subscribe(async data => {
        // this.loadingController.dismiss();
        const response = data.json();

        if (response.status === 'Failed') {
            alert(response.message);
          } else {
            const toast = await this.toastCtrl.create({
              message: 'Wishlist Updated',
              duration: 2000
            });
            toast.present();
            this.getData();
          }
        }, error => {
          // this.loadingController.dismiss();
      });
    } else {
      alert('please login');
    }
  }
  goToDetailProduk(x) {
    // this.router.navigateByUrl("/detail-produk");
    this.router.navigate(['/detail-produk'], { queryParams: { id : x.id } });
  }
  goToSearchPage() {

  }
  toRp(val) {
    return this.serv.toRp(val);
  }
  limitText(val, limit) {
    return this.serv.limitText(val, limit);
  }
}
