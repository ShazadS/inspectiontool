import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const History = new Mongo.Collection('history');
if (Meteor.isServer) {
    // let db1 = new MongoInternals.RemoteCollectionDriver('mongodb://localhost:27017/vinspectiontool');
    // coll = new Mongo.Collection('vehicles',  {_driver: db1});

    // This code only runs on the server
    // Only publish vehicles that are public or belong to the current user
    Meteor.publish('history', function historyPublication() {
        return History.find({
            $or: [
                { private: { $ne: true } },
                { owner: this.userId },
            ],
        });
    });
}

Meteor.methods({
    'history.create'(vin, checklisttype, checklistversion, dealerName, make, lastEditUserId, lastEditUserName, status, updateDate) {
        // console.log("history.upsertAll user=" + updateDate ); //  + JSON.stringify(valueslist));

        // todo add modelName and colour


        let query_object = {};
        query_object["VIN"] = vin;
        query_object["Type"] = checklisttype;
        // query_object["Version"] = checklistversion;
        // query_object["Dealer"] = dealerName;
        // query_object["Make"] = make;
        // query_object["UserId"] = lastEditUserId;
        // query_object["User"] = lastEditUserName;
        // query_object["Status"] = status;

        let updated = {};
        var options = {
            weekday: "short", year: "numeric", month: "short",
            day: "numeric", hour: "2-digit", minute: "2-digit"
        };
        updated["Date Updated"] = updateDate.toLocaleTimeString("en-NZ", options);
        updated.updateDate = updateDate;
        updated["Version"] = checklistversion;
        updated["Dealer"] = dealerName;
        updated["Make"] = make;
        updated["UserId"] = lastEditUserId;
        updated["User"] = lastEditUserName;
        updated["Status"] = status;
        History.upsert(query_object, {$set: updated});
    },

    'history.upsertAll'(vin, checklisttype, checklistversion, dealerName, make, lastEditUserId, lastEditUserName, status, updateDate) {
        // console.log("history.upsertAll user=" + updateDate ); //  + JSON.stringify(valueslist));

        // todo access rights check
        // Make sure the user is logged in before inserting a task
        // if (! userid) { // } Meteor.userId()) {
        //     throw new Meteor.Error('not-authorized');
        // }

        let query_object = {};
        query_object["VIN"] = vin;
        query_object["Type"] = checklisttype;
        query_object["Version"] = checklistversion;
        query_object["Dealer"] = dealerName;
        query_object["Make"] = make;
        query_object["UserId"] = lastEditUserId;
        query_object["User"] = lastEditUserName;
        query_object["Status"] = status;

        let updated = {};
        var options = {
            weekday: "short", year: "numeric", month: "short",
            day: "numeric", hour: "2-digit", minute: "2-digit"
        };
        updated["Date Updated"] = updateDate.toLocaleTimeString("en-NZ", options);
        updated.updateDate = updateDate;
        History.upsert(query_object, {$set: updated});
    },
    'history.removeall'() {
        // console.log("removeall");
        History.remove({});
    }
});

