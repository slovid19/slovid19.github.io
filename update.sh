#!/bin/sh
cd data
./updateData.sh
cd ..

#cp data/export/* .
#git add *.json
#git commit -m "Updating Case data"
#git push

cd src/server
./importData.sh
cd ..
