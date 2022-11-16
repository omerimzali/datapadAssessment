# Install
- First you need to [Install Deno]('https://deno.land/manual@v1.28.0/getting_started/installation'). You can install with this command below (for Mac Os X - Linux)
  ```curl -fsSL https://deno.land/x/install/install.sh | sh```
- run the command below in repository directory
- ``` deno run --allow-read --allow-env --allow-net app.ts```

# Endpoints

## Avg. Revenue by Brand
`http://127.0.0.1:3000/metrics?id=revenue&dimensions=brand&aggregate=avg`

## Weekly Sessions


## Daily Conversion Date %
- `http://127.0.0.1:3005/metrics?id=conversion&dimensions=date&aggregate=distinct`


## Net Revenue of Each Customer
-`http://127.0.0.1:3000/metrics?id=net-revenue&dimensions=customer&aggregate=sum&filter.date.from=2020-09-10&filter.date.to=2020-09-29`
