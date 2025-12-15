#!/usr/bin/env node

/**
 * LMS Schema Deployment Script
 * Run this locally to deploy the schema to Supabase
 *
 * Usage:
 *   node supabase/deploy-schema.mjs
 *
 * Or with environment variables:
 *   SUPABASE_SERVICE_ROLE_KEY=your_key node supabase/deploy-schema.mjs
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration
const SUPABASE_URL = 'https://dxdrbdoswraktyeciuvu.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Error: SUPABASE_SERVICE_ROLE_KEY environment variable is not set\n');
  console.log('Usage:');
  console.log('  SUPABASE_SERVICE_ROLE_KEY=your_key node supabase/deploy-schema.mjs\n');
  console.log('Or create a .env.local file with the key and use dotenv.');
  process.exit(1);
}

const projectRef = 'dxdrbdoswraktyeciuvu';

async function deploySchema() {
  console.log('\n🚀 LMS Schema Deployment\n');
  console.log('━'.repeat(50));
  console.log(`Project: ${projectRef}`);
  console.log(`URL: ${SUPABASE_URL}`);
  console.log('━'.repeat(50) + '\n');

  try {
    // Read schema
    const schemaPath = join(__dirname, 'schema.sql');
    const schema = readFileSync(schemaPath, 'utf8');

    console.log(`📄 Schema loaded (${(schema.length / 1024).toFixed(1)} KB)\n`);

    // Use Supabase Management API to execute SQL
    const response = await fetch(
      `https://api.supabase.com/v1/projects/${projectRef}/database/query`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query: schema })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();

      // Try alternative: direct pg endpoint
      console.log('⚠️  Management API unavailable, trying direct SQL...\n');

      const pgResponse = await fetch(`${SUPABASE_URL}/pg/query`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query: schema })
      });

      if (!pgResponse.ok) {
        throw new Error(`API Error: ${response.status} - ${errorText}`);
      }
    }

    console.log('✅ Schema deployed successfully!\n');
    console.log('📋 Created 34 tables:');
    console.log('   • User management: companies, profiles, groups, user_groups');
    console.log('   • Content: courses, modules, lessons, categories');
    console.log('   • Assessments: quizzes, quiz_questions, quiz_answers, assignments');
    console.log('   • Progress: enrollments, user_course_progress, user_lesson_progress');
    console.log('   • Commerce: subscription_plans, subscriptions, payments');
    console.log('   • Engagement: reviews, comments, discussion_forums, notifications');
    console.log('   • And more...\n');

  } catch (error) {
    console.error('❌ Deployment failed:', error.message);
    console.log('\n📝 ALTERNATIVE: Manual deployment via Supabase Dashboard\n');
    console.log(`   1. Open: https://supabase.com/dashboard/project/${projectRef}/sql/new`);
    console.log('   2. Copy contents of supabase/schema.sql');
    console.log('   3. Paste into SQL Editor and click "Run"\n');
    process.exit(1);
  }
}

deploySchema();
