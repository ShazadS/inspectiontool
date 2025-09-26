import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const VehicleTypes = new Mongo.Collection('vehicletypes');
if (Meteor.isServer) {
    // let db1 = new MongoInternals.RemoteCollectionDriver('mongodb://localhost:27017/vinspectiontool');
    // coll = new Mongo.Collection('vehicletypes',  {_driver: db1});

    // This code only runs on the server
    // Only publish vehicletypes that are public or belong to the current user
    Meteor.publish('vehicletypes', function vehicletypesPublication() {
        return VehicleTypes.find({
            // $or: [
            //     { private: { $ne: true } },
            //     { owner: this.userId },
            // ],
        });
    });
}

Meteor.methods({
    'vehicletypes.updateStatus'(query_object, status) {
        console.log("vehicletypes.updateStatus " );

        // todo access rights check
        // Make sure the user is logged in before inserting a task
        // if (! userid) { // } Meteor.userId()) {
        //     throw new Meteor.Error('not-authorized');
        // }
        let updated = {};
        updated.status = status;
        updated.createdAt = new Date();

        VehicleTypes.upsert(query_object, { $set: updated });
    },
    'vehicletypes.upsertAll'(query_object, valueslist, status, signaturePic, lastEditUserName, lastEditUserId) {
        //  console.log("vehicletypes.upsertAll " + JSON.stringify(valueslist));

        // todo access rights check
        // Make sure the user is logged in before inserting a task
        // if (! userid) { // } Meteor.userId()) {
        //     throw new Meteor.Error('not-authorized');
        // }
        let updated = {};

        updated.status = status;
        updated.signaturePic = signaturePic;
        updated.createdAt = new Date();
        updated.lastEditUserName = lastEditUserName;
        updated.lastEditUserId = lastEditUserId;
        updated.valueslist = valueslist;
        VehicleTypes.upsert(query_object,  { $set: updated });
    },
    'vehicletypes.upsertModelName'(newModel){
        // inserts or updates

        let query_object = {
            modelName: newModel.modelName
        };
        if (Meteor.isServer) {
            VehicleTypes.upsert(query_object, {$set: newModel})
        }
    },
    'vehicletypes.removeall'() {
        // console.log("removeall");
        // VehicleTypes.remove({});
    }
});