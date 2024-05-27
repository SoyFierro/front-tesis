import { Component, OnInit, AfterViewInit} from '@angular/core';
import { DataService } from '../servicios/data.service';
import { Chart, ChartType, ChartConfiguration, ChartItem  } from 'chart.js/auto';

@Component({
  selector: 'app-grafica',
  templateUrl: './grafica.component.html',
  styleUrl: './grafica.component.css'
})
export class GraficaComponent  implements OnInit{

  outputAPI: string = '';
  public chart!: Chart;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    
    this.outputAPI = this.dataService.getData();
    console.log(this.outputAPI);


    
    this.loadChart();
    
  }


  loadChart(): void {
    const data = {
      labels: ['Enero', 'Febrero', 'Marzo'],
      datasets: [{
        label: 'My First Dataset',
        data: [65, 59, 80, 81, 56, 55, 40],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(255, 159, 64, 0.2)',
          'rgba(255, 205, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(201, 203, 207, 0.2)'
        ],
        borderColor: [
          'rgb(255, 99, 132)',
          'rgb(255, 159, 64)',
          'rgb(255, 205, 86)',
          'rgb(75, 192, 192)',
          'rgb(54, 162, 235)',
          'rgb(153, 102, 255)',
          'rgb(201, 203, 207)'
        ],
        borderWidth: 1
      }]
    };

    this.chart = new Chart("chart", {
      type: 'bar' as ChartType,
      data
    })
  }

}

