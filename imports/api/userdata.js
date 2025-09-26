import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

//let coll = 0;
//export const UserData = new Mongo.Collection('users');
if (Meteor.isServer) {

    Meteor.publish('users', function userdataPublication() {
        return userData.find({});
    });

    Meteor.publish("userList", function () {

        var user = Meteor.users.findOne({
            _id: this.userId
        });


        // if (Roles.userIsInRole(user, ["admin"])) {
        return Meteor.users.find({}, {
            fields: {
                username: 1,
                profile: 1
            }
        });
        // }

        this.stop();
        return;
    });


    Meteor.methods({
        'userdata.hallo'() {
            console.log(" H A L L O");
        },
        // 'userdata.upsertAll'(data) {
        //     let query_object = {};
        //     query_object.firstName = data.firstName;
        //     query_object.lastName = data.lastName;
        //     query_object.email = data.email;
        //
        //     let dateTimeNow = new Date();
        //     let updated = data;
        //     updated.updatedAt = dateTimeNow;
        //
        //     // console.log("checklistvalues.upsertAll status " + status + " user name " + lastEditUserName + " record " + JSON.stringify(updated));
        //     UserData.upsert(query_object, {$set: updated});
        // },
        'userdata.createUserFromAdmin'(newUser) {
            Accounts.createUser(newUser);
        },
        'userdata.userUpdate': function (id, doc) {
            // Update account
            // console.log("userdata.userUpdate id " + JSON.stringify(id));
            // console.log("userdata.userUpdate doc " + JSON.stringify(doc));
            Meteor.users.update({"_id": id}, {
                $set: {
                    username: doc.username,
                    profile: doc.profile
                }
            });

            // Update password - only if changed
            if (doc.password != "not changed atall") {
                Accounts.setPassword({"_id": id}, doc.password);
            }

            return true;
        },
        'userdata.userUpdatePassword': function (id, doc) {
            // Update account password
            // console.log("userdata.userUpdatePassword id " + JSON.stringify(id));

            // Update password - always gets updated
            // if (doc.password != 'the same') {
                Accounts.setPassword(id, doc.password);
            // }

            return true;
        },

        userRemove: function (id) {

            Meteor.users.remove(id);

            return id;
        }
    });
}