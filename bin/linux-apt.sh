#!/bin/bash
pip="pip install -r requirements.txt"
npm="npm i"
python="sudo apt-get install python pip"
node="sudo apt-get install nodejs npm"

echo '------------------------ REQUIRED SOFTWARE -----------------------------------'

echo "Installing Node.JS and Python, please wait...";
echo `${node}`
echo `${python}`

echo '------------------------ REQUIRED PACKAGES -----------------------------------'

echo "Installing Python requirements, please wait...";
echo `${pip}`

echo "Installing Node.JS requirements, please wait...";
echo `${npm}`
