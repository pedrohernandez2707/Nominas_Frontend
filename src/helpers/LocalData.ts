import { SessionStorage, LocalStorage } from 'quasar';
import { api, endPoints } from 'src/boot/axios';
//import { useUserStore } from 'src/stores/User';
import { getLogoDb, parseBoolean } from './helpers';
import { Platform } from 'quasar'


function setSession(page:string) {
  LocalStorage.set('First-Time-'+page, true);
}

function getSession(page:string) {
  //return true;
  const dato = LocalStorage.getItem('First-Time-'+page)?.toString();
  if (dato !== undefined) {
    return parseBoolean(dato.toString());
  } else {
    return null;
  }
  //return SessionStorage.getItem('SERIE');
}

function clearSession(reload=false){
  const local= LocalStorage.getAllKeys();

  local.forEach(key => {
    if (key.includes('First-Time')) {
      LocalStorage.remove(key)
    }
  });

  if (reload) {
    location.reload();

  }
}


function setEmpresa(empresa: string) {
  LocalStorage.set('EMPRESA', empresa);
  void getLogoDb();
}
function getEmpresa() {
  const dato = LocalStorage.getItem('EMPRESA')?.toString();
  if (dato !== undefined) {
    return dato.toString();
  } else {
    return null;
  }
}

function setLogo(logo: string|null) {
  if (logo===null) {
    LocalStorage.remove('LOGO')
  }
  else{
    LocalStorage.set('LOGO', logo);
  }
}

function getLogo() {
  const dato = LocalStorage.getItem('LOGO')?.toString();
  if (dato !== undefined) {
    //console.log(dato);
    return dato.toString();
  } else {
    //return 'no-image-available.png';
    return null;
  }
}

function setUsuario(usuario: string) {

  SessionStorage.set('USER', usuario);
}
function getUsuario(from?: string) {

  const dato = SessionStorage.getItem('USER')?.toString();
  if (dato !== undefined) {
    return dato.toString();
  } else {
    return null;
  }
  //return SessionStorage.getItem('USER');
}
function removeUsuario() {
  SessionStorage.remove('USER');
}


function setUsuarioAdmin(usuario: string) {

  SessionStorage.set('USERADMIN', usuario);
}
function getUsuarioAdmin(from?: string) {

  const dato = SessionStorage.getItem('USERADMIN')?.toString();
  if (dato !== undefined) {
    return dato.toString();
  } else {
    return null;
  }
  //return SessionStorage.getItem('USER');
}
function removeUsuarioAdmin() {
  SessionStorage.remove('USERADMIN');
}

function setToken(token: string) {
  SessionStorage.set('TOKEN', token);
  //const us= mapStores(useUserStore).userStore();
  //const us=useUserStore();

  //us.token=token;

}
function getToken() {
  const token = SessionStorage.getItem('TOKEN')?.toString();
  if (token !== undefined) {
    return token.toString();
  } else {
    return null;
  }
}
function removeToken() {
  SessionStorage.remove('TOKEN');
}
async function validarToken() {
  //let conf = configApi2;
  //conf.headers.Authorization = getToken() !== null ? getToken() : "";
  let resp = false;
  await api
    .get(endPoints.EMPRESAS)
    .then(() => {
      resp = true;
    })
    .catch((ex) => {
      console.log(ex);
      resp = false;
    });
  return resp;
}


const getlLocalServer='http://localhost:8001/';

const felUuidServer='https://report.feel.com.gt/ingfacereport/ingfacereport_documento?uuid='

const urlWhatsapp='https://wa.me/'



export {
  getSession,
  setSession,
  clearSession,
  getEmpresa,
  setEmpresa,
  getLogo,
  setLogo,
  getUsuario,
  setUsuario,
  removeUsuario,
  getUsuarioAdmin,
  setUsuarioAdmin,
  removeUsuarioAdmin,
  getToken,
  setToken,
  removeToken,
  validarToken,
  getlLocalServer,
  felUuidServer
};


