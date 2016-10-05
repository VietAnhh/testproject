import {Component, ViewChild, ElementRef} from '@angular/core';
import {NavController, Slides, ModalController, PopoverController, LoadingController} from 'ionic-angular';
import {PortfolioModal} from "./portfolio-modal/portfolio-modal";
import {MapModal} from "./map-modal/map-modal";
import {ShowBarcodeModal} from "./showbarcode-modal/showbarcode-modal";
import {WorkModal} from "./work-modal/work-modal";
import {AuthService} from "../../provider/auth";


@Component({
  templateUrl: 'build/pages/profile/profile.html',
})
export class ProfilePage {

  @ViewChild('mySlider') slider: Slides;
  @ViewChild('mySlider') pager;


  @ViewChild('profile') profile;

  @ViewChild('contact') contact;
  @ViewChild('portfolio') portfolio;
  @ViewChild('work') work;
  @ViewChild('social') social;

  TabArray = [
    "contact",
    "portfolio",
    "work",
    "social"
  ];

  mySlideOptions = {
    initialSlide: 1,
    loop: true
  };

  options;
  extraOptions;
  currentTab;

  loader;

  account;


  //MAKES IT SO THE COLOR OF THE BORDER-BOTOM OF THE TAB DOESN'T REPEAT WHEN THE VIEW ENTER BACK IN
  smallWorkAround1:number = 0;


  constructor(private navCtrl: NavController, private modalCtrl: ModalController, private loadingCtrl : LoadingController, private auth: AuthService) {
    // event.preventDefault();
  }


  ionViewDidEnter(){


    this.currentTab = this.contact;
    console.log(this.contact);
    if(this.smallWorkAround1 < 1){
      this.contact.nativeElement.style.borderBottom = "4px solid #B63A3A";
      this.smallWorkAround1++;
    }
    this.options = {
    pagination: '.swiper-pagination',
    slidesPerView: 1,
    paginationClickable: true
    // paginationBulletRender: function (index, className) {
    // console.log(className);
    // console.log(this.categories);
    // return `<span class="${className}">${this.categories[index]}</span>`;
    // return `<!--<button class="${className}">${this.categories[index]}</button>-->`;
    // }
    };

    let takeAwayHide = this.pager.elementRef.nativeElement.children[0].children[1];
    takeAwayHide.className = "swiper-pagination";
    this.slider.getSlider().update()
  }

  ionViewLoaded(){
    setTimeout(() => {
      this.loader = this.loadingCtrl.create(
        { content: "Please wait..." }
      );
      this.loader.present();
    }, 0);


    this.auth.getAccounts((data) => {
      setTimeout(() => {
        this.loader.dismiss();
      },0);
      this.account = data;
      console.log(this.account);
    });
  }

  onSlidedChanged() {
    let currentIndex = this.slider.getActiveIndex();
    this.changeTabIndex(currentIndex);

  }

  testDrag(){
    let currentIndex = this.slider.getActiveIndex();
    this.changeTabIndex(currentIndex);

  }

  changeTabIndex(index){
    this.currentTab.nativeElement.style.borderBottom = "";
    let newTab = this.TabArray[index];
    this[newTab].nativeElement.style.borderBottom = "4px solid #B63A3A";
    this.currentTab = this[newTab];
  }

  openPortfolio(obj){
      console.log(obj);
      let modal = this.modalCtrl.create(PortfolioModal, {profile: obj});
      modal.onDidDismiss(() => {
        this.BackgroundOpacity(true);
      });
      this.BackgroundOpacity(false);
      modal.present();
  }

  BackgroundOpacity(value){
    if(value){
      this.profile.elementRef.nativeElement.setAttribute("style", "background-color: ;");
    }else{
      this.profile.elementRef.nativeElement.setAttribute("style", "opacity: 0.5;background-color: #363838;-webkit-filter: blur(5px);moz-filter: blur(5px);-o-filter: blur(5px);-ms-filter: blur(5px);filter: blur(5px);");
    }
  }

  openMap(){
    // let modal = this.modalCtrl.create(MapModal);
    // modal.onDidDismiss(() => {
    //   this.BackgroundOpacity(true);
    // });
    // this.BackgroundOpacity(false);
    // modal.present();

    this.navCtrl.push(MapModal);

  }

  openBarcode(){
    let modal = this.modalCtrl.create(ShowBarcodeModal);
    modal.onDidDismiss(() => {
      this.BackgroundOpacity(true);
    });
    this.BackgroundOpacity(false);
    modal.present();
  }

  openWorkModal(obj){
    let modal = this.modalCtrl.create(WorkModal, {profile: obj});
    modal.onDidDismiss(() => {
      this.BackgroundOpacity(true);
    });
    this.BackgroundOpacity(false);
    modal.present();
  }


}
