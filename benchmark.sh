#!/bin/bash

# Function to restart PostgreSQL
# restart_postgres() {
#   sudo systemctl restart postgresql
# }

# Function to clear OS cache
# clear_os_cache() {
#   sudo sync
#   sudo sysctl -w vm.drop_caches=3
# }


# # Function to perform a benchmark run
run_benchmark() {
  # Clear caches
  # restart_postgres
  # clear_os_cache

  npm start
}

# Function to perform a benchmark run
# run_benchmark() {
#   npm start
# }

# Default number of iterations
iterations=2
size=50
# database_url="postgresql://nikolasburk:nikolasburk@localhost:5432/benchmark"

# Parse command-line arguments
while [[ "$#" -gt 0 ]]; do
  case $1 in
    -i|--iterations) iterations="$2"; shift ;;
    -s|--size) size="$2"; shift ;;
    -d|--database-url) database_url="$2"; shift ;;
    *) echo "Unknown parameter passed: $1"; exit 1 ;;
  esac
  shift
done

echo "Running benchmark iteration $i with size $size and database URL $database_url"
export ITERATIONS=$iterations
export SIZE=$size
export DATABASE_URL=$database_url
run_benchmark
