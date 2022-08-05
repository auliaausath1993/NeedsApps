import { Component, OnInit } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { MyserviceService } from '../myservices.service';
import { Router, ActivatedRoute } from '@angular/router';
import { StorageMap } from '@ngx-pwa/local-storage';
import { LoadingController, AlertController, Events } from '@ionic/angular';

@Component({
  selector: 'app-news-detail',
  templateUrl: './news-detail.page.html',
  styleUrls: ['./news-detail.page.scss'],
})
export class NewsDetailPage {
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

  data;
  base_url_image;
  judul; deskripsi; gambar;


  constructor(
    private http: Http,
    private router: Router,
    private events: Events,
    private storage: StorageMap,
    private route: ActivatedRoute,
    private serv: MyserviceService,
    private alertController: AlertController,
    private loadingController: LoadingController,
  ) {
    this.bahasa       = this.serv.bahasa;
    this.bahasa_name  = this.serv.bahasa_name;
    this.base_url_image = this.serv.base_url_image;


    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.id        = this.router.getCurrentNavigation().extras.state.id;
        this.getData();
      }
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
  getData() {
    const headers = new Headers();
    // headers.append("Authorization", this.serv.header_key);
    const requestOptions = new RequestOptions({ headers });
    const body = new FormData();

    body.append('page', this.page.toString());
    body.append('token', this.serv.header_key);
    body.append('id', this.id);
    if (this.keyword !== ' ') {
      body.append('keyword', this.keyword.toString());
    }

    this.http.post(this.serv.base_url + 'detail_news', body, requestOptions)
    .subscribe(data => {
      this.loadingController.dismiss();
      const response = data.json();

      if (response.status === 'Failed') {

        } else {
          this.data      = response.data;
          this.judul     = response.data.judul;
          this.gambar    = response.data.gambar;
          this.deskripsi = response.data.isi;
        }
      }, error => {
        this.loadingController.dismiss();
    });
  }
  goToHome() {
    this.router.navigateByUrl('/app/tabs/tab1');
  }
  goToDetail(x) {
    this.router.navigateByUrl('/detail-promo');
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
