<template>
  <q-layout view="hHh Lpr lff">
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
      bordered
      :width="250"
      overlay
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


        <q-expansion-item
          icon="badge"
          label="Nominas"
        >
          <q-list class="q-pl-lg">

            <q-item to="/periodos" active-class="q-item-no-link-highlighting">
              <q-item-section avatar>
                <q-icon name="calendar_month"/>
              </q-item-section>
              <q-item-section>
                <q-item-label>Periodos</q-item-label>
              </q-item-section>
            </q-item>

            <q-expansion-item
            icon="playlist_add"
            label="Bonos y Extras"
            >
              <q-list class="q-pl-lg">

                <q-item to="/horas" active-class="q-item-no-link-highlighting">
                  <q-item-section avatar>
                    <q-icon name="more_time"/>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>Horas Extras / Dobles</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item to="/comisiones" active-class="q-item-no-link-highlighting">
                  <q-item-section avatar>
                    <q-icon name="local_atm"/>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>Comisiones Empleado</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item to="/bonificaciones" active-class="q-item-no-link-highlighting">
                  <q-item-section avatar>
                    <q-icon name="add_card"/>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>Bonificaciones Empleado</q-item-label>
                  </q-item-section>
                </q-item>

              </q-list>

            </q-expansion-item>
            
            <q-expansion-item
              icon="person_remove"
              label="Deducciones"
            >
              <q-list class="q-pl-lg">

                 <q-item to="/dias" active-class="q-item-no-link-highlighting">
                  <q-item-section avatar>
                    <q-icon name="playlist_remove"/>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>Reporte dias Empleado</q-item-label>
                  </q-item-section>
                </q-item>

                 <q-item to="/aportes" active-class="q-item-no-link-highlighting">
                  <q-item-section avatar>
                    <q-icon name="volunteer_activism"/>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>Aportes Solidarios</q-item-label>
                  </q-item-section>
                </q-item>

              </q-list>

            </q-expansion-item>

          </q-list>

        </q-expansion-item>

        <!-- Agregar otro -->

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
