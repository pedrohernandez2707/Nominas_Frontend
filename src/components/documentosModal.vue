
<template >

    <q-btn label="Documentos" color="info" size="md" icon="find_in_page" @click="obtenerDocs"></q-btn>


    <q-dialog v-if="Empleado_ID" v-model="mostrarModal" persistent full-width>

        <q-card bordered >

          <div class="row q-ma-sm">
            Expediente de Empleados
          </div>

            <div class="row q-pt-lg q-pb-lg">

                <div class="col q-pa-sm col-md-3">
                    <q-select class="col-xs-12 col-sm-2 q-pr-md" v-model="tipoDoc" :options="tiposDoc" label="Tipo Documento" filled />
                </div>

                <div class="col q-pa-sm col-md-3">

                    <q-file 
                    color="teal" 
                    filled 
                    v-model="docModel" 
                    label="Subir Documento (Solo formato PDF)" 
                    accept=".pdf"
                    @rejected="onRejected"
                    >
                        <template v-slot:prepend>
                            <q-icon name="cloud_upload"/>
                        </template>

                        <template v-slot:after>
                            <q-btn round dense flat icon="send" @click="subirDoc"/>
                        </template>

                    </q-file>
                </div>

            </div>


          <div class="row">
              
            <div class="col">
              <q-table
              dense
              :title="`Expediente de ${Empleado_Name}`"
              :rows="docRows"
              :columns="docCols"
              :pagination="{rowsPerPage: 0}"
              no-data-label="Sin Registros"
              >
                <template v-slot:body-cell-Documento="props">
                    <q-td :props="props" style="padding:0px; width: 5px;">
                        <q-btn size="md" outline color="indigo" icon="folder_shared" @click="abrirPestaña(props.row)"/>
                    </q-td>
                </template>
              </q-table>
                <q-card-actions align="right">
                  <q-btn label="Regresar" color="negative" v-close-popup icon="logout"/>
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
import { QTableProps, useQuasar } from 'quasar';

export default defineComponent({

    name:'documentosModal',
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

        const $q = useQuasar()
        const mostrarModal = ref(false)
        const url = ref('')
        const docRows = ref([])
        const docModel = ref<any>(null)

        const tiposDoc = ref(['Copia DPI', 'Títulos - diplomas', 'Antecedentes penales', 'Antecedentes policiacos']);
        const tipoDoc = ref('Copia DPI');

         const docCols:QTableProps['columns']=[

            {
                name: 'Codigo',
                label:'Código',
                field:'idempleado',
                align: 'center'
            },
            {
                name:'Tipo',
                label:'Tipo Documento',
                field:'tipo',
                align: 'center'
            },
            {
                name: 'Documento',
                label:'Documento',
                field:'Documento',
                align: 'center'
            },
        ]


        const onRejected = (rejectedEntries)=>{
           
            showError('Error', {subtitulo: `${rejectedEntries.length} file(s) no cumple con las validaciones, Solo PDF`} )

        }
       

        const obtenerDocs = async()=>{

            mostrarModal.value = true

            if(!props.Empleado_ID) return;

            await api.get(endPoints.EMPLEADOS + '/obtenerDocs',{params:{
                'idEmpleado': props.Empleado_ID
            }}).then((resp)=>{
                
                docRows.value = resp.data
                
            }).catch((ex)=>{
                showErrorEx(ex)
            })
        }

        const abrirPestaña = (row) =>{
            url.value = row.url

            window.open(url.value, '_blank')
        }

          const file2Base64 = (file:File):Promise<string> => {
            return new Promise<string> ((resolve,reject)=> {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => resolve(reader.result?.toString() || '');
                reader.onerror = error => reject(error);
            })
        }



        const subirDoc = async()=>{

            if(!props.Empleado_ID){
                showError('Debe Seleccionar un Empleado')
                return
            }

            if(!docModel.value) {
                showError('Debe seleccionar un Archivo')
                return
            }
            
            const conf = await showAlertAsync('Confirmacion', `Desea Subir el documento de ${tipoDoc.value} del empleado ${props.Empleado_ID} ?`,{})
            
            if(!conf) return

            $q.loading.show()

            const base64 = await file2Base64(docModel.value)

            await api.post(endPoints.EMPLEADOS + '/saveDoc', { 
                'base64': base64,
                'Id': props.Empleado_ID,
                'Tipo': tipoDoc.value
            }).then((resp)=>{

                url.value = resp.data.url
                void obtenerDocs()
                showSucces('Guardado Correctamente')

            }).catch((ex)=>{
                
                showErrorEx(ex)

            }).finally(()=>{
                $q.loading.hide()
            })

        
        }


        return{
            mostrarModal,
            docCols,
            docRows,
            tiposDoc,
            tipoDoc,
            obtenerDocs,
            abrirPestaña,
            url,
            docModel,
            subirDoc,
            onRejected
        }

    },
    created(){
       // void this.obtenerDocs()
    }
 
})

</script>

<style>

</style>