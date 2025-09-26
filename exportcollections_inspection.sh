#!/bin/bash
date=$1

#for iicoll in  checklistmains checklisttemplates checklistvalues companies \cronHistory dealers dealersshort locations propdata roles typeofchecks \
#users vehicles vehiclesadded vehicletypes ;
#for iicoll in dealers vehicles vehicletypes;
for iicoll in vehicles;
do

    echo "export ${iicoll}"
mongoexport -h localhost:3001 --db meteor --collection ${iicoll} > /tmp/${iicoll}.json
done
        
