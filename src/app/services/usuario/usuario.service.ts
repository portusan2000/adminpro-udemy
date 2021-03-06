import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../../models/usuario.model';
import { URL_SERVICIOS } from '../../config/config';
import { map } from 'rxjs/operators';
import swal from 'sweetalert';
import { Router } from '@angular/router';
import { SubirArchivoService } from '../subir-archivo/subir-archivo.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  usuario: Usuario;
  token: string;

  constructor(
    public http: HttpClient, 
    public router: Router,
    public _subirArchivoService: SubirArchivoService) { this.cargarStorage() }

  estaLogueado() {
    return  (this.token.length > 5) ? true: false;
  }

  cargarStorage() {
    if (localStorage.getItem('token')) {
      this.usuario = JSON.parse(localStorage.getItem('usuario'));
      this.token = localStorage.getItem('token');
    } else {
      this.token = '';
      this.usuario = null;
    }
  }

  guardarStorage( id: string, token: string, usuario: Usuario) {
    localStorage.setItem('id', id);
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));

    this.usuario = usuario;
    this.token = token;
  }

  logout() {
    this.usuario = null;
    this.token = '';

    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    this.router.navigate(['/login']);
  }

  loginGoogle( token: string ) {
    let url = URL_SERVICIOS + '/login/google';
    return this.http.post(url, {token: token})
                    .pipe(map( (resp: any) => {
                      this.guardarStorage(resp.id, resp.token, resp.usuario);
                      return true;
                    }))
  }

  login(usuario: Usuario, recordar: boolean = false) {
    if(recordar){
      localStorage.setItem('email', usuario.email);
    } else {
      localStorage.getItem('email');
    }

    let url = URL_SERVICIOS + '/login';
    return this.http.post(url, usuario).pipe(map((resp: any) => {
      this.guardarStorage(resp.id, resp.token, resp.usuario);
      return true;
    }))
  }

  crearUsuario(usuario: Usuario) {
    let url = URL_SERVICIOS + '/usuario';
    return this.http.post(url, usuario)
      .pipe(map((resp: any) => {
        swal('Usuario creado', usuario.email, "success")
      })
      )
  }

  actualizarUsuario(usuario: Usuario) {
    let url = URL_SERVICIOS + '/usuario/' + usuario._id;
    url += '?token=' + this.token;
    console.log(url)
    return this.http.put(url, usuario)
      .pipe(map( (resp: any) => {

        // this.usuario = resp.usuario;
        let usuarioDB: Usuario = resp.usuario;

        this.guardarStorage(usuarioDB._id, this.token, usuarioDB);
        swal('Usuario actualizado', usuario.nombre, 'success');
          
        return true
      }))
  }

  cambiarImagen(archivo: File, id: string) {
    
    this._subirArchivoService.subirArchivo(archivo, 'usuarios', id)
        .then( (resp: any) => {

          this.usuario.img = resp.usuario.img;
          swal('Imagen Actualizada', this.usuario.nombre, 'success');
          
          this.guardarStorage( id, this.token, this.usuario);

        })
        .catch( resp => {
          console.log(resp);
        })
  }

}
