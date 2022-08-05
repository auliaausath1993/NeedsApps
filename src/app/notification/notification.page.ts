import { Component, OnInit } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { MyserviceService } from '../myservices.service';
import { Router, NavigationExtras} from '@angular/router';
import { StorageMap } from '@ngx-pwa/local-storage';
import { LoadingController, AlertController, Events } from '@ionic/angular';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.page.html',
  styleUrls: ['./notification.page.scss'],
})
export class NotificationPage {
  bahasa; bahasa_name;

  produk = [];
  favorit = [];
  banners = [1, 1, 1, 1, 1, 1];
  loading;
  page = 1;
  pelanggan_id = 0;

  base_url_image;
  items = [];


  constructor(
    private http: Http,
    private router: Router,
    private events: Events,
    private storage: StorageMap,
    private serv: MyserviceService,
    private alertController: AlertController,
    private loadingController: LoadingController,
  ) {
    this.base_url_image = this.serv.base_url_image;
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
    this.loading = this.loadingController.create({
      message: 'Please Wait',
      duration: 10000
    }).then((res) => {
      this.getSubtitle();
      // res.present();


      res.onDidDismiss().then((dis) => {
      });
    });
  }
  ionViewWillEnter() {
    this.storage.get('user').subscribe((val) => {
      if (val) {
        const data: any = val;
        this.pelanggan_id = data.id;
      }
      this.getData();
    });
  }

  getSubtitle() {
    this.http.get('assets/data/subtitles.json').subscribe(data => {
      const response = data.json();
      if (this.bahasa === 'id') {

      } else if (this.bahasa === 'en') {

      } else if (this.bahasa === 'ch') {

      }
    });
  }
  getData() {

    const headers = new Headers();
    // headers.append("Authorization", this.serv.header_key);
    const requestOptions = new RequestOptions({ headers });
    const body = new FormData();

    body.append('page', this.page.toString());
    body.append('pelanggan_id', this.pelanggan_id.toString());
    body.append('token', this.serv.header_key);

    this.http.post(this.serv.base_url + 'get_notification', body, requestOptions)
    .subscribe(data => {
      this.loadingController.dismiss();
      const response = data.json();

      if (response.status === 'Failed') {

        } else {
          this.items = response.data;
        }
      }, error => {
        this.loadingController.dismiss();
    });
  }
  goToHome() {
    this.router.navigateByUrl('/app/tabs/tab1');
  }
  goToDetailProduk(x) {
    this.router.navigate(['/detail-produk'], { queryParams: { id : x.id } });
  }
  goToSearchPage() {
    this.router.navigateByUrl('/list-produk');
  }
  goToNotification() {
    this.router.navigateByUrl('/notification');
  }
  toRp(val) {
    return this.serv.toRp(val);
  }
  limitText(val, limit) {
    return this.serv.limitText(val, limit);
  }
}
