#!/bin/bash


# Function to perform a benchmark run
run_benchmark() {
  npm start
}

# Default number of iterations
iterations=2
size=50

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

echo "Running benchmarks"
echo "Iterations: $iterations"
echo "Size: $size"

export ITERATIONS=$iterations
export SIZE=$size
if [ -n "$database_url" ]; then
  echo "Database URL: $database_url"
  export DATABASE_URL=$database_url
else
  echo "No database URL provided via command line, reading from .env ..."
fi


# Capture the start time
start_time=$(date +%s)

run_benchmark

# Capture the end time
end_time=$(date +%s)

# Calculate elapsed time in seconds
elapsed_time=$((end_time - start_time))

# Convert elapsed time to minutes and seconds
elapsed_minutes=$((elapsed_time / 60))
elapsed_seconds=$((elapsed_time % 60))

# Print the elapsed time
echo "Benchmark completed in $elapsed_minutes minutes and $elapsed_seconds seconds."
