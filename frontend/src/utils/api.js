const API_BASE = '/api';

/**
 * Fetch wrapper with error handling
 */
async function fetchAPI(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error);
    throw error;
  }
}

/**
 * Get all topics
 */
export async function getTopics() {
  const data = await fetchAPI('/topics');
  return data.topics;
}

/**
 * Get a single topic with all related data
 */
export async function getTopic(id) {
  const data = await fetchAPI(`/topics/${id}`);
  return data.topic;
}

/**
 * Get formulas, optionally filtered by topic
 */
export async function getFormulas(topicId = null) {
  const query = topicId ? `?topicId=${topicId}` : '';
  const data = await fetchAPI(`/formulas${query}`);
  return data.formulas;
}

/**
 * Get examples, optionally filtered by topic
 */
export async function getExamples(topicId = null) {
  const query = topicId ? `?topicId=${topicId}` : '';
  const data = await fetchAPI(`/examples${query}`);
  return data.examples;
}

/**
 * Submit anonymous feedback
 */
export async function submitFeedback(message, pageContext = null, email = null) {
  const data = await fetchAPI('/feedback', {
    method: 'POST',
    body: JSON.stringify({ message, pageContext, email }),
  });
  return data;
}

/**
 * Get all categories
 */
export async function getCategories() {
  const data = await fetchAPI('/categories');
  return data.categories;
}
