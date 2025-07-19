'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '../../../../components/providers/AuthProvider'
import { Button } from '../../../../components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/Card'
import { Badge } from '../../../../components/ui/Badge'
import { 
  BookOpen, 
  ArrowLeft, 
  History, 
  Calendar, 
  User, 
  Clock,
  Eye,
  FileText
} from 'lucide-react'
import { getArticle, getArticleRevisions } from '../../../../lib/api'
import { formatDate } from '../../../../lib/utils'
import toast from 'react-hot-toast'

export default function ArticleHistoryPage({ params }) {
  const [article, setArticle] = useState(null)
  const [revisions, setRevisions] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selectedRevision, setSelectedRevision] = useState(null)
  
  const { user, loading, isAuthenticated } = useAuth()
  const router = useRouter()

  // Load article and revisions data
  useEffect(() => {
    if (isAuthenticated && params.id) {
      loadData()
    }
  }, [isAuthenticated, params.id])

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login')
    }
  }, [loading, isAuthenticated, router])

  const loadData = async () => {
    setIsLoading(true)
    try {
      const [articleResponse, revisionsResponse] = await Promise.all([
        getArticle(params.id),
        getArticleRevisions(params.id)
      ])
      
      const articleData = articleResponse.article
      
      // Check if user is the author
      if (articleData.author_id !== user?.id) {
        setError('You can only view history of your own articles')
        return
      }
      
      setArticle(articleData)
      setRevisions(revisionsResponse.revisions || [])
    } catch (error) {
      if (error.response?.status === 404) {
        setError('Article not found')
      } else {
        setError('Failed to load article history')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleViewRevision = (revision) => {
    setSelectedRevision(revision)
  }

  const handleCloseRevision = () => {
    setSelectedRevision(null)
  }

  // Show loading state while checking authentication or loading data
  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link href="/articles">
            <Button>Back to Articles</Button>
          </Link>
        </div>
      </div>
    )
  }

  // Don't render if not authenticated or article not loaded
  if (!isAuthenticated || !article) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-secondary-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Link href={`/articles/${params.id}`} className="flex items-center text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Article
            </Link>
            <div className="flex items-center space-x-2">
              <Link href={`/articles/${params.id}/edit`}>
                <Button variant="outline" size="sm" className="flex items-center">
                  <FileText className="h-4 w-4 mr-1" />
                  Edit Article
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <History className="h-8 w-8 text-primary-600" />
              <h1 className="text-3xl font-bold text-gray-900">Article History</h1>
            </div>
            <p className="text-gray-600">View previous versions of your article</p>
          </div>

          {/* Article Info */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="h-5 w-5 mr-2" />
                {article.title}
              </CardTitle>
              <CardDescription>
                Edit history for this article
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span className="flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  {article.author_name}
                </span>
                <span className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  Created {formatDate(article.created_at)}
                </span>
                {article.updated_at !== article.created_at && (
                  <span className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    Last updated {formatDate(article.updated_at)}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Revisions List */}
            <Card>
              <CardHeader>
                <CardTitle>Revision History</CardTitle>
                <CardDescription>
                  Previous versions of this article
                </CardDescription>
              </CardHeader>
              <CardContent>
                {revisions.length > 0 ? (
                  <div className="space-y-4">
                    {revisions.map((revision, index) => (
                      <div
                        key={revision.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          selectedRevision?.id === revision.id
                            ? 'border-primary-300 bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                        onClick={() => handleViewRevision(revision)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <Badge variant="secondary" className="text-xs">
                              Version {revisions.length - index}
                            </Badge>
                            {index === 0 && (
                              <Badge variant="default" className="text-xs">
                                Current
                              </Badge>
                            )}
                          </div>
                          <span className="text-xs text-gray-500">
                            {formatDate(revision.created_at)}
                          </span>
                        </div>
                        <h4 className="font-medium text-gray-900 mb-1">
                          {revision.title}
                        </h4>
                        {revision.excerpt && (
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {revision.excerpt}
                          </p>
                        )}
                        <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                          <span className="flex items-center">
                            <User className="h-3 w-3 mr-1" />
                            {revision.author_name}
                          </span>
                          <span className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {formatDate(revision.created_at)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <History className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No revisions yet</h3>
                    <p className="text-gray-600">This article hasn't been edited yet.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Revision Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Revision Preview</span>
                  {selectedRevision && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCloseRevision}
                    >
                      Close
                    </Button>
                  )}
                </CardTitle>
                <CardDescription>
                  {selectedRevision ? 'Viewing selected revision' : 'Select a revision to view'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedRevision ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-gray-900">
                        {selectedRevision.title}
                      </h3>
                      <Badge variant="secondary">
                        Version {revisions.findIndex(r => r.id === selectedRevision.id) + 1}
                      </Badge>
                    </div>
                    
                    {selectedRevision.excerpt && (
                      <p className="text-gray-600 italic">
                        {selectedRevision.excerpt}
                      </p>
                    )}
                    
                    <div className="prose prose-sm max-w-none">
                      <div className="whitespace-pre-wrap text-gray-800 bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto">
                        {selectedRevision.content}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t">
                      <span className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        {selectedRevision.author_name}
                      </span>
                      <span className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {formatDate(selectedRevision.created_at)}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Select a revision</h3>
                    <p className="text-gray-600">Choose a revision from the list to view its content.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 