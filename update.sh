#!/bin/sh
cd data
./updateData.sh
cd ..

cp data/export/* .

cd src/server
./importData.sh
cd ..
