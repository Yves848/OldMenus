<template>
<div>
    <v-toolbar>
        <v-toolbar-side-icon></v-toolbar-side-icon>
        <v-toolbar-title>FlyMenu</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-menu :nudge-width="100" offset-y>
        <v-toolbar-title slot="activator">
          <span>Utilisateur</span>
          <v-icon >arrow_drop_down</v-icon>
        </v-toolbar-title>
        <v-list>
          <v-list-tile >
            <v-list-tile-title>Profile</v-list-tile-title>
          </v-list-tile>
          <v-divider ></v-divider>
          <v-list-tile >
            <v-list-tile-title>Connecter</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
        
    </v-toolbar>
</div>
</template>

<script>
export default {
    
}
</script>

<style>

</style>
