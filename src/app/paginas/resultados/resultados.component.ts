import { Component, OnInit } from '@angular/core';
import { DataService } from '../servicios/data.service';

@Component({
  selector: 'app-resultados',
  templateUrl: './resultados.component.html',
  styleUrl: './resultados.component.css'
})
export class ResultadosComponent  implements OnInit{

  outputAPI: string = '';

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.outputAPI = this.dataService.getData();
  }

  parseOutput(output: string): any[] {
    const sections = output.split('\n\n');
    return sections.map((section) => {
      const lines = section.split('\n');
      const formattedLines = lines.map((line) => this.formatLine(line));
      return formattedLines;
    });
  }

  formatLine(line: string): string {
    // Verificar si la línea contiene elementos con ':'
    if (line.includes(':')) {
      const items = line.split(/(\S+:\s*[^\s]+)/);
      return items.filter(item => item.trim() !== '').map(item => item.trim()).join('\t'); //Esta es la separacion de espacios de Medidas de separacion  y Orden Clasificado
    } else {
      // Para líneas con solo números, formatear adecuadamente
      const items = line.split(/\s+/);
      return items.join('\t');  //Estan los las que imoprimen el formato de: Datros sin procesar hasta soluciones ideales positivas y negativas
    }
  }

  formatSpecialLine(line: string): string {
    // Reemplazar múltiples espacios con uno solo
    return line.replace(/\s+/g, '     ');
  }

}
