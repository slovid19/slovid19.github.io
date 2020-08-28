#!/bin/sh
cd slovid_data_gathering
./updateData.sh
cd ..

cp slovid_data_gathering/export/* .
git add *.json
git commit -m "Updating Case data"
git push

cd src/server
./importData.sh
cd ..
