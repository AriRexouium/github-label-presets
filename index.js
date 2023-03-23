import githubLabelSync from 'github-label-sync'
import yaml from 'js-yaml'
import fs from 'fs'
import * as dotenv from 'dotenv'
dotenv.config()

githubLabelSync({
  accessToken: process.env.ACCESSTOKEN,
  labels: yaml.load(fs.readFileSync('labels.yml', 'utf8')),
  repo: process.env.REPO
})
  .then(diff => console.log(diff))
  .catch(error => console.log(error))
