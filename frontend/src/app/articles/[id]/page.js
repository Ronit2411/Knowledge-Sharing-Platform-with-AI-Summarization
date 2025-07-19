import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Button } from '../../../components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/Card'
import { Badge } from '../../../components/ui/Badge'
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  Brain, 
  History, 
  Edit, 
  Trash2,
  Clock,
  Sparkles
} from 'lucide-react'
import { getArticle, getArticleSummary } from '../../../lib/api'
import { formatDate } from '../../../lib/utils'
import { ArticleSummary } from '../../../components/articles/ArticleSummary'
import { ArticleActions } from '../../../components/articles/ArticleActions'

export default async function ArticleDetailPage({ params }) {
  let article = null
  let summary = null
  let error = null

  try {
    const [articleResponse, summaryResponse] = await Promise.all([
      getArticle(params.id),
      getArticleSummary(params.id).catch(() => null)
    ])
    
    article = articleResponse.article
    summary = summaryResponse?.summary
  } catch (err) {
    console.error('Failed to fetch article:', err)
    if (err.response?.status === 404) {
      notFound()
    }
    error = 'Failed to load article'
  }

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
            <ArticleActions article={article} />
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Article Header */}
          <div className="bg-white rounded-lg shadow-sm border border-secondary-200 p-8 mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <Badge variant="secondary" className="flex items-center">
                  <User className="h-3 w-3 mr-1" />
                  {article.author_name}
                </Badge>
                <span className="text-sm text-gray-500 flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  {formatDate(article.created_at)}
                </span>
                {article.updated_at !== article.created_at && (
                  <span className="text-sm text-gray-500 flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    Updated {formatDate(article.updated_at)}
                  </span>
                )}
              </div>
            </div>
            
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {article.title}
            </h1>
            
            {/* AI Summary */}
            {summary && (
              <div className="bg-gradient-to-r from-primary-50 to-blue-50 border border-primary-200 rounded-lg p-4 mb-6">
                <div className="flex items-center mb-2">
                  <Sparkles className="h-4 w-4 text-primary-600 mr-2" />
                  <span className="text-sm font-medium text-primary-700">AI Summary</span>
                </div>
                <p className="text-gray-700">{summary}</p>
              </div>
            )}
          </div>

          {/* Article Body */}
          <Card className="mb-8">
            <CardContent className="p-8">
              <div className="prose prose-lg max-w-none">
                <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                  {article.content}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Summary Section */}
          <ArticleSummary articleId={article.id} initialSummary={summary} />

          {/* Article Footer */}
          <div className="bg-white rounded-lg shadow-sm border border-secondary-200 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500">
                  Written by {article.author_name}
                </span>
                <span className="text-sm text-gray-500">
                  • {formatDate(article.created_at)}
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Link href={`/articles/author/${article.author_id}`}>
                  <Button variant="outline" size="sm">
                    More by {article.author_name}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 