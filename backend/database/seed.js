import pg from 'pg';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

async function seedDatabase() {
  const client = await pool.connect();
  
  try {
    console.log('🌱 Seeding database...');

    // Create sample users
    const hashedPassword = await bcrypt.hash('password123', 12);
    
    const users = [
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: hashedPassword
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: hashedPassword
      },
      {
        name: 'Admin User',
        email: 'admin@example.com',
        password: hashedPassword
      }
    ];

    const createdUsers = [];
    for (const user of users) {
      const result = await client.query(`
        INSERT INTO users (name, email, password)
        VALUES ($1, $2, $3)
        ON CONFLICT (email) DO NOTHING
        RETURNING id, name, email
      `, [user.name, user.email, user.password]);
      
      if (result.rows[0]) {
        createdUsers.push(result.rows[0]);
        console.log(`✅ Created user: ${user.name}`);
      } else {
        console.log(`⚠️ User already exists: ${user.name}`);
      }
    }

    // Sample articles content
    const sampleArticles = [
      {
        title: 'Introduction to Artificial Intelligence',
        content: `Artificial Intelligence (AI) is a branch of computer science that aims to create intelligent machines that work and react like humans. Some of the activities computers with artificial intelligence are designed for include speech recognition, learning, planning, and problem solving.

AI can be categorized into two main types: narrow AI and general AI. Narrow AI, also known as weak AI, is designed to perform a narrow task (e.g., facial recognition or internet searches). General AI, also known as strong AI, is an AI system with generalized human cognitive abilities.

Machine learning is a subset of AI that provides systems the ability to automatically learn and improve from experience without being explicitly programmed. Deep learning is a subset of machine learning that uses neural networks with multiple layers to analyze various factors of data.

The applications of AI are vast and growing. From virtual assistants like Siri and Alexa to recommendation systems on Netflix and Amazon, AI is becoming an integral part of our daily lives. In healthcare, AI is being used for disease diagnosis and drug discovery. In finance, it's used for fraud detection and algorithmic trading.

However, AI also raises important ethical considerations. Issues such as job displacement, privacy concerns, and the potential for bias in AI systems need to be carefully considered as the technology continues to advance.`
      },
      {
        title: 'The Future of Web Development',
        content: `Web development has evolved significantly over the past few decades, from simple static HTML pages to complex, dynamic applications. The future of web development is being shaped by several key trends and technologies.

Progressive Web Apps (PWAs) are becoming increasingly popular, offering native app-like experiences through web browsers. They provide features like offline functionality, push notifications, and fast loading times, making them a compelling alternative to traditional mobile apps.

JavaScript frameworks continue to dominate the landscape, with React, Vue, and Angular leading the way. However, new frameworks like Svelte and Solid.js are gaining traction for their performance benefits and developer experience improvements.

Serverless architecture is revolutionizing how we build and deploy web applications. By abstracting away server management, developers can focus on writing code while the cloud provider handles scaling and infrastructure management.

WebAssembly (WASM) is enabling high-performance applications to run in the browser, opening up new possibilities for web development. This technology allows code written in languages like C++, Rust, and Go to run at near-native speeds in the browser.

The rise of AI and machine learning is also impacting web development. AI-powered tools are helping with code generation, testing, and optimization. Chatbots and recommendation systems are becoming standard features of modern web applications.

Accessibility and performance remain crucial considerations. As web applications become more complex, ensuring they work for all users and load quickly on all devices is more important than ever.`
      },
      {
        title: 'Database Design Best Practices',
        content: `Database design is a critical aspect of software development that directly impacts application performance, scalability, and maintainability. Following best practices can help create robust and efficient database systems.

Normalization is a fundamental concept in database design. It involves organizing data to reduce redundancy and improve data integrity. The goal is to eliminate data anomalies and ensure that each piece of information is stored in only one place.

Indexing is crucial for query performance. Proper indexing can dramatically improve query speed, but over-indexing can slow down write operations. It's important to create indexes based on the most common query patterns and to monitor their usage.

Data types should be chosen carefully. Using the most appropriate data type for each column not only saves storage space but also improves performance. For example, using VARCHAR instead of TEXT for short strings, or choosing the right integer type based on the expected range of values.

Relationships between tables should be well-defined and properly enforced with foreign key constraints. This ensures referential integrity and helps maintain data consistency across the database.

Security is paramount in database design. Sensitive data should be encrypted, and access should be controlled through proper authentication and authorization mechanisms. Regular backups and disaster recovery plans are essential for data protection.

Scalability considerations should be built into the design from the beginning. This includes planning for horizontal scaling, partitioning strategies, and read/write separation for high-traffic applications.`
      },
      {
        title: 'Understanding RESTful APIs',
        content: `REST (Representational State Transfer) is an architectural style for designing networked applications. RESTful APIs have become the standard for web services due to their simplicity, scalability, and stateless nature.

The core principles of REST include statelessness, client-server separation, cacheability, uniform interface, and layered system architecture. These principles ensure that RESTful APIs are scalable, maintainable, and easy to understand.

HTTP methods play a crucial role in RESTful APIs. GET is used for retrieving resources, POST for creating new resources, PUT for updating existing resources, DELETE for removing resources, and PATCH for partial updates. Using these methods correctly is essential for creating intuitive APIs.

Resource naming conventions are important for API design. Resources should be represented as nouns, not verbs, and should use plural forms. For example, use /users instead of /getUsers or /user. This makes the API more intuitive and easier to understand.

Status codes should be used appropriately to communicate the result of API requests. 200-series codes indicate success, 400-series codes indicate client errors, and 500-series codes indicate server errors. Providing meaningful status codes helps clients handle responses correctly.

Versioning is an important consideration for API design. As APIs evolve, maintaining backward compatibility becomes crucial. Common versioning strategies include URL versioning (/api/v1/users), header versioning, and content negotiation.

Documentation is essential for any API. Tools like Swagger/OpenAPI can help generate interactive documentation that makes it easy for developers to understand and test the API. Good documentation includes examples, error responses, and authentication requirements.`
      },
      {
        title: 'Modern JavaScript Features',
        content: `JavaScript has evolved significantly since its creation in 1995. Modern JavaScript (ES6+) introduces many powerful features that make the language more expressive, efficient, and easier to work with.

Arrow functions provide a concise syntax for writing function expressions. They have implicit returns and automatically bind the 'this' context, making them perfect for callbacks and event handlers. However, they don't have their own 'this' binding, which can be both an advantage and a limitation.

Destructuring allows you to extract values from objects and arrays into distinct variables. This feature makes code more readable and reduces the need for temporary variables. It's particularly useful when working with function parameters and API responses.

Template literals provide a more flexible way to create strings. They support multi-line strings, expression interpolation, and tagged templates. This makes string manipulation much more powerful and readable than traditional string concatenation.

The spread and rest operators are versatile features that work with arrays and objects. The spread operator (...) can be used to copy arrays, merge objects, and pass multiple arguments to functions. The rest operator allows functions to accept a variable number of arguments.

Modules provide a way to organize and share code. ES6 modules use import and export statements to manage dependencies between files. This creates a more maintainable codebase and enables better tree-shaking for smaller bundle sizes.

Async/await makes asynchronous programming much more readable than callbacks or promises. It allows you to write asynchronous code that looks and behaves like synchronous code, making it easier to understand and debug.

These modern features, along with others like classes, default parameters, and optional chaining, have transformed JavaScript into a powerful and modern programming language suitable for both frontend and backend development.`
      }
    ];

    // Create sample articles
    for (let i = 0; i < sampleArticles.length; i++) {
      const article = sampleArticles[i];
      const userId = createdUsers[i % createdUsers.length].id;
      
      const result = await client.query(`
        INSERT INTO articles (title, content, created_by)
        VALUES ($1, $2, $3)
        RETURNING id, title
      `, [article.title, article.content, userId]);
      
      console.log(`✅ Created article: ${result.rows[0].title}`);
    }

    console.log('🎉 Database seeding completed successfully!');
    console.log(`📊 Created ${createdUsers.length} users and ${sampleArticles.length} articles`);
    
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Run seed if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase()
    .then(() => {
      console.log('✅ Database seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Database seeding failed:', error);
      process.exit(1);
    });
}

export default seedDatabase; 