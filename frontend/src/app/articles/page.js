import Link from 'next/link'
import { Button } from '../../components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { 
  BookOpen, 
  Search, 
  PenTool, 
  ArrowRight, 
  Calendar,
  User,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { getArticles } from '../../lib/api'
import { formatDate, generateExcerpt } from '../../lib/utils'

export default async function ArticlesPage({ searchParams }) {
  const page = parseInt(searchParams.page) || 1
  const limit = parseInt(searchParams.limit) || 20

  let articles = []
  let pagination = {}
  let error = null

  try {
    const response = await getArticles({ page, limit })
    articles = response.articles || []
    pagination = response.pagination || {}
  } catch (err) {
    console.error('Failed to fetch articles:', err)
    error = 'Failed to load articles'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-secondary-200">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Knowledge Articles
              </h1>
              <p className="text-gray-600">
                Discover and learn from our community's shared knowledge
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-2">
              <Link href="/articles/search">
                <Button variant="outline" className="flex items-center space-x-2">
                  <Search className="h-4 w-4" />
                  <span>Search Articles</span>
                </Button>
              </Link>
              <Link href="/articles/new">
                <Button className="flex items-center space-x-2">
                  <PenTool className="h-4 w-4" />
                  <span>Write Article</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {error ? (
          <div className="text-center py-12">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading articles</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        ) : articles.length > 0 ? (
          <>
            {/* Articles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {articles.map((article) => (
                <Card key={article.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary" className="text-xs">
                        {article.author_name}
                      </Badge>
                      <span className="text-xs text-gray-500 flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatDate(article.created_at)}
                      </span>
                    </div>
                    <CardTitle className="text-lg line-clamp-2">
                      {article.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="line-clamp-3 mb-4">
                      {generateExcerpt(article.content)}
                    </CardDescription>
                    <Link href={`/articles/${article.id}`}>
                      <Button variant="ghost" size="sm" className="w-full">
                        Read More
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2">
                <Link
                  href={`/articles?page=${pagination.page - 1}`}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    pagination.page <= 1
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Link>

                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    const pageNum = i + 1
                    return (
                      <Link
                        key={pageNum}
                        href={`/articles?page=${pageNum}`}
                        className={`px-3 py-2 text-sm font-medium rounded-md ${
                          pageNum === pagination.page
                            ? 'bg-primary-600 text-white'
                            : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                        }`}
                      >
                        {pageNum}
                      </Link>
                    )
                  })}
                </div>

                <Link
                  href={`/articles?page=${pagination.page + 1}`}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    pagination.page >= pagination.totalPages
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
            )}

            {/* Results Info */}
            <div className="text-center mt-8 text-sm text-gray-600">
              Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
              {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
              {pagination.total} articles
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No articles yet</h3>
            <p className="text-gray-600 mb-6">
              Be the first to share your knowledge with the community!
            </p>
            <Link href="/articles/new">
              <Button>
                <PenTool className="mr-2 h-4 w-4" />
                Write First Article
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
} 