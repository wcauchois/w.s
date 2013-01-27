from __future__ import with_statement
import os, json
from fabric.api import run, local, settings, abort, env, cd, lcd
from fabric.operations import put

common_config = json.load(open('config.common.json', 'r'))
AWS_BUCKET = common_config['AWS_BUCKET']
AWS_ASSETS_ROOT = 'http://%s.s3.amazonaws.com/' % AWS_BUCKET
CONFIG_MODES = ('dev', 'prod')

def gen_configs():
  for mode in CONFIG_MODES:
    config_json = json.load(open('config.%s.json' % mode, 'r'))
    config_dict = dict(config_json)
    config_dict.update(common_config)
    config_js = """\
    var %s_config = %s;
    if (typeof exports != undefined)
      module.exports = %s_config;
    """ % (mode, json.dumps(config_dict), mode)
    for target_dir in ('chrome', 'node'):
      with open(os.path.join(target_dir, 'config.%s.js' % mode), 'w') as out_stream:
        out_stream.write(config_js)

def generated_files():
  for dir in ('chrome', 'node'):
    for mode in ('dev', 'prod'):
      yield '%s/config.%s.js' % (dir, mode)
  yield 'node/templates/post.mustache'
  yield 'chrome/post.mustache'
  yield 'chrome/manifest.json'

def clean():
  for asset in generated_files():
    local('rm %s' % asset)

def copy_common_files():
  local('cp common/post.mustache node/templates/')
  local('cp common/post.mustache chrome/')

def chrome_compile():
  with lcd('chrome'):
    local('node compile.js')

def download_asset_scripts():
  with lcd('chrome'):
    for script in json.load(open('chrome/assetScripts.json')):
      local('rm -f %s' % script)
      local('wget --quiet %s%s' % (AWS_ASSETS_ROOT, script))

def gen():
  gen_configs()
  copy_common_files()
  chrome_compile()
  download_asset_scripts()

def setup_linode():
  env.host_string = 'linode'
  env.source_dir = '/home/wcauchois/Code/w.s/node'
  env.target_dir = 'w.s/node'

def linode_deploy():
  setup_linode()
  for filename in os.listdir(env.source_dir):
    if not filename.startswith('.') and not filename == 'node_modules':
      put(os.path.join(env.source_dir, filename),
        os.path.join(env.target_dir, filename))
