import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {ProductoInterface} from '../interfaces/producto.interface';
import { reject } from 'q';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  cargando = true;

  productos: ProductoInterface[] = [];

  productosFiltrados: ProductoInterface[] = [];

  constructor(private http: HttpClient) {

    this.cargarProductos();
   }

   private cargarProductos() {

    return new Promise((resolve, reject ) => {

    this.http.get('https://angular-html-64eaa.firebaseio.com/productos_idx.json')
    .subscribe((resp: ProductoInterface[]) => {
            
      this.productos = resp;
      this.cargando = false;
      resolve();
      /*Si quiero ponerle un tiempo de espera adicional
      
      setTimeout(() => {

        this.cargando = false;

      }, 2000);*/
    });

    });

  }

  getProducto(id: string) {

    return this.http.get(`https://angular-html-64eaa.firebaseio.com/productos/${ id }.json`);

  }

  buscarProducto(termino: string) {

    if (this.productos.length === 0){

      //Cargar productos

      this.cargarProductos().then( () => {

        //Ejecutar despues de tener los productos

        //Aplicar filtro

        this.filtrarProductos( termino );

      } );
    } else {
      //Tenemos los datos, aplicamos filtro

      this.filtrarProductos( termino );

    }
  }

  private filtrarProductos(termino: string) {

    console.log(this.productos);
    this.productosFiltrados = [];

    termino = termino.toLocaleLowerCase();

    this.productos.forEach( prod => {

      const tituloLower = prod.titulo.toLocaleLowerCase();

      if ( prod.categoria.indexOf(termino) >= 0 || tituloLower.indexOf(termino) >= 0 ) {

        this.productosFiltrados.push( prod );

      }
    });

  }
}
