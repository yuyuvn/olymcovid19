FROM node:13.12

ENV DEBIAN_FRONTEND noninteractive

ENV PATH=/root/.cargo/bin:$PATH

RUN apt-get update && apt-get upgrade -qy && \
    apt-get install -y --no-install-recommends \
    curl git openssl libssl-dev ca-certificates \
    build-essential python cmake && \
    apt-get clean && rm -rf /var/cache/apt/archives/* /var/lib/apt/lists/*

RUN curl https://sh.rustup.rs -sSf | sh -s -- --default-toolchain nightly -y && \
    rustup update && \
    rustup install stable && \
    rustup default stable && \
    rustup target add wasm32-unknown-emscripten

RUN yarn global add webpack webpack-cli && cargo install wasm-pack

ENV PATH=$PATH:/emscripten/emsdk-portable:/emscripten/emsdk-portable/clang/fastcomp/build_incoming_64/bin:/emscripten/emsdk-portable/emscripten/incoming

WORKDIR /app

COPY package.json package.json
COPY yarn.lock yarn.lock

RUN yarn

COPY . .

RUN yarn run build

EXPOSE 8000
