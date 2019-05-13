import Vue from 'vue';
import Vuex from 'vuex';

import * as moment from 'moment';

import pdb from '@/pdb';

Vue.use(Vuex);

export default new Vuex.Store({

    state: {
        trackingNow: {},
        tracker: []
    },

    mutations: {

        startTracking(state, data) {
            state.trackingNow = data;
        },

        stopTracking(state, data) {
            state.trackingNow.startedAt = null;
            state._rev = data._rev;
        },

        addRecordToTracker(state, data) {
            state.tracker.push(data);
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
                console.error('update!!');
                data._rev = state.trackingNow._rev;
            }

            console.error('Data to write on trackingNow:');
            console.error(data);

            pdb.db.local.put(data).then((dbData) => {
                dbData.startedAt = startedAt;
                commit('startTracking', dbData);
            });

        },

        addRecordToTracker({commit, state}) {

            const finishedAt = moment();

            const data = {
                startedAt: state.trackingNow.startedAt.toISOString(),
                finishedAt: finishedAt.toISOString(),
                _id: 'tracker_' + finishedAt.format('YYYYMMDDHHmmssSSS')
            };

            pdb.db.local.put(data).then((dbData) => {

                dbData.startedAt = state.trackingNow.startedAt;
                dbData.finishedAt = finishedAt;
                commit('addRecordToTracker', dbData);

            });

        },

        stopTracking({commit, state}) {

            const data = {
                _id: 'trackingNow',
                _rev: state.trackingNow._rev,
                startedAt: null
            };

            console.error('---- update trackingNow startedAt to null ----');
            console.error(data);

            pdb.db.local.put(data).then((updateTrackingNowDbData) => {
                console.error('---- trackingNow updated!! startedAt should be null! ----');
                console.error(updateTrackingNowDbData);
                commit('stopTracking', updateTrackingNowDbData);
            });

        }
    }

});
