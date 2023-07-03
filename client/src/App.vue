<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { ModalsContainer } from 'vue-final-modal'
</script>

<template>
  <header>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container-xxl">

        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav">

            <li class="nav-item">
              <RouterLink to="/" class="nav-link">
                  Home
              </RouterLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </header>
  <main>
    <div class="container-fluid py-2">
      <RouterView :scene-data="scene_data"/>
    </div>
  </main>
  <ModalsContainer />
</template>

