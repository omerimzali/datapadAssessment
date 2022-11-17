# Install
## Install with repository
- First you need to [Install Deno]('https://deno.land/manual@v1.28.0/getting_started/installation'). You can install with this command below (for Mac Os X - Linux)
  ```curl -fsSL https://deno.land/x/install/install.sh | sh```
- .env should be created. (There's an example called .env.example )
- run the command below in repository directory
- ``` deno run --allow-read --allow-env --allow-net app.ts``` ps: be sure to say yes grant access request via terminal
- 
- Default IP:port will be 127.0.0.1:3001, You can change it with .env file
## Install with Docker
- There are 2 Dockerfiles in this repository. If you're a ARM based processor user, you can use directly `Dockerfile`. If you're not, change the name and use the other one called `Dockerfile.notarm`. I didn't have a chance to try this second one but I used offical deno image in it.
-  `docker build -t denoadaptorcase .`
-  `docker run -dp 8080:8080 denadaptorcase`
# Details
This repo created for [DatapodOfficial Assesment]('https://github.com/datapadofficial/assessment-backend')

There are 4 Classes called Brand, Conversion, Customer and SpreadSheet.
SpreadSheet is doing the call, over GoogleSheets API and  It's calculating the expected metric.

A worker that periodically pulls this data and prepares the metrics (every 5 minutes) can provide a much faster response. But I did not work on this direction because I think that this does not meet the scope of the test case.

# Tests
You can run test with `deno test` command. Tests are provided

# Documents
You can get documents with `deno doc` or `deno doc --json` 

## notes
I used customer_id instead of customer name, because the data doesn't provide customer names.
I created a local file to run tests local.
I add my own GoogleSpreadSheet API.K€Y by own purpose. I know credentials are dangerous to be shared in a public format. I did it for you to have more easy installation steps.


# Endpoints

## Avg. Revenue by Brand
`http://127.0.0.1:3001/metrics?id=revenue&dimensions=brand&aggregate=avg` or `http://localhost:8080/metrics?id=revenue&dimensions=brand&aggregate=avg`

## Weekly Sessions
`http://127.0.0.1:3001/metrics?id=sessions&dimensions=date.weeknum&aggregate=distinct` or `http://localhost:8080/metrics?id=sessions&dimensions=date.weeknum&aggregate=distinct`

## Daily Conversion Date %
- `http://127.0.0.1:3001/metrics?id=conversion&dimensions=date&aggregate=distinct`  or `http://localhost:8080/metrics?id=conversion&dimensions=date&aggregate=distinct`


## Net Revenue of Each Customer
-`http://127.0.0.1:3001/metrics?id=net-revenue&dimensions=customer&aggregate=sum&filter.date.from=2020-09-10&filter.date.to=2020-09-29`  or `http://localhost:8080/metrics?id=net-revenue&dimensions=customer&aggregate=sum&filter.date.from=2020-09-10&filter.date.to=2020-09-29`


