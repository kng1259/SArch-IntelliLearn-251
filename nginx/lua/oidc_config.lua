-- Builds options for lua-resty-openidc from environment variables.
-- Returns a table of options used by resty.openidc functions.

local _M = {}

local function split_csv(s)
  if not s or s == "" then return nil end
  local out = {}
  for token in string.gmatch(s, "([^,]+)") do
    token = token:gsub("^%s+", ""):gsub("%s+$", "")
    table.insert(out, token)
  end
  return out
end

local discovery = "http://keycloak:8080/realms/intellilearn/.well-known/openid-configuration"
local client_id = "nginx"
local aud_csv = "nginx"

local opts = {
  discovery = discovery,
  client_id = client_id,
--   jwks_uri = "http://keycloak:8080/realms/intellilearn/protocol/openid-connect/certs",
  -- for validating access tokens signed with RS256, no client_secret required
  -- cache settings (lua_shared_dict names)
  jwks_cache = "jwks_cache",
  ssl_verify = false,
  -- accepted audiences: if set, openidc will ensure token aud matches at least one item
  accepted_audiences = split_csv(aud_csv),
  -- optionally tune timeouts / HTTP settings via http_opts
  http_opts = {
    timeout = 5000
  }
}

_M.opts = opts
return _M