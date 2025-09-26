import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

//let coll = 0;
export const Locations = new Mongo.Collection('locations');
if (!Meteor.isServer) {
    //coll = new Mongo.Collection('locations');
} else {
    // let db1 = new MongoInternals.RemoteCollectionDriver('mongodb://localhost:27017/vinspectiontool');
    // coll = new Mongo.Collection('locations',  {_driver: db1});

    // This code only runs on the server
    // Only publish locations that are public or belong to the current user
    Meteor.publish('locations', function locationsPublication() {
        return Locations.find({

        });
    });
}

Meteor.methods({
    'locations.hallo'() {
        console.log(" H A L L O");
    },
    'locations.removeall'() {
        // console.log("removeall");
        Locations.remove({});
    }
});