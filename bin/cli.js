#!/usr/bin/env node

import parser from "./parser.js";
import callActions from "./CliActions.js";
const args = parser(process.argv);
await callActions(args);

