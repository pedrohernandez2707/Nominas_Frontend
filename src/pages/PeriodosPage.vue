<template>
  <q-page padding>

    <q-form
      @submit="agregarPeriodo"
      class="q-gutter-md"
    >
      <div class="row">

        <div class="col-xs-4 col-md-4 q-pa-md">
          <q-select v-model="periodo" :options="periodos" label="Periodo" filled />
        </div>

        <div class="col-xs-4 col-md-4 q-pa-md">
          <q-select v-model="mes" :options="meses" label="Mes" filled />
        </div>

        <div class="col-xs-4 col-md- q-pa-md">
          <q-select v-model="año" :options="años" label="Año" filled />
        </div>
        
      </div>
      <div>
        <q-btn label="Activar" type="submit" color="primary"/>
      </div>
    </q-form>

    <div style="height: 500px;">
      <q-table
        class="full-height"
        title="Historial Periodos"
        :rows="periodosRows"
        :columns="columns"
        :filter="filter"
        :pagination="{ rowsPerPage: 0 }"
      >
       <template v-slot:body-cell-Accion="props">
          <q-td :props="props" class="q-pa-sm">
            <q-btn 
            outline size="sm" 
            :color="props.row.estado == 'A' ? 'positive' : 'indigo' "
            :icon="props.row.estado == 'A' ? 'task' : 'print' " 
            :label="props.row.estado == 'A' ? 'Generar' : '' "
            @click="generarNomina(props.row)">
          </q-btn>
          </q-td>
        </template>

        <template v-slot:top-right>
          <q-input
            borderless dense v-model="filter" placeholder="Buscar Periodos" clearable>
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
import { showAlertAsync, showError, showErrorEx, showSucces } from 'src/helpers/showAlerts';
import { defineComponent, ref } from 'vue';


const columns:QTableProps['columns']=[
  {
    name: 'Id',
    label:'Id',
    field:'id',
    align: 'center'
  },
  {
    name:'Periodo',
    label:'Periodo',
    field:'periodo',
    align: 'center'
  },
  {
    name:'Mes',
    label:'Mes',
    field:'mes',
    align: 'center'
  },
  {
    name: 'Año',
    label:'Año',
    field:'año',
    align: 'center'
  },
  {
    name: 'Estado',
    label:'Estado',
    field:'estado',
    align: 'center'
  },
  {
    name: 'Fecha Creacion',
    label:'Fecha Creacion',
    field:'fecha',
    align: 'center'
  },
  {
    name: 'Accion',
    label:'Accion',
    field:'Accion',
    align: 'center'
  }
]

export default defineComponent({
  name: 'UsuariosPage',
  setup(){

    const $q = useQuasar()
    const mes = ref<any|null>(null)

    const periodo = ref<any|null>(null)

    const periodos = ref([
      { value: 1, label: 'Primera Quincena' },
      { value: 2, label: 'Segunda Quincena' },
      { value: 3, label: 'Bono 14' },
      { value: 4, label: 'Aguinaldo' },
      { value: 5, label: 'Otros' },
    ])

    const meses = ref([
      { value: 1, label: 'Enero' },
      { value: 2, label: 'Febrero' },
      { value: 3, label: 'Marzo' },
      { value: 4, label: 'Abril' },
      { value: 5, label: 'Mayo' },
      { value: 6, label: 'Junio' },
      { value: 7, label: 'Julio' },
      { value: 8, label: 'Agosto' },
      { value: 9, label: 'Septiembre' },
      { value: 10, label: 'Octubre' },
      { value: 11, label: 'Noviembre' },
      { value: 12, label: 'Diciembre' },
    ])

    const filter = ref('');

    const año = ref<any|null>(null)

    const años = ref([
      {value: 2022, label: '2022'},
      {value: 2023, label: '2023'},
      {value: 2024, label: '2024'},
      {value: 2025, label: '2025'},
      {value: 2026, label: '2026'},
      {value: 2027, label: '2027'},
      {value: 2028, label: '2028'}
    ])

    const periodosRows = ref<any[]>([]);

    const getPeriodos = async()=>{

      $q.loading.show()

      await api.get(endPoints.PERIODOS)
      .then((resp)=>{
        
        periodosRows.value = resp.data;
    
      })
      .catch((ex)=>{

        showErrorEx(ex)

      }).finally(()=>{

        $q.loading.hide()

      })
    }

    const agregarPeriodo = async()=>{

      if(!mes.value || !año.value || !periodo.value){
        showError('Debe Seleccionar todos los campos')
        return
      }

      const conf = await showAlertAsync('Confirmacion', 'Desea Agregar el Periodo Activo?', {})

      if(!conf) return

      const data = {
        mes: mes.value.value,
        anio: año.value.value,
        periodo: periodo.value.value
      }

      $q.loading.show()

      const resp = await api.post(endPoints.PERIODOS, data)
      .then(async(resp)=>{

        if (resp.status === 200){
          await getPeriodos()
          showSucces('Agregado Correctamente')
        }

      }).catch((ex)=>{
        showErrorEx(ex)
      })

      $q.loading.hide()

    }

    const generarNomina = ()=>{

    }

    return{
      generarNomina,
      getPeriodos,
      periodosRows,
      columns,
      meses,
      mes,
      periodo,
      periodos,
      filter,
      año,
      años,
      agregarPeriodo
    }
  },
  created(){
    void this.getPeriodos();
  }
});
</script>
