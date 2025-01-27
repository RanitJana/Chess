#!/bin/bash

clear

# Define variables for PIDs
server_pid=0
client_pid=0

# Function to handle cleanup on script exit
cleanup() {
    echo -e "🥲 Stopping servers..."
    [[ $server_pid -ne 0 ]] && kill $server_pid 2>/dev/null && echo "Node.js server stopped."
    [[ $client_pid -ne 0 ]] && kill $client_pid 2>/dev/null && echo "React server stopped."
    exit 0
}

# Trap signals for cleanup
trap cleanup SIGINT SIGTERM

# Start Node.js server
startBackend() {
    echo "💀 Starting Node.js server..."
    cd ./server || {
        echo "Error: Cannot find 'server' directory."
        exit 1
    }
    npm install &>/dev/null || {
        echo "Error: Failed to install Node.js dependencies."
        exit 1
    }
    npm run write &>/dev/null || {
        echo "Error: Failed to run 'write' script."
        exit 1
    }
    npm start &>/dev/null &
    server_pid=$! # Capture the process ID of the Node.js server
    echo "👉 Node.js server started with PID: $server_pid"
    echo ""
    cd - &>/dev/null || exit
}

# Start React server
startFrontend() {
    echo "🥶 Starting React server..."
    cd ./client || {
        echo "Error: Cannot find 'client' directory."
        exit 1
    }
    npm install &>/dev/null || {
        echo "Error: Failed to install React dependencies."
        exit 1
    }
    npm run write &>/dev/null || {
        echo "Error: Failed to run 'write' script."
        exit 1
    }
    npm run dev &>/dev/null &
    client_pid=$! # Capture the process ID of the React server
    echo "👉 React server started with PID: $client_pid"
    echo ""
    cd - &>/dev/null || exit
}

# Start both servers
startBackend
startFrontend

# Inform the user that the servers are running
echo "Both servers are running in the background."
echo "🚫 Press Ctrl+C to stop both servers."
echo ""

# Wait for both servers to terminate
wait $server_pid $client_pid
