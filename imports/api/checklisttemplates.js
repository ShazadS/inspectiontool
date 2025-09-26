/* copied from tasks.js */
import { Meteor } from 'meteor/meteor';
// import { MongoInternals } from 'meteor/mongo';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

//let coll = 0;
export const ChecklistTemplates = new Mongo.Collection('checklisttemplates');
if (!Meteor.isServer) {
    //coll = new Mongo.Collection('checklisttemplates');
} else {
        // Only publish checklisttemplates that are public or belong to the current user
    Meteor.publish('checklisttemplates', function checklisttemplatesPublication() {
        return ChecklistTemplates.find({ });
    });
}
// export const ChecklistTemplates = coll;

Meteor.methods({
    'checklisttemplates.hallo': function() {
        console.log(" H A L L O");
    },
    'checklisttemplates.upsert': function(query_object, body) {
        // console.log("checklisttemplates.upsert "); // + JSON.stringify(query_object));

        let updated = _.clone(body);
        updated.createdAt = new Date();
        ChecklistTemplates.upsert(query_object, {$set: updated});
    },
    'checklisttemplates.findone': function(query) {
        console.log("checklisttemplates.findone");
        let template = ChecklistTemplates.findOne(query);
        console.log("checklisttemplates.findone template" + JSON.stringify(template));
        return template;
    }
    // 'checklisttemplates.removeall': function() {
    //     // console.log("removeall");
    //     ChecklistTemplates.remove({});
    // }
});