<template>
  <q-layout>
    <q-page-container>
      <q-page class="flex bg-image flex-center">
        <q-card v-bind:style="$q.screen.lt.sm?{'width': '80%'}:{'width':'30%'}">
          <q-card-section>
            <q-avatar size="103px" class="absolute-center">
              <img src="../assets/login.png">
            </q-avatar>
          </q-card-section>
          <q-card-section>
            <div class="text-center q-pt-lg">
              <div class="col text-h6 ellipsis">
                Log in
              </div>
            </div>
          </q-card-section>
          <q-card-section>
            <q-form
              class="q-gutter-md"
              @submit="onSubmit"
            >
            <q-select 
              label="Seleccione la Empresa" 
              filled v-model="modelEmpresa" 
              :options="optionsEmpresa"
              :rules="[val => !!val || 'Campo obligatorio']"
              > 

            </q-select>
              <q-input
                rounded
                filled
                type="email"
                v-model="username"
                label="Usuario"
                lazy-rules
                :rules="[
                  val => !!val || 'Campo obligatorio',
                  val =>  /.+@.+\..+/.test(val) || 'Ingresa un Correo Valido'
                ]"
                
              >
               <template v-slot:append>
                  <q-icon
                    name='person'
                  />
                </template>
              </q-input>
             

              <q-input
                rounded
                :type="isPwd ? 'password' : 'text'"
                filled
                v-model="password"
                label="Contraseña"
                lazy-rules
                :rules="[val => !!val || 'Campo obligatorio']"
                
              >
              <template v-slot:append>
                <q-icon
                  :name="isPwd ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwd = !isPwd"
                />
              </template>
              </q-input>

              <div>
                <!-- <q-btn size="lg" label="Login" type="submit" color="indigo" :loading="loading" align="center"/> -->
                 <q-btn
                  :loading="loading"
                  color="indigo"
                  type="submit"
                  size="md"
                >
                  Ingresar
                  <template v-slot:loading>
                    <q-spinner-gears class="on-left" />
                  </template>
                </q-btn>
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">

import { api, endPoints } from 'src/boot/axios'
import { showAlert, showErrorEx } from 'src/helpers/showAlerts'
import {defineComponent} from 'vue'
import {ref} from 'vue'
import { useRouter } from 'vue-router'
import {saveToken} from '../helpers/token'

export default defineComponent({
  setup() {
    
      const optionsEmpresa = ref([])
      const modelEmpresa = ref<any>(null)
      const username = ref('')
      const password = ref('')
      const loading = ref(false)
      const $router = useRouter()
      const isPwd = ref(true)

      const getEmpresas = async()=>{

      await api.get( endPoints.EMPRESAS).then((resp)=>{
        
        optionsEmpresa.value = resp.data
      
      }).catch((ex)=>{
        showErrorEx(ex)
      })
    }

    const onSubmit = ()=>{
      void loginUser()
    }

    const loginUser = async ()=>{

      loading.value = true
      
      await api.post(endPoints.LOGIN, {
        'idEmpresa': modelEmpresa.value.value,
        'email': username.value,
        'pass': password.value
      },{}).then((resp)=>{
        const token = resp.data.data.token
        const name = resp.data.data.nombre
        const rol = resp.data.data.rol

        if(!token){
          showAlert('Alerta','No se pudo iniciar sesion, contante al administrador',{})
          return;
        }

        saveToken(token, name, rol, username.value)
        loading.value = false
        void $router.push('/home');

      }).catch((ex)=>{
        //console.log(ex); 
        showErrorEx(ex, {mensaje: ex.response.data.mensaje})
      }).finally(()=>{
        loading.value = false;
      })
    }

    return {
      username,
      password,
      getEmpresas,
      optionsEmpresa,
      modelEmpresa,
      onSubmit,
      loading,
      isPwd
    }
  },
  created(){
    void this.getEmpresas();
  }
})
</script>

<style>

.bg-image {
  background-image: linear-gradient(135deg, #7028e4 0%, #e5b2ca 100%);
  /* background-color:indigo; */
}
</style>
