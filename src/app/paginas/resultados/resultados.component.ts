import { Component, OnInit, AfterViewInit } from '@angular/core';
import { DataService } from '../servicios/data.service';

@Component({
  selector: 'app-resultados',
  templateUrl: './resultados.component.html',
  styleUrl: './resultados.component.css'
})
export class ResultadosComponent  implements OnInit, AfterViewInit{

  outputAPI: string = '';
  steps = ['Datos sin procesar', 'Datos Normalizados', 'Datos Ponderados', 'Soluciones ideales positivas y negativas', 'Medidas de separación', 'Orden Clasificado']
  currentStep: number = 0; // Variable para almacenar el índice del paso actual

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.outputAPI = this.dataService.getData();
  }

  ngAfterViewInit(): void {
    // Asegúrate de que `outputAPI` no esté vacío antes de llamar a `scrollToLastSection`
    if (this.outputAPI) {
      setTimeout(() => {
        this.scrollToLastSection();
      }, 0);
    }
  }

  parseOutput(output: string): any[] {
    if (!output) {
      return []; // Si no hay output, retorna un arreglo vacío
    }

    const sections = output.split('\n\n');
    return sections.map((section) => {
      const lines = section.split('\n');
      const formattedLines = lines.map((line) => this.formatLine(line));
      return formattedLines;
    });
  }

  formatLine(line: string): string {
    if (!line) {
      return ''; // Si la línea es indefinida o vacía, retorna una cadena vacía
    }

    if (line.includes(':')) {
      const items = line.split(/(\S+:\s*[^\s]+)/);
      return items.filter(item => item.trim() !== '').map(item => item.trim()).join('\t');
    } else {
      const items = line.split(/\s+/);
      return items.join('\t');
    }
  }

  formatSpecialLine(line: string): string {
    // Reemplazar múltiples espacios con uno solo
    return line.replace(/\s+/g, '     ');
  }

  //Este para modificar agregar el stepp progres
  scrollToSection(index: number): void {
    this.currentStep = index; // Actualiza el paso actual al hacer clic
    const sectionId = `section-${index}`;
    const sectionElement = document.getElementById(sectionId);
    if (sectionElement) {
      sectionElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }



  //Esta funcion es para mostrar al ultima tabla una ves entrando a la pagina
  scrollToLastSection(): void {
    const lastSectionId = `section-${this.parseOutput(this.outputAPI).length - 1}`;
    const lastSectionElement = document.getElementById(lastSectionId);
    if (lastSectionElement) {
      lastSectionElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

}
