import { Component, OnInit } from '@angular/core';
import { ConfigClass } from '../../../classes/config-class';
import { GaleriaService } from '../../../servicos/galeria/galeria.service';



@Component({
  selector: 'app-home-carousel',
  templateUrl: './home-carousel.component.html',
  styleUrls: ['./home-carousel.component.css']
})
export class HomeCarouselComponent implements OnInit {

  listImgGaleria: any;
  server: String = ConfigClass.getUrlApi().toString();



  constructor(private galeriaService: GaleriaService) { }

  ngOnInit() {
    this.galeriaService.getTodos().subscribe(resp => {
      this.listImgGaleria = resp.body?.dados.map(function(this: any, obj: any ){
        return {id_galeria: obj.id_galeria,
                titulo: obj.titulo,
                caminho: this + (obj.caminho ? obj.caminho.substring(1) :obj.caminho ) 
        }
      }, this.server);
    });

    console.log("dados:", this.listImgGaleria);
  }

}
