//import {VueRouter} from 'vue-router/types/router';

//import { useRouter } from 'vue-router';
import { api, configApi, endPoints } from 'src/boot/axios';
import { PropType } from 'vue';
import { getEmpresa, setLogo } from './LocalData';
import { showErrorEx } from './showAlerts';

/**
 * Espera el tiempo determinado y continua
 *
 * @param time - Tiempo a esperar en milisegundos
 *
 */
const Sleep = async (time: number) => {
  return new Promise((resolve) => setTimeout(resolve, time));
};

type Falsey = undefined | null;

/**
 * Convierte un dato a un valor booleano
 *
 * @param val - Valor a convertir
 *
 */
const parseBoolean = (val: string | boolean | number | Falsey): boolean => {
  const s = val && val.toString().toLowerCase().trim();
  if (s == 'true' || s == '1') return true;
  return false;
};

const nullType = <T>(data: T | null) => {
  return {
    type: null as unknown as PropType<T | null>,
    default: data,
    //validator: (v: any) => typeof v === typeof T || v === null,
  };
};



const emitKeyboard = (key: string) => {
  window.dispatchEvent(
    new KeyboardEvent('keydown', {
      key: key,
    })
  );
};

const getLogoDb=async()=>{
  let logo=null;
  const empresa=getEmpresa();
  if(empresa!==null && empresa!==''){
    await api.get(endPoints.EMPRESAS, configApi({queryParams: {nombre: empresa}}))
      .then(resp=>{
        if (resp.data.Empresa!==null) {
          logo=resp.data.Empresa.Logo;
        }
      })
      .catch(ex=>{
        console.log('get logo error');

        showErrorEx(ex);
      });

      setLogo(logo);
  }
  //logo='assets/Logos/'+logo;
}



const groupBy = (xs: any[], key: string | number):{key: string, values:any[]}[]=> {

  const resp:{'key': string, 'values': any[]}[]=[];
  //console.log(key);
  const obj=xs.reduce(function(rv: { [x: string]: any[] }, x: { [x: string]: string | number; }) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    //(rv[y['UbicacionP']] = rv[x['UbicacionP']] || []).push(x);
    return rv;
  }, {});
  //const newarr= Object.entries(obj);
  //console.log(obj);
  Object.entries(obj).forEach(([key, value]) => {
    resp.push({'key': key, 'values': value as any});
  });
  //console.log('resp group', resp);

  return resp;

};





// const logout = (from?: string) => {
//   //const router = useRouter();

//   //const routes = useRouter();
//   //const routes=router({store: null});

//   const empresa = getEmpresa();
//   const bodega = getBodega();
//   const serie = getSerie();
//   console.log(from + ' ', empresa, bodega, serie);
//   let ruta = '';
//   ruta = (empresa ? empresa : '') + '/' + (bodega ? bodega : '') + '/' + (serie ? serie : '');

//   console.log('go to', ruta);

//   //Router.push('/mypage')
//   //void routes.push(ruta);
// };


export {
  //logout,
  parseBoolean,
  nullType,
  Sleep,
  getLogoDb,
  emitKeyboard,
  groupBy,

};


