from __future__ import with_statement
import os, json
from fabric.api import run, local, settings, abort, env, cd, lcd
from fabric.operations import put

AWS_BUCKET = open('aws_bucket.txt', 'r').read().strip()
AWS_ASSETS_ROOT = 'http://%s.s3.amazonaws.com/' % AWS_BUCKET

def copy_configs():
  for target_dir in ('chrome/', 'node/'):
    for mode in ('dev', 'prod'):
      local('cp config.%s.js %s' % (mode, target_dir))

def generated_assets():
  for dir in ('chrome', 'node'):
    for mode in ('dev', 'prod'):
      yield '%s/config.%s.js' % (dir, mode)
  yield 'node/templates/post.mustache'
  yield 'chrome/post.mustache'
  yield 'chrome/manifest.json'

def clean():
  for asset in generated_assets():
    local('rm %s' % asset)

def copy_common_assets():
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
  copy_configs()
  copy_common_assets()
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
