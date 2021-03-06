import { Component } from '@angular/core';
import { HomePage } from '../home/home';
import {SettingPage} from "../setting/setting";
import {BarcodePage} from "../barcode/barcode";
import {ProfilePage} from "../profile/profile";
import {NavParams} from "ionic-angular/index";
import {QrService} from "../../provider/qrservice";
import {AuthService} from "../../provider/auth";
import {CalendarPage} from "../calendar/calendar";


@Component({
  templateUrl: 'build/pages/tabs/tabs.html'
})
export class TabsPage {

  public tab1Root: any;
  public tab2Root: any;
  public tab3Root: any;
  public tab4Root: any;
  public tab5Root: any;

  constructor(private params: NavParams, private auth: AuthService) {

    // this tells the tabs component which Pages
    // should be each tab's root Page
    this.tab1Root = HomePage;
    this.tab2Root = ProfilePage;
    this.tab3Root = BarcodePage;
    this.tab4Root = CalendarPage;
    this.tab5Root = SettingPage;
  }
}
