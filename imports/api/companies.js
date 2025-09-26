import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Companies = new Mongo.Collection('companies');
if (!Meteor.isServer) {

} else {
    Meteor.publish('companies', function companiesPublication() {
        return Companies.find({

        });
    });
}

Meteor.methods({
    'companies.hallo'() {
        console.log(" H A L L O");
    },
    'companies.removeall'() {
        // console.log("removeall");
        Companies.remove({});
    }
});