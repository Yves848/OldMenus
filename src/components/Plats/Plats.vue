<template>
    <v-container>
      <v-toolbar dense  elevation-4 style="margin-bottom:5px">
        <v-layout flex>
          <v-flex md11 lg11>
             <v-text-field prepend-icon="search" v-model="filtre" hide-details single-line></v-text-field>
        </v-flex>
        </v-layout>
      </v-toolbar >

    <v-card style="padding-left:10px">
      <v-container grid-list-md>
        <v-layout row wrap style="">
          <v-flex
             v-for="(unplat,i) in platsfilter"
             :key="i">
            <v-card width="200px" elevation-12>
              <img class="thumb" :src="unplat.Image">
              <v-card-title primary-title>
                {{unplat.Nom}}<br>
              </v-card-title>
              <v-card-actions>
                <v-btn round small color="primary" @click="editPlat(unplat)">Editer</v-btn>
                <v-btn round small color="warning" @click="removePlat(unplat)">Supprimer</v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card>

    <v-dialog v-model="showAjout" persistent scrollable max-width="700px">
          <v-card>
            <v-card-title>
              <h1>{{title}}</h1>
            </v-card-title>
              <v-card-text>
              <v-container grid-list-md>
                <v-layout row wrap>
                  <v-flex xs8 sm8 md8>
                    <v-text-field label="Nom du plat" required v-model="plat.Nom"></v-text-field>
                  </v-flex>
                  <v-flex xs4 sm4 md4>
                    <v-select
                      :items="categories"
                      v-model="plat.Categorie"
                      label="Catégorie"
                      autocomplete
                    ></v-select>
                  </v-flex>
                  <v-flex xs11 sm11 md11>
                    <v-text-field label="Image"
                                  v-model="plat.ImageSearch"
                                  >
                    </v-text-field>
                  </v-flex>
                  <v-flex xs1 sm1 md1>
                                  <v-btn icon @click="searchImage(plat.ImageSearch,1)">
                                      <v-icon>search</v-icon>
                                  </v-btn>
                  </v-flex>
                </v-layout>
              </v-container>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" flat @click.native="annulerAjout">Close</v-btn>
              <v-btn color="blue darken-1" flat @click.native="ajouterPlat">Save</v-btn>
            </v-card-actions>
              <v-card class="elevation-0">
                <v-slide-x-reverse-transition>
                  <v-container grid-list-md v-if="images.length>0">
                    <v-layout row wrap=""  >
                      <v-flex
                        v-for="(image,i) in images"
                        :key="i">
                        <v-card width="120px" elevation-12>
                          <v-card-media height="100px">
                            <img :id="'gdImg'+i" class="" width="120px" :src="image.url" @click="clickImage(image,$event)">
                          </v-card-media>
                        </v-card>
                      </v-flex>
                    </v-layout>
                  </v-container>
                </v-slide-x-reverse-transition>
              </v-card>
            </v-card-text>
          </v-card>
    </v-dialog>

    <v-dialog v-model="showDelete"
              persistent
              max-width="400px">
      <v-card>
        <v-card-title>
          <h1>Suppression</h1>
        </v-card-title>
        <v-card-text>
          {{toSuppress.Nom}}
        </v-card-text>
        <v-card-actions>
                <v-btn round outline color="primary" @click="doSuppress()">Supprimer</v-btn>
                <v-btn round outline color="warning" @click="showDelete=false">Annuler</v-btn>
         </v-card-actions>
      </v-card>
    </v-dialog>
    </v-container>
</template>

<script>
import { EventBus } from "../../event-bus.js";
import axios from "axios";
import objPlat from "../../plats.js";

var platsRef = {};

