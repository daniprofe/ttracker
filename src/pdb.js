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

            let momentStartedAt = null;

            if (data.startedAt) {
                momentStartedAt = moment(data.startedAt, moment.ISO_8601);
                if (!momentStartedAt.isValid()) {
                    momentStartedAt = null;
                }
            }

            data.startedAt = momentStartedAt;

            console.error('Loaded data:');
            console.error(data);
            store.commit('startTracking', data);

        });
    },

    loadTracker() {
        this.db.local.allDocs({include_docs: true}).then(data => {
            if (data && data.rows && Array.isArray(data.rows)) {
                store.commit('clearTracker');
                data.rows.forEach((row) => {
                    if (row.doc) {
                        row.doc.startedAt = moment(row.doc.startedAt, moment.ISO_8601);
                        row.doc.finishedAt = moment(row.doc.finishedAt, moment.ISO_8601);
                        store.commit('addToTracker', row.doc);
                    }
                });
            }
        });
    },

    init() {
        this.db.local = new PouchDB('ttracker');
        this.loadTrackingNow();
        this.loadTracker();
    },

};

pdb.init();

export default pdb;
