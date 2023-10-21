<template>
  <q-card class="no-shadow" bordered>
    <q-card-section class="text-center">
      <q-avatar size="100px" class="shadow-10">
        <img :src="avatar">
      </q-avatar>
    </q-card-section>

    <q-card-section class="q-pt-none text-center ">
      <div class="text-h6  text-grey-8">
        {{ name }}
      </div>
       <div class="text-caption text-grey-8">
        {{ dep }}
      </div>
      <div class="text-caption text-grey-8">
        {{ des }}
      </div>
    </q-card-section>

   
  </q-card>
</template>

<script>
import {defineComponent} from 'vue'

export default defineComponent({
  name: 'CardProfile',
  props: ['avatar', 'name', 'des', 'dep']
})
</script>

<style scoped>

</style>
