#!/usr/bin/env node
import parser from "./parser.js";
import callActions from "./CliActions";
callActions(parser(process.argv));
