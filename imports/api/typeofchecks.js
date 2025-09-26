import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Typeofchecks = new Mongo.Collection('typeofchecks');
if (!Meteor.isServer) {

} else {
    Meteor.publish('typeofchecks', function typeofchecksPublication() {
        return Typeofchecks.find({

        });
    });
}

Meteor.methods({
    'typeofchecks.hallo'() {
        console.log(" H A L L O");
    },
    // 'typeofchecks.removeall'() {
    //     // console.log("removeall");
    //     Typeofchecks.remove({});
    // }
});