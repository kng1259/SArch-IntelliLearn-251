FROM openresty/openresty:alpine

# Install build tools and luarocks (only for installing non-OpenResty rocks)
RUN apk add --no-cache build-base git openssl-dev pcre-dev zlib-dev lua5.1 lua5.1-dev luarocks perl

# Use opm (bundled with OpenResty) to install OpenResty-specific modules
# This installs lua-resty-openidc and its OpenResty-style dependencies into OpenResty's lualib
RUN /usr/local/openresty/bin/opm get zmartzone/lua-resty-openidc

# Install other LuaRocks packages that are safe via luarocks
RUN luarocks install lua-resty-http \
 && luarocks install lua-cjson \
 && luarocks install lua-resty-jwt || true

# Create mount target for your Lua files
RUN mkdir -p /usr/local/openresty/lualib

EXPOSE 80

CMD ["/usr/local/openresty/bin/openresty", "-g", "daemon off;"]