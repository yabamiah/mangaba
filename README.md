# Mangaba

Desktop app em Tauri 2 + React + TypeScript para consultar a API do MangaDex, acompanhar lançamentos em portugues brasileiro e ler capitulos.

## Stack

- Bun como runtime/package manager esperado
- React + TypeScript + Vite no frontend
- Tauri 2 com comandos Rust no backend local
- `reqwest`, `tokio`, `governor`, `sled`, `rusqlite` e `rusqlite_migration`
- UI baseada em `@pequiplan/ui`, o pacote local em `packages/ui`

## Scripts

```bash
bun install
bun run dev
bun run tauri:dev
```

Tambem funciona com `npm install` e `npm run dev` para validar o frontend no navegador.

## Funcionalidades implementadas

- Busca por titulo e por URL/UUID do MangaDex
- Filtros de idioma original, status e classificacao
- Biblioteca local com acompanhamento
- Sincronizacao de capitulos em `pt-br`
- Leitor vertical, pagina unica e RTL
- Prefetch das proximas paginas no leitor
- Progresso local e marcacao de lido
- Configuracoes persistidas em SQLite
- Rate limiter global de 5 req/s
- Cache `sled` para evolucao de chamadas cacheadas
- Tipos Rust preparados com `ts-rs`

O frontend nunca chama MangaDex diretamente. Ele usa apenas `invoke()`; para testar a integracao real com MangaDex, execute o app via Tauri.
