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
          <q-select v-model="mes" :options="meses" label="Mes" filled 
            
          />
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
            :color="props.row.estado == 'A' ? 'primary' : 'grey' "
            :icon="props.row.estado == 'A' ? 'cloud_sync' : 'print' " 
            :label="props.row.estado == 'A' ? 'Generar' : 'Imprimir' "
            @click="generarNomina(props.row)">
            </q-btn>
          </q-td>
        </template>

       <template v-slot:body-cell-Igss="props">
          <q-td :props="props" class="q-pa-sm">
            <q-btn 
            v-if="props.row.periodo == 2"
            outline size="sm" class="q-pl-md"
            :color="props.row.estado == 'A' ? 'secondary' : 'grey' "
            :icon="props.row.estado == 'A' ? 'task' : 'print' " 
            :label="props.row.estado == 'A' ? 'Generar Igss' : 'Imprimir Igss' "
            @click="generarNominaIgss(props.row)">
          </q-btn>
          <q-btn v-else
            outline size="sm" class="q-pl-md"
            color="grey"
            label="No disp."
            disable
          >
            
          </q-btn>
          </q-td>
        </template>

        <template v-slot:body-cell="props">
          <q-td :props="props">
            {{props.value}}
          </q-td>
          <q-menu
            touch-position
            context-menu
            v-if="props.row.estado === 'A' "
          >
            <q-list dense style="min-width: 100px">
              <q-item clickable @click="cerrarPeriodo(props.row.id)">
                <q-item-section>Cerrar Periodo</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </template>

         <template v-slot:top-right>
          <q-input
            for="pos-buscar-detalles"
            borderless dense v-model="filter" placeholder="Buscar Empleados" clearable>
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
  import { date, QTableProps, useQuasar } from 'quasar';
  import { api, endPoints } from 'src/boot/axios';
  import { showAlertAsync, showError, showErrorEx, showSucces } from 'src/helpers/showAlerts';
  import { defineComponent, ref } from 'vue';

  import * as pdfMake from 'pdfmake/build/pdfmake';
  import * as pdfFonts from 'pdfmake/build/vfs_fonts';
  import jszip from 'jszip';


  pdfMake.vfs = {};
  pdfMake.jszip = jszip;
  pdfMake.DynamicContent = {
      content: {
          widths: '100%'
      }
  };
  pdfMake.fonts = {
      Roboto: {
          normal: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf',
          bold: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Medium.ttf',
          italics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Italic.ttf',
          bolditalics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-MediumItalic.ttf'
      },
  };

  (<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;


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
      name:'Descripcion',
      label:'Descripcion',
      field:'descripcion',
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
      align: 'center',
      format:(val, row)=>`${date.formatDate(val, 'DD-MMMM-YYYY')}`,
    },
    {
      name: 'Accion',
      label:'Reporte Nomina',
      field:'Accion',
      align: 'center'
    },
    {
      name: 'Igss',
      label:'Reporte Igss',
      field:'Igss',
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
        { value: 1, label: 'Primera Quincena 45%' },
        { value: 2, label: 'Segunda Quincena' },
        { value: 3, label: 'Bono 14' },
        { value: 4, label: 'Aguinaldo' },
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

        if(mes.value.value !== 7 && periodo.value.value === 3){
          showError('El periodo de Bono 14 solo puede ser generado en el mes de Julio')
          return
        }

        if(mes.value.value !== 12 && periodo.value.value === 4){
          showError('El periodo de Aguinaldo solo puede ser generado en el mes de Diciembre')
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



      const generarNomina = async(row)=>{

        if (row.estado === 'G'){
          await imprimirNomina(row)
          return
        }
        
        const resp = await showAlertAsync('Confirmacion', 'Esta seguro de Generar la Nomina?',{})

        if(!resp){
          return
        }

        $q.loading.show()

        await api.post(endPoints.NOMINA,{

          'idPeriodo': row.id

        }).then(async(resp)=>{

          if(resp.status === 200){

            await imprimirNomina(row)
          }

        }).catch((ex)=>{
          showErrorEx(ex)
        })

        $q.loading.hide();

        
      }



      const generarNominaIgss = async(row)=>{

        if (row.estado === 'G'){
          $q.loading.show()

          await imprimirNominaIgss(row)

          $q.loading.hide()

          return
        }
        
        const resp = await showAlertAsync('Confirmacion', 'Esta seguro de Generar la Nomina?',{})

        if(!resp){
          return
        }

        $q.loading.show()

        await api.post(endPoints.NOMINA,{

          'idPeriodo': row.id

        }).then(async(resp)=>{

          if(resp.status === 200){

            await imprimirNominaIgss(row)
          }

        }).catch((ex)=>{
          showErrorEx(ex)
        })

        $q.loading.hide();

        
      }




      const imprimirNomina = async(row)=>{

        await api.get(endPoints.NOMINA, {params:{
          'idPeriodo': row.id
        }}).then((resp)=>{

          if(!resp.data){
            showError('No existen Datos para este Periodo')
            return
          }


          
          const data = resp.data[0]
          
          const tipoNom = data.descripcion
          const mesAnio = `Mes:  ${data.mes}  Año:  ${data.año}`

          let sumaTotal = 0;

          resp.data.forEach(empleado => {
            sumaTotal += empleado.total_a_pagar;
          });
        

          // Cargar la imagen y convertirla en un dataURL
          
          const pdfmakeData = {
            documentTitle: 'Reporte_Nomina.pdf',
            pageOrientation: 'landscape',
            pageSize: 'Legal',
            content: [
              {
                text: 'Reporte de Calculo de Nominas',
                style: 'header',
              },
              {
                text: tipoNom,
                style: 'subheader',
              },
              {
                text: mesAnio,
                style: 'subheader',
              },
              {
                text: '',
                style: 'subheader',
              },
              {
                text: '',
                style: 'subheader',
              },
              {
                text: '',
                style: 'subheader',
              },
              {
                table: {
                  headerRows: 1,
                  widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto','auto'],
                  body: [
                    [
                      { text: 'Nombre Empleado', style: 'tableHeader' },
                      { text: 'Departamento', style: 'tableHeader' },
                      { text: 'Puesto', style: 'tableHeader' },
                      { text: 'Salario', style: 'tableHeader' },
                      { text: 'H Extras', style: 'tableHeader' },
                      { text: 'H Dobles', style: 'tableHeader' },
                      { text: 'Comis.', style: 'tableHeader' },
                      { text: 'Bonif.', style: 'tableHeader' },
                      { text: 'Bono Ley', style: 'tableHeader' },
                      { text: 'Compras', style: 'tableHeader' },
                      { text: 'Igss', style: 'tableHeader' },
                      { text: 'Total Bonos', style: 'tableHeader' },
                      { text: 'Total Deduccion', style: 'tableHeader' },
                      { text: 'Sueldo Liquido', style: 'tableHeader' },
                    ],
                    ...resp.data.map(employee => [
                      `${employee.empleado_id} - ${employee.nombre_empleado}`,
                      employee.departamento,
                      employee.puesto,
                      `Q. ${employee.sueldo.toFixed(2)}`,
                      `Q. ${employee.horas_extras.toFixed(2)}`,
                      `Q. ${employee.horas_dobles.toFixed(2)}`,
                      `Q. ${employee.comisiones.toFixed(2)}`,
                      `Q. ${employee.bonificaciones.toFixed(2)}`,
                      `Q. ${employee.bono_ley.toFixed(2)}`,
                      `Q. ${employee.compras_empleado.toFixed(2)}`,
                      `Q. ${employee.igss.toFixed(2)}`,
                      `Q. ${employee.total_bonificacion.toFixed(2)}`, // Format total pay to two decimal places
                      `Q. ${employee.total_deducciones.toFixed(2)}`, // Format total pay to two decimal places
                      `Q. ${employee.total_a_pagar.toFixed(2)}`, // Format total pay to two decimal places
                    ]),
                  ],
                },
                layout: 'lightHorizontalLines',

              },
              {
                text: '-',
                style: 'total',
              },
              {
                text: `Total General: Q${sumaTotal}`,
                style: 'total',
              },
            ],
            styles: {
              header: {
                fontSize: 18,
                bold: true,
                alignment: 'center',
              },
              total: {
                fontSize: 14,
                bold: true,
                alignment: 'right',
              },
              tableHeader: {
                bold: true,
                fontSize: 10,
                color: 'black',
              },
              subheader: {
                fontSize: 12,
                alignment: 'center',
                margin: [0, 5, 0, 0],
              },
            },
            defaultStyle: {
              fontSize: 8,
            },
          };

          pdfMake.createPdf(pdfmakeData).open();

          
        }).catch((ex)=>{
          console.log(ex);
          
          showErrorEx(ex)
        })

      }





      const imprimirNominaIgss = async(row)=>{

        await api.get(endPoints.NOMINA, {params:{
          'idPeriodo': row.id
        }}).then((resp)=>{

          if(!resp.data ){
            showError('No existen Datos para este Periodo')
            return
          }


          console.log(resp.data);
          

          const data = resp.data[0]
          
          const tipoNom = data.descripcion
          const mesAnio = `Mes:  ${data.mes}  Año:  ${data.año}`

          // Cargar la imagen y convertirla en un dataURL

          let sumaIgssTotal = 0;

          resp.data.forEach(empleado => {
            sumaIgssTotal += empleado.igss_total;
          });
          
          
          const pdfmakeData = {
            documentTitle: 'Reporte_Nomina_IGGS.pdf',
            
            content: [
              {
                text: 'Reporte de Calculo de IGGS',
                style: 'header',
              },
              {
                text: mesAnio,
                style: 'subheader',
              },
              {
                text: '',
                style: 'subheader',
              },
              {
                text: '',
                style: 'subheader',
              },
              {
                text: '',
                style: 'subheader',
              },
              {
                table: {
                  headerRows: 1,
                  widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
                  body: [
                    [
                      { text: 'Nombre Empleado', style: 'tableHeader' },
                      { text: 'Departamento', style: 'tableHeader' },
                      { text: 'Puesto', style: 'tableHeader' },
                      { text: 'Sueldo', style: 'tableHeader' },
                      { text: 'Igss Empleado', style: 'tableHeader' },
                      { text: 'Igss Patrono', style: 'tableHeader' },
                      { text: 'Total Iggs', style: 'tableHeader' },
                    ],
                    ...resp.data.map(employee => [
                      `${employee.empleado_id} - ${employee.nombre_empleado}`,
                      employee.departamento,
                      employee.puesto,
                      `Q. ${employee.sueldo.toFixed(2)}`,
                      `Q. ${employee.igss.toFixed(2)}`,
                      `Q. ${employee.igss_patrono.toFixed(2)}`, // Format total pay to two decimal places
                      `Q. ${employee.igss_total.toFixed(2)}`, // Format total pay to two decimal places
                    ]),
                  ],
                },
                //layout: 'lightHorizontalLines',
                
                 
              },
              {
                text: '-',
                style: 'total',
              },
              {
                text: `Total General: Q${sumaIgssTotal}`,
                style: 'total',
              },
            ],
            styles: {
              header: {
                fontSize: 18,
                bold: true,
                alignment: 'center',
              },
              total: {
                fontSize: 14,
                bold: true,
                alignment: 'right',
              },
              tableHeader: {
                bold: true,
                fontSize: 10,
                color: 'black',
              },
              subheader: {
                fontSize: 12,
                alignment: 'center',
                margin: [0, 5, 0, 0],
              },
            },
            defaultStyle: {
              fontSize: 8,
            },
          };

          pdfMake.createPdf(pdfmakeData).open();

          
        }).catch((ex)=>{
          console.log(ex);
          
          showErrorEx(ex)
        })

      }


      //Funcion para cerrar el periodo activo de nomina
      const cerrarPeriodo = async(periodo)=>{

        const resp = await showAlertAsync('Confirmacion','Esta seguro de cerrar el periodo de nominas?',{})

        if(!resp){
          return
        }

        $q.loading.show()

        await api.post(endPoints.PERIODOS + '/cerrar',{

          'periodo': periodo

        }).then(async(resp)=>{

          await getPeriodos()

        }).catch((ex)=>{
          showErrorEx(ex)
        })

        $q.loading.hide()


      }
    

      return{
        cerrarPeriodo,
        generarNomina,
        imprimirNomina,
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
        agregarPeriodo,
        generarNominaIgss,
        imprimirNominaIgss
      }
    },
    created(){
      void this.getPeriodos();
    }
});
</script>
