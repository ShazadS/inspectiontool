import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
import {check} from 'meteor/check';

//let coll = 0;
export const Dealers = new Mongo.Collection('dealers');

if (!Meteor.isServer) {
    //coll = new Mongo.Collection('dealers');

} else {

    // Dealers._ensureIndex({
    //     'dealer': 1
    // });

    // let db1 = new MongoInternals.RemoteCollectionDriver('mongodb://localhost:27017/vinspectiontool');
    // coll = new Mongo.Collection('dealers',  {_driver: db1});

    // This code only runs on the server
    // Only publish locations that are public or belong to the current user
    Meteor.publish('dealers', function dealersPublication() {

	//let d = Dealers.find({}).fetch();
        //console.log("all dealers from dealers collection " + JSON.stringify(d));

        return Dealers.find({});

    });
}

Meteor.methods({
    'dealers.hallo'() {
        console.log(" H A L L O");
    },
    'dealers.upsertdealercode'(newDealerCode) {
        // console.log("upsertdealercode");


        if (Meteor.isServer) {
            let query_object = {
                "Dealer Code": newDealerCode.dealercode
            };
            Dealers.upsert(query_object, {$set: newDealerCode})
        }
    }
    // ,
    // 'dealers.removeall'() {
    //     // console.log("removeall");
    //     Dealers.remove({});
    // }
});
