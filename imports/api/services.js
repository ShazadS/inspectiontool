import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Services = new Mongo.Collection('services');
if (!Meteor.isServer) {

} else {
    Meteor.publish('services', function companiesPublication() {
        return Services.find({

        });
    });
}

Meteor.methods({
    'services.hallo'() {
        console.log(" H A L L O");
    },
    'services.removeall'() {
        // console.log("removeall");
        Services.remove({});
    }
});