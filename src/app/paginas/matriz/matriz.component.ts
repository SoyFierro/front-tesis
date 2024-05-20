import { Component, OnInit, ElementRef, ViewChild  } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { DataService } from '../servicios/data.service';

interface Cell {
  value: number;
  rowIndex: number;
  colIndex: number;
}

@Component({
  selector: 'app-matriz',
  templateUrl: './matriz.component.html',
  styleUrl: './matriz.component.css'
})
export class MatrizComponent implements OnInit{

  filas: number | null = null;
  columnas: number | null = null;;
  matriz: Cell[][] = [];
  columnasArray: number[] = [];
  pesos: number[] = []; // Array para almacenar los pesos
  nombresFilasIzquierda: string[] = []; // Array para almacenar los nombres de las filas a la izquierda de la matriz
  nombresFilasSuperior: string[] = []; // Array para almacenar los nombres de las filas en la parte superior de la matr
  rawData: number[][] = [];
  outputAPI: string = ''; // Variable para almacenar el output de la API
  outputAPIHtml: SafeHtml = ''; // Variable para almacenar el output de la API con formato HTML

  @ViewChild('inputElements', { static: false }) inputElements: ElementRef[];
  
  constructor(private http:HttpClient, private router: Router, private sanitizer: DomSanitizer, private dataService: DataService) {
    this.inputElements = [];
  }

  ngOnInit(): void {
    
  }

  updateFilas(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.filas = value ? parseInt(value, 10) : null;
  }

  updateColumnas(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.columnas = value ? parseInt(value, 10) : null;
  }

  generarMatriz(): void {
    // Limpiar la matriz actual
    this.matriz = [];

    // Validar que se hayan ingresado valores válidos
    if (this.filas === null || this.columnas === null || this.filas <= 0 || this.columnas <= 0) {
      console.error('Por favor, ingrese valores válidos para filas y columnas.');
      return;
    }


    // Generar los nombres de las filas para los encabezados a la izquierda de la matriz
    this.nombresFilasIzquierda = Array.from(Array(this.filas).keys()).map(i => `A${i + 1}`);

    // Generar los nombres de las filas para los encabezados en la parte superior de la matriz
    this.nombresFilasSuperior = Array.from(Array(this.columnas).keys()).map(i => `C${i + 1}`);

    // Generar la matriz con valores de entrada
    for (let i = 0; i < this.filas; i++) {
        const fila: Cell[] = [];
        for (let j = 0; j < this.columnas; j++) {
            fila.push({ value: 0, rowIndex: i, colIndex: j }); // Puedes inicializar los valores como desees
        }
        this.matriz.push(fila);
    }

    // Generar el array de columnas
    this.columnasArray = Array.from(Array(this.columnas).keys()).map(i => i + 1);

    // Inicializar los pesos con valores por defecto (puedes cambiarlo según necesites)
    this.pesos = Array.from(Array(this.columnas).keys()).map(i => 1);

    // Enfocar el primer campo de entrada después de generar la matriz
    if (this.inputElements.length > 0) {
        this.inputElements[0].nativeElement.focus();
    }
  }

  
  realizarCalculoTopsis(): void {
    // Extraer solo los valores numéricos de la matriz
    const raw_data = this.matriz.map(row => row.map(cell => cell.value));
    // Construir el objeto JSON con los datos recolectados
    const data = {
      weights: this.pesos,
      attributes: this.nombresFilasSuperior,
      candidates: this.nombresFilasIzquierda,
      raw_data: raw_data,
      benefit_attributes: [0, 0, 0, 0, 0] // Agregar el campo benefit_attributes
    };

    console.log('JSON enviado a la API:', data);
    console.log('JSON esperado por la API:', {
      "attributes": ["C1", "C2"],
      "candidates": ["A1", "A2"],
      "raw_data": [
        [1, 1],
        [9, 9]
      ],
      "weights": [1, 1],
      "benefit_attributes": [0, 0, 0, 0, 0]
    });
  

    // Realizar la solicitud POST a la API
    this.http.post<any>('http://127.0.0.1:7500/topsis', data).subscribe(
    (response) => {
      console.log('Respuesta de la API:', response);
      this.outputAPI = response.output;
      this.outputAPIHtml = this.sanitizer.bypassSecurityTrustHtml(this.outputAPI);
      this.dataService.setData(this.outputAPI);  // Guardar los datos en el servicio
      this.router.navigate(['/resultados']);  // Navegar a la página de resultados
    },
    (error) => {
      console.error('Error al realizar la solicitud:', error);
      // Manejar el error aquí (por ejemplo, mostrar un mensaje de error en la interfaz de usuario)

      // Capturar la salida del proceso si está disponible
      if (error.error && error.error.output) {
        console.error('Salida del proceso:', error.error.output);
      }
    }
  );
  }

  actualizarValor(event: Event, cell: Cell): void {
    const valor = (event.target as HTMLInputElement).value;
    const newValue = parseFloat(valor);
    if (!isNaN(newValue)) {
      cell.value = newValue;
    }
  }



}




