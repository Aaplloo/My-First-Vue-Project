<script setup>
import Dashboard from './components/Dashboard.vue'
import AuthManager from './components/Auth/AuthManager.vue'
</script>

<template>
  <div>
    <AuthManager>
      <Dashboard />
    </AuthManager>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

#app {
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
  overflow: hidden;
}
</style>
