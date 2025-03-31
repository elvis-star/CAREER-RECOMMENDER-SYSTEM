// System health monitoring utilities
import mongoose from 'mongoose';
import os from 'os';
import fs from 'fs';
import path from 'path';

// Get system metrics
export const getSystemMetrics = () => {
  return {
    memory: {
      total:
        Math.round((os.totalmem() / (1024 * 1024 * 1024)) * 100) / 100 + ' GB',
      free:
        Math.round((os.freemem() / (1024 * 1024 * 1024)) * 100) / 100 + ' GB',
      usage: Math.round((1 - os.freemem() / os.totalmem()) * 100) + '%',
    },
    cpu: {
      cores: os.cpus().length,
      model: os.cpus()[0].model,
      load: os.loadavg(),
    },
    system: {
      platform: os.platform(),
      uptime: Math.floor(os.uptime() / 3600) + ' hours',
      hostname: os.hostname(),
    },
    node: {
      version: process.version,
      memoryUsage: {
        rss: Math.round(process.memoryUsage().rss / (1024 * 1024)) + ' MB',
        heapTotal:
          Math.round(process.memoryUsage().heapTotal / (1024 * 1024)) + ' MB',
        heapUsed:
          Math.round(process.memoryUsage().heapUsed / (1024 * 1024)) + ' MB',
      },
    },
    database: {
      status:
        mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
      name: mongoose.connection.name || 'unknown',
    },
  };
};

// Check disk space
export const getDiskSpace = () => {
  try {
    // This is a simplified version - in production you'd use a more robust solution
    const rootDir = path.parse(process.cwd()).root;
    const stats = fs.statfsSync(rootDir);
    const totalSpace = stats.blocks * stats.bsize;
    const freeSpace = stats.bfree * stats.bsize;
    const usedSpace = totalSpace - freeSpace;

    return {
      total:
        Math.round((totalSpace / (1024 * 1024 * 1024)) * 100) / 100 + ' GB',
      free: Math.round((freeSpace / (1024 * 1024 * 1024)) * 100) / 100 + ' GB',
      used: Math.round((usedSpace / (1024 * 1024 * 1024)) * 100) / 100 + ' GB',
      usagePercentage: Math.round((usedSpace / totalSpace) * 100) + '%',
    };
  } catch (error) {
    console.error('Error getting disk space:', error);
    return { error: 'Could not determine disk space' };
  }
};

// Check database health
export const checkDatabaseHealth = async () => {
  try {
    // Simple ping to check if database is responsive
    const start = Date.now();
    await mongoose.connection.db.admin().ping();
    const responseTime = Date.now() - start;

    return {
      status: 'healthy',
      responseTime: responseTime + 'ms',
      collections: Object.keys(mongoose.connection.collections).length,
    };
  } catch (error) {
    console.error('Database health check failed:', error);
    return {
      status: 'unhealthy',
      error: error.message,
    };
  }
};

// Overall system health check
export const getSystemHealth = async () => {
  const metrics = getSystemMetrics();
  const diskSpace = getDiskSpace();
  const dbHealth = await checkDatabaseHealth();

  const isHealthy =
    dbHealth.status === 'healthy' &&
    Number.parseInt(metrics.memory.usage) < 90 &&
    Number.parseInt(diskSpace.usagePercentage) < 90;

  return {
    status: isHealthy ? 'healthy' : 'degraded',
    timestamp: new Date().toISOString(),
    metrics,
    diskSpace,
    database: dbHealth,
  };
};
