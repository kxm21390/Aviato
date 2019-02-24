import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from "../data.service";
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-com-all',
  templateUrl: './com-all.component.html',
  styleUrls: ['./com-all.component.css']
})
export class ComAllComponent implements OnInit {

  constructor(private router: Router, private data: DataService, private httpClient:HttpClient) {}
  //@ViewChild("searchid") SearchId: ElementRef;

  public urlData;
  public prices;
  public textContent;
  public dropdownValues;
  public menuTitle;
  public priceFlag = false;
  public menuFlag = false;
  public loaderFlag = false;
  public priceTitle = "PRICE";
  public weathLong = 0;
  public weathLati = 0;
  private forecast;
  private privateForecast;
  public todayForecast;

  clickPrice(priceValue) {
    this.priceFlag = true;
    this.priceTitle = priceValue;
  }

  clickMenu(menuValue) {
    this.menuFlag = true;
    this.menuTitle = menuValue;
  }

  clickQT(price, menu) {
    let dataReq = {title: this.urlData, price: this.priceTitle, menu: this.menuTitle};
    let stringDataReq = JSON.stringify(dataReq);
    this.data.changeMessage(stringDataReq);
    this.router.navigate(['/QTOptions']);
  }

  ngOnInit() {
    this.urlData = this.router.url.slice(1);
    this.menuTitle = this.urlData;
    this.prices = ['$', '$$', '$$$'];
    if(this.urlData === 'Food'){
      this.dropdownValues = ['SURPRISE ME', 'AMERICAN', 'BURGERS', 'CHINESE', 'MEXICAN', 'PIZZA', 'SANDWICHES', 'SUSHI'];
    }
    else if(this.urlData === 'Drinks'){
      this.dropdownValues = ['SURPRISE ME', 'COFFEE', 'JUICE & SMOOTHIES', 'BEER GARDEN', 'COCKTAIL BAR', 'LOUNGES', 'SPORTS BAR', 'WINE BAR']
    }
    else {
      this.dropdownValues = ['SURPRISE ME', 'SHOPPING', 'TOURS', 'FITNESS', 'WINERIES', 'FARMS', 'ARTS', 'FASHION', 'NIGHTLIFE', 'ACTIVE', 'FESTIVALS'];
    }
    //let kiran = this.navigate();
    //this.SearchId.nativeElement.focus();
    this.httpClient.get('https://cors-anywhere.herokuapp.com/https://api.weather.gov/points/29.4622009,-98.50686643413086').subscribe((resp)=>{
      this.forecast = resp; //.properties.forecast
      this.httpClient.get(this.forecast.properties.forecast).subscribe((resp1)=>{
        this.privateForecast = resp1;
        this.todayForecast = this.privateForecast.properties.periods[0];
        this.loaderFlag = true;
      });
    });
  }
  ngAfterViewChecked() {
    if(this.loaderFlag){
      document.getElementById('searchId').focus();
    }
  }
}
