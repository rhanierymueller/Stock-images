import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

//Importação do service
import { HttpClientModule } from '@angular/common/http';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeCarouselComponent } from './componentes/home/home-carousel/home-carousel.component';
import { ManterGaleriaComponent } from './componentes/galeria/manter-galeria/manter-galeria.component';

import { GaleriaService } from './servicos/galeria/galeria.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule} from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [
    AppComponent,
    HomeCarouselComponent,
    ManterGaleriaComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule
  ],
  providers: [GaleriaService],
  bootstrap: [AppComponent]
})

export class AppModule { }
