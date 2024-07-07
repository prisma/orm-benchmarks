# ORM benchmarks

## Setup

1. Clone repo
1. Set DB connection
1. Migrate DB
1. Generate Prisma Client
1. Create `data` and `results` folders
1. Run benchmarks

## Usage

### Executing the benchmarks


You can execute the benchmarks by running the [`benchmark.sh`](./benchmark.sh):

```
sh ./benchmark.sh [options]
```

### Options

You can provide the following options to the script:

| Name             | Short | Default | Description                                        | Required |
| ---------------- | ----- | ------- | -------------------------------------------------- | -------- |
| `--iterations`   | `-i`  | 10      | Number of times to execute the benchmarks          | No       |
| `--size`         | `-s`  | 50      | Size of the data set (number of records per table) | No       |
| `--database-url` | `-d`  | n/a     | Database connection string                         | Yes      |

For example:

```
sh ./benchmark.sh -i 30 -s 1000 --database-url postgresql://user:password@host:port/db
```

### Output

The results of the benchmark runs are stored in a folder called `results`. Make sure this folder exists on your machine before running the benchmarks.
