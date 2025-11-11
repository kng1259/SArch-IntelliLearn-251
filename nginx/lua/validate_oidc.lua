local cjson = require "cjson.safe"
local openidc = require "resty.openidc"

local jwks_uri = os.getenv("OIDC_JWKS_URI")
local client_id = os.getenv("OIDC_CLIENT_ID")
local ssl_verify = os.getenv("OIDC_SSL_VERIFY") or "no"

local opts = {
  discovery = {
    jwks_uri = jwks_uri,
  },
  client_id = client_id,
  -- for validating access tokens signed with RS256, no client_secret required
  -- cache settings (lua_shared_dict names)
  jwks_cache = "jwks_cache",
  ssl_verify = ssl_verify,
  -- optionally tune timeouts / HTTP settings via http_opts
  http_opts = {
    timeout = 5000
  }
}

-- verify bearer token (RS256 JWT) locally using discovery/JWKS
local res, err = openidc.bearer_jwt_verify(opts)

if err then
  ngx.status = ngx.HTTP_UNAUTHORIZED
  ngx.header.content_type = "application/json; charset=utf-8"
  ngx.say(cjson.encode({ error = "token_validation_failed", detail = err }))
  ngx.exit(ngx.HTTP_UNAUTHORIZED)
end

-- 'res' contains claims. Example keys: sub, preferred_username, email, realm_access.roles, resource_access
-- Extract useful values and set them as headers for upstream
local sub = res.sub or ""
local preferred_username = res.preferred_username or res.username or ""
local roles = ""

-- Try to collect roles from common Keycloak claim locations:
-- realm_access.roles (array) and resource_access[client_id].roles
if res.realm_access and res.realm_access.roles then
  roles = table.concat(res.realm_access.roles, ",")
end

-- append client roles if present
if res.resource_access and opts.client_id and res.resource_access[opts.client_id] and res.resource_access[opts.client_id].roles then
  local client_roles = table.concat(res.resource_access[opts.client_id].roles, ",")
  if roles ~= "" then roles = roles .. "," .. client_roles
  else roles = client_roles end
end

ngx.req.set_header("X-Remote-User", preferred_username)
ngx.req.set_header("X-Remote-Sub", sub)
ngx.req.set_header("X-Remote-Roles", roles)

return