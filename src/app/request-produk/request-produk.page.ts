import { LoadingController, NavController, AlertController, ToastController, Platform } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { MyserviceService } from '../myservices.service';
import { Router, NavigationExtras  } from '@angular/router';
import { StorageMap } from '@ngx-pwa/local-storage';
import { FileUploader, FileItem } from 'ng2-file-upload';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { File } from '@ionic-native/file/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';

declare var cordova: any;

@Component({
  selector: 'app-request-produk',
  templateUrl: './request-produk.page.html',
  styleUrls: ['./request-produk.page.scss'],
})
export class RequestProdukPage implements OnInit {
  nama = ' '; ukuran = ' '; bukti;
  uploader;
  uploader1; bukti1; isUploaded;
  pelanggan_id; loading; toast;
  base_url_image; lastImage;
  preview; base_url;

  constructor(
    private http: Http,
    private router: Router,
    private storage: StorageMap,
    private serv: MyserviceService,
    public navCtrl: NavController,
    private toastCtrl: ToastController,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private camera: Camera,
    private transfer: FileTransfer,
    private file: File,
    private filePath: FilePath,
    public platform: Platform, ) {
      this.base_url_image = this.serv.base_url_image;
      this.storage.get('user').subscribe((val) => {
        if (val) {
          const data: any = val;
          this.pelanggan_id = data.id;
        }
      });
      this.setupUploader();
    }

  ngOnInit() {
  }
  presentToast(val) {

  }
  camera1() {
    this.takePicture(this.camera.PictureSourceType.CAMERA, '1');
  }
  public takePicture(sourceType, enumx) {
    // Create options for the Camera Dialog
    const options = {
      quality: 100,
      sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };

    // Get the data of an image
    this.camera.getPicture(options).then((imagePath) => {
      // Special handling for Android library
      if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
        this.filePath.resolveNativePath(imagePath)
          .then(filePath => {
            const correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
            const currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
            this.copyFileToLocalDir(correctPath, currentName, this.createFileName(), enumx);
          });
      } else {
        const currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
        const correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
        this.copyFileToLocalDir(correctPath, currentName, this.createFileName(), enumx);
      }
    }, (err) => {
      this.presentToast('Error while selecting image.');
    });
  }
  // Create a new name for the image
  private createFileName() {
    const d = new Date(),
    n = d.getTime(),
    newFileName =  n + '.jpg';
    return newFileName;
  }

  // Copy the image to a local folder
  private copyFileToLocalDir(namePath, currentName, newFileName, enumx) {
    this.file.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
      this.lastImage = newFileName;
      this.uploadImage(enumx);
    }, error => {
      this.presentToast('Error while storing file.');
    });
  }
  public pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      return cordova.file.dataDirectory + img;
    }
  }
  public uploadImage(enumx) {
    this.loading = this.loadingController.create({
      message: 'Please Wait'
    }).then((res) => {
      res.present();

      res.onDidDismiss().then((dis) => {
      });
    });

    // let url = this.serv.base_url + 'upload_bukti';
    const url = 'https://needsmarket.id/adminpage/public/api_admin/upload_foto';
    // File for Upload
    const targetPath = this.pathForImage(this.lastImage);
    // File name only
    const filename = this.lastImage;
    const options = {
      fileKey: 'file',
      fileName: filename,
      chunkedMode: false,
      mimeType: 'multipart/form-data',
      params : {
        fileName: filename,
      }
    };
    const fileTransfer: FileTransferObject = this.transfer.create();
    fileTransfer.upload(targetPath, url, options).then(data => {
      this.loadingController.dismiss();
      const json = JSON.parse(data.response);
      this.lastImage = json.nama_file;
      this.presentToast('Image succesful uploaded.');
      this.bukti = json.message;
      // this.foto   = json.message;
      this.isUploaded = true;
    }, err => {
      this.loadingController.dismiss();
      this.presentToast('Error while uploading file.');
    });
  }
  setupUploader() {
    this.uploader = new FileUploader({
      url: 'https://needsmarket.id/adminpage/public/api_admin/upload_foto',
      method: 'POST',
      autoUpload: true,
    });
    this.uploader.onBeforeUploadItem = (item: FileItem) => {

      // add additional parameters for the serverside
        this.uploader.options.additionalParameter = {
            name: item.file.name,
            pelanggan_id: this.pelanggan_id,
            section: 'whatever',
            // userid = __this.auth.user.userid;
        };
    };

    this.uploader.onAfterAddingFile = (fileItem) => {
        this.loading = this.loadingController.create({
          message: 'Please Wait'
        }).then((res) => {
          res.present();

          res.onDidDismiss().then((dis) => {
          });
        });
        fileItem.withCredentials = false;
    };

    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
      const response_json = JSON.parse(response);
      this.loadingController.dismiss();
      if (response_json.status === 'Success') {
        this.bukti = response_json.message;
      } else {
        alert(response_json.message);
      }
    };
  }
  async postData() {
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
    body.append('nama', this.nama.toString());
    body.append('ukuran', this.ukuran.toString());
    body.append('image', this.bukti.toString());
    body.append('token', this.serv.header_key);

    this.http.post(this.serv.base_url + 'request_product', body, requestOptions)
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
