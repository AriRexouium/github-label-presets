const githubLabelSync = require('github-label-sync')
const yaml = require('js-yaml')
const fs = require('fs')
require('dotenv').config()

githubLabelSync({
  accessToken: process.env.ACCESSTOKEN,
  labels: yaml.load(fs.readFileSync('labels.yml', 'utf8')),
  repo: process.env.REPO
})
  .then(diff => console.log(diff))
  .catch(error => console.log(error))
