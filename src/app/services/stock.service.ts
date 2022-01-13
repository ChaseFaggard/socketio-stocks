import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'
import { io, Socket } from 'socket.io-client'
import { environment } from 'src/environments/environment'
import { DataObject, HistoricalData, HistoricalObject, LiveData } from '../Interfaces'
import { LoggerService } from './logger.service'

@Injectable({
  providedIn: 'root'
})
export class StockService {

  private socket: Socket = io(environment.production ? 'https://socketio-livestocks.herokuapp.com/' : 'http://localhost:8080')

  public liveData = new BehaviorSubject<DataObject[] | null>(null)

  constructor(private logger: LoggerService) { 

    this.getLiveData().subscribe((data: LiveData) => {
      //this.logger.log(data)
      this.liveData.next(data.data)
    })
  }

  public asyncEmit = (eventName: string, data?: any): Promise<any> => {
    return new Promise((resolve, reject) => {

      if(data !== undefined) this.socket.emit(eventName, data)
      else this.socket.emit(eventName)
      
      this.socket.on(eventName, (result: any) => {
        this.socket.off(eventName)
        resolve(result)
      })

      /* If no response after 1 second */
      setTimeout(() => { reject(new Error('Server responded too slow... it might be down or lagging behind')) }, 1000)
      
    })
  }

  public getLatency = async (): Promise<number> => {
    const startTime = new Date().getTime()
    await this.asyncEmit('ping')
    return new Date().getTime() - startTime
  }

  public requestLive = (tickers: string[]) => {
    this.socket.emit('startLive', tickers)
  }

  public requestHistorical = async (tickers:string[]): Promise<HistoricalData> => {
    return this.asyncEmit('historicalData', tickers)
  }

  public requestList = async (): Promise<String[]> => {
    return this.asyncEmit('listData')
  }

  public getLiveData = (): Observable<LiveData> => {
    return new Observable<LiveData>((observer:any) => {
      this.socket.on('liveData', (data: LiveData) => {
        observer.next(data)
      })
    })
  }



  public setInterval = (interval:number, tickers: string[]) => {
    this.socket.emit('changeInterval', interval)
    this.requestLive(tickers)
  }

}
