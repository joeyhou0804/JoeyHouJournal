'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
  Grid,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Link,
  Drawer,
  Tooltip,
} from '@mui/material'
import {
  Instagram as InstagramIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  CloudUpload as UploadIcon,
  Block as BlockIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material'
import destinationsData from 'src/data/destinations.json'
import AdminLoading from 'src/components/AdminLoading'
import { generateChineseDestinationName } from '@/lib/cityTranslations'

interface InstagramPost {
  id: string
  caption: string
  mediaType: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM'
  mediaUrl?: string
  timestamp: string
  permalink: string
  childMedia: Array<{
    id: string
    mediaUrl: string
    mediaType: string
  }>
}

interface Destination {
  id: string
  name: string
  state: string
  journeyName: string
}

export default function InstagramImportPage() {
  const router = useRouter()
  const [isConnected, setIsConnected] = useState(false)
  const [checkingConnection, setCheckingConnection] = useState(true)
  const [loading, setLoading] = useState(false)
  const [posts, setPosts] = useState<InstagramPost[]>([])
  const [importedPostIds, setImportedPostIds] = useState<Set<string>>(new Set())
  const [excludedPostIds, setExcludedPostIds] = useState<Set<string>>(new Set())
  const [error, setError] = useState<string | null>(null)
  const [selectedPost, setSelectedPost] = useState<InstagramPost | null>(null)
  const [postToExclude, setPostToExclude] = useState<InstagramPost | null>(null)
  const [importing, setImporting] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [showProcessedPosts, setShowProcessedPosts] = useState(false)

  // New destination form fields
  const [destinationName, setDestinationName] = useState('')
  const [destinationNameCn, setDestinationNameCn] = useState('')
  const [destinationState, setDestinationState] = useState('')
  const [destinationCountry, setDestinationCountry] = useState('USA')
  const [destinationDate, setDestinationDate] = useState('')
  const [isEditingCountry, setIsEditingCountry] = useState(false)
  const [lat, setLat] = useState<number>(0)
  const [lng, setLng] = useState<number>(0)
  const [isDetectingCoords, setIsDetectingCoords] = useState(false)
  const [showMap, setShowMap] = useState(true)

  const destinations: Destination[] = destinationsData as Destination[]

  // Load excluded posts from database
  useEffect(() => {
    async function fetchExcludedPosts() {
      try {
        const response = await fetch('/api/admin/instagram/excluded')
        if (response.ok) {
          const data = await response.json()
          setExcludedPostIds(new Set(data.excludedPostIds || []))
        }
      } catch (error) {
        console.error('Failed to load excluded posts:', error)
      }
    }
    fetchExcludedPosts()
  }, [])

  // Check if Instagram is connected
  useEffect(() => {
    checkConnection()
  }, [])

  const checkConnection = async () => {
    try {
      setCheckingConnection(true)
      console.log('Checking Instagram connection...')
      const response = await fetch('/api/admin/instagram/status')
      console.log('Connection check response:', response.status)

      if (response.ok) {
        const data = await response.json()
        console.log('Status data:', data)
        setIsConnected(data.connected === true)
      } else {
        setIsConnected(false)
      }
    } catch (err) {
      console.error('Failed to check connection:', err)
      setIsConnected(false)
    } finally {
      setCheckingConnection(false)
    }
  }

  const handleConnect = () => {
    const instagramAppId = '1353131923075236'
    // Use environment-aware redirect URI
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'
    const redirectUri = encodeURIComponent(baseUrl + '/api/admin/instagram/callback')
    const scope = 'email,pages_show_list,pages_read_engagement,instagram_basic,instagram_manage_insights,business_management'

    const authUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${instagramAppId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code&auth_type=rerequest`

    window.location.href = authUrl
  }

  const loadPosts = async () => {
    setLoading(true)
    setError(null)

    try {
      // Fetch Instagram posts and existing destinations in parallel
      const [postsResponse, destinationsResponse] = await Promise.all([
        fetch('/api/admin/instagram/posts?limit=50'),
        fetch('/api/admin/destinations')
      ])

      if (!postsResponse.ok) {
        const data = await postsResponse.json()
        throw new Error(data.error || 'Failed to load posts')
      }

      const postsData = await postsResponse.json()
      const destinationsData = await destinationsResponse.json()

      // Build a set of Instagram post IDs that have already been imported
      const imported = new Set<string>()
      destinationsData.forEach((dest: any) => {
        if (dest.instagram_post_id) {
          imported.add(dest.instagram_post_id)
        }
      })

      setImportedPostIds(imported)
      setPosts(postsData.posts)
      setIsConnected(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load posts')
      if (err instanceof Error && err.message.includes('token expired')) {
        setIsConnected(false)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleImport = async () => {
    if (!selectedPost || !destinationName || !destinationDate) {
      setError('Please fill in at least destination name and date')
      return
    }

    setImporting(true)
    setError(null)

    try {
      // Parse bilingual caption
      const { english, chinese } = parseBilingualCaption(selectedPost.caption)

      // Collect all media URLs from the post
      const mediaUrls: string[] = []

      if (selectedPost.mediaType === 'CAROUSEL_ALBUM') {
        // For carousel, use all child media
        selectedPost.childMedia.forEach(child => {
          if (child.mediaType === 'IMAGE' && child.mediaUrl) {
            mediaUrls.push(child.mediaUrl)
          }
        })
      } else if (selectedPost.mediaType === 'IMAGE' && selectedPost.mediaUrl) {
        // Single image
        mediaUrls.push(selectedPost.mediaUrl)
      }

      if (mediaUrls.length === 0) {
        throw new Error('No images found in this post')
      }

      const response = await fetch('/api/admin/instagram/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          instagramPostId: selectedPost.id,
          destinationName,
          destinationNameCn: destinationNameCn || destinationName,
          destinationState,
          destinationCountry,
          destinationDate,
          lat,
          lng,
          description: english,
          descriptionCn: chinese,
          mediaUrls,
          showMap,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to import')
      }

      const result = await response.json()
      const newDestinationId = result.destinationId

      setSuccessMessage(
        `Successfully created destination "${destinationName}" with ${result.uploadedCount} image(s). ` +
        `Click here to view it in the destinations list.`
      )

      // Add post to imported set
      setImportedPostIds(prev => new Set([...Array.from(prev), selectedPost.id]))

      setSelectedPost(null)

      // Clear form fields
      setDestinationName('')
      setDestinationNameCn('')
      setDestinationState('')
      setDestinationCountry('USA')
      setDestinationDate('')
      setLat(0)
      setLng(0)
      setIsEditingCountry(false)

      // Show link to the new destination in the success message
      console.log('New destination created:', newDestinationId)
      console.log('You can view it at: /admin/destinations or navigate to edit it')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to import')
    } finally {
      setImporting(false)
    }
  }

  const getMediaPreview = (post: InstagramPost) => {
    if (post.mediaType === 'CAROUSEL_ALBUM' && post.childMedia.length > 0) {
      return post.childMedia[0].mediaUrl
    }
    return post.mediaUrl
  }

  // Parse bilingual caption into English and Chinese
  const parseBilingualCaption = (caption: string) => {
    if (!caption) return { english: '', chinese: '' }

    // Split by lines and filter out empty lines
    const lines = caption.split('\n').filter(line => line.trim().length > 0)

    const chineseLines: string[] = []
    const englishLines: string[] = []

    lines.forEach(line => {
      // Check if line contains Chinese characters
      const hasChinese = /[\u4e00-\u9fa5]/.test(line)
      // Check if line contains English letters
      const hasEnglish = /[a-zA-Z]/.test(line)

      if (hasChinese && hasEnglish) {
        // Mixed line - try to split by Chinese/English boundaries
        // Extract Chinese portion
        const chinesePortion = line.match(/[\u4e00-\u9fa5\u3000-\u303f\uff00-\uffef]+/g)?.join('') || ''
        // Extract English portion
        const englishPortion = line.match(/[a-zA-Z\s.,!?;:'"()-]+/g)?.join(' ').trim() || ''

        if (chinesePortion) chineseLines.push(chinesePortion.trim())
        if (englishPortion) englishLines.push(englishPortion.trim())
      } else if (hasChinese) {
        chineseLines.push(line.trim())
      } else if (hasEnglish) {
        englishLines.push(line.trim())
      }
    })

    return {
      chinese: chineseLines.join('\n'),
      english: englishLines.join('\n')
    }
  }

  // US State abbreviation to full name mapping
  const stateMap: { [key: string]: string } = {
    'AL': 'Alabama', 'AK': 'Alaska', 'AZ': 'Arizona', 'AR': 'Arkansas', 'CA': 'California',
    'CO': 'Colorado', 'CT': 'Connecticut', 'DE': 'Delaware', 'FL': 'Florida', 'GA': 'Georgia',
    'HI': 'Hawaii', 'ID': 'Idaho', 'IL': 'Illinois', 'IN': 'Indiana', 'IA': 'Iowa',
    'KS': 'Kansas', 'KY': 'Kentucky', 'LA': 'Louisiana', 'ME': 'Maine', 'MD': 'Maryland',
    'MA': 'Massachusetts', 'MI': 'Michigan', 'MN': 'Minnesota', 'MS': 'Mississippi', 'MO': 'Missouri',
    'MT': 'Montana', 'NE': 'Nebraska', 'NV': 'Nevada', 'NH': 'New Hampshire', 'NJ': 'New Jersey',
    'NM': 'New Mexico', 'NY': 'New York', 'NC': 'North Carolina', 'ND': 'North Dakota', 'OH': 'Ohio',
    'OK': 'Oklahoma', 'OR': 'Oregon', 'PA': 'Pennsylvania', 'RI': 'Rhode Island', 'SC': 'South Carolina',
    'SD': 'South Dakota', 'TN': 'Tennessee', 'TX': 'Texas', 'UT': 'Utah', 'VT': 'Vermont',
    'VA': 'Virginia', 'WA': 'Washington', 'WV': 'West Virginia', 'WI': 'Wisconsin', 'WY': 'Wyoming',
    'DC': 'District of Columbia'
  }

  // Geocode address to get coordinates
  const geocodeAddress = async (address: string) => {
    setIsDetectingCoords(true)
    try {
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
      console.log('Geocoding address:', address)
      console.log('API key exists:', !!apiKey)

      if (!apiKey) {
        console.error('Google Maps API key not found')
        setIsDetectingCoords(false)
        return
      }

      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`
      console.log('Geocoding URL:', url.replace(apiKey, 'REDACTED'))

      const response = await fetch(url)
      const data = await response.json()

      console.log('Geocoding response status:', data.status)
      console.log('Geocoding response:', data)

      if (data.status === 'OK' && data.results.length > 0) {
        const location = data.results[0].geometry.location
        console.log('Setting coordinates:', location)
        setLat(location.lat)
        setLng(location.lng)
      } else {
        console.warn('Geocoding failed:', data.status, data.error_message)
      }
    } catch (error) {
      console.error('Geocoding error:', error)
    } finally {
      setIsDetectingCoords(false)
    }
  }

  // Parse destination name to extract state abbreviation and convert to full name
  const handleDestinationNameChange = (name: string) => {
    setDestinationName(name)

    // Extract state from "Name, XX" format
    const match = name.match(/,\s*([A-Z]{2})$/)
    if (match) {
      const abbr = match[1]
      setDestinationState(stateMap[abbr] || abbr)
    } else {
      setDestinationState('')
    }

    // Auto-detect coordinates
    if (name) {
      geocodeAddress(name)
    }
  }

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleExcludePost = async () => {
    if (!postToExclude) return

    try {
      const response = await fetch('/api/admin/instagram/excluded', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ instagramPostId: postToExclude.id })
      })

      if (!response.ok) {
        throw new Error('Failed to exclude post')
      }

      const newExcluded = new Set([...Array.from(excludedPostIds), postToExclude.id])
      setExcludedPostIds(newExcluded)
      setPostToExclude(null)
    } catch (error) {
      console.error('Error excluding post:', error)
      setError('Failed to exclude post')
    }
  }

  const handleUnexcludePost = async (postId: string) => {
    try {
      const response = await fetch('/api/admin/instagram/excluded', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ instagramPostId: postId })
      })

      if (!response.ok) {
        throw new Error('Failed to unexclude post')
      }

      const newExcluded = new Set(Array.from(excludedPostIds))
      newExcluded.delete(postId)
      setExcludedPostIds(newExcluded)
    } catch (error) {
      console.error('Error unexcluding post:', error)
      setError('Failed to restore post')
    }
  }

  const handleRowClick = (post: InstagramPost) => {
    const isImported = importedPostIds.has(post.id)
    const isExcluded = excludedPostIds.has(post.id)

    if (isImported || isExcluded) return

    setSelectedPost(post)
    // Auto-fill date from post timestamp
    const postDate = new Date(post.timestamp)
    const formattedDate = postDate.toISOString().split('T')[0]
    setDestinationDate(formattedDate)
  }

  // Filter out excluded posts from main list
  const filteredPosts = posts.filter(post => !excludedPostIds.has(post.id))

  // Sort posts: non-imported first, then imported
  const sortedPosts = Array.from(filteredPosts).sort((a, b) => {
    const aImported = importedPostIds.has(a.id)
    const bImported = importedPostIds.has(b.id)

    if (aImported && !bImported) return 1
    if (!aImported && bImported) return -1
    return 0
  })

  // Paginated posts
  const paginatedPosts = sortedPosts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

  // Get processed posts (imported + excluded)
  const processedPosts = posts.filter(post =>
    importedPostIds.has(post.id) || excludedPostIds.has(post.id)
  )

  if (!isConnected) {
    return (
      <Box>
        <Typography variant="h4" sx={{ fontFamily: 'MarioFontTitle, sans-serif', mb: 3, color: '#373737' }}>
          Instagram Import
        </Typography>

        <Card elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 2, textAlign: 'center', py: 6 }}>
          <CardContent>
            <InstagramIcon sx={{ fontSize: 80, color: '#E4405F', mb: 3 }} />
            <Typography variant="h5" sx={{ fontFamily: 'MarioFontTitle, sans-serif', mb: 2, color: '#373737' }}>
              Connect Your Instagram Account
            </Typography>
            <Typography variant="body1" sx={{ fontFamily: 'MarioFont, sans-serif', mb: 4, color: '#666', maxWidth: 500, mx: 'auto' }}>
              Link your Instagram Creator account to import photos from your posts directly into your travel destinations.
            </Typography>
            <Button
              variant="contained"
              size="large"
              startIcon={<InstagramIcon />}
              onClick={handleConnect}
              sx={{
                backgroundColor: '#E4405F',
                color: 'white',
                fontFamily: 'MarioFont, sans-serif',
                px: 4,
                '&:hover': { backgroundColor: '#C13584' },
              }}
            >
              Connect Instagram
            </Button>
          </CardContent>
        </Card>
      </Box>
    )
  }

  if (checkingConnection) {
    return <AdminLoading message="Checking Instagram Connection..." />
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontFamily: 'MarioFontTitle, sans-serif', color: '#373737' }}>
            Instagram Import
          </Typography>
          {posts.length > 0 && (
            <Typography variant="body2" sx={{ fontFamily: 'MarioFont, sans-serif', color: '#666', mt: 0.5 }}>
              {filteredPosts.length - importedPostIds.size} available · {importedPostIds.size} imported · {excludedPostIds.size} excluded
            </Typography>
          )}
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          {processedPosts.length > 0 && (
            <Button
              variant="outlined"
              startIcon={<VisibilityIcon />}
              onClick={() => setShowProcessedPosts(true)}
              sx={{
                borderColor: '#373737',
                color: '#373737',
                fontFamily: 'MarioFont, sans-serif',
                '&:hover': { borderColor: '#FFD701', backgroundColor: '#FFD701' },
              }}
            >
              View Processed ({processedPosts.length})
            </Button>
          )}
          <Button
            variant="contained"
            startIcon={<InstagramIcon />}
            onClick={loadPosts}
            disabled={loading}
            sx={{
              backgroundColor: '#FFD701',
              color: '#373737',
              fontFamily: 'MarioFont, sans-serif',
              '&:hover': { backgroundColor: '#E5C001' },
            }}
          >
            {loading ? 'Loading...' : 'Load Posts'}
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {successMessage && (
        <Alert
          severity="success"
          sx={{ mb: 3 }}
          onClose={() => setSuccessMessage(null)}
          action={
            <Button
              color="inherit"
              size="small"
              onClick={() => router.push('/admin/destinations')}
              sx={{ fontFamily: 'MarioFont, sans-serif' }}
            >
              View Destinations
            </Button>
          }
        >
          {successMessage}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress sx={{ color: '#FFD701' }} />
        </Box>
      ) : posts.length === 0 ? (
        <Card elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 2, textAlign: 'center', py: 6 }}>
          <CardContent>
            <Typography variant="body1" sx={{ fontFamily: 'MarioFont, sans-serif', color: '#666' }}>
              Click "Load Posts" to fetch your Instagram photos
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Paper elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 2 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell sx={{ fontFamily: 'MarioFontTitle, sans-serif', fontWeight: 'bold' }}>Preview</TableCell>
                  <TableCell sx={{ fontFamily: 'MarioFontTitle, sans-serif', fontWeight: 'bold' }}>Type</TableCell>
                  <TableCell sx={{ fontFamily: 'MarioFontTitle, sans-serif', fontWeight: 'bold' }}>Caption</TableCell>
                  <TableCell sx={{ fontFamily: 'MarioFontTitle, sans-serif', fontWeight: 'bold' }}>Date</TableCell>
                  <TableCell sx={{ fontFamily: 'MarioFontTitle, sans-serif', fontWeight: 'bold' }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedPosts.map((post) => {
                  const isImported = importedPostIds.has(post.id)
                  return (
                  <TableRow
                    key={post.id}
                    onClick={() => handleRowClick(post)}
                    sx={{
                      '&:hover': { backgroundColor: isImported ? '#f5f5f5' : '#fafafa' },
                      cursor: isImported ? 'default' : 'pointer',
                      backgroundColor: isImported ? '#f5f5f5' : 'transparent',
                      opacity: isImported ? 0.6 : 1,
                    }}
                  >
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Box
                        component="img"
                        src={getMediaPreview(post)}
                        alt={post.caption?.substring(0, 50)}
                        sx={{
                          width: 80,
                          height: 80,
                          objectFit: 'cover',
                          borderRadius: 1,
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      {post.mediaType === 'CAROUSEL_ALBUM' ? (
                        <Chip
                          label={`${post.childMedia.length} photos`}
                          size="small"
                          sx={{ fontFamily: 'MarioFont, sans-serif' }}
                        />
                      ) : (
                        <Chip
                          label="Single"
                          size="small"
                          sx={{ fontFamily: 'MarioFont, sans-serif' }}
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      {(() => {
                        const { english, chinese } = parseBilingualCaption(post.caption)
                        return (
                          <Box>
                            {english && (
                              <Typography
                                variant="body2"
                                sx={{
                                  fontFamily: 'MarioFont, sans-serif',
                                  color: '#666',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  display: '-webkit-box',
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: 'vertical',
                                  mb: chinese ? 0.5 : 0,
                                }}
                              >
                                <strong>EN:</strong> {english}
                              </Typography>
                            )}
                            {chinese && (
                              <Typography
                                variant="body2"
                                sx={{
                                  fontFamily: 'MarioFont, sans-serif',
                                  color: '#666',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  display: '-webkit-box',
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: 'vertical',
                                }}
                              >
                                <strong>中文:</strong> {chinese}
                              </Typography>
                            )}
                            {!english && !chinese && (
                              <Typography variant="body2" sx={{ fontFamily: 'MarioFont, sans-serif', color: '#999' }}>
                                No caption
                              </Typography>
                            )}
                          </Box>
                        )
                      })()}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontFamily: 'MarioFont, sans-serif', color: '#666' }}>
                        {new Date(post.timestamp).toLocaleDateString()}
                      </Typography>
                    </TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      {isImported ? (
                        <Chip
                          icon={<CheckIcon />}
                          label="Imported"
                          size="small"
                          sx={{
                            fontFamily: 'MarioFont, sans-serif',
                            backgroundColor: '#4caf50',
                            color: 'white',
                          }}
                        />
                      ) : (
                        <Tooltip title="Exclude this post from import">
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation()
                              setPostToExclude(post)
                            }}
                            sx={{
                              color: '#f44336',
                              '&:hover': { backgroundColor: 'rgba(244, 67, 54, 0.1)' },
                            }}
                          >
                            <BlockIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                    </TableCell>
                  </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={posts.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{ fontFamily: 'MarioFont, sans-serif' }}
          />
        </Paper>
      )}

      {/* Import Dialog */}
      <Dialog
        open={selectedPost !== null}
        onClose={() => setSelectedPost(null)}
        maxWidth="md"
        fullWidth
      >
        {selectedPost && (
          <>
            <DialogTitle sx={{ fontFamily: 'MarioFontTitle, sans-serif' }}>
              Import Instagram Post
            </DialogTitle>
            <DialogContent>
              <Box sx={{ mb: 3 }}>
                <img
                  src={getMediaPreview(selectedPost)}
                  alt="Preview"
                  style={{ width: '100%', maxHeight: 300, objectFit: 'contain', borderRadius: 8 }}
                />
                {selectedPost.mediaType === 'CAROUSEL_ALBUM' && (
                  <Typography variant="body2" sx={{ mt: 2, fontFamily: 'MarioFont, sans-serif', color: '#666' }}>
                    This carousel contains {selectedPost.childMedia.length} images. All will be imported.
                  </Typography>
                )}
              </Box>

              {(() => {
                const { english, chinese } = parseBilingualCaption(selectedPost.caption)
                return (
                  <Box sx={{ mb: 3, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                    {english && (
                      <Typography variant="body2" sx={{ fontFamily: 'MarioFont, sans-serif', color: '#666', mb: 1 }}>
                        <strong>EN:</strong> {english}
                      </Typography>
                    )}
                    {chinese && (
                      <Typography variant="body2" sx={{ fontFamily: 'MarioFont, sans-serif', color: '#666' }}>
                        <strong>中文:</strong> {chinese}
                      </Typography>
                    )}
                  </Box>
                )
              })()}

              <Typography variant="h6" sx={{ mb: 2, fontFamily: 'MarioFontTitle, sans-serif', color: '#373737' }}>
                Create New Destination
              </Typography>

              <FormControl fullWidth sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ mb: 0.5, fontFamily: 'MarioFont, sans-serif', color: '#666' }}>
                  Name (English) * <span style={{ color: '#999', fontSize: '0.9em' }}>(Format: Name, STATE)</span>
                </Typography>
                <input
                  type="text"
                  value={destinationName}
                  onChange={(e) => handleDestinationNameChange(e.target.value)}
                  placeholder="e.g., Grand Canyon, AZ"
                  style={{
                    width: '100%',
                    padding: '10px',
                    fontFamily: 'MarioFont, sans-serif',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                  }}
                />
              </FormControl>

              <FormControl fullWidth sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2" sx={{ fontFamily: 'MarioFont, sans-serif', color: '#666' }}>
                    Name (Chinese)
                  </Typography>
                  <Button
                    size="small"
                    onClick={() => {
                      // Extract city name without state suffix (e.g., "San Francisco" from "San Francisco, CA")
                      const cityName = destinationName.split(',')[0].trim()
                      console.log('Generating Chinese name for:', { cityName, destinationState })
                      const translation = generateChineseDestinationName(cityName, destinationState)
                      console.log('Translation result:', translation)
                      if (translation) {
                        setDestinationNameCn(translation)
                      } else {
                        console.warn('No translation found for:', { cityName, destinationState })
                      }
                    }}
                    disabled={!destinationName || !destinationState}
                    sx={{
                      fontFamily: 'MarioFont, sans-serif',
                      fontSize: '12px',
                      textTransform: 'none',
                      backgroundColor: '#FFD701',
                      color: '#373737',
                      '&:hover': { backgroundColor: '#FFC700' },
                      '&:disabled': { backgroundColor: '#E0E0E0', color: '#999' },
                    }}
                  >
                    Auto-Generate
                  </Button>
                </Box>
                <input
                  type="text"
                  value={destinationNameCn}
                  onChange={(e) => setDestinationNameCn(e.target.value)}
                  placeholder="e.g., 加利福尼亚州·旧金山"
                  style={{
                    width: '100%',
                    padding: '10px',
                    fontFamily: 'MarioFont, sans-serif',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                  }}
                />
              </FormControl>

              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <FormControl fullWidth>
                  <Typography variant="body2" sx={{ mb: 0.5, fontFamily: 'MarioFont, sans-serif', color: '#666' }}>
                    State <span style={{ color: '#999', fontSize: '0.9em' }}>(Auto-detected)</span>
                  </Typography>
                  <input
                    type="text"
                    value={destinationState}
                    readOnly
                    placeholder="Auto-filled from name"
                    style={{
                      width: '100%',
                      padding: '10px',
                      fontFamily: 'MarioFont, sans-serif',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      backgroundColor: '#f9f9f9',
                    }}
                  />
                </FormControl>

                <FormControl fullWidth>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="body2" sx={{ fontFamily: 'MarioFont, sans-serif', color: '#666' }}>
                      Country
                    </Typography>
                    {!isEditingCountry && (
                      <Button
                        size="small"
                        onClick={() => setIsEditingCountry(true)}
                        sx={{ fontFamily: 'MarioFont, sans-serif', fontSize: '0.75rem', minWidth: 'auto', p: 0 }}
                      >
                        Edit
                      </Button>
                    )}
                  </Box>
                  <input
                    type="text"
                    value={destinationCountry}
                    onChange={(e) => setDestinationCountry(e.target.value)}
                    readOnly={!isEditingCountry}
                    placeholder="USA"
                    style={{
                      width: '100%',
                      padding: '10px',
                      fontFamily: 'MarioFont, sans-serif',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      backgroundColor: isEditingCountry ? 'white' : '#f9f9f9',
                    }}
                  />
                </FormControl>
              </Box>

              {/* Coordinates Display */}
              <Box sx={{ mb: 2, p: 2, backgroundColor: '#f9f9f9', borderRadius: '4px', border: '1px solid #ddd' }}>
                <Typography variant="body2" sx={{ mb: 1, fontFamily: 'MarioFont, sans-serif', fontWeight: 'bold', color: '#666' }}>
                  Coordinates {isDetectingCoords && '(Detecting...)'}
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                  <Box>
                    <Typography variant="caption" sx={{ fontFamily: 'MarioFont, sans-serif', color: '#999' }}>
                      Latitude
                    </Typography>
                    <Typography sx={{ fontFamily: 'MarioFont, sans-serif', fontSize: '14px' }}>
                      {lat ? lat.toFixed(6) : '—'}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ fontFamily: 'MarioFont, sans-serif', color: '#999' }}>
                      Longitude
                    </Typography>
                    <Typography sx={{ fontFamily: 'MarioFont, sans-serif', fontSize: '14px' }}>
                      {lng ? lng.toFixed(6) : '—'}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <FormControl fullWidth sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ mb: 0.5, fontFamily: 'MarioFont, sans-serif', color: '#666' }}>
                  Date *
                </Typography>
                <input
                  type="date"
                  value={destinationDate}
                  onChange={(e) => setDestinationDate(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    fontFamily: 'MarioFont, sans-serif',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                  }}
                />
              </FormControl>

              {/* Show Map Toggle */}
              <Box sx={{ mb: 2, p: 2, backgroundColor: '#f9f9f9', borderRadius: '4px', border: '1px solid #ddd' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <input
                    type="checkbox"
                    checked={showMap}
                    onChange={(e) => setShowMap(e.target.checked)}
                    id="showMap-import"
                    style={{
                      width: '20px',
                      height: '20px',
                      cursor: 'pointer',
                      accentColor: '#FFD701'
                    }}
                  />
                  <label htmlFor="showMap-import" style={{ fontFamily: 'MarioFont, sans-serif', fontWeight: 'bold', cursor: 'pointer', flex: 1, color: '#666' }}>
                    Show Map in Carousel
                  </label>
                </Box>
                <Typography sx={{ fontFamily: 'MarioFont, sans-serif', fontSize: '12px', color: '#999', marginTop: '0.5rem', marginLeft: '32px' }}>
                  When enabled, the last tab will display a map instead of the image number.
                </Typography>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => {
                  setSelectedPost(null)
                  setDestinationName('')
                  setDestinationNameCn('')
                  setDestinationState('')
                  setDestinationCountry('USA')
                  setDestinationDate('')
                  setLat(0)
                  setLng(0)
                  setShowMap(true)
                  setIsEditingCountry(false)
                }}
                startIcon={<CancelIcon />}
                sx={{ fontFamily: 'MarioFont, sans-serif' }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleImport}
                disabled={!destinationName || !destinationDate || importing}
                variant="contained"
                startIcon={importing ? <CircularProgress size={20} /> : <UploadIcon />}
                sx={{
                  backgroundColor: '#FFD701',
                  color: '#373737',
                  fontFamily: 'MarioFont, sans-serif',
                  '&:hover': { backgroundColor: '#E5C001' },
                  '&:disabled': { backgroundColor: '#e0e0e0' },
                }}
              >
                {importing ? 'Creating...' : 'Create & Import'}
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Exclude Confirmation Dialog */}
      <Dialog
        open={postToExclude !== null}
        onClose={() => setPostToExclude(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontFamily: 'MarioFontTitle, sans-serif' }}>
          Exclude Post from Import?
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ fontFamily: 'MarioFont, sans-serif', mb: 2 }}>
            This post will be hidden from the import list. You can restore it later from the "View Processed" section.
          </Typography>
          {postToExclude && (
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
              <Box
                component="img"
                src={getMediaPreview(postToExclude)}
                alt="Post preview"
                sx={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 1 }}
              />
              <Typography variant="body2" sx={{ fontFamily: 'MarioFont, sans-serif', flex: 1 }}>
                {parseBilingualCaption(postToExclude.caption).english || 'No caption'}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setPostToExclude(null)}
            sx={{ fontFamily: 'MarioFont, sans-serif' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleExcludePost}
            variant="contained"
            startIcon={<BlockIcon />}
            sx={{
              backgroundColor: '#f44336',
              color: 'white',
              fontFamily: 'MarioFont, sans-serif',
              '&:hover': { backgroundColor: '#d32f2f' },
            }}
          >
            Exclude Post
          </Button>
        </DialogActions>
      </Dialog>

      {/* Processed Posts Drawer */}
      <Drawer
        anchor="right"
        open={showProcessedPosts}
        onClose={() => setShowProcessedPosts(false)}
        sx={{ '& .MuiDrawer-paper': { width: { xs: '100%', sm: '600px' } } }}
      >
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" sx={{ fontFamily: 'MarioFontTitle, sans-serif', color: '#373737' }}>
              Processed Posts
            </Typography>
            <Button onClick={() => setShowProcessedPosts(false)} sx={{ fontFamily: 'MarioFont, sans-serif' }}>
              Close
            </Button>
          </Box>

          <Typography variant="body2" sx={{ fontFamily: 'MarioFont, sans-serif', color: '#666', mb: 3 }}>
            {importedPostIds.size} imported · {excludedPostIds.size} excluded
          </Typography>

          <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0' }}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell sx={{ fontFamily: 'MarioFontTitle, sans-serif' }}>Preview</TableCell>
                  <TableCell sx={{ fontFamily: 'MarioFontTitle, sans-serif' }}>Caption</TableCell>
                  <TableCell sx={{ fontFamily: 'MarioFontTitle, sans-serif' }}>Status</TableCell>
                  <TableCell sx={{ fontFamily: 'MarioFontTitle, sans-serif' }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {processedPosts.map((post) => {
                  const isImported = importedPostIds.has(post.id)
                  const isExcluded = excludedPostIds.has(post.id)
                  return (
                    <TableRow key={post.id}>
                      <TableCell>
                        <Box
                          component="img"
                          src={getMediaPreview(post)}
                          alt="Post preview"
                          sx={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 1 }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontFamily: 'MarioFont, sans-serif', fontSize: '12px' }}>
                          {parseBilingualCaption(post.caption).english?.substring(0, 50) || 'No caption'}...
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {isImported ? (
                          <Chip
                            icon={<CheckIcon />}
                            label="Imported"
                            size="small"
                            sx={{
                              fontFamily: 'MarioFont, sans-serif',
                              backgroundColor: '#4caf50',
                              color: 'white',
                              fontSize: '11px',
                            }}
                          />
                        ) : (
                          <Chip
                            icon={<BlockIcon />}
                            label="Excluded"
                            size="small"
                            sx={{
                              fontFamily: 'MarioFont, sans-serif',
                              backgroundColor: '#f44336',
                              color: 'white',
                              fontSize: '11px',
                            }}
                          />
                        )}
                      </TableCell>
                      <TableCell>
                        {isExcluded && (
                          <Button
                            size="small"
                            onClick={() => handleUnexcludePost(post.id)}
                            sx={{
                              fontFamily: 'MarioFont, sans-serif',
                              fontSize: '11px',
                              color: '#FFD701',
                              '&:hover': { backgroundColor: 'rgba(255, 215, 1, 0.1)' },
                            }}
                          >
                            Restore
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Drawer>
    </Box>
  )
}
