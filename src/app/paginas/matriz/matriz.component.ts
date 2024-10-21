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
  
  constructor(private http:HttpClient, private router: Router, private sanitizer: DomSanitizer, private dataService: DataService, private matrizStateService: DataService) {
    this.inputElements = [];
  }

  ngOnInit(): void {
    this.recuperarEstado();
    
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

    this.guardarEstado();

    // Enfocar el primer campo de entrada después de generar la matriz
    if (this.inputElements.length > 0) {
        this.inputElements[0].nativeElement.focus();
    }
  }

  agregarFila(): void {
    const nuevaFila: Cell[] = [];
    for (let j = 0; j < (this.columnas || 0); j++) {
      nuevaFila.push({ value: 0, rowIndex: this.matriz.length, colIndex: j });
    }
    this.matriz.push(nuevaFila);
    this.filas = this.matriz.length;

    // Agregar un nuevo nombre de fila
    this.nombresFilasIzquierda.push(`A${this.filas}`);

    this.guardarEstado();
  }

  agregarColumna(): void {
    this.matriz.forEach(fila => {
      fila.push({ value: 0, rowIndex: fila[0].rowIndex, colIndex: fila.length });
    });
    this.columnas = this.matriz[0].length;

    // Agregar un nuevo nombre de columna
    this.nombresFilasSuperior.push(`C${this.columnas}`);
    this.columnasArray = Array.from(Array(this.columnas).keys()).map(i => i + 1);

    // Agregar un peso por defecto para la nueva columna
    this.pesos.push(1);

    this.guardarEstado();
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
    this.http.post<any>('http://127.0.0.1:8000/topsis', data).subscribe(
    (response) => {
      console.log('Respuesta de la API:', response);
      this.outputAPI = response.result;
      this.outputAPIHtml = this.sanitizer.bypassSecurityTrustHtml(this.outputAPI);
      this.dataService.setData(this.outputAPI);  // Guardar los datos en el servicio
      this.router.navigate(['/resultados']);  // Navegar a la página de resultados
    },
    (error) => {
      console.error('Error al realizar la solicitud:', error);
      // Manejar el error aquí (por ejemplo, mostrar un mensaje de error en la interfaz de usuario)

      // Capturar la salida del proceso si está disponible
      if (error.error && error.error.result) {
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


  //Metodos para guardar el estado de la matriz una ves ingresado los datos que pone el usuario

  private guardarEstado(): void {
    this.matrizStateService.setFilas(this.filas);
    this.matrizStateService.setColumnas(this.columnas);
    this.matrizStateService.setMatriz(this.matriz);
    this.matrizStateService.setPesos(this.pesos);
    this.matrizStateService.setNombresFilasIzquierda(this.nombresFilasIzquierda);
    this.matrizStateService.setNombresFilasSuperior(this.nombresFilasSuperior);
  }

  private recuperarEstado(): void {
    this.filas = this.matrizStateService.getFilas();
    this.columnas = this.matrizStateService.getColumnas();
    this.matriz = this.matrizStateService.getMatriz();
    this.pesos = this.matrizStateService.getPesos();
    this.nombresFilasIzquierda = this.matrizStateService.getNombresFilasIzquierda();
    this.nombresFilasSuperior = this.matrizStateService.getNombresFilasSuperior();

    if (this.filas !== null && this.columnas !== null) {
      this.columnasArray = Array.from(Array(this.columnas).keys()).map(i => i + 1);
    }
  }

  exportToCSV(): void {
    // Convertir los datos de la matriz y los criterios en formato CSV
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Pesos," + this.pesos.join(",") + "\n";
    csvContent += "Criterios," + this.nombresFilasSuperior.join(",") + "\n"; // Agregar los nombres de los criterios
    csvContent += "Filas," + this.nombresFilasIzquierda.join(",") + "\n";
    this.matriz.forEach(row => {
      csvContent += row.map(cell => cell.value).join(",") + "\n";
    });
  
    // Crear un enlace temporal para descargar el archivo CSV
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "matriz.csv");
    document.body.appendChild(link);
  
    // Simular un clic en el enlace para iniciar la descarga
    link.click();
  }

  importFromCSV(event: any): void {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e: any) => {
        const contents = e.target.result;
        const lines = contents.split("\n").filter((line: string) => line.trim() !== ""); // Especificar el tipo de 'line'

        // Limpiar la matriz y los criterios actuales
        this.matriz = [];
        this.nombresFilasSuperior = [];
        this.nombresFilasIzquierda = [];
        this.pesos = [];

        // Leer los datos del archivo CSV
        lines.forEach((line: string, rowIndex: number) => {
            const cells = line.split(",");
            if (rowIndex === 0) {
                // Leer los pesos de la primera línea
                this.pesos = cells.slice(1).map(parseFloat);
            } else if (rowIndex === 1) {
                // Leer los nombres de los criterios de la segunda línea
                this.nombresFilasSuperior = cells.slice(1);
            } else if (rowIndex === 2) {
                // Leer los nombres de las filas de la tercera línea
                this.nombresFilasIzquierda = cells.slice(1);
            } else if (rowIndex >= 3 && cells.length > 1) {
                // Leer los valores de las celdas solo si hay más de una celda en la fila
                const row = cells.map((value: string, colIndex: number) => ({
                    value: parseFloat(value),
                    rowIndex: rowIndex - 3,
                    colIndex: colIndex
                }));
                this.matriz.push(row);
            }
        });

        // Actualizar el número de filas y columnas
        this.filas = this.matriz.length;
        this.columnas = this.matriz[0] ? this.matriz[0].length : 0;
        this.columnasArray = Array.from(Array(this.columnas).keys()).map(i => i + 1);

        // Guardar el estado actualizado
        this.guardarEstado();
    };

    // Leer el contenido del archivo CSV como texto
    reader.readAsText(file);
  }
  eliminarFila(): void {
    if (this.matriz.length > 1) {
      this.matriz.pop(); // Elimina la última fila
      this.nombresFilasIzquierda.pop(); // Elimina el nombre de la fila correspondiente
      
      this.filas = this.matriz.length; // Actualiza el número de filas
      this.guardarEstado();
    } else {
      console.log('No se pueden eliminar más filas.');
    }
  }
  
  eliminarColumna(): void {
    if (this.columnasArray.length > 1) {
      this.matriz.forEach(row => row.pop()); // Elimina la última celda de cada fila
      this.nombresFilasSuperior.pop(); // Elimina el nombre de la columna correspondiente
      this.columnasArray.pop(); // Elimina el índice de la columna correspondiente
      this.columnas = this.columnasArray.length; // Actualiza el número de columnas
      this.pesos.pop(); // Elimina el peso correspondiente a la columna eliminada
      this.guardarEstado();
    } else {
      console.log('No se pueden eliminar más columnas.');
    }
  }



}




