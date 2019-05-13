<template>
    <!-- <ion-card> -->
      <ion-item>
        <ion-icon name="walk" slot="start"></ion-icon>
        <ion-label>Started: {{startedAt}}, Ellapsed: {{ellapsed}}</ion-label>
        <ion-button shape="round" v-on:click="stop">
            <ion-icon slot="icon-only" name="stopwatch"></ion-icon>
        </ion-button>
      </ion-item>

      <!-- <ion-card-content>
        This is content, without any paragraph or header tags,
        within an ion-card-content element.
      </ion-card-content>
  </ion-card> -->
</template>

<script>

import * as moment from 'moment';

export default {

    name: 'TheTracker',

    data() {
        return {
            now: null
        }
    },

    created() {
        if (!this.timer) {
            console.error('timer started!');
            this.timer = setInterval( () => {
                this.now = moment();
            }, 1000);
        }
    },

    computed: {

        startedAt() {

            if (!this.$store.state.trackingNow.startedAt) {
                return '';
            }

            return this.$store.state.trackingNow.startedAt.format('HH:mm:ss');

        },

        ellapsed() {

            if (!this.now || !this.$store.state.trackingNow.startedAt) {
                return '';
            }

            const duration = moment.duration(this.now.diff(this.$store.state.trackingNow.startedAt));
            return Math.floor(duration.asHours()) + moment.utc(duration.asMilliseconds()).format(":mm:ss");

        }
    },

    methods: {
        stop() {
            this.$store.dispatch('stopTracking');
        }
    }

}

</script>
