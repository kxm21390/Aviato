import { Component, OnInit, ViewChildren, QueryList, ElementRef, ChangeDetectorRef } from '@angular/core';
import { DataService } from "../data.service";
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-qtoptions',
  templateUrl: './qtoptions.component.html',
  styleUrls: ['./qtoptions.component.css']
})
export class QTOptionsComponent implements OnInit {
  public selected;
  private selectedResponse;
  public results = [];
  private message: string;
  private baseUrl = '';
  public pageLoader = true;
  public mapFlag = false;
  public mapUrl;
  public mapName;
  private mapOrigin;
  private mapCord;
  private mapDest;
  private mapData = [];
  private result;
  private timeDate;
  private pushFlag;
  private searchFlag = false;
  private searchValue;
  private httpCall;
  private HeaderSettings;
  private secondStopDetails;
  private secondStopUrl = [];
  private finalBusDetails;
  public finalBusDetailsArray;
  public searchResultFlag = false;
  
  constructor(private data: DataService, private httpClient:HttpClient, private cdRef : ChangeDetectorRef) { }
  @ViewChildren('showMap') mapShown: QueryList<ElementRef>;
  clickRoute(number) {
    this.pageLoader = true;
    if(this.finalBusDetailsArray === undefined || this.finalBusDetailsArray.length === 0){
      this.result = 'result_' + number;
      const params = 'client_id=a4865387-a933-4c7c-913c-a2537b8074ef&client_secret=oc9P8gmpRIH8HUtVzgCZrBtTKdAai/d1/QvXVACehBc=&Resource=2cd2fb9a-18c2-4eb1-931b-8885c6151548&grant_type=client_credentials';
      let url = 'https://cors-anywhere.herokuapp.com/https://login.microsoftonline.com/2a3033c2-ad76-426c-9c5a-23233cde4cde/oauth2/token';
      let headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded' });
      let options = { headers: headers };
      this.httpClient.post(url, params, options).subscribe((response: any) => {
          const accessToken = response.access_token;
          this.mapOrigin = this.mapOrigin.replace(',','/');
          const currDate = new Date();
          //this.mapOrigin = '29.4241/-98.4936';
          const authString = "Bearer " + accessToken;
          const firstStopUrl = 'https://cors-anywhere.herokuapp.com/https://codegtfsapi.viainfo.net/api/v1/stops/search/'+this.mapOrigin+'/2/2';
          this.httpClient.get(firstStopUrl, {headers: {'Authorization': authString}}).subscribe((response1)=>{
            this.finalBusDetails = response1; 
            for(let k=0;k<this.finalBusDetails.result.length;k++){
              this.secondStopUrl[k] = 'https://cors-anywhere.herokuapp.com/https://codegtfsapi.viainfo.net/api/v1/stop-times/stop/'+this.finalBusDetails.result[k].stopId+'/'+currDate;
              this.httpClient.get(this.secondStopUrl[k], {headers: {'Authorization': authString}}).subscribe((response2)=>{
              this.secondStopDetails = response2;
              let busTimings = [];
              for(let m=0; m<6; m++){
                //busTimings[m] = this.secondStopDetails.result[m].arrivalTime;
                let timeNode = this.secondStopDetails.result[m].arrivalTime[0] + this.secondStopDetails.result[m].arrivalTime[1];
                timeNode = Number(timeNode);
                if(timeNode > 12){
                  busTimings[m] = this.secondStopDetails.result[m].arrivalTime + ' PM'; 
                }
                else {
                  busTimings[m] = this.secondStopDetails.result[m].arrivalTime + ' AM';
                }
              }
              this.finalBusDetails.result[k].arrivalTime = busTimings;
            });
            }
            this.finalBusDetailsArray = this.finalBusDetails.result;
          });
          this.mapFlag = true;
          if(this.mapFlag) {
            // 34.04415728433331,-118.46049081367187 34.0874082,-118.3808133
            this.mapUrl = 'https://maps.google.com/maps?q='+this.mapData[number]+'&t=&z=13&ie=UTF8&iwloc=&output=embed';
          }else {
            document.getElementById(this.result).focus();
          }
          this.pageLoader = false;
        });
      }
      else {
        this.mapFlag = true; 
        if(this.mapFlag) {
          // 34.04415728433331,-118.46049081367187 34.0874082,-118.3808133
          this.mapUrl = 'https://maps.google.com/maps?q='+this.mapData[number]+'&t=&z=13&ie=UTF8&iwloc=&output=embed';
          }else {
            document.getElementById(this.result).focus();
          }
          this.pageLoader = false;
      }
  }
  closeMap() {
    this.mapFlag = false;
  }
  extractData(res: Response) {
    let body = res.json();
    return body || {};
  }
  handleErrorPromise (error: Response | any) {
    console.error(error.message || error);
    return Promise.reject(error.message || error);
  } 

