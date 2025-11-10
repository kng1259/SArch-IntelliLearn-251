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

local discovery = os.getenv("OIDC_DISCOVERY")
local client_id = os.getenv("OIDC_CLIENT_ID")
local aud_csv = os.getenv("OIDC_ACCEPTED_AUDIENCES")
local ssl_verify_env = os.getenv("OIDC_SSL_VERIFY")

local opts = {
  discovery = discovery,
  client_id = client_id,
  -- for validating access tokens signed with RS256, no client_secret required
  -- cache settings (lua_shared_dict names)
  discovery_cache = "oidc_cache",
  jwks_cache = "jwks_cache",
  ssl_verify = (ssl_verify_env == nil) and true or (ssl_verify_env:lower() ~= "false"),
  -- accepted audiences: if set, openidc will ensure token aud matches at least one item
  accepted_audiences = split_csv(aud_csv),
  -- optionally tune timeouts / HTTP settings via http_opts
  http_opts = {
    timeout = 5000
  }
}

_M.opts = opts
return _M