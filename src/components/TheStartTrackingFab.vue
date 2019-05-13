<template>

    <ion-fab vertical="bottom" horizontal="end" slot="fixed">
        <ion-fab-button>
            <ion-icon name="play" v-on:click="buttonClicked"></ion-icon>
        </ion-fab-button>
    </ion-fab>

</template>

<script>

export default {
    name: 'TheStartTrackingFab',
    methods: {
        buttonClicked() {
            this.$store.dispatch('startTracking');
        }
    }
}

</script>
