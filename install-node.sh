#!/bin/bash

# Script para instalar Node 22 con nvm y configurar el proyecto

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

echo "Installing Node 22..."
nvm install 22

echo "Using Node 22..."
nvm use 22

echo "Current Node version:"
node --version

echo "Installing pnpm..."
npm install -g pnpm

echo "Cleaning old dependencies..."
cd /Users/dgk/Desktop/localDevelop/007PasProject
rm -rf node_modules package-lock.json

echo "Installing dependencies with pnpm..."
pnpm install

echo "Setup complete!"
echo "You can now run: pnpm dev"
