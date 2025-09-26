import { Meteor } from 'meteor/meteor';
// import { MongoInternals } from 'meteor/mongo';
import { Mongo } from 'meteor/mongo';
export const PropData = new Mongo.Collection('propdata');
if (Meteor.isServer) {
    // let db1 = new MongoInternals.RemoteCollectionDriver('mongodb://localhost:27017/vinspectiontool');
    // coll = new Mongo.Collection('vehicles',  {_driver: db1});

    // This code only runs on the server
    // Only publish vehicles that are public or belong to the current user
    Meteor.publish('propdata', function propdataPublication() {
        return PropData.find({});
    });
}
Meteor.methods({


    'propdata.upsert.servername'(servername) {
        console.log("propdata.upsert ");
        PropData.upsert({type: "servername"}, {$set: {"prop": servername}});
    },
    'propdata.removeall'() {
        // console.log("removeall");
        PropData.remove({});
    }
});

