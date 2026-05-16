# STAGE 1: Build the binary
FROM golang:1.26-alpine AS builder

WORKDIR /app

# Copy dependency files first for better caching
COPY go.mod go.sum ./
RUN go mod download

# Copy the source code and build
COPY . .
RUN go build -o main .

# STAGE 2: Run the binary
FROM alpine:latest
WORKDIR /root/

# Copy only the compiled binary from the builder stage
COPY --from=builder /app/main .

EXPOSE 8080
CMD ["./main"]