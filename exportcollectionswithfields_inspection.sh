#!/bin/bash
collection="vehicles"

echo "Exporting ${collection} to JSON"
/usr/bin/mongoexport \
  -h localhost:3001 \
  --db meteor \
  --collection ${collection} \
  --fields "vin" \
  --out /tmp/${collection}.json

echo "Extracting VINs only"
awk -F'"' '{
  for (i=1; i<=NF; i++) {
    if ($i == "vin") print $(i+2);
  }
}' /tmp/${collection}.json > /tmp/${collection}_vin_list.txt


echo "i ran" > /tmp/scriptran.txt
