<template>
  <q-page class="q-pa-md">
    <card-social icon_position="right" />

    <div class="row q-col-gutter-sm q-pa-lg">
      <todo-list />

      <card-time-line />
    </div>


     <div class="q-pa-lg">
      <q-card class="no-shadow" bordered>
        <q-card-section>
          <div class="text-h6 text-grey-8">Empleados Registrados</div>
        </q-card-section>
        <q-separator />
        <q-card-section class="q-pa-none">
          <q-table grid :rows="rows" :columns="columns" hide-bottom>
            <template v-slot:item="props">
              <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3">
                <card-profile
                  :avatar="props.row.photourl"
                  :name="props.row.nombre"
                  :des="props.row.puesto"
                  :dep="props.row.departamento"
                ></card-profile>
              </div>
            </template>
          </q-table>
        </q-card-section>
      </q-card>
    </div>


  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import CardSocial from '../components/CardSocial.vue';
import CardTimeLine from '../components/CardTimeLine.vue';
import TodoList from '../components/TodoList.vue';
import CardProfile from '../components/CardProfile.vue';
import { api, endPoints } from 'src/boot/axios';
import { showErrorEx } from 'src/helpers/showAlerts';
import { useQuasar } from 'quasar';

const columns = [
  {
    name: 'Nombre',
    label: 'Nombre',
    field: 'nombre',
    sortable: true,
    align: 'left',
  },
  {
    name: 'Departamento',
    label: 'Departamento',
    field: 'departamento',
    sortable: true,
    align: 'left',
  },
  {
    name: 'Action',
    label: '',
    field: 'Action',
    sortable: false,
    align: 'center',
  },
];

const data = [
  {
    name: 'Pratik Patel',
    Project: 'Quasar Admin',
    avatar:
      'https://avatars3.githubusercontent.com/u/34883558?s=400&u=09455019882ac53dc69b23df570629fd84d37dd1&v=4',
    des: 'Solutions Developer',
  },
  {
    name: 'Mayank Patel',
    Project: 'Quasar QDraggableTree',
    avatar:
      'https://avatars2.githubusercontent.com/u/27857088?s=400&u=a898efbc753d93cf4c2070a7cf3b05544b50deea&v=4',
    des: 'Solutions Developer',
  },
];

export default defineComponent({
  name: 'DashBoardPage',
  components: {
    CardSocial,
    CardTimeLine,
    TodoList,
    CardProfile,
  },

  setup() {
    const $q = useQuasar();

    const rows = ref([]);

    const getEmpleados = async () => {
      $q.loading.show();

      await api
        .get(endPoints.EMPLEADOS + '/empleadoDash')
        .then((resp) => {
          rows.value = resp.data;
        })
        .catch((ex) => {
          showErrorEx(ex);
        });

      $q.loading.hide();
    };

    return {
      columns,
      data,
      rows,
      getEmpleados,
    };
  },

  created() {
    void this.getEmpleados();
  },
});
</script>
