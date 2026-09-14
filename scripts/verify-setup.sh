#!/bin/bash

echo "🔍 Verifying AI-Driven Setup..."

# 1. Check Root Configs
for file in package.json turbo.json pnpm-workspace.yaml tsconfig.base.json; do
  if [ -f "$file" ]; then
    echo "✅ Found $file"
  else
    echo "❌ Missing $file"
    exit 1
  fi
done

# 2. Check Directories
for dir in packages/tokens packages/react apps/docs .ai-skills scripts/skills; do
  if [ -d "$dir" ]; then
    echo "✅ Found directory $dir"
  else
    echo "❌ Missing directory $dir"
    exit 1
  fi
done

# 3. Check AI Roles
for role in role-coordinator.md role-devops.md role-token-architect.md; do
  if [ -f ".ai-skills/$role" ]; then
    echo "✅ Found Skill: $role"
  else
    echo "❌ Missing Skill: $role"
    exit 1
  fi
done

# 4. Check CI/CD
if [ -f ".github/workflows/ci.yml" ]; then
  echo "✅ Found CI Workflow"
else
  echo "❌ Missing CI Workflow"
  exit 1
fi

echo "🚀 Setup Verification Complete!"
