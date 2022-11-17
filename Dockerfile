FROM lukechannings/deno
EXPOSE 8080

ARG PORT_ARG=8080
ARG APP_HOST=0.0.0.0
ENV APP_PORT=$PORT_ARG
ENV APP_HOST=$APP_HOST
WORKDIR /app
USER deno
COPY deps.ts .
RUN deno cache deps.ts

COPY . .
RUN mkdir -p /var/tmp/log
CMD ["run", "--allow-all", "app.ts"]