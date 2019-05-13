<template>

  <div class="ion-page">
    <ion-header>
      <ion-toolbar>
        <ion-title>TTracker</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">

        <ion-list v-show="!trackerIsEmpty">
            <ion-item v-for="(trackerRecord, index) in this.$store.state.tracker">
                <ul>
                    <li><strong>Started at:</strong> {{trackerRecord.startedAt.format('HH:mm:ss')}}</li>
                    <li><strong>Finished at:</strong> {{trackerRecord.finishedAt.format('HH:mm:ss')}}</li>
                    <li><strong>Ellapsed:</strong> {{ellapsed[index]}}</li>
                </ul>
            </ion-item>
        </ion-list>

        <TheStartTrackingFab v-show="!trackingNow"></TheStartTrackingFab>

    </ion-content>

    <ion-footer>
        <TheTracker v-show="trackingNow"></TheTracker>
    </ion-footer>

  </div>

</template>

<style>
</style>

<script>

import * as moment from 'moment';

import TheStartTrackingFab from '@/components/TheStartTrackingFab';
import TheTracker from '@/components/TheTracker';

export default {

    name: 'home',

    components: {
        TheTracker,
        TheStartTrackingFab
    },

    computed: {

        trackingNow() {
            console.error('-----------------------');
            console.error(this.$store.state.trackingNow.startedAt);
            return (this.$store.state.trackingNow.startedAt);
        },

        trackerIsEmpty() {
            return this.$store.state.tracker.length === 0;
        },

        ellapsed() {

            return this.$store.state.tracker.map((trackerEntry) => {
                const duration = moment.duration(trackerEntry.finishedAt.diff(trackerEntry.startedAt));
                return Math.floor(duration.asHours()) + moment.utc(duration.asMilliseconds()).format(":mm:ss");
            });

        }
    },

    methods: {

    }

}

</script>
