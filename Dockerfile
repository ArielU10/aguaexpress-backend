# -------- Imagen base
FROM node:20-slim

# -------- Vars de entorno tempranas (opcional)
ENV NODE_ENV=production
ENV PORT=3000

# -------- Directorio de trabajo
WORKDIR /usr/src/app

# -------- Instalar dependencias (aprovecha cache)
COPY package*.json ./
# Usa el lockfile y solo deps de prod
RUN npm ci --only=production

# -------- Copiar código
COPY . .

# -------- Permisos y usuario no root
RUN chown -R node:node /usr/src/app
USER node

# -------- Exponer puerto
EXPOSE 3000

# -------- Healthcheck (con start-period)
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||3000)+'/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

# -------- Start
CMD ["node", "index.js"]
