import axios from 'axios';

import utils from './Utils';

export default {

    registerNewUser(userData) {

        return new Promise((resolve, reject) => {

            axios.post(
                utils.pathConcat([process.env.VUE_APP_POUCHDB_REMOTE_SERVER, '/auth/register']),
                userData
            ).then(response => {
                console.error('Success!');
                console.error(response);
                /*
                {
                	"issued": 1557936418468,
                	"expires": 1558022818468,
                	"provider": "local",
                	"token": "exKQci6pQa25a16xO_qSkg",
                	"password": "b4FkEaN6QTCO2A20UISJaw",
                	"user_id": "dani@on4u.es",
                	"roles": ["user"],
                	"userDBs": {
                		"ttrack": "https://exKQci6pQa25a16xO_qSkg:b4FkEaN6QTCO2A20UISJaw@ttrack-couchdb-server-daniprofe.c9users.io/ttrack$dani(40)on4u(2e)es"
                	}
                }
                 */
            }).catch(failData => {
                reject(failData);
            });

        });


    }

};
