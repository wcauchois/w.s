from __future__ import with_statement
import os
from fabric.api import run, local, settings, abort, env, cd, lcd
from fabric.operations import put

def copy_configs():
  for target_dir in ('chrome/', 'node/'):
    for mode in ('dev', 'prod'):
      local('cp config.%s.js %s' % (mode, target_dir))

def compile_manifest():
  with lcd('chrome'):
    local('node compileManifest.js')

def gen():
  copy_configs()
  compile_manifest()

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
