<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar
      class="bg-indigo text-white shadow-1 rounded-borders"
      >
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          Sistema de Nominas
        </q-toolbar-title>

        <div>

          <q-btn round flat>
            <q-avatar size="26px">
              <img src="https://cdn.quasar.dev/img/boy-avatar.png">
            </q-avatar>

            <q-menu
            >
              
              <q-list style="min-width: 100px">
                <card-item class="q-mt-lg" :name="name" :des="email"
                   avatar="https://cdn.quasar.dev/img/boy-avatar.png"></card-item>
                   
                <q-card class="text-center no-shadow no-border">
                  <q-btn icon="logout" label="Cerrar Sesion" style="max-width: 140px !important;" flat dense
                         class="text-indigo-6" @click="onlogOut"></q-btn>
                </q-card>
              </q-list>
            </q-menu>

          </q-btn>

        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
    >
      <q-list>
        <q-item-label
          header
        >
          Bienvenido
        </q-item-label>

        <q-item to="/home" active-class="q-item-no-link-highlighting">
          <q-item-section avatar>
            <q-icon name="dashboard"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>Dashboard</q-item-label>
          </q-item-section>
        </q-item>

         <q-item v-if="rol == 'Administrador'" to="/usuarios" active-class="q-item-no-link-highlighting">
          <q-item-section avatar>
            <q-icon name="person_add"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>Usuarios</q-item-label>
          </q-item-section>
        </q-item>

         <q-item v-if="rol != 'Colaborador'" to="/empleados" active-class="q-item-no-link-highlighting">
          <q-item-section avatar>
            <q-icon name="supervised_user_circle"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>Empleados</q-item-label>
          </q-item-section>
        </q-item>

        <q-item v-if="rol != 'Colaborador'" to="/productos" active-class="q-item-no-link-highlighting">
          <q-item-section avatar>
            <q-icon name="category"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>Productos</q-item-label>
          </q-item-section>
        </q-item>

        <q-item v-if="rol != 'Colaborador'" to="/store" active-class="q-item-no-link-highlighting">
          <q-item-section avatar>
            <q-icon name="local_grocery_store"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>Tienda / Ventas</q-item-label>
          </q-item-section>
        </q-item>
       
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { showAlertAsync } from 'src/helpers/showAlerts';
import { useRouter } from 'vue-router';
import { removeToken, getToken } from '../helpers/token'
import CardItem from '../components/CardItem.vue'
//import { useQuasar } from 'quasar';



export default defineComponent({
  name: 'MainLayout',

  components: {
    CardItem
  },

  setup () {

    const leftDrawerOpen = ref(false)
    const $router = useRouter()
    const name = ref<string|null>('')
    const email = ref<string|null>('')
    const rol = ref<string|null>('')
    const onlogOut = async()=>{
      await showAlertAsync('Confirmacion','Desea salir del Sistema?',{
        onPressOk(){
          removeToken()
          void $router.push('/')
        }
      })
    }
    //const $q = useQuasar()
    return {
      //$q,
      leftDrawerOpen,
      onlogOut,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      },
      name,
      email,
      rol
    }
  },
  created(){
    const data = getToken()
    
    if(!data.storedToken){
      void this.$router.push('/')
    }else{
      this.name = data.storedName 
      this.email = data.storedEmail 
      this.rol = data.storedRol    
    }
  }
});
</script>
