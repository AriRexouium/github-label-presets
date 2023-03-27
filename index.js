import githubLabelSync from 'github-label-sync'
import { request, gql } from 'graphql-request'
import yaml from 'js-yaml'
import fs from 'fs'
import dotenv from 'dotenv'
dotenv.config()

const repos = await request({
  url: 'https://api.github.com/graphql',
  document: gql`{
    viewer {
      repositories(first: 100, ownerAffiliations: OWNER) {
        nodes {
          name
          nameWithOwner
          isArchived
        }
      }
    }
  }`,
  requestHeaders: {
    authorization: `Bearer ${process.env.GITHUB_TOKEN}`
  }
})

const whitelist = process.env.REPO_WHITELIST.split(',')
const blacklist = process.env.REPO_BLACKLIST.split(',')
const labels = yaml.load(fs.readFileSync('labels.yml', 'utf8'))

repos.viewer.repositories.nodes.forEach(repo => {
  if (repo.isArchived) return

  if (process.env.USE_LIST === 'whitelist') {
    if (!whitelist.includes(repo.name)) return
  } else if (process.env.USE_LIST === 'blacklist') {
    if (blacklist.includes(repo.name)) return
  }

  githubLabelSync({
    accessToken: process.env.GITHUB_TOKEN,
    repo: repo.nameWithOwner,
    labels,
    dryRun: process.env.DRYRUN
  })
    .then(diff => console.log(repo.nameWithOwner, diff))
    .catch(error => console.log(repo.nameWithOwner, error))
})
