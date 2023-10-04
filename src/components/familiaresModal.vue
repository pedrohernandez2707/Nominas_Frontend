
<template >

    <q-btn label="Familiares" color="secondary" size="md" icon="family_restroom" @click="getFamiliaresEmpleado"></q-btn>


    <q-dialog v-if="Empleado_ID" v-model="mostrarModal" persistent full-width>

        <q-card bordered >

          <div class="row q-ma-sm">
            Mantenimiento de Familiares
          </div>

            <div class="row q-pt-lg q-pb-lg">

                <div class="col q-pa-sm col-md-3">
                    <q-input outlined v-model="nombreFam"  type="text" label="Nombre de Familiar"/>
                </div>

                <div class="col q-pa-sm col-md-3">
                    <q-input outlined v-model="telefonoFam"  type="text" label="Telefono Contacto"/>
                </div>

                 <div class="col q-pa-sm col-md-3">
                    <q-select class="col-xs-12 col-sm-2 q-pr-md" v-model="parentesco" :options="parentescos" label="Parentesco" filled />
                </div>
               
                <div class="col q-pa-sm col-md-3">
                    <q-select class="col-xs-12 col-sm-2 q-pr-md" v-model="genero" :options="generos" label="Genero" filled />
                </div>

                <q-btn label="Guardar" color="primary" @click="guardarFamiliar"></q-btn>
                <q-btn label="Limpiar" @click="clearForm"></q-btn>


            </div>

            <div class="row q-pt-sm q-pb-md">
                <div class="col q-pa-md">

                <q-table
                    dense
                    title="Listado de Familiares"
                    no-data-label="Sin Registros"
                    :columns="columnsFam"
                    :rows="famRows"
                    @row-dblclick="asignarFamiliar"
                >  
                </q-table>
                </div>
            </div>


          <div class="row">
              
            <div class="col">
              <q-table
              dense
              :title="`Familiares de ${Empleado_Name}`"
              :rows="empFamRows"
              :columns="empFamCols"
              :pagination="{rowsPerPage: 0}"
              no-data-label="Sin Registros"
              >
                <template v-slot:body-cell-Eliminar="props">
                    <q-td :props="props" style="padding:0px; width: 5px;">
                    <q-btn outline size="md" color="red" icon="delete_forever" @click="desasignarFamiliar(props.row)"/>
                    </q-td>
                </template>
              </q-table>
                <q-card-actions align="right">
                  <q-btn label="Regresar" color="negative" v-close-popup @click="clearForm" icon="logout"/>
                </q-card-actions>
            </div>
          </div>
          
        </q-card>
      </q-dialog>
  
</template>

<script lang="ts">

import { defineComponent, ref } from 'vue';
import { api, endPoints } from 'src/boot/axios';
import { showAlert, showAlertAsync, showError, showErrorEx, showSucces } from 'src/helpers/showAlerts';
import { QTableProps } from 'quasar';

