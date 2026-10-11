'use client'

import { useEffect, useState } from 'react'
import {
  Alert,
  Btn,
  BODY,
  C,
  Card,
  Chip,
  ConfirmModal,
  DISPLAY,
  EmptyState,
  Field,
  FormGrid,
  IconBtn,
  Input,
  PageHeader,
  Panel,
  SearchPill,
  SectionLoading,
  Select,
  TableWrap,
} from '../_ui'

interface EmailSubscription {
  id: number
  name: string
  email: string
  preferredLocale: string
  subscribedAt: string
  isActive: boolean
  unsubscribeToken: string
}

function PencilSvg({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 20l1.1-4.1L16.6 4.4a2.12 2.12 0 0 1 3 3L8.1 18.9 4 20z"
        stroke="currentColor"
        strokeWidth={2.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M14.8 6.2l3 3" stroke="currentColor" strokeWidth={2.8} strokeLinecap="round" />
    </svg>
  )
}

function TrashSvg({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 7h16" stroke="currentColor" strokeWidth={3} strokeLinecap="round" />
      <path d="M9.5 7V5.4A1.4 1.4 0 0 1 10.9 4h2.2a1.4 1.4 0 0 1 1.4 1.4V7" stroke="currentColor" strokeWidth={3} strokeLinecap="round" />
      <path
        d="M6.6 7l0.9 12.1A1.9 1.9 0 0 0 9.4 21h5.2a1.9 1.9 0 0 0 1.9-1.9L17.4 7"
        stroke="currentColor"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M10 11.5v5M14 11.5v5" stroke="currentColor" strokeWidth={3} strokeLinecap="round" />
    </svg>
  )
}

export default function EmailSubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<EmailSubscription[]>([])
  const [filteredSubscriptions, setFilteredSubscriptions] = useState<EmailSubscription[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState({
    id: 0,
    name: '',
    email: '',
    preferredLocale: 'en'
  })
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [feedback, setFeedback] = useState<{ tone: 'error' | 'success'; text: string } | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<EmailSubscription | null>(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    fetchSubscriptions()
  }, [])

  useEffect(() => {
    // Filter subscriptions based on search term
    if (searchTerm.trim() === '') {
      setFilteredSubscriptions(subscriptions)
    } else {
      const lowercaseSearch = searchTerm.toLowerCase()
      const filtered = subscriptions.filter(sub =>
        sub.name.toLowerCase().includes(lowercaseSearch) ||
        sub.email.toLowerCase().includes(lowercaseSearch)
      )
      setFilteredSubscriptions(filtered)
    }
  }, [searchTerm, subscriptions])

  const fetchSubscriptions = async () => {
    try {
      const response = await fetch('/api/admin/email-subscriptions')
      const data = await response.json()
      setSubscriptions(data)
      setFilteredSubscriptions(data)
      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch email subscriptions:', error)
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setFeedback(null)

    const payload = {
      name: formData.name,
      email: formData.email,
      preferredLocale: formData.preferredLocale,
      _method: editing ? 'PUT' : 'POST'
    }

    try {
      const response = await fetch('/api/admin/email-subscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        setFeedback({ tone: 'success', text: editing ? 'Email subscription updated!' : 'Email subscription added!' })
        resetForm()
        fetchSubscriptions()
      } else {
        setFeedback({ tone: 'error', text: 'Failed to save email subscription' })
      }
    } catch (error) {
      console.error('Failed to save email subscription:', error)
      setFeedback({ tone: 'error', text: 'Failed to save email subscription' })
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (subscription: EmailSubscription) => {
    setFormData({
      id: subscription.id,
      name: subscription.name,
      email: subscription.email,
      preferredLocale: subscription.preferredLocale
    })
    setEditing(true)
    setFeedback(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const confirmDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)

    try {
      const response = await fetch('/api/admin/email-subscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: deleteTarget.email, _method: 'DELETE' })
      })

      if (response.ok) {
        setFeedback({ tone: 'success', text: 'Email subscription deleted!' })
        setDeleteTarget(null)
        fetchSubscriptions()
      } else {
        setFeedback({ tone: 'error', text: 'Failed to delete email subscription' })
      }
    } catch (error) {
      console.error('Failed to delete email subscription:', error)
      setFeedback({ tone: 'error', text: 'Failed to delete email subscription' })
    } finally {
      setDeleting(false)
    }
  }

  const resetForm = () => {
    setFormData({
      id: 0,
      name: '',
      email: '',
      preferredLocale: 'en'
    })
    setEditing(false)
  }

  if (loading) {
    return <SectionLoading label="Loading subscriptions…" icon="star" />
  }

  return (
    <div>
      <PageHeader
        kicker="ADMIN"
        title="Email"
        accent="Subscriptions"
        sub={`${subscriptions.length} total subscriber${subscriptions.length === 1 ? '' : 's'} — emailed when a new journey goes live.`}
      />

      <Panel title={editing ? 'Edit Subscriber' : 'Add Subscriber'} className="mb-6">
        {feedback && (
          <div className="mb-4">
            <Alert tone={feedback.tone} onClose={() => setFeedback(null)}>
              {feedback.text}
            </Alert>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <FormGrid cols={2}>
            <Field label="Name" htmlFor="es-name" required>
              <Input
                id="es-name"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </Field>
            <Field label="Email" htmlFor="es-email" required hint={editing ? 'Email cannot be changed while editing' : undefined}>
              <Input
                id="es-email"
                type="email"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                required
                disabled={editing}
              />
            </Field>
            <Field label="Preferred Language" htmlFor="es-locale">
              <div className="max-w-[220px]">
                <Select
                  id="es-locale"
                  value={formData.preferredLocale}
                  onChange={e => setFormData({ ...formData, preferredLocale: e.target.value })}
                >
                  <option value="en">English</option>
                  <option value="zh">Chinese</option>
                </Select>
              </div>
            </Field>
          </FormGrid>

          <div className="mt-5 flex flex-wrap gap-3">
            <Btn variant="primary" type="submit" loading={saving}>
              {editing ? 'Save Changes' : 'Add Subscriber'}
            </Btn>
            {editing && (
              <Btn variant="white" onClick={resetForm}>
                Cancel
              </Btn>
            )}
          </div>
        </form>
      </Panel>

      {/* Search Bar */}
      <div className="mb-4 flex items-center gap-3">
        <div className="flex-1">
          <SearchPill value={searchTerm} onChange={setSearchTerm} placeholder="Search by name or email…" />
        </div>
        {searchTerm && (
          <Btn variant="white" size="sm" onClick={() => setSearchTerm('')}>
            Clear
          </Btn>
        )}
      </div>

      {filteredSubscriptions.length === 0 ? (
        <EmptyState
          title={searchTerm ? 'No matching subscriptions found' : 'No email subscriptions found'}
          subtitle={searchTerm ? 'Try a different name or email.' : 'Add the first subscriber with the form above.'}
        />
      ) : (
        <>
          {/* Mobile Card View */}
          <div className="flex flex-col gap-3 md:hidden">
            {filteredSubscriptions.map(subscription => (
              <Card key={subscription.id} className="adm-fade-in">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 16, color: C.charcoal }}>{subscription.name}</p>
                    <p className="mt-0.5 break-all" style={{ fontFamily: BODY, fontWeight: 600, fontSize: 13, color: C.gray }}>
                      {subscription.email}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <IconBtn label={`Edit ${subscription.name}`} title="Edit" onClick={() => handleEdit(subscription)}>
                      <PencilSvg />
                    </IconBtn>
                    <IconBtn label={`Delete ${subscription.name}`} title="Delete" danger onClick={() => setDeleteTarget(subscription)}>
                      <TrashSvg />
                    </IconBtn>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2">
                  <Chip tone={subscription.preferredLocale === 'en' ? 'blue' : 'red'}>
                    {subscription.preferredLocale === 'en' ? 'English' : 'Chinese'}
                  </Chip>
                  <span style={{ fontFamily: BODY, fontWeight: 600, fontSize: 13, color: C.gray }}>
                    <strong style={{ color: C.charcoal }}>Subscribed:</strong>{' '}
                    {new Date(subscription.subscribedAt).toLocaleDateString()}
                  </span>
                </div>
              </Card>
            ))}
          </div>

          {/* Desktop Table View */}
          <TableWrap className="hidden md:block">
            <table className="adm-table w-full">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Language</th>
                  <th>Subscribed Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubscriptions.map(subscription => (
                  <tr key={subscription.id}>
                    <td style={{ fontFamily: DISPLAY, fontWeight: 700 }}>{subscription.name}</td>
                    <td>{subscription.email}</td>
                    <td>
                      <Chip tone={subscription.preferredLocale === 'en' ? 'blue' : 'red'}>
                        {subscription.preferredLocale === 'en' ? 'English' : 'Chinese'}
                      </Chip>
                    </td>
                    <td className="whitespace-nowrap">{new Date(subscription.subscribedAt).toLocaleDateString()}</td>
                    <td>
                      <div className="flex gap-2">
                        <IconBtn label={`Edit ${subscription.name}`} title="Edit" onClick={() => handleEdit(subscription)}>
                          <PencilSvg />
                        </IconBtn>
                        <IconBtn label={`Delete ${subscription.name}`} title="Delete" danger onClick={() => setDeleteTarget(subscription)}>
                          <TrashSvg />
                        </IconBtn>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableWrap>
        </>
      )}

      <ConfirmModal
        open={!!deleteTarget}
        onClose={() => {
          if (!deleting) setDeleteTarget(null)
        }}
        onConfirm={confirmDelete}
        title="Delete Subscriber?"
        message={
          deleteTarget ? `This will permanently delete ${deleteTarget.name} (${deleteTarget.email}) from the subscription list.` : ''
        }
        confirmLabel="Delete"
        loading={deleting}
      />
    </div>
  )
}
