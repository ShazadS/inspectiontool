/* copied from tasks.js */
import { Meteor } from 'meteor/meteor';
// import { MongoInternals } from 'meteor/mongo';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

//let coll = 0;
export const Checklists = new Mongo.Collection('checklists');
if (!Meteor.isServer) {
    //coll = new Mongo.Collection('checklists');
} else {
    // let db1 = new MongoInternals.RemoteCollectionDriver('mongodb://localhost:27017/vinspectiontool');
    //coll = new Mongo.Collection('checklists',  {_driver: db1});

    // This code only runs on the server
    // Only publish checklists that are public or belong to the current user
    Meteor.publish('checklists', function checklistsPublication() {
        return Checklists.find({
            $or: [
                { private: { $ne: true } },
                { owner: this.userId },
            ],
        });
    });
}
// export const Checklists = coll;

Meteor.methods({
    'checklists.insert'(name, text) {
        check(name, String);
        //check(text, String);
        console.log("Meteor.userId() " + JSON.stringify(Meteor.userId()));
        // Make sure the user is logged in before inserting a task
        if (! Meteor.userId()) {
            throw new Meteor.Error('not-authorized');
        }
        let uid = Meteor.userId();
        // console.log("Meteor.userId() " + JSON.stringify(Meteor.userId()));


        let uu = Meteor.user();
        // console.log("Meteor.user() " + JSON.stringify(uu));
        Checklists.insert({
            "template": text,
            "templateName": name,
            createdAt: new Date(),
            owner: Meteor.userId() //,
            // username: Meteor.user().username,
        });
    },
    'checklists.update'(name, text, userid) {
        console.log("checklists.update ");
        check(name, String);
        //check(text, String);
        console.log("Meteor.userId() " + JSON.stringify(Meteor.userId()));
        // Make sure the user is logged in before inserting a task
        if (! userid) { // } Meteor.userId()) {
            throw new Meteor.Error('not-authorized');
        }

        Checklists.update({
            "templateName": name,
            "owner": userid //,
            // username: Meteor.user().username,
        },{
            "template": text,
            "templateName": name,
            "createdAt": new Date(),
            "owner": userid
            // username: Meteor.user().username,
        }, {"upsert": true});
    },
    'checklists.removeall'() {
        console.log("removeall");
        Checklists.remove({});
    },
    'checklists.remove'(checklisttemplateId) {
        check(checklisttemplateId, String);

        const task = Checklists.findOne(checklisttemplateId);
        if (task.private && task.owner !== Meteor.userId()) {
            // If the task is private, make sure only the owner can delete it
            throw new Meteor.Error('not-authorized');
        }

        Checklists.remove(checklisttemplateId);
    },
    'checklists.setChecked'(checklisttemplateId, setChecked) {
        check(checklisttemplateId, String);
        check(setChecked, Boolean);

        const task = Checklists.findOne(checklisttemplateId);
        if (task.private && task.owner !== Meteor.userId()) {
            // If the task is private, make sure only the owner can check it off
            throw new Meteor.Error('not-authorized');
        }

        Checklists.update(checklisttemplateId, { $set: { checked: setChecked } });
    },
    'checklists.setPrivate'(checklistId, setToPrivate) {
        check(checklisttemplateId, String);
        check(setToPrivate, Boolean);

        const task = Checklists.findOne(checklisttemplateId);

        // Make sure only the task owner can make a task private
        if (task.owner !== Meteor.userId()) {
            throw new Meteor.Error('not-authorized');
        }

        Checklists.update(checklisttemplateId, { $set: { private: setToPrivate } });
    },
});