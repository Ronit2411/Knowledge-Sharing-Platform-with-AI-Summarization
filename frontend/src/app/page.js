import Link from 'next/link'
import { Button } from '../components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { BookOpen, Brain, Users, Zap, ArrowRight, Search, PenTool } from 'lucide-react'
import { getArticles } from '../lib/api'

export default async function HomePage() {
  let featuredArticles = []
  
  try {
    const response = await getArticles({ limit: 3 })
    featuredArticles = response.articles || []
  } catch (error) {
    console.error('Failed to fetch featured articles:', error)
  }

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Summaries',
      description: 'Get intelligent summaries of any article using advanced AI technology'
    },
    {
      icon: Users,
      title: 'Knowledge Sharing',
      description: 'Share your expertise and learn from others in the community'
    },
    {
      icon: Search,
      title: 'Smart Search',
      description: 'Find relevant articles quickly with our powerful search capabilities'
    },
    {
      icon: PenTool,
      title: 'Rich Content',
      description: 'Create beautiful articles with markdown support and formatting'
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-primary-100 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Share Knowledge with{' '}
              <span className="text-primary-600">AI Intelligence</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Create, discover, and learn from knowledge articles enhanced with AI-powered summaries. 
              Join our community of learners and experts.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/articles">
                <Button size="lg" className="text-lg px-8 py-3">
                  Explore Articles
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/articles/new">
                <Button variant="outline" size="lg" className="text-lg px-8 py-3">
                  <PenTool className="mr-2 h-5 w-5" />
                  Write Article
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Our Platform?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features designed to enhance your knowledge sharing experience
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mx-auto w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary-600" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Articles Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Articles
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover the latest knowledge shared by our community
            </p>
          </div>

          {featuredArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredArticles.map((article) => (
                <Card key={article.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary" className="text-xs">
                        {article.author_name}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {new Date(article.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <CardTitle className="text-lg line-clamp-2">
                      {article.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="line-clamp-3 mb-4">
                      {article.excerpt || article.content.substring(0, 150)}...
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
          ) : (
            <div className="text-center py-12">
              <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No articles yet</h3>
              <p className="text-gray-600 mb-6">Be the first to share your knowledge!</p>
              <Link href="/articles/new">
                <Button>
                  <PenTool className="mr-2 h-4 w-4" />
                  Write First Article
                </Button>
              </Link>
            </div>
          )}

          <div className="text-center mt-12">
            <Link href="/articles">
              <Button variant="outline" size="lg">
                View All Articles
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Share Your Knowledge?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join our community of learners and experts. Create your first article today and start contributing to the collective knowledge.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
                Get Started
                <Zap className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/articles">
              <Button size="lg" variant="outline" className="text-lg px-8 py-3 border-white text-white hover:bg-white hover:text-primary-600">
                Explore Articles
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
} 