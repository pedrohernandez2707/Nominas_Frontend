<template>
  <q-page padding>

    <q-form
      @submit="onSubmit"
      class="q-gutter-md"
    >
      <div class="row justify-evenly">

        <div class="col-xs-1 col-md-1 q-pa-md">
          <q-input v-model="periodoActivo" type="text" disable label="Periodo Activo" />
        </div>

        <div class="col-xs-3 col-md-2">
          <q-input v-model="codigo" type="number" label="Código de Compra" disable/>
        </div>

        <div class="col-xs-9 col-md-4">
          <q-select class="col-xs-6 col-md-4" v-model="modelEmpleado" :options="optionsEmpleado" label="Empleado" filled />
        </div>

        <div class="col-xs-9 col-md-3">
          <q-btn class="q-pa-md" label='Crear Compra' type="submit" color="indigo" :disable='codigo !== null'/>
        </div>

        <div>
          <q-card>
            Total Q100.00
          </q-card>
        </div>

      </div>

    </q-form>


    <q-form 
      @submit="agregarDetalle"
      class="q-gutter-md q-pa-lg"
    >

       <div class="row justify-evenly">

         <div class="col-xs-9 col-md-5">
          <q-select 
          class="col-xs-12 col-sm-2" v-model="modelProducto" :options="optionsProducto" label="Producto" filled @update:model-value="val =>{setPrecio(val)}" />

        </div>

        <div class="col-xs-3 col-md-2">
          <q-input v-model="precio" type="text" label="Precio" disable/>
        </div>

        <div class="col-xs-3 col-md-2">
          <q-input v-model="cantidad" type="number" label="Cantidad"/>
        </div>

        <q-btn :disable="codigo == null" label="agregar" type="submit" color="green">
          <q-tooltip v-if="codigo == null" class="">Debe crear una compra primero!</q-tooltip>
        </q-btn>

       </div>

    </q-form>
   

    <div style="height: 500px;">

      <q-table
        class="full-height"
        title="Detalles"
        :rows="detalles"
        :columns="columns"
        :filter="filter"
        :pagination="{ rowsPerPage: 0 }"
      >

      <template v-slot:top-right>
        <q-input
          for="pos-buscar-detalles"
          borderless dense v-model="filter" placeholder="Buscar Detalles" clearable>
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
import { showAlert, showError, showErrorEx, showSucces } from 'src/helpers/showAlerts';
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';


const columns:QTableProps['columns']=[
  
  {
    name: 'Compra',
    label:'Compra',
    field:'codigo_compra',
    align: 'center'
  },
  {
    name:'Id_Empleado',
    label:'Id_Empleado',
    field:'id_empleado',
    align: 'center'
  },
  {
    name:'Nombre',
    label:'Nombre',
    field:'nombres',
    align: 'center'
  },
  {
    name: 'Id_Producto',
    label:'Id_Producto',
    field:'id_producto',
    align: 'center'
  },
  {
    name: 'Descripcion',
    label:'Descripcion',
    field:'descripcion',
    align: 'center'
  },
  {
    name: 'Cantidad',
    label:'Cantidad',
    field:'cantidad',
    align: 'center'
  },
  {
    name: 'Precio',
    label:'Precio',
    field:'precio',
    align: 'center'
  },
  {
    name: 'Subtotal',
    label:'Subtotal',
    field:'subtotal',
    align: 'center'
  }
]

export default defineComponent({
  name: 'UsuariosPage',
  setup(){

    const $q = useQuasar()

    const codigo=ref<number|null>(null);
    const precio=ref<string|null>(null);
    const cantidad=ref<number|null>(0);
    
    const filter = ref('')
    const detalles = ref<any[]>([]);

    const optionsProducto = ref([])
    const modelProducto = ref<any>(null)
     
    const optionsEmpleado = ref([])
    const modelEmpleado = ref<any>(null)

    const periodoActivo = ref<any|null>(null)


    const $router = useRouter()


    const setPrecio = (val)=>{
      precio.value = val.precio
    }


    const agregarDetalle = async()=>{

       let data={
        'compraId': codigo.value, 
        'productoId': modelProducto.value.value, 
        'cantidad': cantidad.value, 
        'precioUnitario': precio.value
      };

      $q.loading.show()

      await api.post(endPoints.COMPRA_DET,data).then(async(resp)=>{
        showSucces('Compra Creada', {timeout:3000});
        await getDetalles()
      }).catch((ex)=>{
        showErrorEx(ex)
      }).finally(()=>{
        $q.loading.hide()
      })


    }

    const getDetalles = async()=>{

      if(!codigo.value){
        return
      }

      let data = {
        'compraId': codigo.value
      };

      await api.post(endPoints.COMPRA_DET + '/id', data).then((resp)=>{
        detalles.value = resp.data
        console.log(resp.data);
        
      }).catch((ex)=>{
        showErrorEx(ex)
      })

    }

    const onSubmit=()=>{

      if(!modelEmpleado.value){
        showSucces('Alerta',{subtitulo:'Debe Seleccionar un Empleado!', tipo: 'warning'} )
        return
      }

      //var bods= bodega.value.map((val)=>parseInt(val.Codigo));
      let data={
        'idEmpleado': modelEmpleado.value.value,
        'idPeriodo': periodoActivo.value
      };


        api.post(endPoints.COMPRA_ENC, data)
        .then((resp)=>{
          showSucces('Compra Creada', {timeout:3000});
          codigo.value = resp.data.codigo_compra
        })
        .catch(ex=>{

          showErrorEx(ex, {mensaje: ex.response.data.mensaje})

        }).finally(()=>{
          $q.loading.hide()
        })
      
    }


  

    const getEmpleados = async()=>{
      await api.get(endPoints.EMPLEADOS + '/combo').then((resp)=>{

        optionsEmpleado.value = resp.data

      }).catch((ex)=>{
        showErrorEx(ex)
      })
    }

 


    const getProductos = async()=>{
      await api.get(endPoints.PRODUCTOS + '/combo').then((resp)=>{

        optionsProducto.value = resp.data

      }).catch((ex)=>{
        showErrorEx(ex)
      })
    }



    const getPeriodoActivo = async()=>{

      $q.loading.show()

      await api.get(endPoints.PERIODOS+ '/activo')
      .then((resp)=>{

        if(!resp.data[0]){
          showError('Error', {subtitulo:'No existe un Periodo Activo, debe aperturar el periodo', timeout:10000})
          $q.loading.hide()
          $router.back()
          return
        }
        
        periodoActivo.value = resp.data[0].id
    
      })
      .catch((ex)=>{

        showErrorEx(ex)
      }).finally(()=>{

        $q.loading.hide()
      })
    }



    return{
      onSubmit,
      detalles,
      columns,
      codigo,
      precio,
      cantidad,
      setPrecio,
      getProductos,
      getEmpleados,
      optionsEmpleado,
      optionsProducto,
      modelProducto,
      modelEmpleado,
      filter,
      agregarDetalle,
      periodoActivo,
      getPeriodoActivo
    }
  },
  created(){
    //void this.getUsuarios();
    void this.getPeriodoActivo();
    void this.getEmpleados();
    void this.getProductos();
  }
});
</script>
