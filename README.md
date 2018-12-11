# minexp
minimal exp template (for heroku)

Things you need to do after cloning:

```npm install```

add ```.env``` and ```.gitignore```

one critical component of .env is your db credentials, for local testing with postgres this is a line of the form DATABASE_URL=postgres://name:pwd@localhost:port/username

A reasonable default .gitignore might be:

```
# Node build artifacts
node_modules
npm-debug.log

# Local development
*.env
*.dev
.DS_Store
*RData
*.png
```
Assuming you have heroku and your database already set to go, at this point you should be ready to test locally.
