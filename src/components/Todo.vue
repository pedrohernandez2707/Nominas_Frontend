<template>
  <span>
    <q-list bordered class="bg-white no-shadow rounded-borders text-black">
      <q-item v-for="todo in todos" :key="todo.id">
        <q-item-section avatar>
          <q-checkbox
            :id="todo.id"
            v-model="todo.completed"
            color="teal"
            :dark="false"
          />
        </q-item-section>
        <q-item-section 
          class="text-body1 text-wrap"
          :style="todo.completed?{'textDecoration':'line-through'}:{}">

          <q-item-label class="text-black">{{ todo.todo }}</q-item-label>
          <q-item-label  caption class="text-grey-8">{{ todo.todo_desc }}</q-item-label>
        </q-item-section>
       
      </q-item>
    </q-list>
  </span>
</template>

<script>
import {defineComponent} from 'vue'
import {ref} from 'vue'

const todos = ref([
  {
    id: 1,
    completed: false,
    todo: 'Agregar Empleados',
    todo_desc: 'Mantenimiento de Empleados'
  },
  {
    id: 2,
    completed: false,
    todo: 'Agregar Productos',
    todo_desc: 'Mantenimiento de Productos'
  },
  {
    id: 3,
    completed: false,
    todo: 'Tienda Solidarista',
    todo_desc: 'Ventas a empleados en la Tienda'
  },
  {
    id: 4,
    completed: false,
    todo: 'Nominas - Periodos',
    todo_desc: 'Configuracion de Periodos'
  },
  {
    id: 5,
    completed: false,
    todo: 'Prestamos a Empleados',
    todo_desc: 'Mantenimiento a prestamos por empleado'
  },
  {
    id: 5,
    completed: false,
    todo: 'Nominas - Bonificaciones a Empleados',
    todo_desc: 'Horas Extras/Dobles, Comisiones, Bonificaciones'
  },
  {
    id: 7,
    completed: false,
    todo: 'Nominas - Deducciones a Empleados',
    todo_desc: 'Prestamos, Reporte Dias, Aportes Solidarios'
  },
 
])
export default defineComponent({
  name: 'TodoC',
  setup() {
    return {
      todos
    }
  }
})
</script>

<style scoped>

</style>