  dynamicSort(property) {
    var sortOrder = 1;
    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a,b) {
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    } 
  }

  radioChecked(value){
      this.results.sort(this.dynamicSort(value));
  }

  clickSearch(input){
    this.searchValue = input;
    this.searchResultFlag = false;
    this.searchFlag = true;
    this.pageLoader = true;
    this.results = [];
    this.ngOnInit();
  }
  
  ngOnInit() {
    this.data.currentMessage.subscribe(message => this.message = message)
    this.selected = JSON.parse(this.message);
    let priceRange;
    if(this.selected.price === "$") {
      priceRange = 2.1;
    } else if(this.selected.price === "$$") {
      priceRange = 2.2;
    } else {
      priceRange = 2.3;
    }
    let parentRequestId = "c3cf15198a78068d";
    let loc = 78212;
    if(this.searchFlag){
      this.httpCall = 'https://cors-anywhere.herokuapp.com/https://www.yelp.com/search/snippet?find_desc=' + this.searchValue + '&find_loc=' + loc + '&parent_request_id=' + parentRequestId + '&request_origin=';
    } else {
      this.httpCall = 'https://cors-anywhere.herokuapp.com/https://www.yelp.com/search/snippet?cflt=' + this.selected.menu + '&find_loc=' + loc + '&PriceRange=' + priceRange + '&parent_request_id=' + parentRequestId + '&request_origin=user';
    }
    this.httpClient.get(this.httpCall).subscribe((response)=>{
      this.selectedResponse = response;
      let results = this.selectedResponse.searchPageProps.searchMapProps.hovercardData;
      if(Object.keys(results).length > 0) {
      this.searchResultFlag = false;
      this.mapOrigin = this.selectedResponse.searchPageProps.searchMapProps.mapState.center.latitude + ',' + this.selectedResponse.searchPageProps.searchMapProps.mapState.center.longitude;
      this.mapCord = this.selectedResponse.searchPageProps.searchMapProps.mapState.markers;
      let mergedAddress;
      let apiKey = 'AIzaSyA3RQEwMSHf_0TolH8MvY7_ffqxA_E1qLA';
      //let apiKey = 'AIzaSyAmryPV1s5P5HwlMdaFqa5Oig6HywhcdvY';
      Object.keys(results).forEach(key=> {
        for(let j=0; j<this.mapCord.length; j++){
          if(this.mapCord[j].hovercardId === key){
            this.mapDest = this.mapCord[j].location.latitude + ',' + this.mapCord[j].location.longitude;
            this.pushFlag = j;
            break;
          }
        }
        this.httpClient.get('https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins='+this.mapOrigin+'&destinations='+this.mapDest+'&key='+apiKey).subscribe((resp)=>{
          this.timeDate = resp;
          mergedAddress = results[key].addressLines.join();
          mergedAddress = mergedAddress.replace(/ /g,"+");
          mergedAddress = mergedAddress.replace(/,/g,"+");
          this.mapData.push(mergedAddress);
          if(this.timeDate && this.timeDate.rows.length > 0 && this.timeDate.rows[0].elements.length > 0){
            results[key].duration = this.timeDate.rows[0].elements[0].duration.text;
            results[key].distance = this.timeDate.rows[0].elements[0].distance.text;
          }
          else {
            results[key].duration = '23 mins';
            results[key].distance = '3.4 miles';
          }
          this.results.push(results[key]); 
        });    
      });
      } else {
        this.searchResultFlag = true;
        this.pageLoader = false;
      }
  });
  }

  ngAfterViewChecked() {
    if(this.pushFlag === this.results.length){
      this.pageLoader = false;
      document.getElementById('qtid').focus();
      this.cdRef.detectChanges();
    }
  }
}