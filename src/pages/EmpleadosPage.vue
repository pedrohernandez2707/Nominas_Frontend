<template>
  <q-page padding>

    <q-form
      @submit="onSubmit"
      class="q-gutter-md"
      @reset="clear"
    >
      <div class="row">

        <div class="col-xs-2 col-md-2 q-pr-md">
          <q-input v-model="codigo" type="number" label="Código" disable/>
        </div>

        <div class="col-xs-4 col-md-3 q-pr-md">
          <q-input v-model="nombre" type="text" label="Nombre"
            
            :rules="[ val => val.length <= 40 || 'El nombre no puede ser mayor a 40 caracteres']"
          />
        </div>
        
        <div class="col-xs-4 col-md-3 q-pr-md">
          <q-input v-model="apellido" type="text" label="Apellido"
            
            :rules="[ val => val.length <= 40 || 'El nombre no puede ser mayor a 40 caracteres']"
          />
        </div>

         <div class="col-xs-3 col-md-3 q-pr-md">
          <q-input v-model="telefono" type="text" label="Telefono"
            
            :rules="[ val => val.length <= 40 || 'El nombre no puede ser mayor a 40 caracteres']"
          />
        </div>

           <div class="col-xs-3 col-md-3 q-pr-md">
          <q-input v-model="direccion" type="text" label="Direccion"
            
            :rules="[ val => val.length <= 40 || 'El nombre no puede ser mayor a 40 caracteres']"
          />
        </div>

           <div class="col-xs-3 col-md-3 q-pr-md">
          <q-input v-model="dpi" type="text" label="dpi"
            
            :rules="[ val => val.length <= 40 || 'El nombre no puede ser mayor a 40 caracteres']"
          />
        </div>

           <div class="col-xs-3 col-md-3 q-pr-md">
          <q-input v-model="igss" type="text" label="afiliacion IGGS"
            
            :rules="[ val => val.length <= 40 || 'El nombre no puede ser mayor a 40 caracteres']"
          />
        </div>

        <div class="col-xs-4 col-sm-2 col-md-2 q-pr-md">
          <q-toggle v-model="estado" color="green" label="Estado" left-label />
        </div>

        <div class="col-xs-4 col-sm-2 col-md-2 q-pr-md" >
            <q-input v-model="fechaNac" filled type="date" label="Fecha Nacimiento" />
        </div>

        <div class="col-xs-4 col-sm-2 col-md-2 q-pr-md">
            <q-input v-model="fechaInicio" filled type="date" label="Fecha Contratacion" />
        </div>

        <div class="col-xs-4 col-sm-2 col-md-2 q-pr-md">
            <q-input v-model="fechaFin" filled type="date" hint="Fecha Fin / Baja" />
        </div>
      <!-- </div> -->
      <!-- <div class="row"> -->
        <q-select class="col-xs-12 col-sm-2 q-pr-md" v-model="estadoCivil" :options="estadosCiviles" label="Rol / Permiso" filled />
         
        <q-input class="q-pa-xs col-sm-4 q-pr-md" v-model="email" type="email" label="Email"
          counter
        />

        <q-file color="teal" filled v-model="photoModel" label="Subir Fotografia" accept=".jpg, .jpeg, .png, .bmp, .webp">
          <template v-slot:prepend>
            <q-icon name="cloud_upload"/>
          </template>

          <template v-slot:after>
            <q-btn round dense flat icon="send" @click="subirImagen"/>
          </template>

        </q-file>

        <div class="q-pa-md q-gutter-sm">

          <famModal v-if="codigo" :Empleado_ID="codigo" :Empleado_Name="nombre"></famModal>
          <docModal v-if="codigo" :Empleado_ID="codigo" :Empleado_Name="nombre"></docModal>

        </div>

      </div>
      <div>
        <q-btn :label=" codigo === null ? 'Guardar' : 'Actualizar'" type="submit" color="primary"/>
        <q-btn label="Limpiar" type="reset" color="primary" flat class="q-ml-sm" />
      </div>
    </q-form>

     <div>
        <q-img
          v-if="Photo_Url"
          :src="Photo_Url"
          alt="Fotografia de Empleado"
          style="max-width: 150px; height: 150px;"
          fit="fill"
        >
          <q-icon class="absolute all-pointer-events" size="20px" name="info" color="white" style="top: 8px; left: 8px" @click="abrirPestaña">
            <q-tooltip >
              Abrir en nueva pestaña
            </q-tooltip>
          </q-icon>
        </q-img>
      </div>

    <div style="height: 500px;">
      <q-table
        class="full-height"
        title="Usuarios"
        :rows="empleados"
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

import { QTableProps, useQuasar, date } from 'quasar';
import { api, endPoints } from 'src/boot/axios';
import { showAlertAsync, showError, showErrorEx, showSucces } from 'src/helpers/showAlerts';
import { defineComponent, ref } from 'vue';
import famModal from '../components/familiaresModal.vue'
import docModal from '../components/documentosModal.vue'


const columns:QTableProps['columns']=[
  {
    name: 'Codigo',
    label:'Código',
    field:'id',
    align: 'center'
  },
  {
    name:'Nombres',
    label:'Nombres',
    field:'nombres',
    align: 'center'
  },
  {
    name:'Apellidos',
    label:'Apellidos',
    field:'apellidos',
    align: 'center'
  },
  {
    name: 'Email',
    label:'Email',
    field:'email',
    align: 'center'
  },
  {
    name: 'CUI',
    label:'CUI',
    field:'dpi',
    align: 'center'
  },
  {
    name: 'Estado',
    label:'Estado',
    field:'estado',
    align: 'center'
  },
]

