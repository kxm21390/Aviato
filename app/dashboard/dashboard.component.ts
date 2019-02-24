import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  private quoteData;
  public message;
  public quoteFlag = false;
  constructor(private httpClient:HttpClient) { }

  ngOnInit() {
    this.httpClient.get('https://cors-anywhere.herokuapp.com/https://quotes.rest/qod.json?category=inspire').subscribe((response)=>{
      this.quoteData = response;
      this.message = this.quoteData.contents.quotes[0];
      this.quoteFlag = true;
    });
  }

}
