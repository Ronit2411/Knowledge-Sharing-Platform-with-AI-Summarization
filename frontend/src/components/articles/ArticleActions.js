'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '../providers/AuthProvider'
import { Button } from '../ui/Button'
import { 
  Edit, 
  Trash2, 
  History, 
  MoreVertical,
  Eye
} from 'lucide-react'
import { deleteArticle } from '../../lib/api'
import toast from 'react-hot-toast'

export function ArticleActions({ article }) {
  const { user } = useAuth()
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)
  const [showMenu, setShowMenu] = useState(false)

  const isAuthor = user?.id === article.author_id

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this article? This action cannot be undone.')) {
      return
    }

    setIsDeleting(true)
    
    try {
      await deleteArticle(article.id)
      toast.success('Article deleted successfully')
      router.push('/articles')
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete article'
      toast.error(message)
    } finally {
      setIsDeleting(false)
    }
  }

  if (!user) {
    return null
  }

  return (
    <div className="relative">
      <div className="flex items-center space-x-2">
        {/* View History Button - Only for author */}
        {isAuthor && (
          <Link href={`/articles/${article.id}/history`}>
            <Button variant="outline" size="sm" className="flex items-center">
              <History className="h-4 w-4 mr-1" />
              History
            </Button>
          </Link>
        )}

        {/* Edit Button - Only for author */}
        {isAuthor && (
          <Link href={`/articles/${article.id}/edit`}>
            <Button variant="outline" size="sm" className="flex items-center">
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
          </Link>
        )}

        {/* Delete Button - Only for author */}
        {isAuthor && (
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex items-center"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        )}

        {/* Mobile Menu */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowMenu(!showMenu)}
          >
            <MoreVertical className="h-4 w-4" />
          </Button>

          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-secondary-200 py-1 z-50">
              {isAuthor && (
                <>
                  <Link
                    href={`/articles/${article.id}/history`}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-secondary-50"
                    onClick={() => setShowMenu(false)}
                  >
                    <History className="h-4 w-4 mr-2" />
                    View History
                  </Link>
                  <Link
                    href={`/articles/${article.id}/edit`}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-secondary-50"
                    onClick={() => setShowMenu(false)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Article
                  </Link>
                  <button
                    onClick={() => {
                      handleDelete()
                      setShowMenu(false)
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Article
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 