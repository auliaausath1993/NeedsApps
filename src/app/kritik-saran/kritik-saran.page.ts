import { LoadingController, NavController, AlertController, ToastController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { MyserviceService } from '../myservices.service';
import { Router, NavigationExtras  } from '@angular/router';
import { StorageMap } from '@ngx-pwa/local-storage';
import { FileUploader, FileItem } from 'ng2-file-upload';

@Component({
  selector: 'app-kritik-saran',
  templateUrl: './kritik-saran.page.html',
  styleUrls: ['./kritik-saran.page.scss'],
})
export class KritikSaranPage implements OnInit {
  nama = ' '; ukuran = ' '; bukti;
  uploader;
  pelanggan_id; loading; toast;
  base_url_image;

  kritik = ' '; saran = ' ';

  constructor(
    private http: Http,
    private router: Router,
    private storage: StorageMap,
    private serv: MyserviceService,
    public navCtrl: NavController,
    private toastCtrl: ToastController,
    private alertController: AlertController,
    private loadingController: LoadingController, ) {
      this.base_url_image = this.serv.base_url_image;
      this.storage.get('user').subscribe((val) => {
        if (val) {
          const data: any = val;
          this.pelanggan_id = data.id;
        }
      });
    }

  ngOnInit() {
  }
  async postData() {
    if (this.kritik === ' ' || this.kritik === '') {
      // alert("Waktu pengiriman required");
      const toast = await this.toastCtrl.create({
        message: 'kritik required',
        duration: 2000
      });
      toast.present();
    } else if (this.saran === ' ' || this.saran === '') {
      // alert("Hari pengiriman required");
      const toast = await this.toastCtrl.create({
        message: 'saran required',
        duration: 2000
      });
      toast.present();
    } else {
      this.GopostData();
    }
  }
  async GopostData() {
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
    body.append('kritik', this.kritik.toString());
    body.append('saran', this.saran.toString());
    body.append('token', this.serv.header_key);

    this.http.post(this.serv.base_url + 'post_kritik_saran', body, requestOptions)
    .subscribe(async data => {
      this.loadingController.dismiss();
      const response = data.json();

      this.toast = await this.toastCtrl.create({
          message: response.status,
          duration: 2000,
          cssClass: 'my-toast'
        });
      this.toast.present();

      if (response.status === 'Failed') {

        } else {
          this.router.navigateByUrl('/app/tabs/tab5');
        }
      }, error => {
        this.loadingController.dismiss();
    });
  }
  request() {

  }

}
