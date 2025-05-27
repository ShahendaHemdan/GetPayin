import { getCurrentUser } from './auth.js';

// Mock API service that would connect to a real backend in production
const API_DELAY = 600; // Simulate network delay

// Mock data store
let posts = [
  {
    id: 1,
    title: 'Welcome to PostMaster',
    content: 'This is your first scheduled post. Edit or delete it to get started!',
    image: 'https://images.pexels.com/photos/3773557/pexels-photo-3773557.png',
    platforms: ['facebook', 'instagram'],
    scheduledDate: new Date(Date.now() + 86400000).toISOString(),
    status: 'scheduled',
    characterCount: 74,
    userId: 1
  },
  {
    id: 2,
    title: 'Tips for Engagement',
    content: 'Engagement tip: Ask questions in your posts to encourage comments and interaction with your audience.',
    image: 'https://images.pexels.com/photos/935979/pexels-photo-935979.jpeg',
    platforms: ['twitter', 'linkedin'],
    scheduledDate: new Date(Date.now() + 172800000).toISOString(),
    status: 'draft',
    characterCount: 112,
    userId: 1
  },
  {
    id: 3,
    title: 'Content Strategy',
    content: 'A good content strategy includes a mix of promotional, educational, and engaging content.',
    image: 'https://images.pexels.com/photos/1181472/pexels-photo-1181472.jpeg',
    platforms: ['facebook', 'linkedin'],
    scheduledDate: new Date(Date.now() - 86400000).toISOString(),
    status: 'published',
    characterCount: 89,
    userId: 1
  }
];

let platforms = [
  { id: 'facebook', name: 'Facebook', icon: 'facebook', active: true, maxLength: 5000 },
  { id: 'twitter', name: 'Twitter', icon: 'twitter', active: true, maxLength: 280 },
  { id: 'instagram', name: 'Instagram', icon: 'instagram', active: true, maxLength: 2200 },
  { id: 'linkedin', name: 'LinkedIn', icon: 'linkedin', active: true, maxLength: 3000 }
];

// Posts API
export async function getPosts(filters = {}) {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filteredPosts = [...posts]
        .filter(post => {
          // Filter by user
          const currentUser = getCurrentUser();
          if (currentUser && post.userId !== currentUser.id) return false;
          
          // Filter by status
          if (filters.status && post.status !== filters.status) return false;
          
          // Filter by platform
          if (filters.platform && !post.platforms.includes(filters.platform)) return false;
          
          // Filter by date range
          if (filters.startDate && new Date(post.scheduledDate) < new Date(filters.startDate)) return false;
          if (filters.endDate && new Date(post.scheduledDate) > new Date(filters.endDate)) return false;
          
          return true;
        })
        .sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate));
      
      resolve(filteredPosts);
    }, API_DELAY);
  });
}

export async function getPost(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const post = posts.find(p => p.id === parseInt(id));
      if (post) {
        resolve(post);
      } else {
        reject(new Error('Post not found'));
      }
    }, API_DELAY);
  });
}

export async function createPost(postData) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const currentUser = getCurrentUser();
      const newPost = {
        id: posts.length + 1,
        ...postData,
        userId: currentUser.id,
        characterCount: postData.content.length
      };
      posts.push(newPost);
      resolve(newPost);
    }, API_DELAY);
  });
}

export async function updatePost(id, postData) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = posts.findIndex(p => p.id === parseInt(id));
      if (index !== -1) {
        posts[index] = {
          ...posts[index],
          ...postData,
          characterCount: postData.content.length
        };
        resolve(posts[index]);
      } else {
        reject(new Error('Post not found'));
      }
    }, API_DELAY);
  });
}

export async function deletePost(id) {
  return new Promise((resolve) => {
    setTimeout(() => {
      posts = posts.filter(p => p.id !== parseInt(id));
      resolve(true);
    }, API_DELAY);
  });
}

// Platforms API
export async function getPlatforms() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(platforms);
    }, API_DELAY);
  });
}

export async function updatePlatform(id, data) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = platforms.findIndex(p => p.id === id);
      if (index !== -1) {
        platforms[index] = { ...platforms[index], ...data };
        resolve(platforms[index]);
      } else {
        reject(new Error('Platform not found'));
      }
    }, API_DELAY);
  });
}