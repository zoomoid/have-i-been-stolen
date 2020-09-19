<template>
  <v-app>
    <v-main>
      <img src="/img/have-i-been-stolen-black.svg" alt="Have I Been Stolen?">
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<style lang="sass" scoped>
img
  height: 128px
  display: block
  margin-left: 10%
  margin-top: 10%
</style>