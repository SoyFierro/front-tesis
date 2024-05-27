import { Injectable, OnInit } from '@angular/core';

interface Cell {
  value: number;
  rowIndex: number;
  colIndex: number;
}

@Injectable({
  providedIn: 'root'
})

export class DataService {

  constructor() { }
  private filas: number | null = null;
  private columnas: number | null = null;
  private matriz: Cell[][] = [];
  private pesos: number[] = [];
  private nombresFilasIzquierda: string[] = [];
  private nombresFilasSuperior: string[] = [];

  setFilas(filas: number | null): void {
    this.filas = filas;
  }

  getFilas(): number | null {
    return this.filas;
  }

  setColumnas(columnas: number | null): void {
    this.columnas = columnas;
  }

  getColumnas(): number | null {
    return this.columnas;
  }

  setMatriz(matriz: Cell[][]): void {
    this.matriz = matriz;
  }

  getMatriz(): Cell[][] {
    return this.matriz;
  }

  setPesos(pesos: number[]): void {
    this.pesos = pesos;
  }

  getPesos(): number[] {
    return this.pesos;
  }

  setNombresFilasIzquierda(nombres: string[]): void {
    this.nombresFilasIzquierda = nombres;
  }

  getNombresFilasIzquierda(): string[] {
    return this.nombresFilasIzquierda;
  }

  setNombresFilasSuperior(nombres: string[]): void {
    this.nombresFilasSuperior = nombres;
  }

  getNombresFilasSuperior(): string[] {
    return this.nombresFilasSuperior;
  }
  







  

  private data: any;

  setData(data: any) {
    this.data = data;
  }

  getData() {
    return this.data;
  }
}
