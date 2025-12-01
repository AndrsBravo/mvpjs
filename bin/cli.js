#!/usr/bin/env node

import callActions from "./CliActions.js"
import parser from "./parser.js"

const args = parser(process.argv)
await callActions(args)
