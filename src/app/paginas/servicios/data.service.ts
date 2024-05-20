import { Injectable, OnInit } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class DataService implements OnInit{

  constructor() { }

  ngOnInit(): void {
    
  }


  private data: any;

  setData(data: any) {
    this.data = data;
  }

  getData() {
    return this.data;
  }
}
