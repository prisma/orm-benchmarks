# ORM benchmarks

## Setup

### 1. Set up the repo

Clone the repo, navigate into it and install dependencies:

```
git clone git@github.com:nikolasburk/bench.git
cd bench
npm install
```

### 2. Configure database connection

Set the `DATABASE_URL` environment variable to your database connection string:

```bash
export DATABASE_URL="postgresql://user:password@host:port/db"
```

<details><summary>Alternative: Set the <code>DATABASE_URL</code> in a <code>.env</code> file</summary>

Alternatively, you can add set the `DATABASE_URL` in a `.env` file:

```bash
touch .env
```

Then open the `.env` file and add the following line:

```bash
DATABASE_URL=""
```

</details>

### 3. Run database migration

To create the database and the schema, run the `prisma migrate dev` command by pointing it to the schema of your database.

#### PostgreSQL

If you use PostgreSQL, run:

```
npx prisma migrate dev --name init --schema ./prisma-postgres/schema-postgres.prisma
```


#### MySQL

If you use MySQL, run:

```
npx prisma migrate dev --name init --schema ./prisma-mysql/schema-mysql.prisma
```

### 4. Prepare the `data` and `results` folders

```
mkdir data
mkdir results
```

### 5. Run the benchmarks

```
sh ./benchmark.sh -i 30 -s 1000 --database-url postgresql://user:password@host:port/db
```

See below for the different options you can provide to any benchmark runs.

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

## Debugging

You can turn on two debug setting via the `DEBUG` environment variable:

- `benchmarks:compare-results`: compare the results at the end of each benchmark run