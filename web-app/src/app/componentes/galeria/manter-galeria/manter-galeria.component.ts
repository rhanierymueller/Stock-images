import { Component, OnInit } from '@angular/core';
import { GaleriaService } from '../../../servicos/galeria/galeria.service';
import { ConfigClass } from '../../../classes/config-class';
import { FormBuilder } from '@angular/forms';
import { FormGroup, FormControl} from '@angular/forms';


@Component({
  selector: 'app-manter-galeria',
  templateUrl: './manter-galeria.component.html',
  styleUrls: ['./manter-galeria.component.css']
})
export class ManterGaleriaComponent implements OnInit {

  exibirListagemForm: boolean = false;
  listImgGaleria: any;
  mensagem: any;
  galeriaFormGroup: any;
  imagemUrl: any;
  registro: any = {};

  server: String = ConfigClass.getUrlApi().toString();

  constructor(private galeriaService: GaleriaService, private formBuilder :FormBuilder) { 
  }

  ngOnInit() {
    this.galeriaFormGroup = this.formBuilder.group({
        id_galeria: [],
        titulo: [],
        dados_imagem: null
    })

    this.listar()
   
  }

  prepararFormsCadastro() {
    this.limparMsgAlert();
    this.exibirListagemForm = true;
  }

  deletar(id: number): void {
    console.log('deletar id: ', id);
    this.galeriaService.deletar(id).subscribe(resp => {
      if (!this.verificarRetornoHttp(resp)) {
        this.listar();
      }
    })
  }

  onSubmit() {
    console.log('salvando dados...');
    console.log(this.galeriaFormGroup.value);
    console.log(this.galeriaFormGroup);

    //verificar a operação
    if (this.registro.id_galeria) {
      this.editar(this.galeriaFormGroup.value);
    } else {
      this.cadastrar(this.galeriaFormGroup.value);
    }
  }

  editar(dados: any) {
    this.galeriaService.editar(dados).subscribe(resp => {
      if (!this.verificarRetornoHttp(resp)) {
        this.limparForm();
        this.listar();
        this.exibirListagemForm = false;
      }
    });
  }

  cadastrar(dados: any) {
    this.galeriaService.cadastrar(dados).subscribe(resp => {
      if (!this.verificarRetornoHttp(resp)) {
        this.limparForm();
        this.listar();
        this.exibirListagemForm = false;
      }
    });
  }

  prepararFormEditar(id: number): void{
    console.log('id', id);
    this.exibirListagemForm = true;
    this.galeriaService.getId(id).subscribe(resp => {
      if (!this.verificarRetornoHttp(resp)) {
       this.registro.id_galeria = resp.body?.dados[0].id_galeria;
       this.registro.titulo = resp.body?.dados[0].titulo;
       if (resp.body?.dados[0].caminho != null) {
        this.imagemUrl = this.server + resp.body.dados[0].caminho.substring(1);
        console.log('img', this.server + resp.body.dados[0].caminho.substring(1));
       }
      }
    })
  }

  cancelarOperacao() {
    this.limparForm();
    this.exibirListagemForm = false;
  }

  limparForm() {
    this.galeriaFormGroup.reset();
    let formHTML = <HTMLFormElement>document.getElementById('galeriaForm');
    formHTML.reset();
    this.imagemUrl = null;
  }

  carregarImagem(event: any){
      console.log('Carrengando uma imagem');
      //Verificar se a imagem foi selecionada

      if (event.target.files.length) {
        let campoUploadImagem = event.target;
        const leitor = new FileReader();
        const arquivo = campoUploadImagem.files[0];
        leitor.readAsDataURL(arquivo);
        leitor.onload = () => {
          const dataUrl = leitor.result;
          this.imagemUrl = dataUrl;
          console.log("Dados img: ", this.imagemUrl);

          this.galeriaFormGroup.get('dados_imagem').setValue({
            nome_arquivo: arquivo.name,
            tipo_arquivo: arquivo.type,
            imagem_base64: (<string>leitor.result).split(',')[1]
          });
          console.log('dados cad: ', this.galeriaFormGroup.value);
        }
      }
  }

  verificarRetornoHttp(resp: any) {
    if (resp.status >= 400) {
      this.exibirMsgAlert("Erro ao realizar a requisição", "erro");
      return true;
    } else{
      if (resp.body.erro) {
        this.exibirMsgAlert(resp.body.msg, "erro");
        return true;
      } else {
        if (resp.body.msg != null) {
        this.exibirMsgAlert(resp.body.msg, "sucesso");
        return false;
        }
      }
    }
    return false;
  }

  exibirMsgAlert(msg: string, tipo: string) {
    let dados = "";
    if (tipo == "sucesso"){
      dados = `<div class='alert alert-success' role='alert'>
      <strong>${msg}</strong>
      </div>`
    }else if(tipo == "erro") {
      dados = `<div class='alert alert-danger' role='alert'>
      <strong>${msg}</strong>
      </div>`
    }

    this.mensagem = dados;
  }

  limparMsgAlert() {
    this.mensagem = "";
  }

  listar(): void {
    this.galeriaService.getTodos().subscribe(resp => {

      if (!this.verificarRetornoHttp(resp)){
        this.listImgGaleria = resp.body?.dados.map(function(this: any, obj: any ){
          return {id_galeria: obj.id_galeria,
                  titulo: obj.titulo,
                  caminho: this + (obj.caminho ? obj.caminho.substring(1) :obj.caminho ) 
          }
        }, this.server);
        console.log('resposta:', resp);
        console.log('resposta:', this.listImgGaleria);
      }

    });
  }

}
