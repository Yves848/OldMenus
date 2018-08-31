<template>
   <v-container fluid>
      <v-layout row>
         <v-flex md1 lg1>

         </v-flex>
         <v-flex md10 lg10>
            <v-card>
               <v-card-title>
                  <h1>Menus</h1>
               </v-card-title>
               <v-card-text>
                  <v-data-table
                     :headers="headers"
                     :items="menus"
                     class="elevation-5"
                  >
                     <template slot="items" slot-scope="props">
                     <tr>
                     <td>{{ props.item.Nom }}</td>
                     <td class="text-xs-left">{{ props.item.Description }}</td>
                     <td class="justify-right layout px-0">
                        <v-btn icon class="mx-0" @click.stop="props.expanded = !props.expanded">
                           <v-icon color="orange" v-if="!props.expanded">visibility</v-icon>
                           <v-icon color="orange" v-else>visibility_off</v-icon>
                        </v-btn>
                        <v-btn icon class="mx-0" @click.stop="editMenu(props.item)">
                           <v-icon color="teal">edit</v-icon>
                        </v-btn>
                        <v-btn icon class="mx-0" @click.stop="deleteMenu(props.item)">
                           <v-icon color="pink">delete</v-icon>
                        </v-btn>
                     </td>
                     </tr>
                     </template>
                     <template slot="expand" slot-scope="props">
                        <v-card flat>
                           <v-card-text>
                                 <v-card class="elevation-0">
                                    <v-slide-x-reverse-transition>
                                       <v-container grid-list-md>
                                       <v-layout row wrap=""  >
                                          <v-flex
                                             v-for="(plat,i) in props.item.detail"
                                             :key="i">
                                             <v-card width="120px" elevation-12>
                                             <v-card-media height="100px">
                                                <img :id="'gdImg'+i" class="" width="120px" :src="plat.Image" >
                                             </v-card-media>
                                             <v-card-text>
                                                {{plat.Nom}}
                                             </v-card-text>

                                             </v-card>
                                          </v-flex>
                                       </v-layout>
                                       </v-container>
                                    </v-slide-x-reverse-transition>
                                 </v-card>
                           </v-card-text>
                        </v-card>
                     </template>
                  </v-data-table>

               </v-card-text>

            </v-card>

         </v-flex>
          <v-btn
                  color="primary"
                  key="create"
                  v-model="fab"
                  dark
                  fab
                  top
                  left
                  @click="addMenu()">
                  <v-icon>create</v-icon>
                  <v-icon>close</v-icon>
                  </v-btn>
      </v-layout>
      <v-dialog v-model="showAjoutMenu"
            persistent
            fullscreen>
         <v-card>
            <v-card-title>
               <h1>{{this.title}}</h1>
            </v-card-title>
            <v-card-text>
               <v-layout flex row wrap>
                 <v-flex md1 lg1>
                     <v-btn icon class="mx-0" @click.stop="showAjoutPlats=!showAjoutPlats">
                           <v-icon color="teal">playlist_add</v-icon>
                     </v-btn>
                  </v-flex>
                  <v-flex md11 lg11>
                     <v-card>
                        <v-card-title>
                           Plats
                        </v-card-title>
                        <v-card-text>
                           <v-container grid-list-md >
                              <v-layout row wrap=""  >
                                 <v-flex
                                 v-for="(plat,i) in currentMenu.Plats"
                                 :key="i">
                                 <div elevation-24>
                                 <v-card  width="220px">
                                    <v-card-media height="200px">
                                       <img width="120px" :src="load(plat)">
                                    </v-card-media>
                                    <v-card-actions>
                                      <v-btn flat block small @click="deletePlat(plat)">Supprimer</v-btn>
                                    </v-card-actions>
                                 </v-card>
                                 </div>
                                 </v-flex>
                              </v-layout>
                           </v-container>
                        </v-card-text>
                     </v-card>
                  </v-flex>
                  <v-flex md12 lg12>
                     <v-text-field
                        id="nomMenu"
                        name="nomMenu"
                        label="Nom du menu"
                        v-model="currentMenu.Nom"
                     ></v-text-field>
                  </v-flex>
                  <v-flex md12 lg12>
                     <v-text-field
                        id="descMenu"
                        name="descMenu"
                        label="Description du menu"
                        v-model="currentMenu.Description"
                     ></v-text-field>
                  </v-flex>

               </v-layout>
            </v-card-text>
            <v-card-actions>
               <v-btn color="blue darken-1" flat @click.native="showAjoutMenu=false">Annuler</v-btn>
               <v-btn color="blue darken-1" flat @click.native="saveMenu(currentMenu)">Enregistrer</v-btn>
            </v-card-actions>
         </v-card>
      </v-dialog>
      <v-dialog v-model="showAjoutPlats"
         max-width="1024px"
         scrollable>
         <v-card>
            <v-card-title>
               Plats sélectionnés : {{selected}}
            </v-card-title>
            <v-card-text style="height: 600px;">
               <v-container grid-list-md >
                  <v-layout row wrap=""  >
                     <v-flex
                     v-for="(plat,i) in allPlats"
                     :key="i">
                     <v-card width="220px" elevation-12>
                        <v-card-media height="200px">
                           <img :id="'gdImg'+i" class="" width="120px" :src="plat[1].Image">
                        </v-card-media>
                        <v-card-text>
                           <v-checkbox v-model="selected" :label="plat[1].Nom" :value="i"></v-checkbox>
                        </v-card-text>
                     </v-card>
                     </v-flex>
                  </v-layout>
               </v-container>
            </v-card-text>
            <v-card-actions>
               <v-btn color="primary"  @click.stop="cancelSelection()">Annuler</v-btn>
               <v-btn color="primary"  @click.stop="confirmSelection()">Sauver</v-btn>

            </v-card-actions>
         </v-card>
      </v-dialog>
      <v-dialog v-model="showDeleteMenu"
                max-width="400px"
                persistent>
        <v-card>
          <v-card-title>
            Confirmez la suppression
          </v-card-title>
          <v-card-media>

          </v-card-media>
          <v-card-text>
              {{currentMenu.Description}}
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary"  @click.stop="cancelDelete()">Non</v-btn>
            <v-btn color="primary"  @click.stop="confirmDelete()">Oui</v-btn>
          </v-card-actions>
        </v-card>

      </v-dialog>
   </v-container>

