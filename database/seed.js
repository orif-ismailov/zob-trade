require('dotenv').config();
const bcrypt = require('bcrypt');
const { pool, query } = require('../src/config/database');

async function seed() {
  console.log('Seeding database...');

  try {
    // Create admin user
    const username = process.env.ADMIN_USERNAME || 'admin';
    const password = process.env.ADMIN_PASSWORD || 'admin123';
    const passwordHash = await bcrypt.hash(password, 10);

    await query(
      `INSERT INTO admins (username, password_hash)
       VALUES ($1, $2)
       ON CONFLICT (username) DO UPDATE SET password_hash = $2`,
      [username, passwordHash]
    );
    console.log(`Admin user '${username}' created/updated`);

    // Create default content structure
    const defaultContents = [
      // Home page
      { page: 'home', section: 'hero', content_key: 'hero_title' },
      { page: 'home', section: 'hero', content_key: 'hero_subtitle' },
      { page: 'home', section: 'hero', content_key: 'hero_cta' },
      { page: 'home', section: 'trust', content_key: 'years_experience' },
      { page: 'home', section: 'trust', content_key: 'tons_exported' },
      { page: 'home', section: 'trust', content_key: 'countries_served' },

      // About page
      { page: 'about', section: 'main', content_key: 'company_name' },
      { page: 'about', section: 'main', content_key: 'description' },
      { page: 'about', section: 'main', content_key: 'experience' },

      // Products page
      { page: 'products', section: 'diesel', content_key: 'diesel_title' },
      { page: 'products', section: 'diesel', content_key: 'diesel_desc' },
      { page: 'products', section: 'gasoline', content_key: 'gasoline_title' },
      { page: 'products', section: 'gasoline', content_key: 'gasoline_desc' },

      // Contact page
      { page: 'contact', section: 'info', content_key: 'address' },
      { page: 'contact', section: 'info', content_key: 'phone' },
      { page: 'contact', section: 'info', content_key: 'email' }
    ];

    for (const content of defaultContents) {
      await query(
        `INSERT INTO contents (page, section, content_key)
         VALUES ($1, $2, $3)
         ON CONFLICT (page, content_key) DO NOTHING`,
        [content.page, content.section, content.content_key]
      );
    }
    console.log('Default content structure created');

    console.log('Seeding completed successfully');
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

seed();
