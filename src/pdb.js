import store from '@/store';
import PouchDB from 'pouchdb';

import * as moment from 'moment';

const pdb = {

    db: {
        local: null,
        remote: null
    },

    loadTrackingNow() {
        this.db.local.get('trackingNow').then(data => {
            data.startedAt = moment(data.startedAt, moment.ISO_8601);
            console.error('Loaded data:');
            console.error(data);
            store.commit('startTracking', data);
        });
    },

    loadTracker() {

    },

    init() {
        this.db.local = new PouchDB('ttracker');
        this.loadTrackingNow();
    },

};

pdb.init();

export default pdb;