</template>

<script>
import { EventBus } from "../../event-bus.js";
import { objMenu } from "../../menus.js";

var menuRef = {};
var platsRef = {};
function loadPlat(key) {
  return new Promise((resolve, reject) => {
    platsRef
      .child(key)
      .once("value")
      .then(snap => {
        resolve({ ...snap.val(), id: snap.key });
      });
  });
}

function loadAllPlats(key) {
  return new Promise((resolve, reject) => {
    platsRef.once("value").then(snap => {
      var a = [];
      var data = snap.val();
      a = Object.entries(data);
      resolve(a);
    });
  });
}

function loadPlatsArray(keys) {
  return new Promise((resolve, reject) => {
    var result = [];
    keys.forEach(key => {
      loadPlat(key).then(value => {
        result.push(value);
      });
    });
    resolve(result);
  });
}
export default {
  data() {
    return {
      fab: false,
      showAjoutMenu: false,
      showAjoutPlats: false,
      showDeleteMenu: false,
      currentMenu: {},
      pagination: {},
      title: "",
      newMenu: {
        Nom: "",
        Plats: [],
        Description: ""
      },
      selected: [],
      menus: [],
      allPlats: [],
      headers: [
        {
          text: "Nom",
          align: "left",
          sortable: true,
          value: "Nom"
        },
        { text: "Description", value: "Description" },
        { text: "Actions", value: "name", sortable: false }
      ]
    };
  },
  computed: {
    userIn() {
      return this.$store.getters.userName;
    },
    selectedPlats() {
      loadPlatsArray(this.currentMenu.Plats).then(Plats => {
        return Plats;
      });
    }
  },
  created() {
    menuRef = this.$store.getters.dbMenus;
    platsRef = this.$store.getters.dbPlats;
    menuRef.on("child_added", snapshot => {
      var getPlats = new Promise((resolve, reject) => {
        var snap = snapshot.val();
        var plats = [];
        if (snap.Plats) {
          snap.Plats.forEach(plat => {
            loadPlat(plat).then(result => {
              plats.push(result);
            });
          });
        }
        resolve(plats);
      });

      getPlats.then(platsDetail => {
        this.menus.push({
          ...snapshot.val(),
          id: snapshot.key,
          detail: platsDetail
        });
      });
    });

    menuRef.on("child_removed", snapshot => {
      const deletedMenu = this.menus.find(menu => menu.id === snapshot.key);
      const index = this.menus.indexOf(deletedMenu);
      this.menus.splice(index, 1);
    });

    loadAllPlats(this.userIn).then(plats => {
      this.allPlats = plats;
    });
  },
  methods: {
    deletePlat(plat) {
      const key = plat[0];
      var index = this.currentMenu.Plats.findIndex(element => {
        return element[0] == key;
      });
      this.currentMenu.Plats.splice(index, 1);
    },
    popUp(message) {
      EventBus.$emit("popUp", message);
    },
    findPlat(key) {
      return new Promise((resolve, reject) => {
        var index = this.allPlats.findIndex(plat => {
          return plat[0] == key;
        });
        resolve(this.allPlats[index][1]);
      });
    },
    editMenu(key) {
      this.currentMenu = {
        Nom: "",
        Plats: [],
        Description: ""
      };
      this.currentMenu.Nom = key.Nom;
      this.currentMenu.Description = key.Description;
      key.detail.forEach(plat => {
        this.findPlat(plat.id).then(result => {
          this.currentMenu.Plats.push([plat.id, result]);
        });
      });
      this.title = "Edition";
      this.showAjoutMenu = true;
    },
    addMenu() {
      this.currentMenu = {
        Nom: "",
        Plats: [],
        Description: ""
      };
      this.title = "Ajout";
      this.showAjoutMenu = true;
    },
    load(key) {
      return key[1].Image;
    },
    cancelSelection() {
      this.selected = [];
      this.showAjoutPlats = false;
    },
    confirmSelection() {
      this.selected.forEach(key => {
        this.currentMenu.Plats.push(this.allPlats[key]);
      });
      this.selected = [];
      this.showAjoutPlats = false;
    },
    deleteMenu(menu) {
      this.currentMenu = menu;
      this.showDeleteMenu = true;
    },
    deleteMenuFromDb(key) {
      menuRef.child(key).remove();
      this.popUp(this.currentMenu.Description + " supprimé");
    },
    confirmDelete() {
      this.deleteMenuFromDb(this.currentMenu.id);
      this.currentMenu = {};
      this.showDeleteMenu = false;
    },
    cancelDelete() {
      this.currentMenu = {};
      this.showDeleteMenu = false;
    },
    saveMenu(menu) {
      var Plats = [];
      menu.Plats.forEach(plat => {
        Plats.push(plat[0]);
      });
      menuRef.push({
        Description: menu.Description,
        Nom: menu.Nom,
        Plats: Plats
      });
      this.showAjoutMenu = false;
    }
  },
  computed: {}
};
</script>

<style>
</style>