export default defineComponent({

    name:'familiaresModal',
    props:{
        Empleado_ID: {
            type: Number,
            required: true,
        },
        Empleado_Name: {
            type: String,
            required: true,
        },
    },
    
    setup(props){

        const mostrarModal = ref(false)
        const nombreFam = ref('')
        const telefonoFam = ref('')
        const modalKey = ref(0)
        
        const parentescos = ref(['Conyugue','Hijo']);
        const parentesco = ref('Conyugue');

        const generos = ref(['Masculino','Femenino']);
        const genero = ref('Masculino');

        const famRows = ref([])
        const empFamRows = ref([])

         const empFamCols:QTableProps['columns']=[
            {
                name: 'Codigo',
                label:'Código',
                field:'id',
                align: 'center'
            },
            {
                name:'Nombre',
                label:'Nombre',
                field:'nombre',
                align: 'center'
            },
            {
                name: 'Tipo',
                label:'Tipo',
                field:'tipo',
                align: 'center'
            },
            {
                name: 'Telefono',
                label:'Telefono',
                field:'telefono',
                align: 'center'
            },
            {
                name:'Eliminar',
                label: 'Eliminar',
                field: 'Eliminar',
                align: 'center'
            }
        ]

        
        const columnsFam:QTableProps['columns']=[
            {
                name: 'Codigo',
                label:'Código',
                field:'id',
                align: 'center'
            },
            {
                name:'Nombre',
                label:'Nombre',
                field:'nombre',
                align: 'center'
            },
            {
                name: 'Tipo',
                label:'Tipo',
                field:'tipo',
                align: 'center'
            },
            {
                name: 'Telefono',
                label:'Telefono',
                field:'telefono',
                align: 'center'
            },
        ]
    

        const clearForm = ()=>{
            nombreFam.value = ''
            telefonoFam.value = ''
            modalKey.value +=1
        }

        const asignarFamiliar = async(ev,row, index)=>{            

            if(!row.id || !props.Empleado_ID){
                showError('Debe seleccionar un empleado y un familiar')
                return
            }

            const resp = await showAlertAsync('Confirmacion', 'Desea agregar el Familiar al Empleado?',{})

            if (!resp) return

            await api.post(endPoints.EMPLEADOS + '/asignar',{
                'idEmpleado': props.Empleado_ID,
                'idFamiliar': row.id
            }).then((resp)=>{

                void getFamiliaresEmpleado()
                showSucces('Guardado Existosamente')

            }).catch((ex)=>{
                console.log(ex);
                showErrorEx(ex)
            })

        }



        const desasignarFamiliar = async(row)=>{            

            if(!row.id || !props.Empleado_ID){
                showError('Debe seleccionar un empleado y un familiar')
                return
            }

            const resp = await showAlertAsync('Confirmacion', 'Desea eliminar el Familiar al Empleado?',{})

            if (!resp) return

            await api.post(endPoints.EMPLEADOS + '/desasignar',{
                'idEmpleado': props.Empleado_ID,
                'idFamiliar': row.id
            }).then((resp)=>{

                void getFamiliaresEmpleado()
                showSucces('Eliminado Existosamente')

            }).catch((ex)=>{
                showErrorEx(ex)
            })
        }


        const getFamiliar = async()=>{
            await api.get(endPoints.EMPLEADOS + '/familiar',{ 
            })
            .then((resp)=>{
                
                famRows.value = resp.data
                
            }).catch((ex)=>{
                showErrorEx(ex)
            })
        }

        const getFamiliaresEmpleado = async()=>{

            mostrarModal.value = true

            if(!props.Empleado_ID) return;

            await api.get(endPoints.EMPLEADOS + '/famEmpleado',{params:{
                'idEmpleado': props.Empleado_ID
            }}).then((resp)=>{
                
                empFamRows.value = resp.data
                
            }).catch((ex)=>{
                showErrorEx(ex)
            })
        }

        const guardarFamiliar = async()=>{

            if(telefonoFam.value == '' || nombreFam.value == ''){
                showError('Debe ingresar todos los campos')
                return
            }

            const data = {
                Tipo : parentesco.value,
                Genero : genero.value,
                Telefono : telefonoFam.value,
                Nombre : nombreFam.value
            }

            await api.post(endPoints.EMPLEADOS + '/familiar', data).then((resp)=>{

                showSucces('Empleado Guardado Correctamente')
                famRows.value.unshift(resp.data as never)

            }).catch((ex)=>{
                showErrorEx(ex)
            })
        }

        return{
            mostrarModal,
            telefonoFam,
            nombreFam,
            parentescos,
            parentesco,
            generos,
            genero,
            clearForm,
            columnsFam,
            famRows,
            empFamCols,
            empFamRows,
            guardarFamiliar,
            getFamiliaresEmpleado,
            getFamiliar,
            modalKey,
            asignarFamiliar,
            desasignarFamiliar
        }

    },

    created(){
        void this.getFamiliar()
        //void this.getFamiliaresEmpleado()
    }
 
})

</script>

<style>

</style>