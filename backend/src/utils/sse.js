/**
 * Server-Sent Events (SSE) utilities
 */

// Store active SSE connections
const sseConnections = new Map();

/**
 * Initialize SSE connection
 */
function initSSE(res) {
  const sseId = generateSSEId();
  
  // Set SSE headers
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Cache-Control',
  });
  
  // Store connection
  sseConnections.set(sseId, {
    res,
    lastActivity: Date.now(),
  });
  
  // Send initial connection event
  sendSSE(sseId, 'connected', { id: sseId });
  
  // Cleanup on connection close
  res.on('close', () => {
    closeSSE(sseId);
  });
  
  return sseId;
}

/**
 * Send SSE event
 */
function sendSSE(sseId, event, data) {
  const connection = sseConnections.get(sseId);
  
  if (!connection) {
    console.warn(`SSE connection ${sseId} not found`);
    return false;
  }
  
  try {
    const eventData = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
    connection.res.write(eventData);
    connection.lastActivity = Date.now();
    return true;
  } catch (error) {
    console.error(`Error sending SSE event to ${sseId}:`, error);
    closeSSE(sseId);
    return false;
  }
}

/**
 * Close SSE connection
 */
function closeSSE(sseId) {
  const connection = sseConnections.get(sseId);
  
  if (connection) {
    try {
      connection.res.end();
    } catch (error) {
      console.error(`Error closing SSE connection ${sseId}:`, error);
    }
    
    sseConnections.delete(sseId);
  }
}

/**
 * Generate unique SSE ID
 */
function generateSSEId() {
  return `sse_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Cleanup inactive connections
 */
function cleanupInactiveConnections() {
  const now = Date.now();
  const timeout = 5 * 60 * 1000; // 5 minutes
  
  for (const [sseId, connection] of sseConnections.entries()) {
    if (now - connection.lastActivity > timeout) {
      console.log(`Cleaning up inactive SSE connection: ${sseId}`);
      closeSSE(sseId);
    }
  }
}

/**
 * Get active connections count
 */
function getActiveConnectionsCount() {
  return sseConnections.size;
}

// Cleanup inactive connections every 2 minutes
setInterval(cleanupInactiveConnections, 2 * 60 * 1000);

module.exports = {
  initSSE,
  sendSSE,
  closeSSE,
  generateSSEId,
  cleanupInactiveConnections,
  getActiveConnectionsCount,
};
