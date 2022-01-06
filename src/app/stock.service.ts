import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { io, Socket } from 'socket.io-client'
import { environment } from 'src/environments/environment'

@Injectable({
  providedIn: 'root'
})
export class StockService {

  private socket: Socket = io(environment.production ? 'https://socketio-livestocks.herokuapp.com/' : 'http://localhost:8080')

  constructor() { }

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

  public getResponseType = async (requestType: string): Promise<Object> => {
    const response = await this.asyncEmit('requestType', requestType)
    console.log('Response: ' + JSON.stringify(response))
    return response
  }

  public getData = async (request: {'request-type': string, symbols?: string[], start?: string}): Promise<Object> => {
    return await this.asyncEmit('getData', request)
  }



}
