'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Alert,
  BODY,
  Btn,
  C,
  Card,
  Chip,
  ConfirmModal,
  DISPLAY,
  Drawer,
  EmptyState,
  Field,
  FormGrid,
  IconBtn,
  Input,
  Modal,
  PageHeader,
  Pagination,
  Panel,
  SectionLoading,
  SectionTitle,
  Toggle,
} from '../_ui'
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

/* ---------- small inline icons ---------- */

function InstagramSvg({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5.5" stroke="currentColor" strokeWidth="2.4" />
      <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="2.4" />
      <circle cx="17.2" cy="6.8" r="1.4" fill="currentColor" />
    </svg>
  )
}

function RefreshSvg({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M20 12a8 8 0 1 1-2.34-5.66" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M20 4v5h-5" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function EyeSvg({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M2.5 12s3.5-6.5 9.5-6.5S21.5 12 21.5 12s-3.5 6.5-9.5 6.5S2.5 12 2.5 12Z"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="2.8" stroke="currentColor" strokeWidth="2.4" />
    </svg>
  )
}

function BlockSvg({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="2.6" />
      <path d="M6.2 6.2l11.6 11.6" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  )
}

function RestoreSvg({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 10h9a6 6 0 1 1 0 12h-3" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M8 6l-4 4 4 4" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function UploadSvg({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 16V4m0 0L6.5 9.5M12 4l5.5 5.5" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 20h16" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  )
}

/* ---------- caption + media helpers ---------- */

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
    const hasChinese = /[一-龥]/.test(line)
    // Check if line contains English letters
    const hasEnglish = /[a-zA-Z]/.test(line)

    if (hasChinese && hasEnglish) {
      // Mixed line - try to split by Chinese/English boundaries
      // Extract Chinese portion
      const chinesePortion = line.match(/[一-龥　-〿＀-￯]+/g)?.join('') || ''
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

const FIELD_LABEL_STYLE: React.CSSProperties = {
  fontFamily: DISPLAY,
  fontWeight: 600,
  fontSize: 12.5,
  letterSpacing: '0.05em',
  color: C.charcoal,
}

function CaptionLines({ caption, clamp = false }: { caption: string; clamp?: boolean }) {
  const { english, chinese } = parseBilingualCaption(caption)
  if (!english && !chinese) {
    return <p style={{ fontFamily: BODY, fontWeight: 600, fontSize: 12, color: '#999999' }}>No caption</p>
  }
  return (
    <div className="flex flex-col gap-1">
      {english && (
        <p className={clamp ? 'line-clamp-2' : ''} style={{ fontFamily: BODY, fontWeight: 600, fontSize: 12, color: C.gray }}>
          <strong style={{ color: C.charcoal }}>EN:</strong> {english}
        </p>
      )}
      {chinese && (
        <p className={clamp ? 'line-clamp-2' : ''} style={{ fontFamily: BODY, fontWeight: 600, fontSize: 12, color: C.gray }}>
          <strong style={{ color: C.charcoal }}>中文:</strong> {chinese}
        </p>
      )}
    </div>
  )
}

/* ---------- PostCard — one tile in the posts grid ---------- */

function PostCard({
  post,
  imported,
  onSelect,
  onExclude,
}: {
  post: InstagramPost
  imported: boolean
  onSelect: (post: InstagramPost) => void
  onExclude: (post: InstagramPost) => void
}) {
  const preview = getMediaPreview(post)
  return (
    <Card
      hoverable={!imported}
      className="adm-fade-in"
      style={{ padding: 10, cursor: imported ? 'default' : 'pointer', opacity: imported ? 0.6 : 1 }}
    >
      <div onClick={() => onSelect(post)}>
        <div className="relative mb-2.5">
          {preview ? (
            <img
              src={preview}
              alt={post.caption?.substring(0, 50) || 'Instagram post'}
              loading="lazy"
              className="aspect-square w-full rounded-xl object-cover"
              style={{ border: `2px solid ${C.charcoal}` }}
            />
          ) : (
            <div className="aspect-square w-full rounded-xl" style={{ border: `2px solid ${C.charcoal}`, background: C.offwhite }} />
          )}
          <div className="absolute" style={{ top: 8, left: 8 }}>
            <Chip tone={post.mediaType === 'CAROUSEL_ALBUM' ? 'blue' : 'gray'}>
              {post.mediaType === 'CAROUSEL_ALBUM' ? `${post.childMedia.length} photos` : 'Single'}
            </Chip>
          </div>
          <div className="absolute" style={{ top: 8, right: 8 }}>
            <Chip tone={imported ? 'green' : 'yellow'}>{imported ? 'Imported' : 'New'}</Chip>
          </div>
        </div>
        <CaptionLines caption={post.caption} clamp />
        <div className="mt-2 flex items-center justify-between gap-2">
          <span style={{ fontFamily: BODY, fontWeight: 600, fontSize: 11, color: C.gray }}>
            {new Date(post.timestamp).toLocaleDateString()}
          </span>
          {!imported && (
            <IconBtn
              label="Exclude this post from import"
              title="Exclude this post from import"
              danger
              size={30}
              onClick={e => {
                e.stopPropagation()
                onExclude(post)
              }}
            >
              <BlockSvg />
            </IconBtn>
          )}
        </div>
      </div>
    </Card>
  )
}

/* ---------- ImportModal — create a destination from one post ---------- */

interface ImportModalProps {
  post: InstagramPost
  importing: boolean
  error: string | null
  destinationName: string
  destinationNameCn: string
  destinationState: string
  destinationCountry: string
  destinationDate: string
  isEditingCountry: boolean
  lat: number
  lng: number
  isDetectingCoords: boolean
  showMap: boolean
  onNameChange: (name: string) => void
  onNameCnChange: (value: string) => void
  onCountryChange: (value: string) => void
  onEditCountry: () => void
  onDateChange: (value: string) => void
  onShowMapChange: (checked: boolean) => void
  onClose: () => void
  onCancel: () => void
  onImport: () => void
}

function ImportModal({
  post,
  importing,
  error,
  destinationName,
  destinationNameCn,
  destinationState,
  destinationCountry,
  destinationDate,
  isEditingCountry,
  lat,
  lng,
  isDetectingCoords,
  showMap,
  onNameChange,
  onNameCnChange,
  onCountryChange,
  onEditCountry,
  onDateChange,
  onShowMapChange,
  onClose,
  onCancel,
  onImport,
}: ImportModalProps) {
  const handleAutoGenerateCn = () => {
    // Extract city name and state code from destination name (e.g., "San Francisco, CA")
    const parts = destinationName.split(',').map(p => p.trim())
    if (parts.length >= 2) {
      const cityName = parts[0]
      const stateCode = parts[1]
      console.log('Generating Chinese name for:', { cityName, stateCode })
      const fullTranslation = generateChineseDestinationName(cityName, stateCode)
      console.log('Translation result:', fullTranslation)
      if (fullTranslation) {
        // Keep the full translation format (州名·城市名)
        onNameCnChange(fullTranslation)
      } else {
        console.warn('No translation found for:', { cityName, stateCode })
      }
    } else {
      console.warn('Invalid destination name format. Expected: "City, State"')
    }
  }

  return (
    <Modal
      open
      onClose={onClose}
      title="Import Instagram Post"
      maxWidth={640}
      footer={
        <>
          <Btn variant="white" size="sm" onClick={onCancel}>
            Cancel
          </Btn>
          <Btn
            variant="primary"
            size="sm"
            icon={<UploadSvg />}
            loading={importing}
            disabled={!destinationName || !destinationDate}
            onClick={onImport}
          >
            {importing ? 'Creating...' : 'Create & Import'}
          </Btn>
        </>
      }
    >
      <div style={{ maxHeight: 'calc(100dvh - 260px)', overflowY: 'auto' }}>
        {error && (
          <div className="mb-4">
            <Alert tone="error">{error}</Alert>
          </div>
        )}

        <div className="mb-4">
          <img
            src={getMediaPreview(post)}
            alt="Preview"
            className="w-full rounded-xl"
            style={{ maxHeight: 300, objectFit: 'contain', border: `2px solid ${C.charcoal}`, background: C.offwhite }}
          />
          {post.mediaType === 'CAROUSEL_ALBUM' && (
            <p className="mt-2" style={{ fontFamily: BODY, fontWeight: 600, fontSize: 13, color: C.gray }}>
              This carousel contains {post.childMedia.length} images. All will be imported.
            </p>
          )}
        </div>

        <div className="mb-4 rounded-xl p-3" style={{ background: C.offwhite, border: '2px solid #E5E4DE' }}>
          <CaptionLines caption={post.caption} />
        </div>

        <div className="mb-4">
          <SectionTitle>Create New Destination</SectionTitle>
          <FormGrid cols={2}>
            <Field label="Name (English)" required hint="Format: Name, STATE" htmlFor="ig-import-name">
              <Input
                type="text"
                id="ig-import-name"
                value={destinationName}
                onChange={e => onNameChange(e.target.value)}
                placeholder="e.g., Grand Canyon, AZ"
              />
            </Field>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between gap-2">
                <span className="uppercase" style={FIELD_LABEL_STYLE}>
                  Name (Chinese)
                </span>
                <Btn
                  variant="yellow"
                  size="xs"
                  onClick={handleAutoGenerateCn}
                  disabled={!destinationName || !destinationName.includes(',')}
                >
                  Auto-Generate
                </Btn>
              </div>
              <Input
                type="text"
                value={destinationNameCn}
                onChange={e => onNameCnChange(e.target.value)}
                placeholder="e.g., 加利福尼亚州·旧金山"
              />
            </div>

            <Field label="State" hint="Auto-detected" htmlFor="ig-import-state">
              <Input
                type="text"
                id="ig-import-state"
                value={destinationState}
                readOnly
                placeholder="Auto-filled from name"
                style={{ background: C.offwhite }}
              />
            </Field>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between gap-2">
                <span className="uppercase" style={FIELD_LABEL_STYLE}>
                  Country
                </span>
                {!isEditingCountry && (
                  <Btn variant="white" size="xs" onClick={onEditCountry}>
                    Edit
                  </Btn>
                )}
              </div>
              <Input
                type="text"
                value={destinationCountry}
                onChange={e => onCountryChange(e.target.value)}
                readOnly={!isEditingCountry}
                placeholder="USA"
                style={!isEditingCountry ? { background: C.offwhite } : undefined}
              />
            </div>

            <Field label="Date" required htmlFor="ig-import-date">
              <Input type="date" id="ig-import-date" value={destinationDate} onChange={e => onDateChange(e.target.value)} />
            </Field>
          </FormGrid>
        </div>

        <div className="mb-4 rounded-xl p-3" style={{ background: C.offwhite, border: `2px solid ${C.charcoal}` }}>
          <div className="mb-1.5 flex items-center gap-2">
            <span className="uppercase" style={{ ...FIELD_LABEL_STYLE, fontSize: 11.5 }}>
              Coordinates
            </span>
            {isDetectingCoords && (
              <span style={{ fontFamily: BODY, fontWeight: 600, fontSize: 12, color: C.gray }}>(Detecting...)</span>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className="uppercase" style={{ fontFamily: BODY, fontWeight: 600, fontSize: 11, color: C.gray }}>
                Latitude
              </span>
              <p style={{ fontFamily: BODY, fontWeight: 700, fontSize: 14, color: C.charcoal }}>{lat ? lat.toFixed(6) : '—'}</p>
            </div>
            <div>
              <span className="uppercase" style={{ fontFamily: BODY, fontWeight: 600, fontSize: 11, color: C.gray }}>
                Longitude
              </span>
              <p style={{ fontFamily: BODY, fontWeight: 700, fontSize: 14, color: C.charcoal }}>{lng ? lng.toFixed(6) : '—'}</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl p-3" style={{ background: C.offwhite, border: `2px solid ${C.charcoal}` }}>
          <Toggle checked={showMap} onChange={onShowMapChange} label="Show Map in Carousel" />
          <p className="mt-2" style={{ fontFamily: BODY, fontWeight: 600, fontSize: 12, color: C.gray }}>
            When enabled, the last tab will display a map instead of the image number.
          </p>
        </div>
      </div>
    </Modal>
  )
}

/* ---------- HistoryDrawer — imported + excluded posts ---------- */

function HistoryDrawer({
  open,
  onClose,
  processedPosts,
  importedPostIds,
  excludedPostIds,
  onUnexclude,
}: {
  open: boolean
  onClose: () => void
  processedPosts: InstagramPost[]
  importedPostIds: Set<string>
  excludedPostIds: Set<string>
  onUnexclude: (postId: string) => void
}) {
  return (
    <Drawer open={open} onClose={onClose} title="Processed Posts" width={600}>
      <p className="mb-4" style={{ fontFamily: BODY, fontWeight: 600, fontSize: 13, color: C.gray }}>
        {importedPostIds.size} imported · {excludedPostIds.size} excluded
      </p>

      {processedPosts.length === 0 ? (
        <EmptyState title="No Processed Posts" subtitle="Posts you import or exclude will show up here." />
      ) : (
        <div className="flex flex-col gap-3">
          {processedPosts.map(post => {
            const isImported = importedPostIds.has(post.id)
            const isExcluded = excludedPostIds.has(post.id)
            return (
              <Card key={post.id} style={{ padding: 10 }}>
                <div className="flex items-center gap-3">
                  <img
                    src={getMediaPreview(post)}
                    alt="Post preview"
                    className="rounded-lg object-cover"
                    style={{ width: 56, height: 56, border: `2px solid ${C.charcoal}`, flex: 'none' }}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2" style={{ fontFamily: BODY, fontWeight: 600, fontSize: 12, color: C.charcoal }}>
                      {parseBilingualCaption(post.caption).english?.substring(0, 50) || 'No caption'}...
                    </p>
                    <p className="mt-0.5" style={{ fontFamily: BODY, fontWeight: 600, fontSize: 11, color: C.gray }}>
                      {new Date(post.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                  <Chip tone={isImported ? 'green' : 'gray'}>{isImported ? 'Imported' : 'Excluded'}</Chip>
                  {isExcluded && (
                    <IconBtn label="Restore post" title="Restore post" onClick={() => onUnexclude(post.id)}>
                      <RestoreSvg />
                    </IconBtn>
                  )}
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </Drawer>
  )
}

/* ---------- page ---------- */

export default function InstagramImportPage() {
  const router = useRouter()
  const [isConnected, setIsConnected] = useState(false)
  const [connectedUserId, setConnectedUserId] = useState<string | null>(null)
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
  const [showMap, setShowMap] = useState(false)

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

  // Surface OAuth results from the callback redirect (?error=... / ?connected=true)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const oauthError = params.get('error')
    if (oauthError) {
      setError(oauthError)
    }
    if (oauthError || params.get('connected')) {
      window.history.replaceState(null, '', window.location.pathname)
    }
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
        setConnectedUserId(data.connected === true ? data.userId || null : null)
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
      // Fetch destinations once
      const destinationsResponse = await fetch('/api/admin/destinations')
      const destinationsData = await destinationsResponse.json()

      // Build a set of Instagram post IDs that have already been imported
      const imported = new Set<string>()
      destinationsData.forEach((dest: any) => {
        if (dest.instagram_post_id) {
          imported.add(dest.instagram_post_id)
        }
        // Also check if the destination ID contains an Instagram post ID pattern
        // (for backwards compatibility with destinations imported before instagram_post_id field)
        // Instagram post IDs are numeric strings, typically 17-19 digits
        const idParts = dest.id.split('-')
        const lastPart = idParts[idParts.length - 1]
        if (lastPart && /^\d{17,19}$/.test(lastPart)) {
          imported.add(lastPart)
        }
      })

      // Fetch only the most recent 25 Instagram posts
      console.log('Fetching the most recent 25 Instagram posts...')
      const postsResponse = await fetch('/api/admin/instagram/posts?limit=25')

      if (!postsResponse.ok) {
        const data = await postsResponse.json()
        throw new Error(data.error || 'Failed to load posts')
      }

      const postsData = await postsResponse.json()
      const posts = postsData.posts

      console.log(`Loaded ${posts.length} posts`)

      setImportedPostIds(imported)
      setPosts(posts)
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

  // Geocode address to get coordinates
  const geocodeAddress = async (address: string) => {
    setIsDetectingCoords(true)
    try {
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

      if (!apiKey) {
        console.error('Google Maps API key not found')
        setIsDetectingCoords(false)
        return
      }

      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`
      )
      const data = await response.json()

      if (data.status === 'OK' && data.results.length > 0) {
        const location = data.results[0].geometry.location
        setLat(location.lat)
        setLng(location.lng)
      } else if (data.status !== 'ZERO_RESULTS') {
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

  const handlePostClick = (post: InstagramPost) => {
    const isImported = importedPostIds.has(post.id)
    const isExcluded = excludedPostIds.has(post.id)

    if (isImported || isExcluded) return

    setSelectedPost(post)
    // Auto-fill date from post timestamp
    const postDate = new Date(post.timestamp)
    const formattedDate = postDate.toISOString().split('T')[0]
    setDestinationDate(formattedDate)
  }

  // Full reset behind the import dialog's Cancel button
  const resetImportForm = () => {
    setSelectedPost(null)
    setDestinationName('')
    setDestinationNameCn('')
    setDestinationState('')
    setDestinationCountry('USA')
    setDestinationDate('')
    setLat(0)
    setLng(0)
    setShowMap(false)
    setIsEditingCountry(false)
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

  const pageSub = 'Import photos from your Instagram posts straight into travel destinations.'

  if (checkingConnection) {
    return <SectionLoading label="Checking Instagram Connection..." icon="star" />
  }

  if (!isConnected) {
    return (
      <div>
        <PageHeader
          kicker="ADMIN"
          title="Instagram"
          accent="Import"
          sub={pageSub}
          actions={
            <Btn variant="primary" icon={<InstagramSvg />} onClick={handleConnect}>
              Connect Instagram
            </Btn>
          }
        />

        {error && (
          <div className="mb-4">
            <Alert tone="error" onClose={() => setError(null)}>
              {error}
            </Alert>
          </div>
        )}

        <Panel pad={32}>
          <div className="flex flex-col items-center gap-4 py-6 text-center">
            <span style={{ color: C.red, lineHeight: 0 }}>
              <InstagramSvg size={64} />
            </span>
            <h2 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 22, color: C.charcoal }}>
              Connect Your Instagram Account
            </h2>
            <div className="w-full" style={{ maxWidth: 520 }}>
              <Alert tone="info">
                Link your Instagram Creator account to import photos from your posts directly into your travel destinations.
              </Alert>
            </div>
            <Btn variant="primary" size="lg" icon={<InstagramSvg />} onClick={handleConnect}>
              Connect Instagram
            </Btn>
          </div>
        </Panel>
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        kicker="ADMIN"
        title="Instagram"
        accent="Import"
        sub={pageSub}
        actions={
          <>
            {processedPosts.length > 0 && (
              <Btn variant="white" size="sm" icon={<EyeSvg />} onClick={() => setShowProcessedPosts(true)}>
                View Processed ({processedPosts.length})
              </Btn>
            )}
            <Btn variant="white" size="sm" icon={<RefreshSvg />} loading={loading} onClick={loadPosts}>
              {loading ? 'Loading...' : posts.length > 0 ? 'Refresh' : 'Load Posts'}
            </Btn>
          </>
        }
      />

      <Panel className="mb-6" pad={16}>
        <Alert tone="success">
          Instagram account connected{connectedUserId ? ` (account ID: ${connectedUserId})` : ''}. Load your latest posts to
          start importing.
        </Alert>
        {posts.length > 0 && (
          <p className="mt-3" style={{ fontFamily: BODY, fontWeight: 600, fontSize: 13, color: C.gray }}>
            {filteredPosts.length - importedPostIds.size} available · {importedPostIds.size} imported · {excludedPostIds.size}{' '}
            excluded
          </p>
        )}
      </Panel>

      {error && (
        <div className="mb-4">
          <Alert tone="error" onClose={() => setError(null)}>
            {error}
          </Alert>
        </div>
      )}

      {successMessage && (
        <div className="mb-4">
          <Alert tone="success" onClose={() => setSuccessMessage(null)}>
            {successMessage}{' '}
            <Btn variant="white" size="xs" className="ml-1 align-middle" onClick={() => router.push('/admin/destinations')}>
              View Destinations
            </Btn>
          </Alert>
        </div>
      )}

      {loading ? (
        <Panel>
          <SectionLoading label="Loading posts…" icon="star" />
        </Panel>
      ) : posts.length === 0 ? (
        <Panel>
          <EmptyState title="No Posts Loaded" subtitle='Click "Load Posts" to fetch your Instagram photos.' />
        </Panel>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {paginatedPosts.map(post => (
              <PostCard
                key={post.id}
                post={post}
                imported={importedPostIds.has(post.id)}
                onSelect={handlePostClick}
                onExclude={p => setPostToExclude(p)}
              />
            ))}
          </div>
          <Pagination
            page={page + 1}
            pageSize={rowsPerPage}
            total={filteredPosts.length}
            onPageChange={p => setPage(p - 1)}
            onPageSizeChange={n => {
              setRowsPerPage(n)
              setPage(0)
            }}
            pageSizeOptions={[5, 10, 25, 50]}
          />
        </>
      )}

      {/* Import Dialog */}
      {selectedPost && (
        <ImportModal
          post={selectedPost}
          importing={importing}
          error={error}
          destinationName={destinationName}
          destinationNameCn={destinationNameCn}
          destinationState={destinationState}
          destinationCountry={destinationCountry}
          destinationDate={destinationDate}
          isEditingCountry={isEditingCountry}
          lat={lat}
          lng={lng}
          isDetectingCoords={isDetectingCoords}
          showMap={showMap}
          onNameChange={handleDestinationNameChange}
          onNameCnChange={setDestinationNameCn}
          onCountryChange={setDestinationCountry}
          onEditCountry={() => setIsEditingCountry(true)}
          onDateChange={setDestinationDate}
          onShowMapChange={setShowMap}
          onClose={() => setSelectedPost(null)}
          onCancel={resetImportForm}
          onImport={handleImport}
        />
      )}

      {/* Exclude Confirmation Dialog */}
      <ConfirmModal
        open={postToExclude !== null}
        onClose={() => setPostToExclude(null)}
        onConfirm={handleExcludePost}
        title="Exclude Post from Import?"
        confirmLabel="Exclude"
        cancelLabel="Cancel"
        message={
          <>
            This post will be hidden from the import list. You can restore it later from the "View Processed" section.
            {postToExclude && (
              <span
                className="mt-3 flex items-center gap-3 rounded-xl p-3 text-left"
                style={{ background: C.offwhite, border: `2px solid ${C.charcoal}` }}
              >
                <img
                  src={getMediaPreview(postToExclude)}
                  alt="Post preview"
                  className="rounded-lg object-cover"
                  style={{ width: 56, height: 56, border: `2px solid ${C.charcoal}`, flex: 'none' }}
                />
                <span className="line-clamp-2" style={{ fontFamily: BODY, fontWeight: 600, fontSize: 13, color: C.charcoal }}>
                  {parseBilingualCaption(postToExclude.caption).english || 'No caption'}
                </span>
              </span>
            )}
          </>
        }
      />

      {/* Processed Posts Drawer */}
      <HistoryDrawer
        open={showProcessedPosts}
        onClose={() => setShowProcessedPosts(false)}
        processedPosts={processedPosts}
        importedPostIds={importedPostIds}
        excludedPostIds={excludedPostIds}
        onUnexclude={handleUnexcludePost}
      />
    </div>
  )
}
