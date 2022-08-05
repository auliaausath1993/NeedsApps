import { Component, OnInit } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { MyserviceService } from '../myservices.service';
import { Router, ActivatedRoute } from '@angular/router';
import { StorageMap } from '@ngx-pwa/local-storage';
import { LoadingController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  bahasa; bahasa_name;
  kategori_title;

  kategori = [];

  status  = 'ongoing';
  banners = [1, 1, 1, 1, 1, 1];
  base_url_image;

  constructor(
    private http: Http,
    private router: Router,
    private storage: StorageMap,
    private serv: MyserviceService,
    private alertController: AlertController,
    private loadingController: LoadingController,
  ) {
    this.base_url_image = this.serv.base_url_image;
    this.bahasa       = this.serv.bahasa;
    this.bahasa_name  = this.serv.bahasa_name;
  }
  doRefresh(event) {
    this.yuk();

    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }
  ionViewWillEnter() {
    this.yuk();
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
    this.getData();
  }
  getSubtitle() {
    this.http.get('assets/data/subtitles.json').subscribe(data => {
      const response = data.json();
      if (this.bahasa === 'id') {
      } else if (this.bahasa === 'en') {
        this.kategori_title       = response.en.kategori_title;
      } else if (this.bahasa === 'ch') {
        this.kategori_title       = response.ch.kategori_title;
      }
    });
  }
  goToList(data) {
    this.router.navigate(['/list-produk'], { queryParams: { data : data.id } });
  }
  getData() {
    const headers = new Headers();
    // headers.append("Authorization", this.serv.header_key);
    const requestOptions = new RequestOptions({ headers });
    const body = new FormData();

    body.append('token', this.serv.header_key);

    this.http.post(this.serv.base_url + 'get_kategori_produk', body, requestOptions)
    .subscribe(data => {
      this.loadingController.dismiss();
      const response = data.json();

      if (response.status === 'Failed') {

        } else {
          this.kategori         = response.kategori;
        }
      }, error => {
        this.loadingController.dismiss();
    });
  }

  goToDetail(x) {
    this.router.navigate(['/detail-produk'], { queryParams: { id : x.id } });
  }
  goToHome() {
    this.router.navigateByUrl('/app/tabs/tab1');
  }
  goToPengiriman() {
    this.router.navigateByUrl('/detail-pengiriman');
  }
}
