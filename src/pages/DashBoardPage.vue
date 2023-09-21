<template>
  <q-page class="row items-center justify-evenly">
    
    <card-social icon_position="left"/>
    <card-charts/>

  </q-page>
</template>

<script lang="ts">

import { defineComponent, ref } from 'vue';
import CardSocial from '../components/CardSocial.vue'

export default defineComponent({
  name: 'DashBoardPage',
  components: {
    CardSocial
  },
  setup() {
    
    
    return {  };
  }
});
</script>
