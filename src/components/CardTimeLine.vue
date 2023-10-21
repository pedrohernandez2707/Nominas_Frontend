/* eslint-disable quotes */

<template>
  <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
    <q-card class="fit no-shadow" bordered>
      <q-card-section class="text-h6 q-pb-none">
        <q-item>
          <q-item-section avatar class="">
            <q-icon color="blue" name="access_time" style="font-size: 2em;"/>
          </q-item-section>

          <q-item-section>
            <div class="text-h6">Optimiza tu Tiempo</div>
          </q-item-section>
        </q-item>
      </q-card-section>
      <q-card-section class="">
        <q-timeline  color="secondary">

          <q-timeline-entry
            v-for="(timeline, index) in timeline_list"
            :key="index"
            :title="timeline.title"
            :subtitle="timeline.subtitle" :color="timeline.color" :icon="timeline.icon"
            :side="timeline.side"
          >
            <div>
              {{ timeline.desc }}
            </div>
          </q-timeline-entry>
        </q-timeline>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import {defineComponent} from 'vue'


export default defineComponent({
  name: 'CardTimeLine',
  setup() {
    return {
      timeline_list: [
        {
          title: 'Priorización Efectiva',
          side: 'left',
          desc: 'Aprende a identificar y priorizar tus tareas más importantes Enfócate en lo que es ealmente esencial\n' +
            '    y evita perder tiempo en actividades menos relevantes.',
          color: 'red',
          icon: 'thumb_up'
        },
        {
          title: 'Gestión de Interrupciones',
          side: 'left',
          desc: 'Desarrolla estrategias para manejar las interrupciones de manera efectiva. Programa momentos específicos\n' +
            '    para revisar correos electrónicos o mensajes y minimiza distracciones.',
          color: 'orange',
          icon: 'done_all'
        }, {
          title: 'Planificación y Organización',
          side: 'left',
          desc: 'Planifica tu día con antelación y organiza tu espacio de trabajo. Establece metas diarias y utiliza herramientas\n' +
            '    como listas de tareas para mantener el enfoque en tus objetivos.',
          color: 'blue',
          icon: 'thumb_up'
        }
      ],
    }
  }
})
</script>
