<template>
    <v-container fluid>
        <v-layout>
            <v-date-picker v-model="picker" first-day-of-week="1" locale="fr" full-width></v-date-picker>
        </v-layout>

        <v-layout>
            <v-flex lg12 md12>
              <v-card>
                <v-card-title>
                  Semaine : {{weekNumber}}
                </v-card-title>
                <v-card-text>
                    <v-layout row wrap=""  >
                        <v-flex md4 lg4
                        v-for="i in 7"
                        :key="i" >
                        <div elevation-24>
                        <v-card>
                          <v-card-text>
                              Jour : {{weekDay(i)}}
                          </v-card-text>
                          <v-card-actions>
                            <v-btn flat block small >Supprimer</v-btn>
                          </v-card-actions>
                        </v-card>
                        </div>
                        </v-flex>
                    </v-layout>
                </v-card-text>
              </v-card>

            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
var moment = require("moment");
moment.locale("fr");

export default {
  data() {
    return {
      picker: null,
      week: [],
      weekNumber: 0,
      day: 0,
      days: [
        "Lundi",
        "Mardi",
        "Mercredi",
        "Jeudi",
        "Vendredi",
        "Samedi",
        "Dimanche"
      ],
      date: null
    };
  },
  watch: {
    picker: function(val) {
      //console.log(val);
      console.log(moment(val).week());
      console.log(moment(val).day());
      this.weekNumber = moment(val).week();
      this.day = moment(val).date();
    }
  },
  methods: {
    weekDay(i) {
      return this.days[i - 1];
    }
  },
  computed: {}
};
</script>

<style>
</style>

