<template>
<v-app>
  <v-dialog v-model="frmLogin" max-width="500px">
    <v-card>
      <v-card-title>
        Identitication
      </v-card-title>
      <v-card-text>
        <v-layout row wrap>
          <v-flex md2 lg2>

          </v-flex>
          <v-flex md8 lg8>
            <v-text-field
              id="nomUtilisateur"
              name="user"
              label="Nom"
              v-model="userName"
              class="input-group--focused"
            ></v-text-field>
          </v-flex>
          <v-flex md2 lg2>

          </v-flex>
          <v-flex md2 lg2>

          </v-flex>
          <v-flex md8 lg8>
            <v-text-field
              id="password"
              name="password"
              type="password"
              label="Mot de passe"
              v-model="userPassword"
              class="input-group--focused"
            ></v-text-field>
          </v-flex>
          <v-flex md2 lg2>

          </v-flex>
        </v-layout>
      </v-card-text>

      <v-card-actions>
        <v-layout>
          <v-flex md2 lg2>

          </v-flex>
          <v-flex md4 lg4>
            <v-btn color="primary" flat @click.stop="frmLogin=false">Annuler</v-btn>
          </v-flex>
          <v-flex md4 lg4>
            <v-btn color="primary" flat @click.stop="doLog2">Ok</v-btn>
          </v-flex>
        </v-layout>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="showCreateUser"
    max-width="600px">
    <v-card>
      <v-card-title>
        <h2>Nouvel Utilisateur</h2>
      </v-card-title>
      <v-card-text>
        <v-layout row wrap>
          <v-flex md2 lg2>

          </v-flex>
          <v-flex md8 lg8>
            <v-text-field
              id="nomUtilisateurCreate"
              name="user"
              label="Nom"
              v-model="userName"
              class="input-group--focused"
            ></v-text-field>
          </v-flex>
          <v-flex md2 lg2>

          </v-flex>
          <v-flex md2 lg2>

          </v-flex>
          <v-flex md8 lg8>
            <v-text-field
              id="passwordCreate"
              name="password"
              label="Mot de passe"
              v-model="userPassword"
              class="input-group--focused"
            ></v-text-field>
          </v-flex>
          <v-flex md2 lg2>
          </v-flex>
        </v-layout>
      </v-card-text>
      <v-card-actions>
        <v-layout>
          <v-flex md2 lg2>

          </v-flex>
          <v-flex md4 lg4>
            <v-btn color="primary" flat @click.stop="cancelCreateUser()">Annuler</v-btn>
          </v-flex>
          <v-flex md4 lg4>
            <v-btn color="primary" flat @click.stop="confirmCreateUser()">Ok</v-btn>
          </v-flex>
        </v-layout>
      </v-card-actions>
    </v-card>
  </v-dialog>
    <v-snackbar
      :timeout="timeout"
      :top="true"
      :right="true"
      v-model="pop"
    >
      {{ text }}
      <v-btn flat color="pink" @click.native="pop = false">Close</v-btn>
    </v-snackbar>
    <v-navigation-drawer
      fixed
      :clipped="clipped"
      v-model="drawerVisible"
      app
    >
      <v-toolbar flat>
        <v-toolbar-title>Menu</v-toolbar-title>
      </v-toolbar>

      <v-list>
        <v-list-group
          v-for="item in items"
          v-model="item.active"
          :key="item.title"
          no-action
        >
          <v-list-tile slot="activator"  avatar>
            <v-list-tile-avatar>
                <img :src="item.icon" alt="">
            </v-list-tile-avatar>
            <v-list-tile-content @click.stop="ClickMe(item)">

              <v-list-tile-title >
                {{item.title}}
              </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile v-for="subItem in item.subMenu"
                        :key="subItem.title"
                        @click="ClickMe(subItem)">
              <v-list-tile-action>
                <v-icon>{{subItem.icon}}</v-icon>
              </v-list-tile-action>
              <v-list-tile-content >
                  {{subItem.title}}
              </v-list-tile-content>



          </v-list-tile>
        </v-list-group>
      </v-list>


    </v-navigation-drawer>

    <v-toolbar fixed app :clipped="clipped">
        <v-toolbar-side-icon @click.stop="drawer = !drawer">
          <v-avatar
            size="48"
            color="grey lighten-4"
          >
            <img src="/assets/images/icon.png" alt="avatar">
          </v-avatar>
        </v-toolbar-side-icon>
        <v-toolbar-title>FlyMenu</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-menu :nudge-width="100" offset-y>
            <v-toolbar-title slot="activator">
            <span v-if="userIn">{{userIn}}</span>
            <span v-else>Utilisateur</span>
            <v-icon >arrow_drop_down</v-icon>
            </v-toolbar-title>

            <v-list v-if="userIn">
                <v-list-tile >
                    <v-list-tile-title>Profile</v-list-tile-title>
                </v-list-tile>
                <v-divider ></v-divider>
                <v-list-tile @click="logout">
                    <v-list-tile-title>Déconnecter</v-list-tile-title>
                </v-list-tile>

                <v-divider v-if="userIn"></v-divider>
                <v-list-tile @click="importDb">
                    <v-list-tile-title>Importer les plats</v-list-tile-title>
                </v-list-tile>

            </v-list>
            <v-list v-else>
              <v-list-tile @click="CreateUser()">
                  <v-list-tile-title>
                      S'enregistrer
                  </v-list-tile-title>
              </v-list-tile>
              <v-list-tile @click="login">
                    <v-list-tile-title>Connecter</v-list-tile-title>
                </v-list-tile>
            </v-list>
      </v-menu>
    </v-toolbar>

    <v-content >

      <v-container id="back" fill-height fluid  v-if="userIn">
        <v-slide-y-transition mode="out-in">
          <v-layout column align-center>
            <router-view></router-view>
          </v-layout>
        </v-slide-y-transition>
      </v-container>
      <v-container elevation-16 style="margin-top:50px; width:600px" v-else>
        <v-carousel hide-controls hide-delimiters>
          <v-carousel-item v-for="(item,i) in carousel" :src="item.src" :key="i"></v-carousel-item>
        </v-carousel>
      </v-container>
    </v-content>

