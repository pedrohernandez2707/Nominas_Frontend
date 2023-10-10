<template>
  <q-page padding>

    <q-form
      @submit="agregarBonificacion"
      class="q-gutter-md"
    >
      <div class="row">

        <div class="col-xs-4 col-md-4 q-pa-md">
          <q-input v-model="periodoActivo" type="text" disable label="Id Periodo" />
        </div>

        <div class="col-xs-4 col-md-4 q-pa-md">
          <q-select v-model="modelEmpleado" :options="optionsEmpleado" label="Seleccione Empleado" filled @update:model-value="val =>{getBonificacionEmpleado(val)}"/>
        </div>

        <div class="col-xs-4 col-md-4 q-pa-md">
          <q-input clearable v-model="piezas" type="number" label="Ingrese Total de Piezas Elaboradas" />
        </div>
        
      </div>
      <div>
        <q-btn label="Agregar" type="submit" color="primary"/>
      </div>
    </q-form>

    <div style="height: 500px;">

      <q-table
        class="full-height"
        title="Comisiones Empleado"
        :rows="bonificacionEmpleadoRows"
        :columns="columns"
        :filter="filter"
        :pagination="{ rowsPerPage: 0 }"
      >  
      <template v-slot:body-cell-Eliminar="props">
          <q-td :props="props" class="q-pa-sm">
            <q-btn 
            outline size="sm" 
            color='red'
            icon='delete'
            label='Eliminar'
            @click="bajaBonificacion(props.row)">
          </q-btn>
          </q-td>
        </template>
      </q-table>

    </div>

  </q-page>
</template>

<script lang="ts">
import { QTableProps, useQuasar } from 'quasar';
import { api, endPoints } from 'src/boot/axios';
import { showAlertAsync, showError, showErrorEx, showSucces } from 'src/helpers/showAlerts';
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';


const columns:QTableProps['columns']=[
  {
    name: 'IdPeriodo',
    label:'Id Periodo',
    field:'id_periodo',
    align: 'center'
  },
  {
    name:'IdEmpleado',
    label:'Id Empleado',
    field:'id_empleado',
    align: 'center'
  },
  {
    name:'Bonificacion',
    label:'Bonificacion',
    field:'bonificacion',
    align: 'center'
  },
  {
    name: 'Eliminar',
    label:'Eliminar',
    field:'Eliminar',
    align: 'center'
  },
]

export default defineComponent({
  name: 'ComisionesPage',
  setup(){

    const $q = useQuasar()
    const $router = useRouter()
    const periodoActivo = ref<any|null>(null)
    const filter = ref('');

    const bonificacionEmpleadoRows = ref<any[]>([]);

    const optionsEmpleado = ref([])
    const modelEmpleado = ref<any>(null)

    const piezas = ref(null)


    const getEmpleados = async()=>{
      await api.get(endPoints.BONIFICACIONES + '/empleado').then((resp)=>{

        optionsEmpleado.value = resp.data

      }).catch((ex)=>{
        showErrorEx(ex)
      })
    }

    const getBonificacionEmpleado = async(val)=>{

      const idEmpleado = val.value

       $q.loading.show()

      await api.get(endPoints.BONIFICACIONES, {params:{
        'idEmpleado': idEmpleado,
        'idPeriodo' : periodoActivo.value
      }})
      .then((resp)=>{
        
        bonificacionEmpleadoRows.value = resp.data
    
      })
      .catch((ex)=>{

        showErrorEx(ex)
      }).finally(()=>{

        $q.loading.hide()
      })
      
    }


    const bajaBonificacion = async(val)=>{

      const conf = await showAlertAsync('Confirmacion', 'Esta seguro de Eliminar?', {})

      if(!conf) return

      const idEmpleado = val.id_empleado

       $q.loading.show()

      await api.delete(endPoints.BONIFICACIONES, {params:{
        'idEmpleado': idEmpleado,
        'idPeriodo' : periodoActivo.value
      }})
      .then(async(resp)=>{
        
        await getBonificacionEmpleado({value: idEmpleado})
        showSucces('Proceso Correcto')
      })
      .catch((ex)=>{

        showErrorEx(ex)
      }).finally(()=>{

        $q.loading.hide()
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
        
        periodoActivo.value = resp.data[0].periodo
    
      })
      .catch((ex)=>{

        showErrorEx(ex)
      }).finally(()=>{

        $q.loading.hide()
      })
    }

    const agregarBonificacion = async()=>{

      if(!periodoActivo.value || !piezas.value || !modelEmpleado.value){
        showError('Debe Seleccionar todos los campos')
        return
      }

      const conf = await showAlertAsync('Confirmacion', 'Desea Agregar la bonificacion al Empleado?', {})

      if(!conf) return

      const data = {
        idPeriodo: periodoActivo.value,
        piezas: piezas.value,
        idEmpleado: modelEmpleado.value.value
      }

      $q.loading.show()

      const resp = await api.post(endPoints.BONIFICACIONES, data)
      .then(async(resp)=>{

        if (resp.status === 200){
          showSucces('Agregado Correctamente')
          await getBonificacionEmpleado({value: data.idEmpleado})
          piezas.value = null
        }

      }).catch((ex)=>{
        showErrorEx(ex)
      })

      $q.loading.hide()

    }


    return{
      getPeriodoActivo,
      bonificacionEmpleadoRows,
      columns,
      periodoActivo,
      filter,
      agregarBonificacion,
      getEmpleados,
      modelEmpleado,
      optionsEmpleado,
      piezas,
      getBonificacionEmpleado,
      bajaBonificacion
    }
  },
  created(){
    void this.getPeriodoActivo();
    void this.getEmpleados();
  }
});
</script>