export default {
  data() {
    return {
      plats: [],
      categories: [
        "Viande",
        "Poisson",
        "Volaille",
        "Féculent",
        "Légume",
        "Dessert",
        "Entrée"
      ],
      toSuppress: {},
      plat: {},
      filtre: "",
      showAjout: false,
      images: [],
      page: 1,
      title: "",
      pop: false,
      text: "",

      showProgress: false,
      showDelete: false
    };
  },
  components: {},
  mounted() {
    platsRef = this.$store.getters.dbPlats;

    platsRef.on("child_added", snapshot => {
      this.plats.push({ ...snapshot.val(), id: snapshot.key });
    });

    platsRef.on("child_removed", snapshot => {
      const deletedPlat = this.plats.find(plat => plat.id === snapshot.key);
      const index = this.plats.indexOf(deletedPlat);
      this.plats.splice(index, 1);
    });

    EventBus.$on("ajouterPlat", this.showAjouterPlat);
  },
  computed: {
    platsfilter() {
      return this.plats.filter(plat => {
        return plat.Nom.toUpperCase().includes(this.filtre.toUpperCase());
      });
    }
  },
  methods: {
    clickImage(image, event) {
      var i;
      for (i = 0; i < 10; i++) {
        let img = document.querySelector("#gdImg" + i);
        img.className = "";
        img.parentElement.parentElement.parentElement.className =
          "card elevation-0";
      }
      event.path[0].parentElement.parentElement.parentElement.className =
        "card elevation-12";
      event.path[0].className = "clicked";

      this.plat.Image = image.url;
    },
    popUp(message) {
      console.log("plats-popup:", message);
      EventBus.$emit("popUp", message);
    },
    addPlatToDB(plat) {
      platsRef.push({
        Nom: plat.Nom,
        Image: plat.Image,
        Rating: plat.Rating,
        ImageSearch: plat.ImageSearch
        //Categorie: plat.Categorie
      });
      this.popUp(plat.Nom + " ajouté");
    },
    removePlat(plat) {
      this.toSuppress = plat;
      this.showDelete = true;
    },
    doSuppress() {
      this.showDelete = false;
      platsRef.child(this.toSuppress.id).remove();
      this.popUp(this.toSuppress.Nom + " supprimé");
      this.toSuppress = {};
    },
    editPlatInDB(plat) {
      console.log("editPlatInDB:", plat);
      console.log(platsRef.toString());

      platsRef.child(plat.id).update({
        Nom: plat.Nom,
        Image: plat.Image,
        Rating: plat.Rating,
        ImageSearch: plat.ImageSearch,
        Categorie: plat.Categorie
      });
      this.popUp(plat.Nom + " modifié");
    },
    editPlat(plat) {
      this.showAjout = true;
      this.resetPlat();
      this.title = "Editer un plat";
      this.plat = plat;
      if (!this.plat.ImageSearch || this.plat.ImageSearch == "") {
        this.plat.ImageSearch = this.plat.Nom;
      }
    },
    ajouterPlat() {
      if (this.title == "Ajouter un plat") {
        this.addPlatToDB(this.plat);
      } else {
        this.editPlatInDB(this.plat);
      }
      this.showAjout = false;
      this.resetPlat();
    },
    annulerAjout() {
      this.showAjout = false;
    },
    resetPlat() {
      this.plat = new objPlat("");
      this.images = [];
    },
    showAjouterPlat() {
      this.resetPlat();
      this.title = "Ajouter un plat";
      //this.fenetreAjout.okClose = false;
      this.showAjout = true;
    },
    doSearch(key, page) {
      return new Promise((resolve, reject) => {
        var CSE_API_KEY = "007439388879951561867:3ragl0fkhpm";
        var CSE_ID = "AIzaSyDYvQx76ZvFawwKOaDeGqRClb2RJlIcsXM";

        var parameters = "?q=" + encodeURIComponent(key);
        parameters += "&cx=" + CSE_API_KEY;
        parameters += "&imgSize=large";
        //parameters += '&imgType=photo';
        parameters += "&searchType=image";
        //parameters +=
        //  "&fields=items(displayLink%2CfileFormat%2CformattedUrl%2ChtmlFormattedUrl%2ChtmlSnippet%2ChtmlTitle%2Cimage%2Ckind%2Clabels%2Clink%2Cmime%2Cpagemap%2Csnippet%2Ctitle)";
        parameters += "&key=" + CSE_ID;
        //parameters += "&lr=lang_fr";
        //parameters += "&start=" + page;

        var path =
          "https://www.googleapis.com/customsearch/v1" +
          parameters;
        this.imgPage = page;
        axios.get(path).then(response => {
          let imagesarray = [];
          //this.images = imagesarray;
          console.log('RESPONSE',response)
          var images = response.data.items;
          if (images) {
            images.forEach(image => {
              imagesarray.push({
                url: image.link,
                width: image.image.width,
                height: image.image.height
              });
            });
            //this.images.concat(imagesarray);
            if (imagesarray.length > 0) {
              resolve(imagesarray);
            } else {
              reject([]);
            }
          } else {
            reject([]);
          }
        });
      });
    },
    searchImage(key, page) {
      var vm = this;
      // progress on
      this.showProgress = true;
      this.doSearch(key, page, this)
        .then(imgs => {
          vm.images = imgs;
        })
        .catch(imgs => {
          vm.images.push({
            url: "/assets/images/No-image-available.jpg",
            width: 300,
            height: 200
          });
        });
      // progress off
      this.showProgress = false;
    }
  }
};
</script>

<style>
.clicked {
  border: 2px;
  border-style: solid;
  border-color: rgb(12, 18, 75);
}
.thumb {
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 200px;
  height: 200px;
}
.titreThumb {
  background: rgba(155, 167, 167, 0.45);
  border-style: solid;
  border-width: 1px;
  border-color: rgba(0, 0, 0, 0.582);
  text-align: center;
}
</style>
