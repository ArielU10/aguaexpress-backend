# -------- Imagen base
FROM node:20-slim

# -------- Directorio de trabajo
WORKDIR /usr/src/app

# -------- Instalar dependencias (aprovecha cache)
COPY package*.json ./
# Si usas npm:
RUN npm ci --omit=dev
# (Si tu app necesita devDependencies en prod, quita --omit=dev)

# -------- Copiar código
COPY . .

# -------- Permisos y usuario no root
RUN chown -R node:node /usr/src/app
USER node

# -------- Vars y puertos
ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

# -------- Healthcheck (opcional pero útil)
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD node -e "fetch('http://localhost:'+(process.env.PORT||3000)+'/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

# -------- Start
CMD ["node","index.js"]
