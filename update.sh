#!/bin/sh
cd data
./updateData.sh
cd ..

cd src/server
./importData.sh
cd ..
