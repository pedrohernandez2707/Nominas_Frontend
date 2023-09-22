<template>
  <q-page padding>

    <q-form
      @submit="onSubmit"
      class="q-gutter-md"
      @reset="clear"
    >
      <div class="row">
        <div class="col-xs-3 col-md-2">
          <q-input v-model="codigo" type="number" label="Código" disable/>
        </div>
        <div class="col-xs-9 col-md-5">
          <q-input v-model="descripcion" type="text" label="Descripcion"
            counter
          />
        </div>

        <div class="col-xs-9 col-md-5">
          <q-input v-model="precio" type="text" label="Precio"
            counter
          />
        </div>

         <div class="col-xs-9 col-md-5">
          <q-input v-model="fecha" type="text" label="Fecha Creacion"
            counter
            disable
          />
        </div>
      <!-- </div> -->
      <!-- <div class="row"> -->
      
      <!-- </div> -->
      <!-- <div class="row"> -->
    
      </div>
      <div>
        <q-btn :label=" codigo === null ? 'Guardar' : 'Actualizar'" type="submit" color="primary"/>
        <q-btn label="Limpiar" type="reset" color="primary" flat class="q-ml-sm" />
      </div>
    </q-form>

    <div style="height: 500px;">
      <q-table
        class="full-height"
        title="Usuarios"
        :rows="usuarios"
        :columns="columns"
        :filter="filter"
        :pagination="{ rowsPerPage: 0 }"
        @row-click="selectUsuario"
      >
      <template v-slot:top-right>
              <q-input
                for="pos-buscar-detalles"
                borderless dense v-model="filter" placeholder="Buscar Usuarios" clearable>
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
            </template>
      </q-table>
    </div>
  </q-page>
</template>

<script lang="ts">
import { QTableProps, useQuasar } from 'quasar';
import { api, endPoints } from 'src/boot/axios';
import { showErrorEx, showSucces } from 'src/helpers/showAlerts';
import { defineComponent, ref } from 'vue';


const columns:QTableProps['columns']=[
  {
    name: 'Codigo',
    label:'Código',
    field:'id_producto',
    align: 'center'
  },
  {
    name:'Descripcion',
    label:'Descripcion',
    field:'descripcion',
    align: 'center'
  },
  {
    name:'Precio',
    label:'Precio',
    field:'precio',
    align: 'center'
  },
  {
    name: 'Fecha Creacion',
    label:'Fecha Creacion',
    field:'fecha',
    align: 'center'
  }
]

export default defineComponent({
  name: 'UsuariosPage',
  setup(){

    const $q = useQuasar()

    const codigo=ref<number|null>(null);
    const descripcion=ref<string|null>(null);
    const precio=ref<string|null>(null);
    const fecha=ref<string|null>(null);
    //const estado=ref(true);
    //const pass=ref('');
    //const roles=ref(['Administrador','Usuario','Colaborador']);
    //const rol=ref('Usuario');

    const filter = ref('');

    const usuarios = ref<any[]>([]);

    const getProductos = async()=>{

      $q.loading.show({
          delay: 400 // ms
      })

      await api.get(endPoints.PRODUCTOS)
      .then((resp)=>{
        usuarios.value=resp.data;
        //console.log(resp.data);
        
        //options.value=vendedores;
      })
      .catch((ex)=>{
        showErrorEx(ex, {mensaje: ex.response.data.mensaje})
      }).finally(()=>{
        $q.loading.hide()
      })
    }


    const onSubmit=()=>{

      //var bods= bodega.value.map((val)=>parseInt(val.Codigo));
      let data={
        'id':codigo.value ,
        'descripcion': descripcion.value,
        'precio': precio.value,
        //'email': email.value,
        //'activo': estado.value,
        //'contraseña': pass.value ,
        //'rol': rol.value,
        //'Bodegas': bods,
      };

      if(codigo.value === null){

        $q.loading.show()

        api.post(endPoints.PRODUCTOS, data)
        .then(async(resp)=>{
          showSucces('Producto guardado');
          clear();
          await getProductos();
        })
        .catch(ex=>{

          showErrorEx(ex, {mensaje: ex.response.data.mensaje})


        }).finally(()=>{
          $q.loading.hide()
        })
      }else{

        $q.loading.show()
        
         api.put(endPoints.PRODUCTOS, data)
        .then(async(resp)=>{
          showSucces('Producto guardado');
          clear();
          await getProductos();
        })
        .catch(ex=>{

          showErrorEx(ex, {mensaje: ex.response.data.mensaje})
        
        }).finally(()=>{
          $q.loading.hide()
        })

      }
      
    }

    const selectUsuario=(ev,row, index)=>{
      
      codigo.value = row.id_producto;
      descripcion.value = row.descripcion;
      precio.value = row.precio
      fecha.value = row.fecha
      // estado.value = row.activo;
      // pass.value = row.contraseña;
      // rol.value = row.rol;
      // email.value = row.email;
    }

    // const findVend=()=>{
    //   return
    //   if (codigo.value!==null && codigo.value!.toString()!=='') {
    //     var vend= usuarios.value.find(val=>val.Codigo==codigo.value);
    //     if (vend!==undefined) {

    //       codigo.value=vend.Codigo;
    //       nombre.value=vend.Nombre;
    //       estado.value=vend.Estado=='A'?true:false;
    //       pass.value=vend.Referencia;
    //       rol.value=vend.Tipo;
    //       //bodega.value=vend.Bodegas;
    //       return;
    //     }
    //   }
    //   clear();
    // }

    const clear=()=>{
      
      codigo.value=null;
      descripcion.value='';
      precio.value='';
      //email.value='';
      //estado.value=true;
      //pass.value='';
      //rol.value='Usuario';
      //bodega.value=[];
    }


    return{
      getProductos,
      onSubmit,
      selectUsuario,
      //findVend,
      clear,
      usuarios,
      columns,
      codigo,
      descripcion,
      precio,
      //bodegas,
      //bodega,
      filter,
      fecha
    }
  },
  created(){
    void this.getProductos();
  }
});
</script>
