# XXX this build file is atrocious, definitely could use some macros to shorten it

all: node/config.dev.js node/config.prod.js chrome/config.dev.js chrome/config.prod.js

node/config.dev.js: config.dev.js
	cp config.dev.js node/config.dev.js

node/config.prod.js: config.prod.js
	cp config.prod.js node/config.prod.js

chrome/config.dev.js: config.dev.js
	cp config.dev.js chrome/config.dev.js

chrome/config.prod.js: config.prod.js
	cp config.prod.js chrome/config.prod.js
