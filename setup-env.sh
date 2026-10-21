#!/bin/bash

# Create .env.local file if it doesn't exist
if [ ! -f .env.local ]; then
    echo "Creating .env.local file from template..."
    cat > .env.local << 'EOF'
# ============================================
# Database Configuration
# ============================================
# Docker Compose PostgreSQL connection (uses 'postgres' as hostname for Docker networking)
DATABASE_URL="postgresql://lgurd_user:lgurd_password@postgres:5432/lgurd_db?schema=public"

# ============================================
# Stripe Configuration
# ============================================
# Get from: https://dashboard.stripe.com/test/apikeys
# Use test mode keys (starting with sk_test_)
STRIPE_SECRET_KEY="sk_test_YOUR_STRIPE_SECRET_KEY_HERE"

# For local development, get from Stripe CLI:
# Run: stripe listen --forward-to localhost:3000/api/webhook/stripe
# Copy the whsec_... value shown
STRIPE_WEBHOOK_SECRET="whsec_YOUR_WEBHOOK_SECRET_HERE"

# ============================================
# Resend Email Configuration
# ============================================
# Get from: https://resend.com/api-keys
RESEND_API_KEY="re_YOUR_RESEND_API_KEY_HERE"

# ============================================
# Application Configuration
# ============================================
NEXT_PUBLIC_APP_URL="http://localhost:3000"
EOF
    echo "✅ Created .env.local file"
    echo ""
    echo "⚠️  IMPORTANT: Edit .env.local and add your actual API keys:"
    echo "   - STRIPE_SECRET_KEY (from https://dashboard.stripe.com/test/apikeys)"
    echo "   - STRIPE_WEBHOOK_SECRET (from Stripe CLI: stripe listen --forward-to localhost:3000/api/webhook/stripe)"
    echo "   - RESEND_API_KEY (from https://resend.com/api-keys)"
    echo ""
else
    echo "✅ .env.local already exists"
fi
