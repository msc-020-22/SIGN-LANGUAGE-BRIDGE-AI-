#!/usr/bin/env python3
"""
Packaging Script for NYLP × AI Hackathon 2026 Submission
Creates a clean, reproducible SLB-AI-submission.zip containing:
- Complete React/TypeScript frontend source code
- Trained TensorFlow.js model weights and configuration
- Machine learning training and evaluation scripts
- Automated test suites
- Supabase SQL schema migrations
- Complete project documentation (README, Model Card, Dataset Card, Architecture docs)
Excludes node_modules, .git, and temporary caches.
"""

import os
import zipfile

PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
OUTPUT_ZIP = os.path.join(PROJECT_ROOT, 'SLB-AI-submission.zip')

EXCLUDE_DIRS = {
    'node_modules',
    '.git',
    'dist',
    '__pycache__',
    '.turbo',
    '.cache',
    'coverage',
}

EXCLUDE_FILES = {
    'SLB-AI-submission.zip',
    '.DS_Store',
    'Thumbs.db',
}

def create_zip():
    print(f"Creating submission package at: {OUTPUT_ZIP}")
    file_count = 0
    total_size = 0

    with zipfile.ZipFile(OUTPUT_ZIP, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(PROJECT_ROOT):
            # Modify dirs in-place to avoid walking into excluded folders
            dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS and not d.startswith('.')]

            for file in files:
                if file in EXCLUDE_FILES or file.endswith('.pyc') or file.endswith('.tmp'):
                    continue

                full_path = os.path.join(root, file)
                rel_path = os.path.relpath(full_path, PROJECT_ROOT)

                zipf.write(full_path, rel_path)
                file_count += 1
                total_size += os.path.getsize(full_path)

    zip_size_mb = os.path.getsize(OUTPUT_ZIP) / (1024 * 1024)
    print(f"✅ Successfully archived {file_count} files ({zip_size_mb:.2f} MB compressed) into SLB-AI-submission.zip")


if __name__ == '__main__':
    create_zip()
