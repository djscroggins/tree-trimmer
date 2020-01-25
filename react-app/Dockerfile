FROM node:10.18.1

COPY . /app

WORKDIR /app

RUN mv scripts/entrypoint.sh entrypoint.sh \
    && chmod +x entrypoint.sh

RUN npm install --only=prod && npm run build

ENTRYPOINT ["/app/entrypoint.sh"]
