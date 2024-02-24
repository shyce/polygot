```bash
docker run --rm -v ${PWD}:/app -w /app node:latest bash -c "npm install typescript --global && tsc main.ts && node main.js"
```

```bash
docker run --rm -v ${PWD}:/app -w /app golang:1.17 bash -c "go mod init asyncqueue && go build && ./asyncqueue"
```

```bash
docker run --rm -v ${PWD}:/app -w /app rust:1.58 bash -c "cargo build --release && ./target/release/async_queue"
```
