import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'
import { io, Socket } from 'socket.io-client'
import { environment } from 'src/environments/environment'
import { candleData, candlestick, DataObject, HistoricalStockObject, ListData, LiveData, User } from '../Interfaces'
import { UserService } from './user.service'

@Injectable({
  providedIn: 'root'
})
export class StockService {

  private candleInterval: number = 0 // Time in seconds

  public interval: any // Interval function

  private socket: Socket = io(environment.production ? 'https://socketio-livestocks.herokuapp.com/' : 'http://localhost:8080')

  public liveData = new BehaviorSubject<DataObject[] | null>(null)

  public candleLiveData: (candlestick[])[] = []

  public candlestickData = new BehaviorSubject<candleData[]>([])

  public index = 0

  public current: candleData = {
    x: [(new Date()).getTime().toString()],
    close: [0],
    decreasing: { line: { color: '#7f7f7f' } },
    high: [0],
    increasing: { line: { color: '#17becf' } },
    line: { color: 'rgba(31,119,180,1)' },
    low: [0],
    open: [0],
    type: 'candlestick',
    xaxis: 'x',
    yaxis: 'y',
  }

  public tickerIndex: number = 0

  constructor(private userService: UserService) { 

    this.userService.user.subscribe((user: User | null) => {
      if(user != null) {
        if(user.candleInterval != this.candleInterval) {
          /* Reset graph */
          this.current.open = [0]
          this.current.close = [0]
          this.current.high = [0]
          this.current.low = [0]
          this.current.x = [(new Date()).getTime().toString()]
          this.index = 0
          this.candlestickData.next([this.current])

          /* Reset Interval */
          this.candleInterval = user.candleInterval
          clearInterval(this.interval)
          this.interval = setInterval(() => {
            this.current.close.push(0)
            this.current.open.push(0)
            this.current.high.push(0)
            this.current.low.push(0)
            this.current.x.push((new Date()).getTime().toString())
            this.index++
          }, this.candleInterval * 1000)
        }
      }
    })

    this.getLiveData().subscribe((liveData: LiveData) => {
      const data = liveData.data
      this.liveData.next(data)
      if (data != null) {
        for(let i = 0; i < data.length; i++) {
          if(!this.candleLiveData[<any>data[i].symbol]) this.candleLiveData[<any>data[i].symbol] = []
          let current = data[i].currentValue
          if(!this.candleLiveData[<any>data[i].symbol][this.index]) {
            this.candleLiveData[<any>data[i].symbol][this.index] = { 
              open: current, 
              high: current,
              low: current,
              close: current,
            }
          }
          else {
            let candle: candlestick = this.candleLiveData[<any>data[i].symbol][this.index]
            candle.close = current
            candle.high = current > candle.high ? current : candle.high
            candle.low = current < candle.low ? current : candle.low
          }
        }
        let ticker = data[this.tickerIndex].symbol
        this.current.close = this.candleLiveData[<any>ticker].map(candle => candle.close)
        this.current.high = this.candleLiveData[<any>ticker].map(candle => candle.high)
        this.current.open = this.candleLiveData[<any>ticker].map(candle => candle.open)
        this.current.low = this.candleLiveData[<any>ticker].map(candle => candle.low)

        this.candlestickData.next([this.current])
      }
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

  public requestHistorical = async (tickers:string[]): Promise<HistoricalStockObject[]> => {
    const data = await this.asyncEmit('historicalData', tickers)
    return data.data
  }

  public requestList = async (): Promise<string[]> => {
    const listData: ListData = await this.asyncEmit('listData')
    return listData.symbols
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
