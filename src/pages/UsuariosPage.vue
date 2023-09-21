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
          <q-input v-model="nombre" type="text" label="Nombre"
            counter
            :rules="[ val => val.length <= 40 || 'El nombre no puede ser mayor a 40 caracteres']"
          />
        </div>

        <div class="col-xs-9 col-md-5">
          <q-input v-model="apellido" type="text" label="Apellido"
            counter
            :rules="[ val => val.length <= 40 || 'El nombre no puede ser mayor a 40 caracteres']"
          />
        </div>
      <!-- </div> -->
      <!-- <div class="row"> -->
        <div class="col-xs-4 col-sm-2 col-md-2">
          <q-toggle v-model="estado" color="green" label="Estado" left-label />
        </div>
        <div class="col-xs-8 col-sm-10 col-md-3">
          <q-input v-model="pass" type="text" label="Contraseña"
            counter
            :rules="[ val => val.length <= 15 || 'La contraseña no puede ser mayor a 15 caracteres']"
          />

        </div>
      <!-- </div> -->
      <!-- <div class="row"> -->
        <q-select class="col-xs-12 col-sm-2" v-model="rol" :options="roles" label="Rol / Permiso" filled />
         
        <q-input class="q-pa-xs col-sm-4" v-model="email" type="email" label="Email"
          counter
        />
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
    field:'id',
    align: 'center'
  },
  {
    name:'Nombres',
    label:'Nombres',
    field:'nombre',
    align: 'center'
  },
  {
    name:'Apellidos',
    label:'Apellidos',
    field:'apellido',
    align: 'center'
  },
  {
    name: 'Email',
    label:'Email',
    field:'email',
    align: 'center'
  },
  {
    name: 'Estado',
    label:'Estado',
    field:'activo',
    align: 'center'
  },
  {
    name: 'Rol',
    label:'Rol',
    field:'rol',
    align: 'center'
  }
]

export default defineComponent({
  name: 'UsuariosPage',
  setup(){

    const $q = useQuasar()

    const codigo=ref<number|null>(null);
    const nombre=ref<string|null>(null);
    const email=ref<string|null>(null);
    const apellido=ref<string|null>(null);
    const estado=ref(true);
    const pass=ref('');
    const roles=ref(['Administrador','Usuario','Colaborador']);
    const rol=ref('Usuario');

    const filter = ref('');

    const usuarios = ref<any[]>([]);

    const getUsuarios = async()=>{

      $q.loading.show({
          delay: 400 // ms
      })

      await api.get(endPoints.USUARIOS)
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
        'nombre': nombre.value,
        'apellido': apellido.value,
        'email': email.value,
        'activo': estado.value,
        'contraseña': pass.value ,
        'rol': rol.value,
        //'Bodegas': bods,
      };

      if(codigo.value === null){

        $q.loading.show()

        api.post(endPoints.USUARIOS, data)
        .then(async(resp)=>{
          showSucces('Usuario guardado');
          clear();
          await getUsuarios();
        })
        .catch(ex=>{

          showErrorEx(ex, {mensaje: ex.response.data.mensaje})


        }).finally(()=>{
          $q.loading.hide()
        })
      }else{

        $q.loading.show()
        
         api.put(endPoints.USUARIOS, data)
        .then(async(resp)=>{
          showSucces('Usuario guardado');
          clear();
          await getUsuarios();
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
      nombre.value = row.nombre;
      apellido.value = row.apellido
      estado.value = row.activo;
      pass.value = row.contraseña;
      rol.value = row.rol;
      email.value = row.email;
    }

    const findVend=()=>{
      return
      if (codigo.value!==null && codigo.value!.toString()!=='') {
        var vend= usuarios.value.find(val=>val.Codigo==codigo.value);
        if (vend!==undefined) {

          codigo.value=vend.Codigo;
          nombre.value=vend.Nombre;
          estado.value=vend.Estado=='A'?true:false;
          pass.value=vend.Referencia;
          rol.value=vend.Tipo;
          //bodega.value=vend.Bodegas;
          return;
        }
      }
      clear();
    }

    const clear=()=>{
      
      codigo.value=null;
      nombre.value='';
      apellido.value='';
      email.value='';
      estado.value=true;
      pass.value='';
      rol.value='Usuario';
      //bodega.value=[];
    }


    return{
      getUsuarios,
      onSubmit,
      selectUsuario,
      findVend,
      clear,
      usuarios,
      columns,
      codigo,
      nombre,
      apellido,
      estado,
      pass,
      roles,
      rol,
      email,
      //bodegas,
      //bodega,
      filter
    }
  },
  created(){
    void this.getUsuarios();
  }
});
</script>