export default defineComponent({
  name: 'UsuariosPage',

  components:{
    famModal,
    docModal
  },

  methods:{

    
  },

  setup(){

    const $q = useQuasar()
    const Photo_Url = ref('')
    const codigo=ref<number|null>(null);
    const nombre=ref<string|null>(null);
    const fechaNac=ref<string|null>(null);
    const fechaInicio=ref<string|null>(null);
    const fechaFin=ref<string|null>(null);
    const email=ref<string|null>(null);
    const direccion=ref<string|null>(null);
    const telefono=ref<string|null>(null);
    const dpi=ref<string|null>(null);
    const igss=ref<string|null>(null);
    const apellido=ref<string|null>(null);
    const estado=ref(true);
    const pass=ref('');
    const estadosCiviles=ref(['Soltero','Casado','Viudo','Divorciado','Unido']);
    const estadoCivil=ref('Soltero');
    const photoModel = ref<any>(null)
    const filter = ref('');
    const empleados = ref<any[]>([]);

    let showModal = ref(false)

    const abrirPestaña = () =>{

      window.open(Photo_Url.value, '_blank')

    }



    const file2Base64 = (file:File):Promise<string> => {
      return new Promise<string> ((resolve,reject)=> {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result?.toString() || '');
          reader.onerror = error => reject(error);
      })
    }



    const subirImagen = async()=>{

      if(!codigo.value){
        showError('Debe Seleccionar un empleado para actualizar la foto')
        return
      }

      if(!photoModel.value) {
        showError('Debe seleccionar un Archivo')
        return
      }
      
      const conf = await showAlertAsync('Confirmacion', `Desea Subir la Fotografia del empleado ${codigo.value} ?`,{})
      
      if(!conf) return

       $q.loading.show({
          delay: 100 // ms
      })

      const base64 = await file2Base64(photoModel.value)

      await api.post(endPoints.EMPLEADOS + '/imagen', { 
        'base64': base64,
        'Id': codigo.value
      }).then((resp)=>{

        Photo_Url.value = resp.data.url
        showSucces('Guardado Correctamente')

      }).catch((ex)=>{
        
        showErrorEx(ex)

      }).finally(()=>{
        $q.loading.hide()
      })

  
    }


    const getEmpleados = async()=>{

      $q.loading.show({
          delay: 100 // ms
      })

      await api.get(endPoints.EMPLEADOS)
      .then((resp)=>{
        empleados.value=resp.data;
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
        'Id':codigo.value,
        'Nombres': nombre.value,
        'Apellidos': apellido.value,
        'Telefono': telefono.value,
        'Direccion': direccion.value,
        'Dpi': dpi.value,
        'Afiliacion_Igss': igss.value ,
        'Estado_Civil': estadoCivil.value,
        'Fecha_Nacimiento': fechaNac.value,
        'FechaContratacion': fechaInicio.value,
        'FechaBaja': fechaFin.value === undefined ? null : fechaFin.value,
        'Estado': estado.value === true ? 'A' : 'I',
        'Photo_Url': null,
        'Puesto': 1,
        'Departamento': 1,
        'Profesion': 1,
        //'Bodegas': bods,
      };


      if(codigo.value === null){

        $q.loading.show()

        api.post(endPoints.EMPLEADOS, data)
        .then(async(resp)=>{
          showSucces('Empleado guardado');
          clear();
          await getEmpleados();
        })
        .catch(ex=>{

          showErrorEx(ex, {mensaje: ex.response.data.mensaje})

        }).finally(()=>{
          $q.loading.hide()
        })
      }else{

        $q.loading.show()
        
         api.put(endPoints.EMPLEADOS, data)
        .then(async(resp)=>{
          showSucces('Empleado guardado');
          clear();
          await getEmpleados();
        })
        .catch(ex=>{

          showErrorEx(ex, {mensaje: ex.response.data.mensaje})
        
        }).finally(()=>{
          $q.loading.hide()
        })

      }
      
    }

    const selectUsuario=(ev,row, index)=>{
      
      codigo.value = row.id;
      nombre.value = row.nombres;
      apellido.value = row.apellidos
      estado.value = row.estado2;
      pass.value = row.contraseña;
      estadoCivil.value = row.estadocivil;
      direccion.value = row.direccion;
      telefono.value = row.telefono;
      dpi.value = row.dpi;
      igss.value = row.afiliacionigss;
      fechaNac.value = date.formatDate(row.fecha_nacimiento, 'YYYY-MM-DD');
      fechaInicio.value = date.formatDate(row.fechacontratacion, 'YYYY-MM-DD');
      fechaFin.value = date.formatDate(row.fechabaja, 'YYYY-MM-DD');
      Photo_Url.value = row.photourl
    }


    const clear=()=>{
      
      codigo.value = null
      nombre.value = ''
      apellido.value = ''
      estado.value = true
      estadoCivil.value = 'Soltero';
      direccion.value = '';
      telefono.value = '';
      dpi.value = '';
      igss.value = '';
      fechaNac.value = null;
      fechaInicio.value = null;
      fechaFin.value = null;
    }


    return{
      showModal,
      abrirPestaña,
      Photo_Url,
      subirImagen,
      photoModel,
      getEmpleados,
      onSubmit,
      selectUsuario,
      clear,
      empleados,
      columns,
      codigo,
      nombre,
      apellido,
      estado,
      pass,
      estadosCiviles,
      estadoCivil,
      email,
      filter,
      direccion,
      telefono,
      dpi,
      igss,
      fechaNac,
      fechaInicio,
      fechaFin
    }
  },
  created(){
    void this.getEmpleados();
  }
});

</script>
