# SPDX-FileCopyrightText: © 2025 Industria de Diseño Textil S.A. INDITEX
# SPDX-License-Identifier: APACHE-2.0
#!/bin/bash

# Dependency installation script for MCP
# This script will run during the MCP package installation

# Check that we are on macOS
if [[ "$OSTYPE" != "darwin"* ]]; then
    echo "Error: This package only works on macOS"
    exit 1
fi

# Check if homebrew is installed
if ! command -v brew &> /dev/null; then
    echo "Error: Homebrew is not installed. Please install Homebrew first."
    echo "Visit https://brew.sh for installation instructions"
    exit 1
fi

# Install dependencies using Homebrew
echo "Installing idb-companion..."
brew tap facebook/fb
brew install idb-companion

# Check if we're in a virtual environment
if [[ -z "$VIRTUAL_ENV" ]]; then
    echo "Error: Python virtual environment not activated"
    echo "Please activate your virtual environment first:"
    echo "  source venv/bin/activate  # On Unix/macOS"
    echo "  .\\venv\\Scripts\\activate  # On Windows"
    exit 1
fi

# Install Python dependencies in virtual environment
echo "Installing idb Python client in virtual environment..."
python3 -m pip install --upgrade pip
python3 -m pip install fb-idb

# Verify installation
if python3 -m pip show fb-idb &> /dev/null; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Error installing dependencies"
    exit 1
fi
