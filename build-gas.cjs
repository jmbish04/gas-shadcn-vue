#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const GAS_DIST_DIR = 'gas-dist';
const BUILD_DIR = 'dist';
const ASSETS_DIR = path.join(BUILD_DIR, 'assets');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function createGasIndexTemplate() {
  const templateContent = `!DOCTYPE html
html
  head
    base target="_top"
    meta charset="UTF-8"
    meta name="viewport" content="width=device-width, initial-scale=1.0"
    titleMy Vue GAS App/title
    ?!= styles ?
  /head
  body
    div id="app"Loading application.../div
    ?!= scripts ?
    ?!= mock_google_script_run ?
  /body
/html`;
  fs.writeFileSync(path.join(GAS_DIST_DIR, 'index.html'), templateContent);
  console.log('Created gas-dist/index.html template');
}

function createMockGoogleScriptRunFile() {
  const mockScriptContent = `script
if (typeof google === 'undefined' || typeof google.script === 'undefined') {
  window.google = {
    script: {