<template>
  <article>
    <h1 class="text-lg-h1 text-md-h3">Disclaimer</h1>
    <p class="text-body">
      This app does not reflect the full state of the Velocity Bike data. It merely observes events from public
      endpoints to construct at least a partial view of the state of bikes in the system. This app <b>shall not</b>
      be used to conduct theft deduction or investigations, not should it serve any forensic analysis. This app does not
      comply to any standards of Velocity, nor is it officially endorsed or a tool verified by Velocity.<br>
      Please refer to Velocity directly instead of the authors of this app.
    </p>
    <router-link to="/"><v-icon>arrow_back</v-icon>Go back</router-link>
  </article>
</template>

<script>
export default {
  name: 'Disclaimer'
}
</script>

<style lang="scss" scoped>
article {
  max-width: 768px;
  margin: 2em auto;
}
a {
  color: white;
}
</style>