'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '../../../components/providers/AuthProvider'
import { Button } from '../../../components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/Card'
import { BookOpen, ArrowLeft, Save, Eye, EyeOff } from 'lucide-react'
import { createArticle } from '../../../lib/api'
import toast from 'react-hot-toast'

export default function NewArticlePage() {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  
  const { user, loading, isAuthenticated } = useAuth()
  const router = useRouter()

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login')
    }
  }, [loading, isAuthenticated, router])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error('Please fill in title and content')
      return
    }

    setIsLoading(true)
    
    try {
      const response = await createArticle(formData)
      toast.success('Article created successfully!')
      router.push(`/articles/${response.article.id}`)
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create article'
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Don't render form if not authenticated
  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-secondary-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Link href="/articles" className="flex items-center text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Articles
            </Link>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center"
              >
                {showPreview ? (
                  <>
                    <EyeOff className="h-4 w-4 mr-1" />
                    Hide Preview
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4 mr-1" />
                    Preview
                  </>
                )}
              </Button>
              <Button
                type="submit"
                form="article-form"
                disabled={isLoading}
                className="flex items-center"
              >
                <Save className="h-4 w-4 mr-1" />
                {isLoading ? 'Creating...' : 'Create Article'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <BookOpen className="h-8 w-8 text-primary-600" />
              <h1 className="text-3xl font-bold text-gray-900">Create New Article</h1>
            </div>
            <p className="text-gray-600">Share your knowledge with the community</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Form */}
            <Card>
              <CardHeader>
                <CardTitle>Article Details</CardTitle>
                <CardDescription>
                  Fill in the details for your new article
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form id="article-form" onSubmit={handleSubmit} className="space-y-6">
                  {/* Title */}
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                      Title *
                    </label>
                    <input
                      id="title"
                      name="title"
                      type="text"
                      required
                      value={formData.title}
                      onChange={handleChange}
                      className="input w-full"
                      placeholder="Enter article title"
                    />
                  </div>

                  {/* Excerpt */}
                  <div>
                    <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-2">
                      Excerpt (Optional)
                    </label>
                    <textarea
                      id="excerpt"
                      name="excerpt"
                      rows="3"
                      value={formData.excerpt}
                      onChange={handleChange}
                      className="input w-full"
                      placeholder="Brief description of your article"
                    />
                  </div>

                  {/* Content */}
                  <div>
                    <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                      Content *
                    </label>
                    <textarea
                      id="content"
                      name="content"
                      rows="15"
                      required
                      value={formData.content}
                      onChange={handleChange}
                      className="input w-full font-mono text-sm"
                      placeholder="Write your article content here..."
                    />
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Preview */}
            {showPreview && (
              <Card>
                <CardHeader>
                  <CardTitle>Preview</CardTitle>
                  <CardDescription>
                    How your article will appear
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">
                      {formData.title || 'Untitled Article'}
                    </h1>
                    {formData.excerpt && (
                      <p className="text-gray-600 italic mb-4">
                        {formData.excerpt}
                      </p>
                    )}
                    <div className="whitespace-pre-wrap text-gray-800">
                      {formData.content || 'No content yet...'}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 