# ORM benchmarks

## Methodology

TBD

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

To create the database and the schema, run the `prisma migrate dev` command by pointing it to the schema of your database.

#### PostgreSQL

If you use PostgreSQL, run:

```
npx prisma db push --schema ./prisma-pg/schema.prisma
```

#### MySQL

If you use MySQL, run:

```
npx prisma db push --schema ./prisma-mysql/schema.prisma
```

### 4. Run the benchmarks

```
sh ./benchmark.sh -i 30 -s 1000 --database-url postgresql://user:password@host:port/db
```

See below for the different options you can provide to any benchmark runs.

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
sh ./benchmark.sh -i 30 -s 1000 --database-url postgresql://user:password@host:port/db
```

## Debugging

You can turn on two debug setting via the `DEBUG` environment variable:

- `benchmarks:compare-results`: Compare the results at the end of each benchmark run. Note that this approach will consume more memory because the results of all executed queries are collected.
