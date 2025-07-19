import axios from 'axios';

class AIService {
  constructor() {
    this.apiKey = process.env.HUGGING_FACE_API_KEY;
    this.model = process.env.HUGGING_FACE_MODEL || 'facebook/bart-large-cnn';
    this.baseURL = 'https://api-inference.huggingface.co/models';
  }

  async generateSummary(text) {
    if (!this.apiKey) {
      throw new Error('Hugging Face API key not configured');
    }

    if (!text || text.trim().length < 50) {
      throw new Error('Text must be at least 50 characters long for summarization');
    }

    try {
      console.log('🤖 Generating AI summary...');
      
      const response = await axios.post(
        `${this.baseURL}/${this.model}`,
        {
          inputs: text,
          parameters: {
            max_length: 150,
            min_length: 30,
            do_sample: false,
            num_beams: 4,
            early_stopping: true
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: 30000 // 30 seconds timeout
        }
      );

      if (response.data && response.data[0] && response.data[0].summary_text) {
        const summary = response.data[0].summary_text.trim();
        console.log('✅ AI summary generated successfully');
        return summary;
      } else {
        throw new Error('Invalid response format from AI API');
      }
    } catch (error) {
      console.error('❌ AI summary generation failed:', error.message);
      
      if (error.response) {
        // API error response
        if (error.response.status === 401) {
          throw new Error('Invalid API key for AI service');
        } else if (error.response.status === 429) {
          throw new Error('AI service rate limit exceeded. Please try again later.');
        } else if (error.response.status === 503) {
          throw new Error('AI service temporarily unavailable. Please try again later.');
        } else {
          throw new Error(`AI service error: ${error.response.status} - ${error.response.statusText}`);
        }
      } else if (error.code === 'ECONNABORTED') {
        throw new Error('AI service request timeout. Please try again.');
      } else {
        throw new Error(`AI service error: ${error.message}`);
      }
    }
  }

  async generateSummaryWithFallback(text) {
    try {
      return await this.generateSummary(text);
    } catch (error) {
      console.warn('⚠️ AI summary failed, using fallback method:', error.message);
      
      // Fallback: simple text truncation with smart sentence breaking
      return this.generateFallbackSummary(text);
    }
  }

  generateFallbackSummary(text) {
    // Remove extra whitespace and normalize
    const cleanText = text.replace(/\s+/g, ' ').trim();
    
    // Split into sentences
    const sentences = cleanText.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    if (sentences.length === 0) {
      return cleanText.substring(0, 200) + (cleanText.length > 200 ? '...' : '');
    }
    
    // Take first 2-3 sentences or first 200 characters
    let summary = '';
    let sentenceCount = 0;
    
    for (const sentence of sentences) {
      if (summary.length + sentence.length > 200 || sentenceCount >= 3) {
        break;
      }
      summary += sentence.trim() + '. ';
      sentenceCount++;
    }
    
    return summary.trim();
  }

  // Validate API key
  async validateAPIKey() {
    if (!this.apiKey) {
      return { valid: false, error: 'API key not configured' };
    }

    try {
      const response = await axios.get(
        `${this.baseURL}/${this.model}`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`
          },
          timeout: 10000
        }
      );
      
      return { valid: true, model: this.model };
    } catch (error) {
      if (error.response && error.response.status === 401) {
        return { valid: false, error: 'Invalid API key' };
      } else if (error.response && error.response.status === 404) {
        return { valid: false, error: 'Model not found' };
      } else {
        return { valid: false, error: 'API validation failed' };
      }
    }
  }

  // Get available models (for future use)
  getAvailableModels() {
    return [
      'facebook/bart-large-cnn',
      'facebook/bart-large-xsum',
      't5-base',
      't5-small'
    ];
  }
}

export default new AIService(); 