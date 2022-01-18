import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { NewsData } from '../Interfaces';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class NewsService {

  constructor(private http: HttpClient, private localService: LocalStorageService ) { }

  public async newsCall(ticker: string): Promise<NewsData> {
    return new Promise((resolve, reject) => {
      this.http.get(`https://api.polygon.io/v2/reference/news?ticker=${ticker}&order=desc&limit=2&sort=published_utc&apiKey=${environment.NEWS_KEY}`).subscribe(
        (res: any) => {
          if(res.results) {
            console.log(res.results)
            resolve({
              ticker: ticker,
              newsUrl: res.results[0].article_url,
              newsHeadline: res.results[0].title,
              newsImg: res.results[0].image_url
            })
          } else resolve({ticker: '', newsUrl: '', newsHeadline: '', newsImg: ''})
        }, (err) => {
          /* On rejection, send last news article from local storage of that ticekr */
          resolve(this.localService.getNews(ticker)!)  
        }
      )
    })
  }
}
