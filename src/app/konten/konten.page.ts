import { LoadingController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { MyserviceService } from '../myservices.service';
import { Router, ActivatedRoute } from '@angular/router';
import { StorageMap } from '@ngx-pwa/local-storage';

@Component({
  selector: 'app-konten',
  templateUrl: './konten.page.html',
  styleUrls: ['./konten.page.scss'],
})
export class KontenPage {
  bahasa; bahasa_name;

  pelanggan_id;
  loading;
  data;
  konten = '-';

  type;
  title;


  constructor(
    private http: Http,
    private router: Router,
    private storage: StorageMap,
    private route: ActivatedRoute,
    private serv: MyserviceService,
    private loadingController: LoadingController,
  ) {
    this.bahasa       = this.serv.bahasa;
    this.bahasa_name  = this.serv.bahasa_name;

    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.type        = this.router.getCurrentNavigation().extras.state.type;
        this.getData();
      }
    });


    this.storage.get('user').subscribe((val) => {
      if (val) {
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
    this.loading = this.loadingController.create({
      message: 'Please Wait',
      duration: 10000
    }).then((res) => {
      res.present();
      res.onDidDismiss().then((dis) => {
      });
    });
    const headers = new Headers();
    // headers.append("Authorization", this.serv.header_key);
    const requestOptions = new RequestOptions({ headers });
    const body = new FormData();

    body.append('token', this.serv.header_key);

    this.http.post(this.serv.base_url + 'get_setting', body, requestOptions)
    .subscribe(data => {
      this.loadingController.dismiss();
      const response = data.json();

      if (response.status === 'Failed') {

        } else {
          this.data = response.data[0];
          if (this.type === 'terms') {
            this.title = 'Terms & Condition';
            this.konten = response.data[0].terms;
          }
          if (this.type === 'privacy') {
            this.title = 'Privacy Policy';
            this.konten = response.data[0].privacy;
          }
        }
      }, error => {
        this.loadingController.dismiss();
    });
  }

  goToDetail(x) {
    this.router.navigateByUrl('/detail-order');
  }
  goToEditProfile() {
    this.router.navigateByUrl('/edit-profile');
  }
  goToAturAlamat() {
    this.router.navigateByUrl('/atur-alamat');
  }
  goToAturBahasa() {
    this.router.navigateByUrl('/atur-bahasa');
  }
  goToKonten(konten) {
    this.router.navigateByUrl('/konten');
  }
  logout() {

  }
}
