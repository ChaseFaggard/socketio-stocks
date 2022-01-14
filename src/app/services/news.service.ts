import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoggerService } from './logger.service';
import { environment } from 'src/environments/environment';
import { NewsData } from '../Interfaces';

@Injectable({
  providedIn: 'root'
})
export class NewsService {

  constructor(private logger: LoggerService, private http: HttpClient) {
    console.log(environment.NEWS_KEY)
  }

  public async newsCall(ticker: string): Promise<NewsData> {
    return new Promise((resolve, reject) => {
      this.http.get(`https://api.polygon.io/v2/reference/news?ticker=${ticker}&order=desc&limit=2&sort=published_utc&apiKey=${environment.NEWS_KEY}`).subscribe(
        (res: any) => {
          let newsData = {
            ticker: ticker,
            newsUrl: res.results[0].article_url,
            newsHeadline: res.results[0].title,
            newsImg: res.results[0].image_url
          }
          resolve(newsData)
        }, (err) => {
          reject(err)
        }
      )
    })
  }
}
