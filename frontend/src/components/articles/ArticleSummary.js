'use client'

import { useState } from 'react'
import { Button } from '../ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card'
import { Brain, Sparkles, Loader2 } from 'lucide-react'
import { generateArticleSummary } from '../../lib/api'
import toast from 'react-hot-toast'

export function ArticleSummary({ articleId, initialSummary }) {
  const [summary, setSummary] = useState(initialSummary)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isCached, setIsCached] = useState(!!initialSummary)

  const handleGenerateSummary = async () => {
    setIsGenerating(true)
    
    try {
      const response = await generateArticleSummary(articleId)
      setSummary(response.summary)
      setIsCached(response.cached)
      
      if (response.cached) {
        toast.success('Summary retrieved from cache')
      } else {
        toast.success('AI summary generated successfully!')
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to generate summary'
      toast.error(message)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Brain className="h-5 w-5 mr-2 text-primary-600" />
          AI Summary
        </CardTitle>
        <CardDescription>
          Get an intelligent summary of this article using AI
        </CardDescription>
      </CardHeader>
      <CardContent>
        {summary ? (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-primary-50 to-blue-50 border border-primary-200 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <Sparkles className="h-4 w-4 text-primary-600 mr-2" />
                <span className="text-sm font-medium text-primary-700">
                  {isCached ? 'Cached Summary' : 'AI Generated Summary'}
                </span>
              </div>
              <p className="text-gray-700 leading-relaxed">{summary}</p>
            </div>
            <Button
              onClick={handleGenerateSummary}
              disabled={isGenerating}
              variant="outline"
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Brain className="h-4 w-4 mr-2" />
                  Regenerate Summary
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="text-center py-8">
            <Brain className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No summary yet
            </h3>
            <p className="text-gray-600 mb-6">
              Generate an AI-powered summary to get the key points of this article
            </p>
            <Button
              onClick={handleGenerateSummary}
              disabled={isGenerating}
              className="flex items-center mx-auto"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating Summary...
                </>
              ) : (
                <>
                  <Brain className="h-4 w-4 mr-2" />
                  Generate AI Summary
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 