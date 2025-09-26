import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const DealersShort = new Mongo.Collection('dealersshort');

if (Meteor.isServer) {
    Meteor.publish('dealersshort', function dealersshortPublication() {
        return DealersShort.find({
        });
    });
}

Meteor.methods({
    'dealersshort.hallo'() {
        console.log(" H A L L O");
        let dss = DealersShort.find({
        }).fetch();
        console.log("all dealers " + JSON.stringify(dss));
    },
    'dealersshort.upsertdealershort'(newDealer) {
        //console.log("upsertdealershort");

        let query_object = {
            dealer: newDealer.dealer
        };
        if (Meteor.isServer) {
            let maxKey = 1;
            let dealrsKeys = DealersShort.find({}).fetch();

            dealrsKeys.forEach(function(kk){
                console.log("keys " + JSON.stringify(kk));
                if (kk.key > maxKey) {
                    maxKey = kk.key;
                }
            });
            newDealer.key = ++maxKey;
            console.log("upsertdealershort " + JSON.stringify(newDealer));
            DealersShort.upsert(query_object, {$set: newDealer})
        }
    }
});
