import Vue from 'vue';
import Vuex from 'vuex';

import * as moment from 'moment';

import pdb from '@/pdb';

Vue.use(Vuex);

export default new Vuex.Store({

    state: {

        trackingNow: {
            startedAt: null
        },

        tracker: []
    },

    mutations: {

        startTracking(state, data) {
            state.trackingNow.startedAt = data.startedAt;
            state.trackingNow._rev = data._rev;
        },

        stopTracking(state, data) {
            state.trackingNow.startedAt = null;
            state.trackingNow._rev = data._rev;
        },

        addToTracker(state, data) {
            state.tracker.push(data);
        },

        clearTracker(state) {
            state.tracker = [];
        }

    },

    actions: {

        startTracking({commit, state}) {

            const startedAt = moment();

            const data = {
                startedAt: startedAt.toISOString(),
                _id: 'trackingNow'
            };

            if (state.trackingNow._rev) {
                data._rev = state.trackingNow._rev;
            }

            pdb.db.local.put(data).then((dbData) => {
                dbData._rev = dbData.rev;
                dbData.startedAt = startedAt;
                commit('startTracking', dbData);
            });

        },

        addTrackingNowToTracker({commit, state}) {

            return new Promise((resolve, reject) => {

                const finishedAt = moment();

                const data = {
                    startedAt: state.trackingNow.startedAt.toISOString(),
                    finishedAt: finishedAt.toISOString(),
                    _id: 'tracker_' + finishedAt.format('YYYYMMDDHHmmssSSS')
                };

                pdb.db.local.put(data).then((dbData) => {
                    dbData._rev = dbData.rev;
                    dbData.startedAt = state.trackingNow.startedAt;
                    dbData.finishedAt = finishedAt;
                    commit('addToTracker', dbData);
                    resolve();

                });

            });

        },

        stopTracking({commit, state, dispatch}) {

            return dispatch('addTrackingNowToTracker').then(() => {

                const data = {
                    _id: 'trackingNow',
                    _rev: state.trackingNow._rev,
                    startedAt: null
                };

                pdb.db.local.put(data).then((updateTrackingNowDbData) => {
                    updateTrackingNowDbData._rev = updateTrackingNowDbData.rev;
                    commit('stopTracking', updateTrackingNowDbData);
                });

            });

        }

    }

});
