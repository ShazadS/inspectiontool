


    Meteor.methods({
        'checklistvalues.halloserver'(str){
            console.log("halloserver " + str);
            if (str) {
                return {"result": str}
            } else {
                return null;
            }
    }

    });

