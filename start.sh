#!/bin/bash

clear
# Start Node.js server
echo "Starting Node.js server..."
cd ./server || exit
npm install
npm run write
npm start & # Run in the background
server_pid=$! # Capture the process ID of the Node.js server

cd ..

# Start React server
echo "Starting React server..."
cd ./client || exit
npm install
npm run write
npm run dev & # Run in the background
client_pid=$! # Capture the process ID of the React server

# Return to the root directory
cd ..

# Wait for both servers to terminate
echo "Both servers are running in the background."
echo "Node.js Server PID: $server_pid"
echo "React Server PID: $client_pid"
wait $server_pid $client_pid
