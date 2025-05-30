FROM playground-php-wasm:base

ARG JSPI

RUN mkdir -p /root/lib/include /root/lib/lib
COPY ./libz/ /root/libz
RUN if [ "$JSPI" = "1" ]; then \
        cp -r /root/libz/jspi/dist/root/lib/* /root/lib; \
    else \
        cp -r /root/libz/asyncify/dist/root/lib/* /root/lib; \
    fi

RUN set -euxo pipefail; \
	wget https://ftp.gnu.org/pub/gnu/libiconv/libiconv-1.17.tar.gz; \
	tar -xvf libiconv-1.17.tar.gz; \
	rm libiconv-1.17.tar.gz;

WORKDIR /root/libiconv-1.17

RUN set -euxo pipefail; \
	source /root/emsdk/emsdk_env.sh; \
	CPPFLAGS="-I/root/lib/include " \
	LDFLAGS="-L/root/lib/lib " \
	emconfigure ./configure \
		PKG_CONFIG_PATH=$PKG_CONFIG_PATH \
		--build i386-pc-linux-gnu \
		--target wasm32-unknown-emscripten \
		--prefix=/root/install/ \
		--enable-shared=no \
		--enable-static=yes;

RUN set -euxo pipefail; \
	source /root/emsdk/emsdk_env.sh; \
	export JSPI_FLAGS=$(if [ "$JSPI" = "1" ]; then echo "-sSUPPORT_LONGJMP=wasm -fwasm-exceptions"; else echo ""; fi) && \
	EMCC_FLAGS="-fPIC $JSPI_FLAGS" emmake make; \
	emmake make install;

RUN ls -R /root/install
