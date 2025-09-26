import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

//let coll = 0;
export const Roles = new Mongo.Collection('roles');
if (!Meteor.isServer) {
    //coll = new Mongo.Collection('roles');
} else {
    // let db1 = new MongoInternals.RemoteCollectionDriver('mongodb://localhost:27017/vinspectiontool');
    // coll = new Mongo.Collection('roles',  {_driver: db1});

    // This code only runs on the server
    // Only publish locations that are public or belong to the current user
    Meteor.publish('roles', function rolesPublication() {
        return Roles.find({
        });
    });
}

Meteor.methods({
    'roles.hallo'() {
        console.log(" H A L L O");
    },
    'roles.removeall'() {
        // console.log("removeall");
        Roles.remove({});
    }
});