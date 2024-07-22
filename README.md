![](./header.png)

# ORM Benchmarks

This repo contains the app that was used to collect the data for [ORM benchmarks](https://benchmarks.prisma.io). You can learn more about the benchmark methodology and results in this blog post: [Performance Benchmarks: Comparing Query Latency across TypeScript ORMs & Databases](https://www.prisma.io/blog/performance-benchmarks-comparing-query-latency-across-typescript-orms-and-databases).

## Setup

### 1. Set up the repo

Clone the repo, navigate into it and install dependencies:

```
git clone git@github.com:nikolasburk/bench.git
cd bench
npm install
```

### 2. Configure database connection

Set the `DATABASE_URL` environment variable to your database connection string in a `.env` file.

First, create a `.env` file:

```bash
touch .env
```

Then open the `.env` file and add the following line:

```bash
DATABASE_URL="your-database-url"
```

For example:

```bash
DATABASE_URL="postgresql://user:password@host:port/db"
```

<details><summary>Alternative: Set the <code>DATABASE_URL</code> in the terminal</summary>

Alternatively, you can set the `DATABASE_URL` in the terminal:

```bash
export DATABASE_URL="postgresql://user:password@host:port/db"
```

</details>

### 3. Run database migration

To create the database and the schema, run the `prisma db push` command by pointing it to the schema of your database.

#### PostgreSQL

If you use PostgreSQL, run:

```
npx prisma db push --schema ./prisma-pg/schema.prisma
```

> **Note**: We may add more databases in the future.

### 4. Run the benchmarks

> **Note for PostgreSQL**: Since the data preparation/seeding relies on `pg_dump` and `pg_restore`, the PostgreSQL versions of the machine that's executing the script must match the version of the target PostgreSQL server.

```
sh ./benchmark.sh -i 500 -s 1000 
```

This executes the benchmark scripts with 500 iterations and a sample size of 1000 records per table. See below for the different options you can provide to any benchmark runs.

The results of the benchmark run will be stored in a folder called `results/DB-SIZE-ITERATIONS-TIMESTAMP`, e.g. `results/postgresql-50-3-1721027353940`. This folder will have one `.csv` file per ORM, e.g.:

```
results/postgresql-50-3-1721027353940
├── drizzle.csv
├── prisma.csv
└── typeorm.csv
```

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
| `--database-url` | `-d`  | n/a     | Database connection string                         | No       |

For example:

```
sh ./benchmark.sh -i 500 -s 1000 --database-url postgresql://user:password@host:port/db
```

## Debugging

You can turn on two debug setting via the `DEBUG` environment variable:

- `benchmarks:compare-results`: Compare the results at the end of each benchmark run. Note that this approach will consume more memory because the results of all executed queries are collected.
