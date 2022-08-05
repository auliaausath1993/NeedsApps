import { LoadingController, NavController, AlertController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { MyserviceService } from '../myservices.service';
import { Router, NavigationExtras  } from '@angular/router';
import { StorageMap } from '@ngx-pwa/local-storage';

@Component({
  selector: 'app-tabs5',
  templateUrl: './tabs5.page.html',
  styleUrls: ['./tabs5.page.scss'],
})
export class Tabs5Page {
  bahasa; bahasa_name;

  akun_login_sebagai;
  akun_button_edit;
  akun_atur_alamat;
  akun_atur_bahasa;
  akun_privacy;
  akun_syarat_ketentuan;
  akun_keluar;

  status  = 'ongoing';
  banners = [1, 1, 1, 1, 1, 1];

  pelanggan_id;
  loading;
  data;

  id; nama; email; no_hp;
  no_wa;


  constructor(
    private http: Http,
    private router: Router,
    private storage: StorageMap,
    private serv: MyserviceService,
    public navCtrl: NavController,
    private alertController: AlertController,
    private loadingController: LoadingController,
  ) {
    this.bahasa       = this.serv.bahasa;
    this.bahasa_name  = this.serv.bahasa_name;
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
        this.akun_login_sebagai               = response.id.akun_login_sebagai;
        this.akun_button_edit                 = response.id.akun_button_edit;
        this.akun_atur_alamat                 = response.id.akun_atur_alamat;
        this.akun_atur_bahasa                 = response.id.akun_atur_bahasa;
        this.akun_privacy                     = response.id.akun_privacy;
        this.akun_syarat_ketentuan            = response.id.akun_syarat_ketentuan;
        this.akun_keluar                      = response.id.akun_keluar;
      } else if (this.bahasa === 'en') {
        this.akun_login_sebagai               = response.en.akun_login_sebagai;
        this.akun_button_edit                 = response.en.akun_button_edit;
        this.akun_atur_alamat                 = response.en.akun_atur_alamat;
        this.akun_atur_bahasa                 = response.en.akun_atur_bahasa;
        this.akun_privacy                     = response.en.akun_privacy;
        this.akun_syarat_ketentuan            = response.en.akun_syarat_ketentuan;
        this.akun_keluar                      = response.en.akun_keluar;
      } else if (this.bahasa === 'ch') {
        this.akun_login_sebagai               = response.ch.akun_login_sebagai;
        this.akun_button_edit                 = response.ch.akun_button_edit;
        this.akun_atur_alamat                 = response.ch.akun_atur_alamat;
        this.akun_atur_bahasa                 = response.ch.akun_atur_bahasa;
        this.akun_privacy                     = response.ch.akun_privacy;
        this.akun_syarat_ketentuan            = response.ch.akun_syarat_ketentuan;
        this.akun_keluar                      = response.ch.akun_keluar;
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

    body.append('pelanggan_id', this.pelanggan_id.toString());
    body.append('token', this.serv.header_key);

    this.http.post(this.serv.base_url + 'get_profile', body, requestOptions)
    .subscribe(data => {
      this.loadingController.dismiss();
      const response = data.json();

      if (response.status === 'Failed') {

        } else {
          this.data = response.data[0];

          this.nama   = this.data.nama;
          this.email  = this.data.email;
          this.no_hp  = this.data.no_hp;
          this.id     = this.data.id;

          this.no_wa  = response.setting.kontak;
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
  goToRequest() {
    this.router.navigateByUrl('/request-produk');
  }
  goToKritik() {
    this.router.navigateByUrl('/kritik-saran');
  }
  goToKonten(konten) {
    // this.router.navigateByUrl("/konten");
    const navigationExtras: NavigationExtras = {
      state: {
        type : konten,
      }
    };
    this.router.navigateByUrl('/konten', navigationExtras);
    // this.router.navigate(['/konten'], { queryParams: { type : konten } });
  }
  async logout() {
    const alert = await this.alertController.create({
      header: 'Logout?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        }, {
          text: 'Ok',
          handler: () => {

            this.storage.delete('isLogin').subscribe(() => {});
            this.storage.delete('user').subscribe(() => {});
            // this.router.navigateByUrl("");
            this.navCtrl.navigateRoot('');
          }
        }
      ]
    });

    await alert.present();
  }
  kontakAdmin() {
    window.open('https://api.whatsapp.com/send?phone=' + this.no_wa + '&text=Hi Needsmarket, ');
  }
}
