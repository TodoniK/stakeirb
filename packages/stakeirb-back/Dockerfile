FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
COPY packages/stakeirb-back/package*.json packages/stakeirb-back/
RUN npm ci --omit=dev --workspace=packages/stakeirb-back --include-workspace-root=false

COPY packages/stakeirb-back packages/stakeirb-back
WORKDIR /app/packages/stakeirb-back

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000
CMD ["npm", "run", "start"]
