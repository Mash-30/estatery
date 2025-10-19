// Demo user service for handling users without database
import { v4 as uuidv4 } from 'uuid';

// In-memory user store
const users = new Map();
const sessions = new Map();

// Generate a demo user
const createDemoUser = (userData) => {
  const userId = uuidv4();
  const user = {
    _id: userId,
    email: userData.email,
    firstName: userData.firstName,
    lastName: userData.lastName,
    phone: userData.phone,
    role: userData.role || 'buyer',
    createdAt: new Date(),
    isActive: true
  };
  
  users.set(userId, user);
  return user;
};

// Get user by ID
const getDemoUser = (userId) => {
  return users.get(userId);
};

// Get user by email
const getDemoUserByEmail = (email) => {
  for (const user of users.values()) {
    if (user.email === email) {
      return user;
    }
  }
  return null;
};

// Create a demo session
const createDemoSession = (userId) => {
  const sessionId = uuidv4();
  const session = {
    userId,
    sessionId,
    createdAt: new Date(),
    lastAccess: new Date()
  };
  
  sessions.set(sessionId, session);
  return session;
};

// Get session by ID
const getDemoSession = (sessionId) => {
  return sessions.get(sessionId);
};

// Update session last access
const updateSessionAccess = (sessionId) => {
  const session = sessions.get(sessionId);
  if (session) {
    session.lastAccess = new Date();
  }
  return session;
};

// Remove session
const removeDemoSession = (sessionId) => {
  return sessions.delete(sessionId);
};

// Get all sessions for a user
const getUserSessions = (userId) => {
  const userSessions = [];
  for (const session of sessions.values()) {
    if (session.userId === userId) {
      userSessions.push(session);
    }
  }
  return userSessions;
};

// Clear all sessions for a user
const clearUserSessions = (userId) => {
  const sessionsToDelete = [];
  for (const [sessionId, session] of sessions.entries()) {
    if (session.userId === userId) {
      sessionsToDelete.push(sessionId);
    }
  }
  
  sessionsToDelete.forEach(sessionId => {
    sessions.delete(sessionId);
  });
  
  return sessionsToDelete.length;
};

export {
  createDemoUser,
  getDemoUser,
  getDemoUserByEmail,
  createDemoSession,
  getDemoSession,
  updateSessionAccess,
  removeDemoSession,
  getUserSessions,
  clearUserSessions
};
