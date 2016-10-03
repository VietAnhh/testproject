import { Component } from '@angular/core';
import { Platform, ionicBootstrap } from 'ionic-angular';
import { StatusBar } from 'ionic-native';
import {LoginPage} from "./pages/login/login";
import {FirebaseService} from "./provider/firebase";
import {QrService} from "./provider/qrservice";
import {SQLStorage} from "./provider/sqlstorage";


@Component({
  template: '<ion-nav [root]="rootPage"></ion-nav>',
  providers: [FirebaseService, QrService, SQLStorage]
})
export class MyApp {

  public rootPage: any;

  constructor(private platform: Platform) {
    this.rootPage = LoginPage;



    platform.ready().then(() => {
      console.log("went in here");
      console.log(platform.platforms());
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
    });
  }
}

ionicBootstrap(MyApp);
