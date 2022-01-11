import { Directive, HostListener, ElementRef } from '@angular/core';
import { DatabaseService } from './services/database.service';
@Directive({
  selector: '[trackFocus]'
})
export class TrackFocusDirective {
  constructor(private dbService: DatabaseService, private elRef: ElementRef) {}

  @HostListener('focus', ['$event']) onFocus(e: any) { }
  @HostListener('blur', ['$event']) onblur(e: any) { 
    this.save(this.elRef.nativeElement.value)
  }
  @HostListener('document:keydown.enter', ['$event']) onEnter(e: KeyboardEvent): void { 
    this.elRef.nativeElement.blur() 
    this.save(this.elRef.nativeElement.value)
  }

  save = (name: string): void => {
    this.dbService.updateUser('displayName', name)
  }

}