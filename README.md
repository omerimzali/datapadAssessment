# Install
- First you need to [Install Deno]('https://deno.land/manual@v1.28.0/getting_started/installation'). You can install with this command below (for Mac Os X - Linux)
  ```curl -fsSL https://deno.land/x/install/install.sh | sh```
- .env should be created. (There's an example called .env.example )
- run the command below in repository directory
- ``` deno run --allow-read --allow-env --allow-net app.ts```
- 
- Default IP:port will be 127.0.0.1:3000, You can change it with .env file

# Details
This repo created for [DatapodOfficial Assesment]('https://github.com/datapadofficial/assessment-backend')

There are 4 Classes called Brand, Conversion, Customer and SpreadSheet.
SpreadSheet is doing the call, over GoogleSheets API and  It's calculating the expected metric.

A worker that periodically pulls this data and prepares the metrics (every 5 minutes) can provide a much faster response. But I did not work in this direction because I think that this does not meet the scope of the test case.

## notes
I used customer_id instead of customer name, because the data doesn't provide customer names.


# Endpoints

## Avg. Revenue by Brand
`http://127.0.0.1:3000/metrics?id=revenue&dimensions=brand&aggregate=avg`

## Weekly Sessions
`http://127.0.0.1:3000/metrics?id=sessions&dimensions=date.weeknum&aggregate=distinct`

## Daily Conversion Date %
- `http://127.0.0.1:3000/metrics?id=conversion&dimensions=date&aggregate=distinct`


## Net Revenue of Each Customer
-`http://127.0.0.1:3000/metrics?id=net-revenue&dimensions=customer&aggregate=sum&filter.date.from=2020-09-10&filter.date.to=2020-09-29`


