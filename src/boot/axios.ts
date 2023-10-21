import { boot } from 'quasar/wrappers';
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { ref } from 'vue';
//import { getToken, removeToken, removeUsuario } from 'src/helpers/LocalData';
import { showError } from 'src/helpers/showAlerts';
import { getToken, removeToken } from '../helpers/token'
import { useRouter } from 'vue-router';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
    $api: AxiosInstance;
  }
}


const urlFront = ref('http')

const url = ref('https://seminario-nominas-production.up.railway.app')


if (process.env.DEV){
  url.value = 'http://localhost:3000'
}

const api = axios.create({ baseURL: url.value });
const wsURL=api.defaults.baseURL?.replace('http://','').replace('https://','');

api.interceptors.request.use((config)=>{
  //console.log(config);

  if (config.params===undefined) {
    config.params={};
  }

  const data = getToken()
  
  //'Content-Type': 'application/json',
  config.headers = {
    'Content-Type': 'application/json',
    'Authorization': data.storedToken !== null ?  data.storedToken : '',
  } as any
  //console.log('inter ', config);
  //console.log(config)

  return config;
}, (error)=>{
  console.log('inter err', error);

  return Promise.reject(error);
});


api.interceptors.response.use(resp => {
  return resp;
}, async (error)=>{
  const $router = useRouter()

  if (error.response && error.response.status === 401) {
    //const router = getRouter();
    removeToken();
    showError('Sesión vencida, por favor ingrese sus credenciales nuevamente');
    void $router.push('/')
    return Promise.reject(null);
  }
  return Promise.reject(error);
});



export default boot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios;
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api;
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
});


interface dataconfig {
  empresa?: string|null;
  serie?: string | null;
  datos?: any | null;
  queryParams?: any | null;
}


function configApi(
  {
    empresa= null,
    serie = null,
    datos = {},
    queryParams = {},
  }: dataconfig = {
    empresa:null,
    serie: null,
    datos: {},
    queryParams: {},
  }
) {
  const params: { [k: string]: unknown } = {};
  params['serie'] = serie;
  params['empresa'] = empresa;

  Object.entries(queryParams).forEach(([key, value]) => {
    if (value === undefined || value === null) {
      value = '';
    }
    params[key] = value;
  });

  //const datap = JSON.stringify(['t','f']);
  const conf: AxiosRequestConfig = {
    params: params,
    data:datos,

  };

  return conf;
}


enum endPoints {
  EMPRESAS       = 'api/empresas',
  LOGIN          = 'api/login',
  USUARIOS       = 'api/usuarios',
  EMPLEADOS      = 'api/empleados',
  PRODUCTOS      = 'api/productos',
  COMPRA_ENC     = 'api/compraEnc',
  COMPRA_DET     = 'api/compraDet',
  PUESTOS        = 'api/puestos',
  PERIODOS       = 'api/periodos',
  HORAS          = 'api/horas',
  COMISIONES     = 'api/comisiones',
  BONIFICACIONES = 'api/bonificaciones',
  REPORTE_DIAS   = 'api/dias',
  APORTES        = 'api/aportes',
  NOMINA        = 'api/nomina',
}

export { api, urlFront, endPoints, wsURL, configApi };
