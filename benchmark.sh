#!/bin/bash

# Function to restart PostgreSQL
restart_postgres() {
  sudo systemctl restart postgresql
}

# Function to clear OS cache
clear_os_cache() {
  sudo sync
  sudo sysctl -w vm.drop_caches=3
}

# Function to perform a benchmark run
run_benchmark() {
  # Clear caches
  restart_postgres
  clear_os_cache

  # Run your benchmark tool here
  npm run run:all
}

# Main loop to run multiple benchmarks
for i in {1..10}; do
  echo "Running benchmark iteration $i"
  run_benchmark
done
