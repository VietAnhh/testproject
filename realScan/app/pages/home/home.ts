import {Component} from '@angular/core';
import {NavController, LoadingController, MenuController} from 'ionic-angular';
import {BarcodeScanner} from 'ionic-native';
import {ScanPage} from "../scan/scan";
import {QrService} from "../../provider/qrservice";
import {AuthService} from "../../provider/auth";
import {FirebaseService} from "../../provider/firebase";
import {ProfilePage} from "../profile/profile";
import {Geolocation} from 'ionic-native';

export class BarcodeData {
  constructor(
    public text: String,
    public format: String
  ) {}
}

@Component({
  templateUrl: 'build/pages/home/home.html'
})
export class HomePage{

  user;
  CheckLoader;
  FirstTimeLoader;
  BarCodeLoader;
  profile;



  constructor(public navCtrl: NavController, private qr : QrService, private loadingCtrl: LoadingController, private auth: AuthService, private firebase_ : FirebaseService){

  }

  ionViewLoaded(){
    // setTimeout(() => {
    //   this.CheckLoader = this.loadingCtrl.create(
    //     { content: "Please wait..." }
    //   );
    //   this.CheckLoader.present();
    // }, 0);

    let profile = JSON.parse(localStorage.getItem("profile"));
    console.log(profile);
    let mainID = profile.identities[0].user_id;

    this.firebase_.CheckForFirstTimeLogin(mainID).subscribe(
      (data) => {
        // this.CheckLoader.dismiss();
        console.log(data);
        this.profile = data;
        this.auth.setAccounts(data);
        if(data === null){
          setTimeout(() => {
            this.FirstTimeLoader = this.loadingCtrl.create(
              { content: "Making An Account For You..." }
            );
            this.FirstTimeLoader.present();
          }, 0);
          let obj = {
            email: profile.email,
            clientID: mainID,
            barcode_id: mainID,
            barcode_url: `https://suitup1.herokuapp.com/${mainID}.png`,
            total_connections: 0,
            scanned: {
              recent: ["bruh"],
              favorite: ["bruh"]
            },
            contact: {
              name: profile.name,
              picture: profile.picture,
              phone: "",
              location: "",
              resume_pdf_url: "",
              birthday: "",
              university: "",
              map_connections: [
                {
                  long: "",
                  lat: "",
                  date: "",
                  id: ""
                }
              ]
            },
            portfolio: [
              {
                picture_url: "",
                title: "",
                description: ""
              }
            ],
            work: [
              {
                picture: "",
                description: "",
                company: "",
                job_title: "",
                start_date: "",
                end_date: "",
                is_current: "",
                company_phone_number: ""
              }
            ],
            social: {
              facebook: "",
              twitter: "",
              linkedin: "",
              youtube: "",
              github: "",
              instagram: "",
              snapchat: "",
              pinterest: "",
              dropbox: ""
            }
          };

          this.firebase_.CreateUserAccount(obj).subscribe(
            (data) => {
              console.log(`Created your account successfully!`);
              console.log(data);
              this.FirstTimeLoader.dismiss();

              setTimeout(() => {
                this.FirstTimeLoader = this.loadingCtrl.create(
                  { content: "Generating A Barcode For You...!" }
                );
                this.FirstTimeLoader.present();
              }, 0);

              this.qr.GenerateBarCodeForNewUser(data.barcode_id).subscribe(
                (data) => {
                  console.log("Sucessfully Created the Barcode");
                  console.log(data);
                  this.profile = data;
                  this.auth.setAccounts(data);
                  this.FirstTimeLoader.dismiss();
                }, (err) => {
                  console.log("Problem On The ServerSide when Creating the Barcode");
                  console.log(err);
                  this.FirstTimeLoader.dismiss();
                }
              )

            }, (err) => {
              console.log(`There was an error making the account`);
              console.log(err);
              this.FirstTimeLoader.dismiss();
            }
          );

        }
      }, (err) => {
        this.CheckLoader.dismiss();
        console.log(err);
      }
    )

  }

  ionViewDidEnter(){
      // this.loader.dismiss();
    this.animateSVG(23, true);
    this.animateSVG(67, false);
  }

  animateSVG(battery, whichOne){
    let circle;
    if(whichOne){
      circle = document.getElementById('circle1');
    }else{
      circle = document.getElementById('circle2');
    }
    var radius:any = circle.getAttribute('r');
    var cc = Math.PI*(radius*2);
    circle.style.strokeDashoffset = (""+cc+"");
    function ani(val){
      if (val < 0) { val = 0;}
      if (val > 100) { val = 100;}
      var points = (( 100 - val ) / 100) * cc;
      circle.style.strokeDashoffset = (""+points+"");
    }
    setTimeout(function(){ ani(battery); },0);
    if(whichOne){
      document.getElementById('text1').textContent = battery + '%';
    }else{
      document.getElementById('text2').textContent = battery + '%';
    }
  }

  activateScan(){
    BarcodeScanner.scan({
      "preferFrontCamera": false,
      "showFlipCameraButton" : true
    })
      .then((result) => {
        if (!result.cancelled) {
          const barcodeData = new BarcodeData(result.text, result.format);
          let options = {timeout: 10000,maximumAge:3000,enableHighAccuracy: true};
          Geolocation.getCurrentPosition(options).then((position) => {
            this.scanDetails(barcodeData,position.coords.latitude, position.coords.longitude);
          });
        }
      })
      .catch((err) => {
        alert(err);
      })
  }

  scanDetails(details, lat, long) {
    setTimeout(() => {
      this.BarCodeLoader = this.loadingCtrl.create(
        { content: "Retreiving User's Profile..." }
      );
      this.BarCodeLoader.present();
    }, 0);

    this.firebase_.FindIDWithScan(details.text).subscribe(
      (data1) => {
        console.log("Sucessss getting individual ID from firebase");
        console.log(data1);
        let NewUserID = data1.barcode_id;
        let NewUserName = data1.contact.name;
        let NewUserPicture = data1.contact.picture;

        let NewUser ={
          name: NewUserName,
          picture: NewUserPicture,
          id: NewUserID
        };

        let CurrentUserID = this.profile.barcode_id;
        let totalConnections = this.profile.total_connections;
        let ScannedRecentAmount = this.profile.scanned.recent;
        let ScannedFavoriteAmount = this.profile.scanned.favorite;
        this.firebase_.AddScanIDIntoRecent(CurrentUserID, NewUser, totalConnections, ScannedRecentAmount,ScannedFavoriteAmount, lat, long).subscribe(
          (data2) => {
            this.BarCodeLoader.dismiss();

            console.log(data2);
            this.navCtrl.push(ProfilePage, {ScannedUser: data1});
          }, (err2) => {
            console.log("Oh NO there was an error");
            console.log(err2);
            this.BarCodeLoader.dismiss();
          }
        )
      }, (err1) => {
        console.log('OH NO THERE WAS AN ERROR RETREIVING THE ID FROM FIREBASE');
        console.log(err1);
        this.BarCodeLoader.dismiss();
      }
    )

  }


  hideToolBar(){
    console.log(document.getElementsByClassName("show-tabbar")[0].className);
    // document.getElementsByClassName("show-tabbar")[0].className = "";
    document.getElementsByClassName("show-tabbar")[0].className = "hide-tabbar";
  }

  showToolBar(){
    // document.getElementsByClassName("show-tabbar")[0].className = "";
    document.getElementsByClassName("hide-tabbar")[0].className = "show-tabbar";
  }




}
