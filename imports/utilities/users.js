Meteor.methods({
    'users.listusers'(company, dealer) {
        // console.log("users.listusers company " + company);
        // console.log("users.listusers dealer " + dealer);
        var query = {};
        if (company && company.length > 0 && company != "ALL") {
            query["profile.company"] = company;
        }
        if (dealer && dealer.length > 0 && dealer != "ALL") {
            query["profile.dealer"] = dealer;
        }
        // console.log("users.listusers query " + JSON.stringify(query));
        var userlist = Meteor.users.find({}).fetch();
        var result = [];
        userlist.forEach(function(uu) {
            var fitCompany =  company == "ALL" || uu.profile.company == company;
            var fitDealer =  dealer == "ALL" || uu.profile.dealer == dealer;
            if (fitCompany && fitDealer) {
                result.push(uu);
            }
        });

        return result;
    }
});