</v-app>

</template>
<script>
import { EventBus } from "../event-bus.js";

var platsRef = {};

export default {
  created() {
    platsRef = this.$store.getters.dbPlats;
    var platsStd = this.$store.getters.dbPlatsStd;

    platsStd.on("child_added", snapshot => {
      const plat = snapshot.val();
      this.carousel.push({ src: plat.Image });
    });

    platsRef.on("child_added", snapshot => {
      this.plats.push({ ...snapshot.val(), id: snapshot.key });
    });

    platsRef.on("child_removed", snapshot => {
      const deletedPlat = this.plats.find(plat => plat.id === snapshot.key);
      const index = this.plats.indexOf(deletedPlat);
      this.plats.splice(index, 1);
    });

    EventBus.$on("popUp", payload => {
      this.popUp(payload);
    });
  },
  data() {
    return {
      timeout: 2000,
      platMenu: [
        {
          icon: "add",
          title: "Ajout"
        }
      ],
      carousel: [],
      items: [
        {
          icon: "/assets/images/Steak-icon.png",
          title: "Plats",
          action: "Plats",
          active: false,
          subMenu: [
            {
              icon: "add_box",
              title: "ajouter",
              action: "ajouterPlat"
            }
          ]
        },
        {
          icon: "/assets/images/menuIcon.jpg",
          title: "Menus",
          action: "Menus",
          active: false,
          subMenu: []
        },
        {
          icon: "/assets/images/Calendar-icon.png",
          title: "Programmes",
          action: "Programmes",
          active: false,
          subMenu: []
        }
      ],
      drawer: true,
      fixed: false,
      clipped: false,
      frmLogin: false,
      text: "",
      timeout: 2000,
      pop: false,
      userName: "",
      userPassword: "",
      userNameCreate: "",
      userPasswordCreate: "",
      userKey: "",
      plats: [],
      images: [],
      imgPage: 1,
      plat: {},
      showCreateUser: false
    };
  },
  methods: {
    ClickMe(to) {
      this.items.forEach(item => {
        item.active = false;
      });
      switch (to.action) {
        case "Plats":
          to.active = true;
          this.loadPlats();
          break;
        case "Menus":
          to.active = true;
          this.loadMenus();
          break;
        case "Programmes":
          to.active = true;
          this.loadProgrammes();
          break;
        case "ajouterPlat":
          EventBus.$emit("ajouterPlat");
          break;
      }
    },
    resetSubMenus() {},
    findPlat(element) {
      return element.title == "Plats";
    },
    loadPlats() {
      this.$router.push("/Plats");
    },
    loadMenus() {
      this.$router.push("/Menus");
    },
    loadProgrammes() {
      this.resetSubMenus();
      this.$router.push("/Programmes");
    },
    CreateUser() {
      this.userName = "";
      this.userPassword = "";
      this.showCreateUser = true;
    },
    confirmCreateUser() {
      this.showCreateUser = false;
    },
    cancelCreateUser() {
      this.showCreateUser = false;
    },
    getUserPsw(userKey, userPassword) {
      return new Promise((resolve, reject) => {
        var dbUsers = this.$store.getters.dbUsers;
        var psw = "";
        dbUsers
          .child(userKey)
          .once("value")
          .then(snap => {
            var data = snap.val();
            if (data.Infos.Password == userPassword) {
              resolve(data.Infos.Password);
            } else {
              reject("Mot de passe incorrect");
            }
          });
      });
    },
    getUserKey(userName) {
      return new Promise((resolve, reject) => {
        var dbUsers = this.$store.getters.dbUsers;
        var key = "";
        dbUsers
          .orderByChild("Nom")
          .equalTo(userName)
          .on("value", snap => {
            snap.forEach(data => {
              key = data.key;
              if (key != "") {
                resolve(key);
              } else {
                reject(userName + " inexistant");
              }
            });
          });
      });
    },
    doLog2() {
      var this2 = this;
      var userName = this.userName;
      var userPassword = this.userPassword;
      var userKey = "";
      this.getUserKey(userName)
        .then(function(key) {
          userKey = key;
          return this2.getUserPsw(key, userPassword);
        })
        .then(function(psw) {
          this2.userKey = userKey;
          this2.text = this2.userName + " connecté";
          this2.pop = true;
          this2.frmLogin = false;
          this2.drawer = true;
          var userObject = {
            userName: userName,
            userKey: userKey,
            userPsw: psw,
            route: this2.$router
          };
          this2.$store.dispatch("setUser", userObject);
          platsRef = this2.$store.getters.dbPlats;
          this2.drawer = true;
          EventBus.$emit(
            "popUp",
            "Utilisateur " + userObject.userName + " connecté"
          );
        })
        .catch(error => {
          EventBus.$emit("popUp", error);
        });
    },
    popUp(text) {
      console.log("Home - popUp:", text);
      this.text = text;
      this.pop = true;
    },
    doLog() {
      if (!this.userName) {
        this.text = "Vous devez vous identifer !";
        this.pop = true;
        //this.frmLogin = false;
      } else {
        var this2 = this;
        this.getUserKey(this.userName)
          .then(function(key) {
            this2.userKey = key;
            this2.text = this2.userName + " connecté";
            this2.pop = true;
            this2.frmLogin = false;
            this2.drawer = true;
            var userObject = {
              userName: this2.userName,
              userKey: this2.userKey,
              route: this2.$router
            };
            console.log("doLog:", userObject);
            this2.$store.dispatch("setUser", userObject);
            platsRef = this2.$store.getters.dbPlats;
            this2.drawer = true;
          })
          .catch(error => {});
      }
    },
    login() {
      this.userName = "";
      this.userPassword = "";
      this.frmLogin = true;
    },
    logout() {
      this.$store.dispatch("logOut", this.$router);
    },
    importDb() {
      var refDb = this.$store.getters.dbPlatsStd;
      refDb.on("child_added", snapshot => {
        let plat = snapshot.val();
        platsRef.push({
          Nom: plat.Nom,
          Image: plat.Image,
          Rating: plat.Rating
        });
      });
    }
  },
  computed: {
    userIn() {
      return this.$store.getters.userName;
    },
    drawerVisible: {
      get() {
        var isVisible = false;
        if (!this.userIn) {
          isVisible = false;
        } else {
          isVisible = this.drawer;
        }
        return isVisible;
      },
      set() {}
    }
  }
};
</script>

<style>
#back {
  background-image: url("/assets/images/background.jpg");
  height: fit-content;
  width: auto;
}
</style>

