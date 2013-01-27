from __future__ import with_statement
import os
from fabric.api import run, local, settings, abort, env
from fabric.operations import put

def config():
  for mode in ('dev', 'prod'):
    for target_dir in ('./chrome/', './node/'):
      local('cp config.%s.js %s' % (mode, target_dir))

def linode_env():
  env.host_string = 'linode'
  env.source_dir = '/home/wcauchois/Code/w.s/node'
  env.target_dir = 'w.s/node'

def deploy_linode():
  linode_env()
  for filename in os.listdir(env.source_dir):
    if not filename.startswith('.') and not filename == 'node_modules':
      put(os.path.join(env.source_dir, filename),
        os.path.join(env.target_dir, filename))
